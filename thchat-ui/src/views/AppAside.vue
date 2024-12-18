<template>
    <div class="container">
        <!-- 上方Logo Start -->
        <div class="logo">
            <img src="../assets/images/logo.png" />
            <span>THChatUI</span>
        </div>
        <!-- 上方Logo End -->

        <!-- 创建新对话按钮 Start -->
        <div class="newChatButton">
            <el-button type="primary" size="default" style="width: 100%" @click="startNewChat">开始新对话</el-button>
        </div>
        <!-- 创建新对话按钮 End -->

        <!-- 聊天选项卡 Start -->
        <div class="chats">
            <div class="session flex" v-for="x in tabs" key="x.uuid" :class="{ active: x.uuid === active }"
                 @click="pickTab(x.uuid)">
                <div class="title">
                    <span>{{ x.title }}</span>
                </div>
                <div class="time flex flex-x-between">
                    <span>{{ formattedTime(x.uuid) }}</span>
                    <div class="btn-box" v-if="x.uuid === active">
                        <span class="btn delete" @click.stop="delTab(x.uuid)"><el-icon><Delete/></el-icon></span>
                    </div>
                </div>
            </div>
        </div>
        <!-- 聊天选项卡 End -->

        <!-- 工具栏 Start -->
        <div class="optionBar">
            <div class="options">
                <div class="option" @click="goTo('/docs')">
                    <svg t="1715779130816" class="icon" viewBox="0 0 1024 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" p-id="46279" width="200" height="200">
                        <path
                            d="M833.4 911.3H619.1c-43 0-77.9-34.9-77.9-77.9V619.1c0-43 34.9-77.9 77.9-77.9h214.3c43 0 77.9 34.9 77.9 77.9v214.3c0 43-34.9 77.9-77.9 77.9z m19.5-272.7c0-21.5-17.4-39-39-39H638.6c-21.5 0-39 17.4-39 39v175.3c0 21.5 17.4 39 39 39h175.3c21.5 0 39-17.4 39-39V638.6z m-19.5-155.8H619.1c-43 0-77.9-34.9-77.9-77.9V190.6c0-43 34.9-77.9 77.9-77.9h214.3c43 0 77.9 34.9 77.9 77.9v214.3c0 43-34.9 77.9-77.9 77.9z m19.5-272.7c0-21.5-17.4-39-39-39H638.6c-21.5 0-39 17.4-39 39v175.3c0 21.5 17.4 39 39 39h175.3c21.5 0 39-17.4 39-39V210.1z m-448 701.2H190.6c-43 0-77.9-34.9-77.9-77.9V619.1c0-43 34.9-77.9 77.9-77.9h214.3c43 0 77.9 34.9 77.9 77.9v214.3c0 43-34.9 77.9-77.9 77.9z m19.4-272.7c0-21.5-17.4-39-39-39H210.1c-21.5 0-39 17.4-39 39v175.3c0 21.5 17.4 39 39 39h175.3c21.5 0 39-17.4 39-39V638.6z m-19.4-155.8H190.6c-43 0-77.9-34.9-77.9-77.9V190.6c0-43 34.9-77.9 77.9-77.9h214.3c43 0 77.9 34.9 77.9 77.9v214.3c0 43-34.9 77.9-77.9 77.9z m19.4-272.7c0-21.5-17.4-39-39-39H210.1c-21.5 0-39 17.4-39 39v175.3c0 21.5 17.4 39 39 39h175.3c21.5 0 39-17.4 39-39V210.1z"
                            fill="#0066FF" p-id="46280"></path>
                    </svg>
                    <div class="option-text red-dot-wrapper">知识库</div>
                </div>
                <div class="divider">
                    <div class="border"></div>
                </div>
                <div class="option" @click="goTo('/tools')">
                    <svg t="1715778725229" class="icon" viewBox="0 0 1024 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" p-id="15387" width="200" height="200">
                        <path
                            d="M886.298 636.832654v91.264683L512 944.199802 137.702 728.097337V295.902663L512 79.800198l374.298 216.102465v87.870457h69.104798v-127.770556L512 0 68.597202 256.002564v511.994872l443.402798 256.002564 443.402798-256.002564V636.832654h-69.104798z"
                            fill="#C21B17" p-id="15388"></path>
                        <path d="M512.020509 513.377174l-33.352627-57.768494 195.337185-112.778537 33.353653 57.768493z"
                              fill="#C21B17" p-id="15389"></path>
                        <path d="M478.662754 455.605604h66.705255v225.557075h-66.705255z" fill="#C21B17"
                              p-id="15390"></path>
                        <path d="M317.928215 398.931261l33.352627-58.034084 196.234451 112.778538-33.352628 58.034084z"
                              fill="#C21B17" p-id="15391"></path>
                    </svg>
                    <div class="option-text">工具箱</div>
                </div>
                <div class="divider">
                    <div class="border"></div>
                </div>
                <div class="option" @click="goTo('/setting')">
                    <svg t="1715778956860" class="icon" viewBox="0 0 1131 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" p-id="38231" width="200" height="200">
                        <path
                            d="M735.663158 107.789474c45.810526 0 91.621053 21.557895 115.873684 61.978947l164.378947 272.168421c26.947368 43.115789 26.947368 97.010526 0 137.431579l-164.378947 272.168421c-24.252632 40.421053-67.368421 64.673684-115.873684 64.673684H396.126316c-45.810526 0-91.621053-24.252632-115.873684-64.673684l-164.378948-269.473684c-26.947368-43.115789-26.947368-97.010526 0-137.431579l164.378948-272.168421c24.252632-40.421053 67.368421-64.673684 115.873684-64.673684h339.536842z m0-83.536842H396.126316c-75.452632 0-145.515789 40.421053-185.936842 105.094736L45.810526 401.515789c-40.421053 67.368421-40.421053 153.6 0 220.968422l164.378948 272.168421c37.726316 64.673684 107.789474 105.094737 185.936842 105.094736h342.231579c75.452632 0 145.515789-40.421053 185.936842-105.094736l164.378947-272.168421c40.421053-67.368421 40.421053-153.6 0-220.968422L921.6 129.347368c-37.726316-64.673684-107.789474-105.094737-185.936842-105.094736z"
                            fill="#0066FF" p-id="38232"></path>
                        <path
                            d="M565.894737 377.263158c75.452632 0 134.736842 59.284211 134.736842 134.736842s-59.284211 134.736842-134.736842 134.736842-134.736842-59.284211-134.736842-134.736842 59.284211-134.736842 134.736842-134.736842m0-80.842105c-118.568421 0-215.578947 97.010526-215.578948 215.578947s97.010526 215.578947 215.578948 215.578947 215.578947-97.010526 215.578947-215.578947-97.010526-215.578947-215.578947-215.578947z"
                            fill="#0066FF" p-id="38233"></path>
                    </svg>
                    <div class="option-text">系统设置</div>
                </div>
            </div>
        </div>
        <!-- 工具栏 End -->
    </div>
