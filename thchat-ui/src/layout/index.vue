<template>
    <div class="common-layout">
        <el-container>
            <!-- 添加遮罩层 -->
            <div class="overlay overlay-bg" v-if="!active" @click="toggleSidebar"></div>
            <!-- 侧边导航栏 Start-->
            <el-aside class="aside-bg" :class="{ 'no-border': active }">
                <app-aside @toggle-sidebar="toggleSidebar"/>
            </el-aside>
            <!-- 侧边导航栏 End-->

            <!-- 右侧侧边竖条 用以隐藏或弹出侧边栏 Start -->
            <div class="vertical-divider" @click="toggleSidebar" :class="{ 'active': active }">
                <svg xmlns="http://www.w3.org/2000/svg" width="5.997314453125" height="28.001953125"
                    viewBox="0 0 5.997314453125 28.001953125">
                    <g>
                        <g>
                            <path
                                d="M1.76479,1.83999484375L0.0229461,13.55206484375Q-0.0106777,13.77816484375,0.00468256,14.00546484375Q-0.00940751,14.22826484375,0.0235386,14.44976484375L1.76538,26.16176484375Q1.78073,26.26496484375,1.80613,26.36626484375Q1.83154,26.46766484375,1.86676,26.56616484375Q1.90198,26.66466484375,1.94667,26.75946484375Q1.99137,26.85416484375,2.04511,26.94426484375Q2.09885,27.03426484375,2.16112,27.11886484375Q2.22339,27.20336484375,2.29359,27.28156484375Q2.36379,27.35966484375,2.44124,27.43076484375Q2.51869,27.50176484375,2.60264,27.56506484375Q2.6866,27.62826484375,2.77625,27.68316484375Q2.86591,27.73796484375,2.96039,27.78386484375Q3.05488,27.82976484375,3.1533,27.86626484375Q3.25171,27.90286484375,3.3531,27.92966484375Q3.45449,27.95646484375,3.55788,27.97326484375Q3.66127,27.99006484375,3.76566,27.99676484375Q3.87005,28.00336484375,3.97445,27.99986484375Q4.07884,27.99626484375,4.18223,27.98256484375Q4.38946,27.95506484375,4.58672,27.88766484375Q4.78398,27.82036484375,4.96367,27.71576484375Q5.14337,27.61126484375,5.29861,27.47346484375Q5.45384,27.33566484375,5.57866,27.17006484375Q5.70352,27.00426484375,5.79313,26.81696484375Q5.88274,26.62966484375,5.93366,26.42796484375Q5.98459,26.22626484375,5.99486,26.01796484375Q6.00513,25.80966484375,5.97436,25.60276484375L4.2486,13.99886484375L5.97378,2.39897484375Q6.00455,2.19207484375,5.99427,1.98378484375Q5.984,1.77549484375,5.93308,1.57381484375Q5.88215,1.37214484375,5.79254,1.18482484375Q5.70293,0.99751484375,5.57807,0.83176884375Q5.45325,0.66608384375,5.29802,0.52831484375Q5.14278,0.39054584375,4.96308,0.28598684375Q4.78339,0.18142684375,4.58613,0.11409284375Q4.38888,0.04675804375,4.18164,0.01923584375Q4.07825,0.00550537375,3.97386,0.00195430175Q3.86947,-0.0015967662500000002,3.76507,0.005065743750000001Q3.66068,0.01172824375,3.55729,0.02854014375Q3.4539,0.04535214375,3.35251,0.07215154375Q3.25112,0.09895094375,3.15271,0.13547984375Q3.05429,0.17200884375,2.95981,0.21791484375Q2.86532,0.26382184375,2.77566,0.31866384375Q2.68601,0.37350584375,2.60205,0.43675484375Q2.5181,0.5000038437500001,2.44065,0.57105184375Q2.3632,0.64209984375,2.293,0.72026084375Q2.2228,0.79842284375,2.16053,0.88294584375Q2.09826,0.96746784375,2.04452,1.05753484375Q1.99078,1.14760484375,1.94608,1.24235484375Q1.90139,1.33710484375,1.86617,1.43562484375Q1.83095,1.53414484375,1.80554,1.63547484375Q1.78014,1.73681484375,1.76479,1.83999484375Z"
                                fill-rule="evenodd" fill-opacity="1"
                                data-spm-anchor-id="5176.28103460.0.i1.297c5d27QZetGL"></path>
                        </g>
                    </g>
                </svg>
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
    left: calc(var(--sidebar-width) - $vertical-divider-width / 2 + 10px); /* 减去按钮宽度的一半 */
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
    display: none;  // 默认隐藏
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
        z-index: 99;  // 确保在侧边栏下面
    }
}
</style>
