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
                    <!-- 主要内容 -->
                    <el-main>
                        <router-view />
                    </el-main>
                    <!-- 页脚 -->
                    <el-footer>
                        <app-footer />
                    </el-footer>
                </el-container>
            </el-container>
            <!-- 右边窗口 End -->
        </el-container>
    </div>
</template>

<script>
import AppAside from '../views/AppAside.vue'
import AppHeader from '../views/AppHeader.vue'
import AppFooter from '../views/AppFooter.vue'

export default {
    name: 'Layout',
    data() {
        return {
            // 是否激活侧边栏
            active: false,
            // 侧边栏宽度
            asideWidth: '250px'
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
    mounted() {
        // 监听窗口大小变化
        window.addEventListener('resize', this.handleResize);
    },
    methods: {
        /**
         * 切换侧边栏的显示/隐藏状态
         * 会同时更新 active 状态和侧边栏宽度
         */
        toggleSidebar() {
            this.active = !this.active;
            this.asideWidth = this.asideWidth === '0px' ? '250px' : '0px';
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
            } else {
                this.active = false
                this.asideWidth = '250px'
            }
            document.documentElement.style.setProperty('--sidebar-width', this.asideWidth);
        }
    }
}

</script>

<style lang="scss" scoped>
/**
 * 变量定义
 */
$animation-time: 0.3s; // 动画时间
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
            transition: all $animation-time;
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

            >.el-container {
                flex: 1;
                overflow: hidden;
            }
        }
    }
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
    height: 92px;
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
