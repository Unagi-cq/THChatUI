<template>
    <div class="home" ref="homeRef">

        <el-row :gutter="24" justify="center" style="margin-left: 0;margin-right: 0;">
            <div class="main-header">
                <span>{{header_msg}}</span>
            </div>

            <el-col :md="20" :sm="24" :xs="24">
                <ChatCard :query="c['query']" :answer="c['answer']" :model_name="c['model_name']" :responseTime="c['responseTime']" :finishTime="c['finishTime']" :sessionId="c['sessionId']" @delete-chat="handleDeleteChat" v-for="c in chat"/>

                <div class="title-container theme-bg dashed-border" v-if="chat.length === 0">
                    <div class="title-line">LLM的Web会话管理方案 <span>THChatUI</span></div>
                    <div class="sub-title-line"> 嗨喽~朋友！🤖 欢迎使用THWebUI。目前项目已支持</div>
                    <el-row>
                        <el-col :span="12">
                            <div class="grid-content bg-purple-light">
                                <h1>本地实现</h1>
                                <p style="font-size: 10px">(Python实现，支持知识库和联网搜索，可切换本地模型或远程模型)</p>
                                <div class="sub-title-line">
                                    <p>① <b>聊天对话</b>功能：</p>
                                    <div style="font-size: 10px">
                                        <p>开源模型网站：Huggingface</p> <p>远程模型平台：阿里云灵积 \ 讯飞星火 \ 智谱AI</p>
                                    </div>
                                </div>
                                <div class="sub-title-line">
                                    <p>② <b>联网搜索</b>功能</p>
                                </div>
                                <div class="sub-title-line">
                                    <p>③ <b>知识库</b>功能：</p>
                                    <div style="font-size: 10px">
                                        <p>文档(pdf、word、txt)检索增强</p>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="grid-content bg-purple">
                                <h1>远程模型</h1>
                                <p style="font-size: 10px">(只需填写api-key但仅支持聊天模型)</p>
                                <div class="sub-title-line">
                                    <p> ① <b>阿里云灵积</b>平台以下模型：</p>
                                    <div style="font-size: 10px">
                                        <p>千问（7个版本）</p>
                                        <p>百川（2个版本）</p>
                                        <p>ChatGLM（1个版本）</p>
                                    </div>
                                </div>
                                <div class="sub-title-line">
                                    <p>② <b>讯飞星火</b>平台以下模型：</p>
                                    <div style="font-size: 10px">
                                        <p>星火(3种版本)</p>
                                    </div>
                                </div>
                                <div class="sub-title-line">
                                    <p>③ <b>智谱AI</b>平台以下模型：</p>
                                    <div style="font-size: 10px">
                                        <p>ChatGLM（2个版本）</p>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>

                    <div class="sub-title-line">
                        (查看源码<el-link type="primary" href="https://github.com/Unagi-cq/THChatUI" target="_blank">github</el-link>
                        系统文档<el-link type="primary" href="javascript:void(0)" @click="goTo('/tutorial')">文档</el-link>)</div>
                </div>
            </el-col>

        </el-row>
    </div>
</template>

<script>

export default {
    name: 'AppMain',
    computed: {
        // 当前激活的聊天记录uuid
        active() {
            return this.$store.state.app.active;
        },
        // 激活的聊天记录
        chat() {
            let chats =  this.$store.state.app.chats;

            try {
                return chats.filter(item => item.uuid === this.active)[0]['data'];
            } catch (error) {
                return []
            }
        },
        // 页眉提示
        header_msg() {
            if (this.$store.state.setting.method === 'local') {
                return '本地调用'+ ' ' + (this.$store.state.setting.memory ? '多轮对话' : '单轮对话');
            } else {
                return '远程调用' + ' ' + this.$store.state.setting.model_version + ' ' + (this.$store.state.setting.memory ? '多轮对话' : '单轮对话');
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
    watch: {
        // 监听chats的变化，当变化时，表示在Bot回答，此时需要刷新滚动条的位置
        "$store.state.app.chats":{
            deep:true, //深度监听设置为 true
            handler:function(newVal,oldVal){
                // 检查是否滚动到底部 给100px的误差控制 这里的100px可以根据实际需求调整
                let isAtBottom = this.$refs.homeRef.scrollTop + this.$refs.homeRef.clientHeight >= this.$refs.homeRef.scrollHeight - 100;
                if (!isAtBottom) {
                    return;
                }
                // 内容更新时，保持滚动条的位置
                this.$nextTick(() => {
                    this.$refs.homeRef.scrollTop = this.$refs.homeRef.scrollHeight
                });
            }
        },
        // 监听active的变化，当变化时，表示切换了聊天选项卡，此时需要把滚动条的位置设置到最下方
        "$store.state.app.active":{
            deep:true, //深度监听设置为 true
            handler:function(newVal,oldVal){
                // 内容更新时，保持滚动条的位置
                this.$nextTick(() => {
                    this.$refs.homeRef.scrollTop = this.$refs.homeRef.scrollHeight
                });
            }
        },
        query: function (newVal, oldVal) {
            // 内容更新时，保持滚动条的位置
            this.$nextTick(() => {
                this.$refs.homeRef.scrollTop = this.$refs.homeRef.scrollHeight
            });
        }
    },
    created() {
        // 内容更新时，保持滚动条的位置
        this.$nextTick(() => {
            this.$refs.homeRef.scrollTop = this.$refs.homeRef.scrollHeight
        });
    },
    methods: {
        /**
         * 跳转页面函数
         * @param path
         */
        goTo(path) {
            this.$router.push(path)
        },
        /**
         * 删除缓存中的单个对话卡
         * @param sessionId 会话id
         */
        handleDeleteChat(sessionId) {
            let chats = [...this.chats];
            const index = chats.findIndex(item => item.uuid === this.active);
            if (index !== -1) {
                let chat = [...chats[index]['data']];
                const sessionIndex = chat.findIndex(item => item.sessionId === sessionId);
                if (sessionIndex > -1) {
                    chat.splice(sessionIndex, 1);
                    chats[index]['data'] = chat;
                    this.chats = chats;
                }
            }
        }
    }
}
</script>

<style>
.main-header {
    position: fixed;
    margin-top: -18px;
    font-size: 12px;
    color: var(--chat-card-font-color);
}
/* 确保容器可以滚动 */
.home {
    height: 100%;
    overflow-y: scroll;
}

.home {
    scrollbar-width: none; /* Firefox */
}

.home::-webkit-scrollbar {
    display: none; /* Chrome, Safari 和 Opera */
}

.el-link {
    margin-right: 8px;
}
.el-link .el-icon--right.el-icon {
    vertical-align: text-bottom;
}

.title-container {
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    -moz-box-orient: vertical;
    -moz-box-direction: normal;
    flex-direction: column;
    padding: 20px;
    gap: 4px;
    max-width: 1000px;
    margin: 2vh auto;
    width: fit-content;
    text-align: center;
    border-radius: 20px;
}

.title-container .title-line {
    font-style: normal;
    font-weight: 700;
    font-size: 34px;
    line-height: 52px;
    color: #1a2029;
    margin-bottom: 14px;
}

.title-container .title-line span {
    color: #2454ff;
}

.title-container .sub-title-line {
    font-size: 15px;
}
</style>

