<template>
    <div class="container">
        <!-- 上方Logo Start -->
        <div class="logo">
            <img :src="logoSrc" alt="logo" />
            <span>THChatUI</span>
        </div>
        <!-- 上方Logo End -->

        <!-- 聊天选项卡 Start -->  
        <div class="chats-header">
            <span>对话</span>
            <el-icon class="header-icon" @click="startNewSession">
                <Plus />
            </el-icon>
        </div>

        <div class="chats">
            <template v-for="group in groupedTabs" :key="group.title">
                <div class="chats-header" style="padding: 10px 6px 2px 6px;font-weight: 600;">
                    <span style="font-size: 12px; color: var(--page-appaside-chats-header-color);">{{ group.title }}</span>
                </div>
                <div class="session flex" v-for="x in group.tabs" :key="x.uuid" :class="{ active: x.uuid === active }"
                    @click="pickTab(x.uuid)">
                    <div class="title">
                        <span>{{ x.title }}</span>
                        <div class="btn-box" v-if="x.uuid === active">
                            <SvgIcon @click.stop="delTab(x.uuid)" icon-class="trash" class="icon"
                                style="width: 16px; height: 16px;" />
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <!-- 聊天选项卡 End -->

        <!-- 工具栏 Start -->
        <div class="optionBar">
            <div class="options">
                <div class="option" @click="goToPage('/kb')">
                    <SvgIcon icon-class="kb" class="icon" style="width: 20px; height: 20px;" />
                    <div class="option-text red-dot-wrapper">知识库</div>
                </div>
                <div class="option" @click="goToDialog('/mcp')">
                    <SvgIcon icon-class="mcp" class="icon" style="width: 20px; height: 20px;" />
                    <div class="option-text">MCP</div>
                </div>
                <div class="option" @click="goToDialog('/agent')">
                    <SvgIcon icon-class="agent" class="icon" style="width: 20px; height: 20px;" />
                    <div class="option-text">智能体</div>
                </div>
                <div class="option" @click="goToPage('/docs')">
                    <SvgIcon icon-class="docs" class="icon" style="width: 20px; height: 20px;" />
                    <div class="option-text">文档</div>
                </div>
                <div class="option" @click="goToDialog('/setting')">
                    <SvgIcon icon-class="setting" class="icon" style="width: 20px; height: 20px;" />
                    <div class="option-text">设置</div>
                </div>
                <div class="option" @click="goToDialog('/about')">
                    <SvgIcon icon-class="about" class="icon" style="width: 20px; height: 20px;" />
                    <div class="option-text">关于</div>
                </div>
            </div>
        </div>
        <!-- 工具栏 End -->

        <!-- 自定义弹窗 -->
        <CustomDialog v-model="dialogVisible" :title="dialogTitle" :class="dialogClass">
            <component :is="currentComponent"></component>
        </CustomDialog>
    </div>
</template>

<script>
import Setting from './setting/index.vue'
import About from './about/index.vue'
import logoDark from '../assets/images/logo_dark_2480.png'
import logoLight from '../assets/images/logo_light_2480.png'
import tabStoreHelper from '@/schema/tabStoreHelper'
import chatStoreHelper from '@/schema/chatStoreHelper'

