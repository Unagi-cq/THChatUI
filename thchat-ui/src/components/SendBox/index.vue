<template>
    <div class="search-container">
        <!--    输入框    -->
        <el-input placeholder="请输入你的问题或需求，按'↑'可快捷复制问题" v-model="query" :autosize="{ minRows: 1, maxRows: 8 }" resize="none"
            @keydown.enter="onEnterKeyDown" @keydown.up="onEnterKeyUp" type="textarea">
        </el-input>

        <div class="left-icons">
            <!-- 上传图标 -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
                <path
                    d="M6.93745 10C6.24652 10.0051 5.83076 10.0263 5.4996 10.114C3.99238 10.5131 2.96048 11.8639 3.00111 13.3847C3.01288 13.8252 3.18057 14.3696 3.51595 15.4585C4.32309 18.079 5.67958 20.3539 8.7184 20.8997C9.27699 21 9.90556 21 11.1627 21L12.8372 21C14.0943 21 14.7229 21 15.2815 20.8997C18.3203 20.3539 19.6768 18.079 20.4839 15.4585C20.8193 14.3696 20.987 13.8252 20.9988 13.3847C21.0394 11.8639 20.0075 10.5131 18.5003 10.114C18.1691 10.0263 17.7534 10.0051 17.0625 10"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                <path
                    d="M12 3L12 14M12 3C12.4683 3 12.8243 3.4381 13.5364 4.3143L14.5 5.5M12 3C11.5316 3 11.1756 3.4381 10.4635 4.3143L9.49995 5.5"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <!-- 知识库图标 -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
                <path
                    d="M8.85746 12.5061C6.36901 10.6456 4.59564 8.59915 3.62734 7.44867C3.3276 7.09253 3.22938 6.8319 3.17033 6.3728C2.96811 4.8008 2.86701 4.0148 3.32795 3.5074C3.7889 3 4.60404 3 6.23433 3H17.7657C19.396 3 20.2111 3 20.672 3.5074C21.133 4.0148 21.0319 4.8008 20.8297 6.37281C20.7706 6.83191 20.6724 7.09254 20.3726 7.44867C19.403 8.60062 17.6261 10.6507 15.1326 12.5135C14.907 12.6821 14.7583 12.9567 14.7307 13.2614C14.4837 15.992 14.2559 17.4876 14.1141 18.2442C13.8853 19.4657 12.1532 20.2006 11.226 20.8563C10.6741 21.2466 10.0043 20.782 9.93278 20.1778C9.79643 19.0261 9.53961 16.6864 9.25927 13.2614C9.23409 12.9539 9.08486 12.6761 8.85746 12.5061Z"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <!-- 联网图标 -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
                <path
                    d="M8.9835 1.99998C6.17689 2.06393 4.53758 2.33109 3.41752 3.44727C2.43723 4.42416 2.10954 5.79742 2 7.99998M15.0165 1.99998C17.8231 2.06393 19.4624 2.33109 20.5825 3.44727C21.5628 4.42416 21.8905 5.79742 22 7.99998M15.0165 22C17.8231 21.9361 19.4624 21.6689 20.5825 20.5527C21.5628 19.5758 21.8905 18.2026 22 16M8.9835 22C6.17689 21.9361 4.53758 21.6689 3.41752 20.5527C2.43723 19.5758 2.10954 18.2026 2 16"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path
                    d="M15 15L17 17M16 11.5C16 9.01468 13.9853 6.99998 11.5 6.99998C9.01469 6.99998 7 9.01468 7 11.5C7 13.9853 9.01469 16 11.5 16C13.9853 16 16 13.9853 16 11.5Z"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </div>

        <div class="right-icons">
            <!--    发送ICON    -->
            <el-button type="primary" @click="onSubmitChat" v-if="controller === undefined"
                class="right-send-stop-button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none">
                    <path
                        d="M11.922 4.79004C16.6963 3.16245 19.0834 2.34866 20.3674 3.63261C21.6513 4.91656 20.8375 7.30371 19.21 12.078L18.1016 15.3292C16.8517 18.9958 16.2267 20.8291 15.1964 20.9808C14.9195 21.0216 14.6328 20.9971 14.3587 20.9091C13.3395 20.5819 12.8007 18.6489 11.7231 14.783C11.4841 13.9255 11.3646 13.4967 11.0924 13.1692C11.0134 13.0742 10.9258 12.9866 10.8308 12.9076C10.5033 12.6354 10.0745 12.5159 9.21705 12.2769C5.35111 11.1993 3.41814 10.6605 3.0909 9.64127C3.00292 9.36724 2.97837 9.08053 3.01916 8.80355C3.17088 7.77332 5.00419 7.14834 8.6708 5.89838L11.922 4.79004Z"
                        stroke="currentColor" stroke-width="3.5" />
                </svg>
            </el-button>
            <!--    停止发送ICON    -->
            <el-button type="danger" @click="stopChat" v-if="controller !== undefined" class="right-send-stop-button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3.5" />
                    <path d="M9.5 9L9.5 15M14.5 9V15" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </el-button>
        </div>
    </div>