</template>

<script>
export default {
    name: 'AppAside',
    data() {
        return {
            isCollapsed: false,
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

    },
    created() {

    },
    methods: {
        // 删除历史聊天选项卡
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
                this.goTo('/');
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
                this.goTo('/');
            }
            // 更新active
            this.active = '';
        },
        /**
         * 跳转页面函数
         * @param path
         */
        goTo(path) {
            this.$router.push(path)
        },
        /**
         * 格式化时间戳
         * @param timestamp
         * @returns {string}
         */
        formattedTime(timestamp) {
            // 将时间戳转换为Date对象
            const date = new Date(timestamp); // 乘以1000以将时间戳从秒转换为毫秒

            // 创建日期和时间格式化函数
            return date.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });
        },

    }
}
</script>

<style lang="scss" scoped>
/**
 * 变量定义
 */
$animation-time: 0.3s;

/**
 * 容器样式
 */
.container {
    height: 100vh; /* 设置容器的高度为视口高度 */
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

    > img {
        height: 35px;
        margin-right: 10px;
        border-radius: 5px;
    }

    > span {
        font-size: 18px;
    }
}

/**
 * 创建新对话按钮
 */
.newChatButton {
    width: 220px;
    padding: 5px;

    > el-button {
        padding: 20px;
        height: 30px;
    }
}

