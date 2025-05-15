<template>
    <div class="common-layout">
        <el-container>
            <!-- 添加遮罩层 -->
            <div class="overlay overlay-bg" v-if="!active" @click="toggleSidebar"></div>
            <!-- 侧边导航栏 Start-->
            <el-aside class="aside-bg" :class="{ 'no-border': active }">
                <app-aside @toggle-sidebar="toggleSidebar" />
            </el-aside>
            <!-- 侧边导航栏 End-->

            <!-- 右侧侧边竖条 用以隐藏或弹出侧边栏 Start -->
            <div class="vertical-divider" @click="toggleSidebar" :class="{ 'active': active }">
                <SvgIcon icon-class="vertical-divider" />
            </div>
            <!-- 右侧侧边竖条 用以隐藏或弹出侧边栏 End -->

            <!-- 右边窗口 Start -->
            <el-container>
                <el-header class="header-bg">
                    <app-header />
                </el-header>
                <el-container class="main-bg">
                    <el-row :gutter="24" justify="center" class="main-row">
                        <!-- 主内容区 -->
                        <el-col v-if="isChatPage" :md="20" :sm="22" :xs="24" class="main-col">
                            <el-main>
                                <router-view />
                            </el-main>
                            <SendBox v-if="isHidden" />
                            <!-- 页脚 -->
                            <el-footer>
                                <app-footer />
                            </el-footer>
                        </el-col>
                        <el-col v-else class="main-col">
                            <el-main>
                                <router-view />
                            </el-main>
                            <SendBox v-if="isHidden" />
                            <!-- 页脚 -->
                            <el-footer>
                                <app-footer />
                            </el-footer>
                        </el-col>

                        <el-col :md="4" :sm="0" :xs="0" v-if="sideBarData.visible && !isMobileScreen">
                            <SideBar 
                                :recallList="sideBarData.recallList"
                                :webSearchResults="sideBarData.webSearchResults" 
                                :isMobile="false"
                                @close="closeSideBar" />
                        </el-col>
                    </el-row>

                </el-container>
            </el-container>
            <!-- 右边窗口 End -->
        </el-container>
    </div>
    <!-- 移动端全屏SideBar -->
    <div class="mobile-sidebar" v-if="sideBarData.visible && isMobileScreen">
        <SideBar 
            :recallList="sideBarData.recallList"
            :webSearchResults="sideBarData.webSearchResults" 
            :isMobile="true"
            @close="closeSideBar" />
    </div>
</template>

<script>
import AppAside from '../views/AppAside.vue'
import AppHeader from '../views/AppHeader.vue'
import AppFooter from '../views/AppFooter.vue'
import eventBus from '@/eventBus'

export default {
    name: 'Layout',
    data() {
        return {
            // 是否激活侧边栏
            active: false,
            // 侧边栏宽度
            asideWidth: '240px',
            sideBarData: {
                recallList: [],
                webSearchResults: [],
                visible: false
            },
            isMobileScreen: false
        }
    },
    components: {
        AppAside,
        AppFooter,
        AppHeader
    },
    created() {
        this.handleResize()
    },
    computed: {
        isHidden() {
            return this.$router.currentRoute.value.name === 'index';
        },
        isChatPage() {
            const currentRoute = this.$router.currentRoute.value.name;
            // 这里根据路由名称判断，只有index路由是聊天页面
            return currentRoute === 'index';
        }
    },
    mounted() {
        // 监听窗口大小变化
        window.addEventListener('resize', this.handleResize);
        eventBus.on('showSideBar', this.handleShowSideBar);
        this.checkMobileScreen();
    },
    beforeUnmount() {
        eventBus.off('showSideBar', this.handleShowSideBar);
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
        /**
         * 切换侧边栏的显示/隐藏状态
         * 会同时更新 active 状态和侧边栏宽度
         */
        toggleSidebar() {
            this.active = !this.active;
            this.asideWidth = this.asideWidth === '0px' ? '240px' : '0px';
            // 更新CSS变量以改变竖条的位置
            document.documentElement.style.setProperty('--sidebar-width', this.asideWidth);
        },

        /**
         * 处理窗口大小变化事件
         * 根据屏幕宽度自动调整侧边栏的显示状态
         * 在小屏幕(<=767px)时自动隐藏侧边栏,大屏幕时显示
         */
        handleResize() {
            // 检查当前屏幕尺寸是否为XS
            if (window.matchMedia('(max-width: 767px)').matches) {
                // 如果是XS尺寸
                this.active = true
                this.asideWidth = '0px'
                this.isMobileScreen = true;
            } else {
                this.active = false
                this.asideWidth = '240px'
                this.isMobileScreen = false;
            }
            document.documentElement.style.setProperty('--sidebar-width', this.asideWidth);
        },
        handleShowSideBar(data) {
            this.sideBarData = {
                ...data,
                visible: true
            };
        },
        closeSideBar() {
            this.sideBarData.visible = false;
        },
        /**
         * 清空SideBar数据
         */
        clearSideBarData() {
            this.sideBarData = {
                recallList: [],
                webSearchResults: [],
                visible: false
            };
        },
        checkMobileScreen() {
            this.isMobileScreen = window.matchMedia('(max-width: 767px)').matches;
        }
    },
    watch: {
        // 监听路由变化，当路由改变时清空SideBar数据
        '$route': {
            handler() {
                this.clearSideBarData();
            }
        },
        // 监听active状态变化，当active改变时清空SideBar数据
        "$store.state.app.active": {
            handler() {
                this.clearSideBarData();
            }
        }
    }
}

