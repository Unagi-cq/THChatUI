<template>
    <div class="search-container">
        <!--    输入框    -->
        <el-input
            placeholder="请输入你的问题或需求"
            v-model="query"
            class="search-input"
            autosize
            resize="none"
            @keydown.enter="onEnterKeyDown"
            @keydown.up="onEnterKeyUp"
            type="textarea">
        </el-input>

        <!--    发送ICON    -->
        <el-button
            type="primary"
            icon="Promotion"
            @click="onSubmitChat"
            v-if="controller === undefined"
            class="search-button">
        </el-button>

        <!--    停止发送ICON    -->
        <el-button
            type="danger"
            icon="VideoPause"
            @click="stopChat"
            v-if="controller !== undefined"
            class="search-button">
        </el-button>

    </div>

</template>

<script>
import {local} from "@/api/local";
import {postProcess} from "@/util/rule";

export default {
    name: 'SendBox',
    data() {
        return {
            // 输入框内容
            query: "",
            // 输入框高度 由于毛玻璃主题有些特殊性，所以需要手动设置高度
            textareaHeight: '41px', // 初始值
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
        region: {
            get() {
                return this.$store.state.setting.region;
            }
        },
        // 请求方式 本地/远程
        method: {
            get() {
                return this.$store.state.setting.method;
            }
        },
        // API Key
        api_key: {
            get() {
                return this.$store.state.setting.api_key;
            }
        },
        // 模型名称
        model_name: {
            get() {
                return this.$store.state.setting.model_name;
            }
        },
        // 模型版本
        model_version: {
            get() {
                return this.$store.state.setting.model_version;
            }
        },
        // 是否开启多轮对话
        memory: {
            get() {
                return this.$store.state.setting.memory;
            }
        },
        // 前置规则处理组 远程请求一律在util/rule.js统一处理
        pre_group: {
            get() {
                return this.$store.state.setting.pre_group;
            }
        },
        // 后置规则处理组 远程请求一律在util/rule.js统一处理
        post_group: {
            get() {
                return this.$store.state.setting.post_group;
            }
        }
    },
    /**
     * 这里是为了自动调节输入框毛玻璃UI的高度
     */
    mounted() {
        // 获取textarea元素
        const textarea = this.$el.querySelector('.el-textarea__inner');
        // 更新CSS变量以匹配textarea的高度
        const updateHeight = () => {
            this.textareaHeight = `${textarea.scrollHeight}px`
        };
        // 监听textarea的输入事件来更新高度
        textarea.addEventListener('input', updateHeight);
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
        getRemoteCall() {
            if (this.region === 'Ali_DashScope') {
                return import("@/api/Ali_DashScope").then(module => module.remote);
            } else if (this.region === 'Xunfei_Spark') {
                return import("@/api/Xunfei_Spark").then(module => module.remote);
            } else if (this.region === 'Zhipu_BigModel') {
                return import("@/api/Zhipu_BigModel").then(module => module.remote);
            }
        },

        /**
         * 提交聊天请求
         */
        async onSubmitChat() {
            if (this.query === '') {
                this.$notify({
                    title: '请输入你的问题或需求!',
                    type: 'warning',
                });
                return;
            }
            // 此处的model_name 用以未来显示模型的头像
            let [query, uuid, model_name, model_version] = [this.query, Date.now(), this.method === 'local' ? 'default' : this.model_name, this.model_version];

            // 重置输入框
            this.query = ''
            // 重置输入框高度 毛玻璃蒙版高度需要手动设置
            this.textareaHeight = '41px'

            let session = {
                "sessionId": uuid,
                "query": query,
                "responseTime": undefined,
                "answer": "",
                "finishTime": undefined,
                "model_name": model_name
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
                this.chats = [{"uuid": uuid, "data": []}, ...this.chats]
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
                if (this.method === 'local') {
                    await local({
                        prompt: query,
                        history: chat,
                        files: this.$store.state.app.files,
                        controller: this.controller,
                        onopen: (event) => {
                            // SSE的500错误需要在onopen中检测 https://github.com/Azure/fetch-event-source/issues/70
                            console.log('开始发送', uuid)
                            if (event.status === 500 || event.status === 404) {
                                this.$notify({
                                    title: '无法连接本地接口!',
                                    message: '请检测网络或接口是否开启',
                                    type: 'error',
                                });
                            } else if (event.status === 422) {
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
                                // 更新聊天记录
                                this.updateChats(uuid, session);
                            }
                            try {
                                // 假设 event.data 是一次消息的内容
                                let data = JSON.parse(event.data).data;

                                if (typeof data === 'string') {
                                    session.answer += data;
                                } else if (typeof data === 'object' && data.hasOwnProperty('content')) {
                                    session.answer += data.content;
                                } else if (typeof data === 'object' && data.hasOwnProperty('data')) {
                                    session.answer += data.data;
                                }

                            } catch (e) {
                                console.log("本地模型解析响应error:", e)
                            }
                            // 更新聊天记录
                            this.updateChats(uuid, session);
                        },
                        onclose: () => {
                            console.log("连接关闭", uuid)
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
                } else {
                    this.getRemoteCall().then(remote => {
                        // 现在 remote 可以使用了，它是根据条件导入的模块的 remote
                        remote({
                            model_version: model_version,
                            prompt: query,
                            history: chat,
                            groupIndex: this.pre_group,
                            controller: this.controller,
                            onopen: (event) => {
                                console.log('连接成功')
                                if (event != undefined && event.status === 401) {
                                    this.$notify({
                                        title: '远程调用失败!',
                                        message: '请检查API KEY是否填写或过期',
                                        type: 'error',
                                    });
                                }
                                session.responseTime = new Date().getTime();
                                // 更新聊天记录
                                this.updateChats(uuid, session);
                            },
                            onmessage: (event) => {
                                try {
                                    session.answer += postProcess(event, this.post_group);
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
                }
            } catch (e) {
                console.error(e);
            }

        }

    }
}
</script>

<style scoped>

.search-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-end; /* 使按钮位于容器的右侧 */
    bottom: -20px;
}

.search-input::before {
    content: '';
    position: absolute;
    max-height: 150px;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: v-bind(textareaHeight);
    z-index: 0; /* 将伪元素置于输入框下层 */
    background: var(--send-box-search-input-bg);
    backdrop-filter: var(--send-box-search-input-before);
    -webkit-backdrop-filter: var(--send-box-search-input-before);
}

:deep(.el-textarea__inner) {
    max-height: 150px;
    font-size: 14px;
    color: var(--chat-card-font-color);
    background: none;
    padding: 10px 40px 10px 5px;
    position: absolute;
    bottom: 0;
    border: 1px dashed grey;
}

.search-button {
    z-index: 99;
    margin: -35px 5px 0 0;
    height: 30px;
    width: 30px;
    border-radius: 50%;

}

:deep(.el-textarea__inner) {
    scrollbar-width: none; /* Firefox */
}

:deep(.el-textarea__inner)::-webkit-scrollbar {
    display: none; /* Chrome, Safari 和 Opera */
}
</style>
