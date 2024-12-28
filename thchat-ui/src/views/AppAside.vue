<template>
    <div class="container">
        <!-- 上方Logo Start -->
        <div class="logo">
            <img :src="logoSrc" alt="logo"/>
            <span>THChatUI</span>
        </div>
        <!-- 上方Logo End -->

        <!-- 聊天选项卡 Start -->
        <div class="chats">
            <div class="chats-header">
                <span>对话</span>
                <el-icon class="header-icon" @click="startNewChat">
                    <Plus />
                </el-icon>
            </div>
            <div class="session flex" v-for="x in tabs" key="x.uuid" :class="{ active: x.uuid === active }"
                @click="pickTab(x.uuid)">
                <div class="title">
                    <span>{{ x.title }}</span>
                    <div class="btn-box" v-if="x.uuid === active">
                        <svg @click.stop="delTab(x.uuid)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                            width="16" height="16" fill="none">
                            <path
                                d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5"
                                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                            <path
                                d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5"
                                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                            <path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-width="1.5"
                                stroke-linecap="round" />
                            <path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-width="1.5"
                                stroke-linecap="round" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
        <!-- 聊天选项卡 End -->

        <!-- 工具栏 Start -->
        <div class="optionBar">
            <div class="options">
                <div class="option" @click="goToPage('/docs')">
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                        fill="none">
                        <path
                            d="M7 6.00085H16.75C18.8567 6.00085 19.91 6.00085 20.6667 6.50644C20.9943 6.72532 21.2755 7.00657 21.4944 7.33414C22 8.09081 22 9.14416 22 11.2509C22 14.7621 22 16.5176 21.1573 17.7788C20.975 18.0517 20.7666 18.3054 20.5355 18.5364M3.46447 18.5364C2 17.072 2 14.7149 2 10.0009V6.94512C2 5.12865 2 4.22041 2.38032 3.53891C2.65142 3.05312 3.05227 2.65227 3.53806 2.38117C4.21956 2.00085 5.1278 2.00085 6.94427 2.00085C8.10802 2.00085 8.6899 2.00085 9.19926 2.19186C10.3622 2.62797 10.8418 3.68443 11.3666 4.73398L12 6.00085"
                            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                        <path
                            d="M10.4499 12.0009V13.9799M6.96289 15.5012H9.01487M14.986 15.5012H17.0379M14.986 18.4745H17.0379M6.96289 18.4745H9.01487M10.4499 20.0201V21.9991M13.4754 20.0201V21.9991M13.4646 12.0009V13.9799M10.0149 19.9684H13.986C14.5382 19.9684 14.986 19.5207 14.986 18.9684V14.9799C14.986 14.4276 14.5382 13.9799 13.986 13.9799H10.0149C9.46258 13.9799 9.01487 14.4276 9.01487 14.9799V18.9684C9.01487 19.5207 9.46258 19.9684 10.0149 19.9684Z"
                            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                    <div class="option-text red-dot-wrapper">知识库</div>
                </div>
                <div class="divider">
                    <div class="border"></div>
                </div>
                <div class="option" @click="goToDialog('/setting')">
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                        fill="none">
                        <path
                            d="M15.5 11.5C15.5 13.433 13.933 15 12 15C10.067 15 8.5 13.433 8.5 11.5C8.5 9.567 10.067 8 12 8C13.933 8 15.5 9.567 15.5 11.5Z"
                            stroke="currentColor" stroke-width="1.5" />
                        <path
                            d="M21 13.5995C21.3155 13.5134 21.6503 13.4669 22 13.4669V9.53324C19.1433 9.53324 17.2857 6.43041 18.732 3.96691L15.2679 2.0001C13.8038 4.49405 10.1978 4.49395 8.73363 2L5.26953 3.96681C6.71586 6.43035 4.85673 9.53324 2 9.53324V13.4669C4.85668 13.4669 6.71425 16.5697 5.26795 19.0332L8.73205 21C9.46434 19.7527 10.7321 19.1289 12 19.1286"
                            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path
                            d="M18.5 15L18.7579 15.697C19.0961 16.611 19.2652 17.068 19.5986 17.4014C19.932 17.7348 20.389 17.9039 21.303 18.2421L22 18.5L21.303 18.7579C20.389 19.0961 19.932 19.2652 19.5986 19.5986C19.2652 19.932 19.0961 20.389 18.7579 21.303L18.5 22L18.2421 21.303C17.9039 20.389 17.7348 19.932 17.4014 19.5986C17.068 19.2652 16.611 19.0961 15.697 18.7579L15 18.5L15.697 18.2421C16.611 17.9039 17.068 17.7348 17.4014 17.4014C17.7348 17.068 17.9039 16.611 18.2421 15.697L18.5 15Z"
                            stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                    </svg>
                    <div class="option-text">设置</div>
                </div>
                <div class="option" @click="goToPage('/tools')">
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                        fill="none">
                        <path
                            d="M12 11.5C12.4955 11.5 12.9562 11.3015 13.8775 10.9045L14.5423 10.618C16.1808 9.91202 17 9.55902 17 9C17 8.44098 16.1808 8.08798 14.5423 7.38197L13.8775 7.09549C12.9562 6.6985 12.4955 6.5 12 6.5C11.5045 6.5 11.0438 6.6985 10.1225 7.09549L9.45768 7.38197C7.81923 8.08798 7 8.44098 7 9C7 9.55902 7.81923 9.91202 9.45768 10.618L10.1225 10.9045C11.0438 11.3015 11.5045 11.5 12 11.5ZM12 11.5V17.5"
                            stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                        <path
                            d="M17 9V15C17 15.559 16.1808 15.912 14.5423 16.618L13.8775 16.9045C12.9562 17.3015 12.4955 17.5 12 17.5C11.5045 17.5 11.0438 17.3015 10.1225 16.9045L9.45768 16.618C7.81923 15.912 7 15.559 7 15V9"
                            stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                        <path
                            d="M9.14426 2.5C6.48724 2.56075 4.93529 2.81456 3.87493 3.87493C2.81456 4.93529 2.56075 6.48724 2.5 9.14426M14.8557 2.5C17.5128 2.56075 19.0647 2.81456 20.1251 3.87493C21.1854 4.93529 21.4392 6.48724 21.5 9.14426M14.8557 21.5C17.5128 21.4392 19.0647 21.1854 20.1251 20.1251C21.1854 19.0647 21.4392 17.5128 21.5 14.8557M9.14426 21.5C6.48724 21.4392 4.93529 21.1854 3.87493 20.1251C2.81456 19.0647 2.56075 17.5128 2.5 14.8557"
                            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <div class="option-text">工具箱</div>
                </div>
                <div class="divider">
                    <div class="border"></div>
                </div>
                <div class="option" @click="goToDialog('/about')">
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                        fill="none">
                        <path
                            d="M2.5 16.5C2.5 17.4293 2.5 17.894 2.57686 18.2804C2.89249 19.8671 4.13288 21.1075 5.71964 21.4231C6.10603 21.5 6.57069 21.5 7.5 21.5M21.5 16.5C21.5 17.4293 21.5 17.894 21.4231 18.2804C21.1075 19.8671 19.8671 21.1075 18.2804 21.4231C17.894 21.5 17.4293 21.5 16.5 21.5M21.5 7.5C21.5 6.57069 21.5 6.10603 21.4231 5.71964C21.1075 4.13288 19.8671 2.89249 18.2804 2.57686C17.894 2.5 17.4293 2.5 16.5 2.5M2.5 7.5C2.5 6.57069 2.5 6.10603 2.57686 5.71964C2.89249 4.13288 4.13288 2.89249 5.71964 2.57686C6.10603 2.5 6.57069 2.5 7.5 2.5"
                            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path
                            d="M12 8.5V6.5M10 11.5V12M14 11.5V12M11 8.5H13C14.8856 8.5 15.8284 8.5 16.4142 9.08579C17 9.67157 17 10.6144 17 12.5V12.5C17 14.3856 17 15.3284 16.4142 15.9142C15.8284 16.5 14.8856 16.5 13 16.5H11C9.11438 16.5 8.17157 16.5 7.58579 15.9142C7 15.3284 7 14.3856 7 12.5V12.5C7 10.6144 7 9.67157 7.58579 9.08579C8.17157 8.5 9.11438 8.5 11 8.5Z"
                            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <div class="option-text">关于</div>
                </div>
            </div>
        </div>
        <!-- 工具栏 End -->

        <!-- 弹窗 -->
        <el-dialog v-model="dialogVisible" :show-close="false" :before-close="handleClose" :destroy-on-close="true"
            append-to-body>
            <template #header="{ close, titleId, titleClass }">
                <div class="dialog-custom-header">
                    <h4>{{ dialogTitle }}</h4>
                    <svg class="el-icon--left" @click="close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                        width="20" height="20" fill="none">
                        <path
                            d="M10.2471 6.7402C11.0734 7.56657 11.4866 7.97975 12.0001 7.97975C12.5136 7.97975 12.9268 7.56658 13.7531 6.74022L13.7532 6.7402L15.5067 4.98669L15.5067 4.98668C15.9143 4.5791 16.1182 4.37524 16.3302 4.25283C17.3966 3.63716 18.2748 4.24821 19.0133 4.98669C19.7518 5.72518 20.3628 6.60345 19.7472 7.66981C19.6248 7.88183 19.421 8.08563 19.0134 8.49321L17.26 10.2466C16.4336 11.073 16.0202 11.4864 16.0202 11.9999C16.0202 12.5134 16.4334 12.9266 17.2598 13.7529L19.0133 15.5065C19.4209 15.9141 19.6248 16.1179 19.7472 16.3299C20.3628 17.3963 19.7518 18.2746 19.0133 19.013C18.2749 19.7516 17.3965 20.3626 16.3302 19.7469C16.1182 19.6246 15.9143 19.4208 15.5067 19.013L13.7534 17.2598L13.7533 17.2597C12.9272 16.4336 12.5136 16.02 12.0001 16.02C11.4867 16.02 11.073 16.4336 10.2469 17.2598L10.2469 17.2598L8.49353 19.013C8.0859 19.4208 7.88208 19.6246 7.67005 19.7469C6.60377 20.3626 5.72534 19.7516 4.98693 19.013C4.2484 18.2746 3.63744 17.3963 4.25307 16.3299C4.37549 16.1179 4.5793 15.9141 4.98693 15.5065L6.74044 13.7529C7.56681 12.9266 7.98 12.5134 7.98 11.9999C7.98 11.4864 7.5666 11.073 6.74022 10.2466L4.98685 8.49321C4.57928 8.08563 4.37548 7.88183 4.25307 7.66981C3.63741 6.60345 4.24845 5.72518 4.98693 4.98669C5.72542 4.24821 6.60369 3.63716 7.67005 4.25283C7.88207 4.37524 8.08593 4.5791 8.49352 4.98668L8.49353 4.98669L10.2471 6.7402Z"
                            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
            </template>
            <div class="dialog-container">

                <component :is="currentComponent" @close="closeDialog"></component>
            </div>

        </el-dialog>
    </div>