</script>

<style lang="scss" scoped>
/**
 * 变量定义
 */
$animation-time: 0.1s; // 动画时间
$vertical-divider-width: 30px; // 竖条的宽度

/**
 * 布局样式
 */
.common-layout {
    height: 100%;
    background-size: cover;
    background: var(--layout-common-layout-bg);

    >.el-container {
        height: 100%;

        >.el-aside {
            width: var(--sidebar-width);
            height: 100%;
            overflow-y: hidden;
            transition: width $animation-time;
            border-right: 1px solid var(--app-small-border-color);
            scrollbar-width: none;

            &::-webkit-scrollbar {
                display: none;
            }

            &.no-border {
                border: none;
            }
        }

        >.el-container {
            height: 100%;
            display: flex;
            flex-direction: column;

            .main-col {
                height: 100%;
                display: flex;
                flex-direction: column;
            }

            >.el-container {
                overflow: hidden;
            }
        }
    }
}

.main-row,
.el-container {
    height: 100%;
    min-height: 0;
    position: relative;
}

.main-bg, .main-row {
    width: 100%;
    display: flex;
    justify-content: center;
}

.el-header {
    height: 45px;
    padding: 0;
    border-bottom: 1px solid var(--app-small-border-color);
}

.el-main {
    scrollbar-width: none;
    padding: 0;
    flex: 1;
    overflow-y: auto;

    &::-webkit-scrollbar {
        display: none;
    }
}

.el-footer {
    color: grey;
    text-align: center;
    height: auto;
}

/**
 * 控制导航栏收缩的按钮
 */
.vertical-divider {
    position: absolute;
    left: calc(var(--sidebar-width) - $vertical-divider-width / 2 + 10px);
    /* 减去按钮宽度的一半 */
    top: 40%;
    transform: translateY(-50%);
    width: $vertical-divider-width;
    cursor: pointer;
    display: flex;
    z-index: 100;
    transition: all $animation-time;

    >svg {
        width: $vertical-divider-width;
        height: $vertical-divider-width;
        transform: rotate(0deg);
        fill: var(--app-small-border-color);
    }

    &.active>svg {
        transform: rotate(180deg);
    }
}

/* 在 xs 尺寸下 */
@media (max-width: 767px) {

    // 左侧导航栏变成浮窗
    .el-aside {
        position: absolute;
        width: 100%;
        z-index: 100;
    }
}

/* 添加遮罩层样式 */
.overlay {
    display: none; // 默认隐藏
}

/* 移动端全屏SideBar样式 */
.mobile-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2000;
    background-color: var(--layout-common-layout-bg);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}

/* 在 xs 尺寸下 */
@media (max-width: 767px) {

    // 遮罩层样式
    .overlay {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 99; // 确保在侧边栏下面
    }
}
</style>