/**
 * 聊天选项卡
 */
.chats {
    font-size: 14px;
    flex: 1;
    padding: 2px 2px 2px 2px;
    margin-bottom: 80px; /* 留出空间给.optionBar */
    overflow-y: auto; /* 添加垂直滚动条 */
    scrollbar-width: none; /* Firefox */

    // 适配不同浏览器去除滚动条
    &::-webkit-scrollbar {
        display: none; /* Chrome, Safari 和 Opera */
    }

    // 单个聊天消息样式
    > .session {
        padding: 10px 6px 10px 10px;
        margin-bottom: 2px;
        cursor: pointer;
        position: relative;
        //transition: background-color $animation-time; // 平滑过渡宽度和阴影变化

        // 聊天选项卡被选中或者鼠标移动到上面的样式
        &.active, &:hover {
            background: rgba(62, 111, 251, 0.2);
            -webkit-box-shadow: 4px 4px 4px rgba(62, 111, 251, 0.4);
            -moz-box-shadow: 4px 4px 4px rgba(62, 111, 251, 0.4);
            box-shadow: 0 0 4px rgba(62, 111, 251, 0.4);
        }


        &.active:before, &:hover:before {
            content: "";
            position: absolute;
            height: 100%;
            width: 2px;
            background-color: #3e6ffb;
            top: 0;
            left: 0;
        }

        &.active:after, &:hover:after {
            content: "";
            position: absolute;
            height: 100%;
            width: 2px;
            background-color: #3e6ffb;
            top: 0;
            right: 0;
        }

        > .flex-x-between {
            -webkit-box-pack: justify;
            -webkit-justify-content: space-between;
            -moz-box-pack: justify;
            justify-content: space-between;
        }

        > .title {
            width: 220px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        > .time {
            font-size: 12px;
            font-weight: 400;
            color: #888;
            position: relative;
            width: 100%;
            line-height: 24px;

            // 删除icon
            > .btn-box {
                font-size: 14px;
                float: right;
                margin: 2px;

                &:hover {
                    color: blue;
                }
            }
        }
    }
}

/**
 * 工具栏
 */
.optionBar {
    text-align: center;
    width: 240px;
    //border-top: 1px solid #afafaf;
    padding: 6px 0 6px 0;
    bottom: 0;

    > .options {
        display: -webkit-box;
        display: -webkit-flex;
        display: -moz-box;
        display: flex;

        > .option {
            width: 50%;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
            -webkit-flex-direction: column;
            -moz-box-orient: vertical;
            -moz-box-direction: normal;
            flex-direction: column;
            -webkit-box-align: center;
            -webkit-align-items: center;
            -moz-box-align: center;
            align-items: center;
            -webkit-box-pack: center;
            -webkit-justify-content: center;
            -moz-box-pack: center;
            justify-content: center;
            position: relative;
            cursor: pointer;
            padding: 10px 0;
            box-sizing: border-box;

            // 鼠标移动到上面之后的样式
            &:hover::before {
                content: '';
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                border: 1px dashed #009688;
                border-radius: 8px;
            }

            // icon
            > .icon {
                width: 25px;
                height: 25px;
                margin-bottom: 4px;
            }

            // icon下面的文字
            > .option-text {
                overflow: hidden;
                text-overflow: ellipsis;
                font-size: 13px;
                font-style: normal;
                font-weight: 600;
                line-height: 16px;
            }
        }

        // 分割符
        > .divider {
            width: 4%;
            display: -webkit-box;
            display: -webkit-flex;
            display: -moz-box;
            display: flex;
            -webkit-box-align: center;
            -webkit-align-items: center;
            -moz-box-align: center;
            align-items: center;
            -webkit-box-pack: center;
            -webkit-justify-content: center;
            -moz-box-pack: center;
            justify-content: center;

            > .border {
                width: 1px;
                height: 30px;
                background-color: #afafaf;
            }
        }
    }
}
</style>