</template>

<script>
import Setting from './setting/index.vue'
import About from './about/index.vue'
import logoDark from '../assets/images/logo_dark_2480.png'
import logoLight from '../assets/images/logo_light_2480.png'

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
            currentComponent: null
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
        tabs: {
            // 获取历史聊天选项卡列表
            get() {
                return this.$store.state.app.tabs;
            },
            set(val) {
                this.$store.dispatch('setTabs', val);
            }
        },
        chats: {
            // 获取所有聊天内容
            get() {
                return this.$store.state.app.chats;
            },
            set(val) {
                this.$store.dispatch('setChats', val);
            }
        },
        logoSrc() {
            const theme = this.$store.state.setting.theme
            return theme === 'dark' ? logoLight : logoDark
        }
    },
    created() {

    },
    methods: {
        /**
         * 删除历史聊天选项卡
         * @param uuid 要删除的选项卡uuid
         */
        delTab(uuid) {
            // 查询要删除的选项卡索引
            let index = this.tabs.findIndex(item => item.uuid === uuid);
            // 设置后续激活的选项卡uuid
            let active = '';

            if (this.tabs.length > 1) {
                let newIndex = index === (this.tabs.length - 1) ? index - 1 : index + 1;
                active = this.tabs[newIndex].uuid;
            }

            // 使用filter方法删除具有指定uuid的数据项 此时会触发get函数
            this.tabs = this.tabs.filter(item => item.uuid !== uuid);
            // 同时要删除对应的聊天数据 此时会触发get函数
            this.chats = this.chats.filter(item => item.uuid !== uuid);

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
        },
        /**
         * 新页面
         */
        startNewChat() {
            // 判断当前是否为聊天页面 如果不是那么跳转到聊天页
            if (this.$router.currentRoute.value.name !== 'index') {
                this.goToPage('/');
            }
            // 更新active
            this.active = '';
        },
        /**
         * 跳转页面函数
         * @param path
         */
        goToPage(path) {
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
                    title: '系统设置'
                },
                '/about': {
                    component: 'About',
                    title: '关于'
                }
            }

            if (componentMap[path]) {
                this.dialogTitle = componentMap[path].title
                this.currentComponent = componentMap[path].component
                this.dialogVisible = true
            } else {
                this.$router.push(path)
            }
        },
        handleClose(done) {
            done()
        },
        closeDialog() {
            this.dialogVisible = false
        }
    }
}
</script>

