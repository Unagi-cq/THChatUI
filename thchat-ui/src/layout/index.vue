<template>
    <div class="common-layout">
        <el-container>
            <!-- 侧边导航栏 Start-->
            <el-aside class="theme-bg" :class="{'no-border' : active}">
                <app-aside/>
            </el-aside>
            <!-- 侧边导航栏 End-->

            <!-- 右侧侧边竖条 用以隐藏或弹出侧边栏 Start -->
            <div class="vertical-divider" @click="toggleSidebar" :class="{'active' : active}">
                <svg class="icon" viewBox="0 0 1024 1024" version="1.1"
                     xmlns="http://www.w3.org/2000/svg" width="200" height="200">
                    <path
                        d="M64 512C64 264.576 264.576 64 512 64s448 200.576 448 448-200.576 448-448 448S64 759.424 64 512z"
                        fill="#94BFFF"></path>
                    <path
                        d="M519.66 498.558a10.672 10.672 0 0 0-15.32 0c-21.14 21.718-82.92 84.97-147.134 148.374-14.508 14.328-35.158 19.874-51.414 7.74-6.656-4.968-14.186-11.574-22.272-20.344-11.03-11.94-18.39-23.302-23.274-32.774-8.022-15.514-3.948-33.674 6.228-47.758 79.574-110.25 165.484-185.438 211.606-221.8 20.288-15.994 47.552-15.994 67.84 0 46.122 36.362 132.032 111.55 211.606 221.8 10.176 14.084 14.25 32.244 6.228 47.758-4.884 9.472-12.244 20.836-23.274 32.774-8.086 8.77-15.616 15.376-22.272 20.342-16.256 12.136-36.906 6.59-51.414-7.74-64.212-63.4-125.994-126.654-147.136-148.372z"
                        fill="#1677FF"></path>
                </svg>
            </div>
            <!-- 右侧侧边竖条 用以隐藏或弹出侧边栏 End -->

            <!-- 右边窗口 Start -->
            <el-container>
                <!-- 主要内容 -->
                <el-main>
                    <router-view/>
                </el-main>
                <!-- 页脚 -->
                <el-footer>
                    <app-footer/>
                </el-footer>
            </el-container>
            <!-- 右边窗口 End -->
        </el-container>
    </div>
</template>

<script>
import AppAside from '../views/AppAside.vue'
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
        AppFooter
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
         * 切换侧边栏
         */
        toggleSidebar() {
            this.active =  !this.active;
            this.asideWidth = this.asideWidth === '0px' ? '250px' : '0px';
            // 更新CSS变量以改变竖条的位置
            document.documentElement.style.setProperty('--sidebar-width', this.asideWidth);
        },
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
$vertical-divider-width: 40px; // 竖条的宽度

.common-layout {
    height: 100%;
    background-size: cover;
    background: var(--layout-common-layout-bg);

    /* 可选，防止图片重复 */
    > .el-container {
        height: 100%;

        > .el-aside {
            width: var(--sidebar-width);
            height: 100%;
            overflow-y: hidden;
            transition: all $animation-time; // 平滑过渡宽度和阴影变化
            border-top-right-radius: 15px;
            border-bottom-right-radius: 15px;
            border-right: 1px dashed grey;
            scrollbar-width: none; /* Firefox */

            &::-webkit-scrollbar {
                display: none; /* Chrome, Safari 和 Opera */
            }

            &.no-border {
                border: none;
            }
        }
    }
}

.el-main {
    scrollbar-width: none; /* Firefox */

    &::-webkit-scrollbar {
        display: none; /* Chrome, Safari 和 Opera */
    }
}

.el-footer {
    color: grey;
    text-align: center;
    height: 45px;
}

/**
 * 控制导航栏收缩的按钮
 */
.vertical-divider {
    position: absolute;
    left: calc(var(--sidebar-width) - $vertical-divider-width / 2); /* 减去按钮宽度的一半 */
    top: 40%;
    transform: translateY(-50%);
    width: $vertical-divider-width;
    cursor: pointer;
    display: flex;
    z-index: 400;
    transition: all $animation-time;

    > svg {
        width: $vertical-divider-width;
        height: $vertical-divider-width;
        transform: rotate(-90deg);
        transition: all $animation-time;
    }

    &.active > svg {
        transform: rotate(90deg);
    }
}

/* 在 xs 尺寸下 */
@media (max-width: 767px) {
    // 左侧导航栏变成浮窗
    .el-aside {
        position: absolute; /* 使 aside 浮起来 */
        width: 100%; /* 在小屏幕上全宽 */
        z-index: 100; /* 保证在顶层 */
    }
}
</style>