export default {
    name: 'AppAside',
    components: {
        Setting,
        About
    },
    data() {
        return {
            isCollapsed: false,
            dialogVisible: false,
            dialogTitle: '',
            currentComponent: null,
            dialogClass: ''
        }
    },
    computed: {
        active: {
            get() {
                return this.$store.state.app.active;
            },
            set(val) {
                this.$store.dispatch('setActive', val);
            }
        },
        tab() {
            return this.$store.state.app.tab;
        },
        logoSrc() {
            const theme = this.$store.state.setting.theme
            return theme === 'dark' ? logoLight : logoDark
        },
        groupedTabs() {
            const tabs = this.tab.getAllTabs();
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
            const yesterday = today - 24 * 60 * 60 * 1000;
            const lastWeek = today - 7 * 24 * 60 * 60 * 1000;
            const lastMonth = today - 30 * 24 * 60 * 60 * 1000;

            const groups = [
                { title: '今天', tabs: [] },
                { title: '过去7天', tabs: [] },
                { title: '过去30天', tabs: [] }
            ];

            const monthGroups = new Map(); // 用于存储按月分组的数据

            tabs.forEach(tab => {
                const timestamp = parseInt(tab.uuid);
                if (timestamp >= today) {
                    groups[0].tabs.push(tab);
                } else if (timestamp >= lastWeek) {
                    groups[1].tabs.push(tab);
                } else if (timestamp >= lastMonth) {
                    groups[2].tabs.push(tab);
                } else {
                    const date = new Date(timestamp);
                    const monthKey = `${date.getFullYear()}年${date.getMonth() + 1}月`;
                    if (!monthGroups.has(monthKey)) {
                        monthGroups.set(monthKey, []);
                    }
                    monthGroups.get(monthKey).push(tab);
                }
            });

            // 将月份分组添加到结果中
            monthGroups.forEach((tabs, monthKey) => {
                groups.push({ title: monthKey, tabs });
            });

            // 过滤掉没有会话的分组
            return groups.filter(group => group.tabs.length > 0);
        }
    },
    methods: {
        /**
         * 删除历史聊天选项卡
         * @param uuid 要删除的选项卡uuid
         */
        delTab(uuid) {
            // 获取前一个选项卡的uuid
            let active = this.tab.getPrevUuid(uuid);
            // 删除选项卡
            tabStoreHelper.del(uuid);
            // 同时要删除对应的聊天数据
            chatStoreHelper.delSession(uuid);
            // 更新active
            this.active = active;
        },

        /**
         * 选择聊天选项卡
         * @param uuid
         */
        pickTab(uuid) {
            // 判断当前是否为聊天页面 如果不是那么跳转到聊天页
            if (this.$router.currentRoute.value.name !== 'index') {
                this.goToPage('/');
            }
            // 更新active
            this.active = uuid;
            // 在手机模式下,触发收起侧边栏
            if (this.isMobileDevice()) {
                this.$emit('toggle-sidebar');
            }
        },

        /**
         * 新页面
         */
        isMobileDevice() {
            return window.innerWidth <= 767;
        },

        /**
         * 开始新的会话
         */
        startNewSession() {
            // 判断当前是否为聊天页面 如果不是那么跳转到聊天页
            if (this.$router.currentRoute.value.name !== 'index') {
                this.goToPage('/');
            }
            // 更新active
            this.active = '';

            // 在手机模式下,触发收起侧边栏
            if (this.isMobileDevice()) {
                this.$emit('toggle-sidebar');
            }
        },

        /**
         * 跳转页面函数
         * @param path
         */
        goToPage(path) {
            // 在手机模式下,触发收起侧边栏
            if (this.isMobileDevice()) {
                this.$emit('toggle-sidebar');
            }
            this.$router.push(path)
        },

        /**
         * 跳转弹窗函数
         * @param path
         */
        goToDialog(path) {
            const componentMap = {
                '/about': {
                    component: 'About',
                    title: '关于'
                }
            }

            if (componentMap[path]) {
                // 在手机模式下,触发收起侧边栏
                if (this.isMobileDevice()) {
                    this.$emit('toggle-sidebar');
                }
                this.dialogTitle = componentMap[path].title
                this.currentComponent = componentMap[path].component
                this.dialogVisible = true
            } else {
                this.goToPage(path)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@mixin hover-active-effect {
    &.active,
    &:hover {
        background: var(--page-appaside-active-hover-bg);
        border-radius: 8px;
        font-weight: 600;
        transform: translateX(3px);
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
}

@mixin header-before {
    &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        height: 70%;
        width: 4px;
        background-color: var(--page-appaside-chats-header-color);
        border-radius: 2px;
    }
}

/**
 * 容器样式
 */
.container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: var(--page-appaside-bg);
}

/**
 * 上方Logo
 */
.logo {
    display: flex;
    align-items: center;
    padding: 20px;
    justify-content: center;
    position: relative;

    img {
        height: 35px;
        margin-right: 12px;
        border-radius: 10px;
        transition: all 0.3s ease;
    }

    span {
        font-size: 20px;
        font-weight: 700;
        background: var(--page-appaside-logo-gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        letter-spacing: 0.5px;
    }
}

.chats-header {
    width: 98%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px;

    span {
        color: var(--page-appaside-chats-header-color);
        font-weight: 600;
        position: relative;
        padding-left: 14px;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 0.5px;

        @include header-before;
    }

    .header-icon {
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        transition: all 0.2s ease;
        color: var(--common-color);
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
            background-color: var(--page-appaside-active-hover-bg);
            transform: rotate(90deg);
        }
    }
}

/**
 * 聊天选项卡
 */
.chats {
    flex: 1;
    width: 100%;
    overflow-y: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }

    .session {
        width: 220px;
        padding: 6px;
        margin-bottom: 1px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        border-radius: 8px;
        position: relative;
        overflow: hidden;
        animation: slideIn 0.3s ease-out;

        &:nth-child(even) {
            animation-delay: 0.1s;
        }

        &:nth-child(odd) {
            animation-delay: 0.2s;
        }

        @include hover-active-effect;

        &.active {
            background: var(--page-appaside-active-hover-bg);
        }

        .title {
            display: flex;
            justify-content: space-between;
            align-items: center;

            span {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                flex: 1;
                font-weight: 500;
                transition: all 0.2s ease;
                padding: 4px 2px;
            }

            .btn-box {
                margin-left: 10px;
                flex-shrink: 0;
                display: flex;
                align-items: center;
                border-radius: 6px;
                padding: 6px;
                transition: all 0.3s ease;
                color: var(--el-color-danger);
                background-color: rgba(var(--el-color-danger-rgb), 0.1);
                transform: scale(1.1);

                &:hover {
                    background-color: rgba(var(--el-color-danger-rgb), 0.5);
                    transform: scale(1.2);
                }
            }
        }
    }
}

/**
 * 工具栏
 */
.optionBar {
    width: 100%;
    font-size: 12px;
    border-top: 1px solid var(--app-small-border-color);
    padding: 4px 0;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        height: 1px;
        background: linear-gradient(90deg,
                transparent 0%,
                var(--app-small-border-color) 20%,
                var(--app-small-border-color) 80%,
                transparent 100%);
    }

    .options {
        width: 100%;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(2, 1fr);
        gap: 2px;
        align-items: center;

        .option {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            padding: 12px 0;
            margin: 2px;
            border-radius: 10px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;

            &:hover {
                background: var(--page-appaside-active-hover-bg);
                transform: translateY(-3px);
                box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);

                &::before {
                    opacity: 0.05;
                }

                .icon {
                    transform: translateY(-2px);
                }

                .option-text {
                    transform: translateY(2px);
                }
            }

            .icon {
                width: 24px;
                height: 24px;
                margin: 0 0 8px 0;
                transition: all 0.3s ease;
            }

            .option-text {
                line-height: 16px;
                width: auto;
                text-align: center;
                transition: all 0.3s ease;
            }

            &:active {
                transform: translateY(-1px);
            }
        }
    }
}
</style>