<style lang="scss" scoped>
/**
 * 变量定义
 */
$animation-time: 0.3s;

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
    font-size: 14px;
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
            font-size: 12px;
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
        padding: 10px 6px 10px 10px;
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
    border-top: 1px solid var(--app-small-border-color);
    padding: 6px 0;

    .options {
        width: 250px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 2px;
        align-items: center;
        transition: width $animation-time ease;

        .option {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            cursor: pointer;
            padding: 10px 18px;
            margin: 0 8px;

            &:hover {
                @include hover-active-effect;
            }

            .icon {
                width: 25px;
                height: 25px;
                margin-right: 4px;
            }

            .option-text {
                font-size: 13px;
                font-weight: 600;
                line-height: 16px;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }

        .divider {
            grid-column: 2;
            justify-self: center;
            height: 100%;
            display: flex;
            align-items: center;

            .border {
                width: 1px;
                height: 70%;
                background-color: var(--app-small-border-color);
            }
        }
    }
}

/**
 * 弹窗
 */
:global(.el-dialog) {
    border-radius: 15px;
    background: var(--layout-common-layout-bg);
    overflow: hidden;
    position: relative;
    max-width: 600px;
    min-width: 300px;
    margin: 15vh auto !important;
    max-height: 70vh;
    display: flex;
    flex-direction: column;
}

:global(.el-dialog::after) {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 110%;
    height: 110%;
    z-index: 1;
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
    pointer-events: none;
}

:global(.el-dialog__header),
:global(.el-dialog__body) {
    position: relative;
    z-index: 2;
}

:global(.el-dialog__body) {
    flex: 1;
    overflow-y: auto;
    scrollbar-width: none;
}

.dialog-custom-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h4 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: var(--common-color);
    }

    svg {
        cursor: pointer;
        color: var(--common-color);
        opacity: 1;
        transition: opacity 0.2s;

        &:hover {
            opacity: 0.6;
        }
    }
}

@media screen and (max-width: 768px) {
    :global(.el-dialog) {
        width: 95% !important;
    }
}

@media screen and (min-width: 1200px) {
    :global(.el-dialog) {
        width: 60% !important;
    }
}
</style>