</template>

<script>
import { postProcess } from "@/util/config";

export default {
    name: 'SendBox',
    data() {
        return {
            // 输入框内容
            query: "",
            // 聊天控制
            controller: undefined
        }
    },
    computed: {
        // 当前激活的聊天选项卡uuid
        active: {
            get() {
                return this.$store.state.app.active;
            },
            set(val) {
                this.$store.dispatch('setActive', val);
            }
        },
        // 获取历史聊天选项卡列表
        tabs: {
            get() {
                return this.$store.state.app.tabs;
            },
            set(val) {
                this.$store.dispatch('setTabs', val);
            }
        },
        // 获取所有聊天内容
        chats: {
            get() {
                return this.$store.state.app.chats;
            },
            set(val) {
                this.$store.dispatch('setChats', val);
            }
        },
        // 平台标识
        platform: {
            get() {
                return this.$store.state.setting.platform;
            }
        },
        // API Key
        api_key: {
            get() {
                return this.$store.state.setting.api_key;
            }
        },
        // 模型配置
        model_config: {
            get() {
                return this.$store.state.setting.model_config;
            }
        },
        // 是否开启多轮对话
        memory: {
            get() {
                return this.$store.state.setting.memory;
            }
        }
    },
    methods: {
        /**
         * 控制Shift+Enter不触发发送请求事件
         */
        onEnterKeyDown(e) {
            // 按下Shift时 e.shiftKey = true
            if (!e.shiftKey) {
                e.cancelBubble = true; //ie阻止冒泡行为
                e.stopPropagation();//Firefox阻止冒泡行为
                e.preventDefault(); //取消事件的默认动作*换行
                this.onSubmitChat();
            }
        },

        /**
         * 控制按下 上键 自动填入最近一条问题
         */
        onEnterKeyUp() {
            if (this.query === '') {
                if (this.chats.length > 0) {
                    // 使用解构赋值创建chatList的副本，以避免直接修改原始数组
                    let chats = [...this.chats];
                    // 查找当前激活选项卡的索引
                    const index = chats.findIndex(item => item.uuid === this.active);
                    if (index === -1) {
                        console.log('未找到聊天记录');
                        return;
                    }
                    // 使用解构赋值创建data数组的副本
                    let chat = [...chats[index]['data']];

                    if (chat.length > 0) {
                        this.query = chat[chat.length - 1].query;
                    }
                }
            }
        },

        /**
         * 更新聊天记录
         * 先根据目前激活的聊天选项卡id active查询指定的聊天记录
         * 然后将聊天记录添加/覆盖到聊天记录列表中
         * @param sessionId
         * @param session
         */
        updateChats(sessionId, session) {
            try {
                // 使用解构赋值创建chatList的副本，以避免直接修改原始数组
                let chats = [...this.chats];
                // 查找当前激活选项卡的索引
                const index = chats.findIndex(item => item.uuid === this.active);

                if (index === -1) {
                    return;
                }

                // 使用解构赋值创建data数组的副本
                let chat = [...chats[index]['data']];
                let sessionIndex = chat.findIndex(item => item.sessionId === sessionId);

                if (sessionIndex > -1) {
                    // 如果找到了，先移除旧记录
                    chat.splice(sessionIndex, 1);
                }
                // 添加或更新聊天记录
                chat.push(session);

                chats[index]['data'] = chat;

                this.chats = chats;

            } catch (error) {
                console.log("更新聊天记录error:", error);
            }
        },

        /**
         * 中断聊天请求 但是其实后端模型还在回答
         */
        stopChat() {
            if (this.controller) {
                this.controller.abort();
                this.controller = undefined;
            }
        },

        /**
         * 动态导入不同平台的远程接口规范
         */
        getDynamicCall() {
            if (this.platform === 'Ali_DashScope') {
                return import("@/api/Ali_DashScope").then(module => module.fenchStream);
            } else if (this.platform === 'Xunfei_Spark') {
                return import("@/api/Xunfei_Spark").then(module => module.fenchStream);
            } else if (this.platform === 'Zhipu_BigModel') {
                return import("@/api/Zhipu_BigModel").then(module => module.fenchStream);
            } else if (this.platform === 'Baidu_QianFan') {
                return import("@/api/Baidu_QianFan").then(module => module.fenchStream);
            } else if (this.platform === 'Local') {
                return import("@/api/Local").then(module => module.fenchStream);
            }
        },

        /**
         * 提交聊天请求
         */
        async onSubmitChat() {
            if (this.query === '') {
                return;
            }

            let [query, uuid] = [this.query, Date.now()];

            // 重置输入框
            this.query = ''

            let session = {
                "sessionId": uuid,
                "query": query,
                "responseTime": undefined,
                "answer": "",
                "finishTime": undefined,
                "series": this.model_config.series,
                "model_name": this.model_config.name
            }

            // active为空表示现在是新建会话，否则表示是已有会话
            if (this.active === '') {
                // 生成一个新Tab并缓存
                let tab = {
                    "title": query,
                    "uuid": uuid
                }
                this.tabs = [tab, ...this.tabs];
                // 生成一个新聊天记录并缓存
                this.chats = [{ "uuid": uuid, "data": [] }, ...this.chats]
                // 激活当前聊天
                this.active = uuid;
            }

            // 更新chatList
            this.updateChats(uuid, session);

            const index = this.chats.findIndex(item => item.uuid === this.active);

            if (index === -1) {
                this.$notify({
                    title: '找不到聊天记录!',
                    message: '请新建聊天或清空缓存后重试',
                    type: 'error',
                });
                return;
            }

            // 此处控制是否传入历史记录
            let chat = [];
            if (this.memory) {
                chat = this.chats[index]['data'];
                chat = chat.slice(-4);
                // 除了最后一个聊天记录 如果answer为空则过滤掉
                chat = chat.filter(item => item.answer !== '');
            }

            try {
                this.controller = new AbortController();
                this.getDynamicCall().then(fenchStream => {
                    fenchStream({
                        prompt: query,
                        history: chat,
                        files: this.$store.state.app.files,
                        controller: this.controller,
                        onopen: (event) => {
                            // SSE的500错误需要在onopen中检测 https://github.com/Azure/fetch-event-source/issues/70
                            console.log('连接成功')
                            if (event !== undefined && event.status === 401) {
                                this.$notify({
                                    title: '远程调用失败!',
                                    message: '请检查API KEY是否填写或过期',
                                    type: 'error',
                                });
                            }
                            if (event !== undefined && (event.status === 500 || event.status === 404)) {
                                this.$notify({
                                    title: '无法连接本地接口!',
                                    message: '请检测网络或接口是否开启',
                                    type: 'error',
                                });
                            } else if (event !== undefined && event.status === 422) {
                                this.$notify({
                                    title: '本地接口错误!',
                                    message: '请检测接口是否正常',
                                    type: 'error',
                                })
                            }
                            session.responseTime = new Date().getTime();
                            // 更新聊天记录
                            this.updateChats(uuid, session);
                        },
                        onmessage: (event) => {
                            // 过滤接口内部错误消息
                            if (event.event === 'error') {
                                this.$notify({
                                    title: '本地接口错误!',
                                    message: '请检测接口内部是否发生错误或异常',
                                    type: 'error',
                                });
                                session.finishTime = new Date().getTime();
                                this.stopChat()
                            }
                            try {
                                session.answer += postProcess(event, this.model_config.post_method);
                            } catch (e) {
                                console.log("本地模型解析响应error:", e)
                            }
                            // 更新聊天记录
                            this.updateChats(uuid, session);
                        },
                        onclose: () => {
                            console.log("连接关闭")
                            session.finishTime = new Date().getTime();
                            this.stopChat()
                            // 更新聊天记录
                            this.updateChats(uuid, session);
                        },
                        onerror: (error) => {
                            console.log('close', error)
                            this.stopChat()
                            this.$message.error(`系统错误：${error}`)
                        }
                    });
                });
            } catch (e) {
                console.error(e);
            }

        }

    }
}
</script>

