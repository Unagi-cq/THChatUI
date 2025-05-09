<template>
    <div class="container">
        <!-- 上方Logo Start -->
        <div class="logo">
            <img :src="logoSrc" alt="logo" />
            <span>THChatUI</span>
        </div>
        <!-- 上方Logo End -->

        <!-- 聊天选项卡 Start -->
        <div class="chats">
            <div class="chats-header">
                <span>对话</span>
                <el-icon class="header-icon" @click="startNewSession">
                    <Plus />
                </el-icon>
            </div>
            <template v-for="group in groupedTabs" :key="group.title">
                <div class="chats-header" style="padding: 10px 6px 2px 6px;font-weight: 600;">
                    <span style="font-size: 12px; color: var(--answer-stats-color);">{{ group.title }}</span>
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
                '/setting': {
                    component: 'Setting',
                    title: '设置'
                },
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
                if (path === '/setting') {
                    this.dialogClass = 'big-page'
                } else {
                    this.dialogClass = ''
                }
            } else {
                this.goToPage(path)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
/**
 * 通用的hover和active效果定义
 */
@mixin hover-active-effect {

    &.active,
    &:hover {
        background: var(--aside-active-hover-bg);
        border-radius: 10px;
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
    background: var(--aside-bg);
}

/**
 * 上方Logo
 */
.logo {
    display: flex;
    align-items: center;
    padding: 20px;

    img {
        height: 35px;
        margin-right: 10px;
        border-radius: 5px;
    }

    span {
        font-size: 18px;
    }
}

/**
 * 聊天选项卡
 */
.chats {
    flex: 1;
    padding: 2px;
    overflow-y: auto;
    scrollbar-width: none;
    width: 240px;

    &::-webkit-scrollbar {
        display: none;
    }

    &-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px;

        span {
            color: var(--answer-stats-color);
        }

        .header-icon {
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;

            &:hover {
                background-color: var(--aside-active-hover-bg);
            }
        }
    }

    .session {
        padding: 8px 6px 8px 6px;
        margin-bottom: 2px;
        cursor: pointer;

        @include hover-active-effect;

        .title {
            width: 220px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            span {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                flex: 1;
            }

            .btn-box {
                margin-left: 8px;
                flex-shrink: 0;
                display: flex;
                align-items: center;
                border-radius: 4px;

                &:hover {
                    color: var(--el-color-primary);
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
            padding: 8px 0;
            margin: 0;

            &:hover {
                @include hover-active-effect;
            }

            .icon {
                width: 24px;
                height: 24px;
                margin: 0 0 4px 0;
            }

            .option-text {
                font-weight: 600;
                line-height: 16px;
                width: auto;
                text-align: center;
            }
        }
    }
}
</style>