<style lang="scss" scoped>
/**
 * 变量定义
 */
$icon-length: 32px;

/**
 * 发送框容器
 */
.search-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    min-height: 40px;
}

/**
 * 左侧icons
 */
.left-icons {
    position: absolute;
    left: 6px;
    bottom: 8px;
    display: flex;
    gap: 8px;
    z-index: 99;

    svg {
        cursor: pointer;
        color: var(--common-color);
        opacity: 0.6;
        transition: opacity 0.2s;

        &:hover {
            opacity: 1;
        }
    }
}

/**
 * 右侧icons
 */
.right-icons {
    position: absolute;
    bottom: 4px;
    right: 2px;
    z-index: 99;

    .right-send-stop-button {
        height: $icon-length;
        width: $icon-length;
        border-radius: 10px;
    }
}

/**
 * elementui输入框
 */
:deep(.el-textarea) {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    border-radius: 10px;
    border: 2px solid var(--common-color);
    background: var(--sendBox-bg-color);
    padding-bottom: $icon-length;
}

:deep(.el-textarea__inner) {
    max-height: 200px;
    font-size: 14px;
    color: var(--common-color);
    background: var(--sendBox-bg-color);
    padding: 6px 32px 0 6px;
    border-radius: 10px;
    box-shadow: 0 0;
    font-weight: 100;
    height: calc(100% - $icon-length);
    scrollbar-width: none;

    &::placeholder {
        color: var(--common-color);
        opacity: 0.2;
    }
}

:deep(.el-textarea__inner)::-webkit-scrollbar {
    display: none;
}
</style>
