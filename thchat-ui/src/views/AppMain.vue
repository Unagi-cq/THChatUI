<template>
    <div class="home" ref="homeRef">

        <el-row :gutter="24" justify="center" style="margin-left: 0;margin-right: 0;">

            <el-col :md="18" :sm="22" :xs="22">
                <ChatCard :qaId="c['qaId']" :query="c['query']" :answer="c['answer']" :modelName="c['modelName']"
                    :series="c['series']" :responseTime="c['responseTime']" :finishTime="c['finishTime']"
                    :files="c['files']" :modelType="c['modelType']" :recall="c['recall']" :reason="c['reason']"
                    v-for="c in active_session_qa_data" />

                <div class="title-container" v-if="is_show">
                    <div class="title-line">{{ $t('AppMain.title') }} <span>THChatUI</span></div>
                    <div class="sub-title-line">{{ $t('AppMain.welcome') }}</div>
                    <div class="sub-title-line">
                        <el-link type="primary" href="https://unagi-cq.github.io/THChatUI/#/docs"
                            @click="goTo('/about')">
                            {{ $t('AppMain.viewDocs') }}
                        </el-link>
                    </div>
                </div>
            </el-col>

            <canvas id="live2d"></canvas>
        </el-row>
    </div>
</template>

<script>
import loadLive2d from 'live2d-helper'

export default {
    name: 'AppMain',
    data() {
        return {
            isLive2dLoading: false,
            live2dError: null,
            live2dInstance: null  // 添加实例引用
        }
    },
    computed: {
        // 当前激活的聊天记录uuid
        active() {
            return this.$store.state.app.active;
        },
        // 激活会话的QA对
        active_session_qa_data() {
            const activeSession = this.$store.state.app.chat.findSession(this.active);
            return activeSession?.data || [];
        },
        // 等app数据加载之后再执行逻辑 否则会闪屏
        is_show() {
            return this.$store.state.app.ready && this.active_session_qa_data.length === 0;
        },
        // 看板娘启用状态
        live2dEnabled() {
            return this.$store.state.setting.live2d_enabled || false;
        },
        // 当前看板娘模型
        currentLive2dModel() {
            return this.$store.state.setting.live2d_model || null;
        }
    },
    methods: {
        // 统一处理滚动
        scrollToBottom() {
            this.$nextTick(() => {
                if (this.$refs.homeRef) {
                    this.$refs.homeRef.scrollTop = this.$refs.homeRef.scrollHeight;
                }
            });
        },
        // 初始化Live2D
        async initLive2d() {
            if (window.innerWidth <= 768 || !this.live2dEnabled || !this.currentLive2dModel) {
                if (this.live2dInstance) {
                    // 清理现有实例
                    this.live2dInstance.dispose && this.live2dInstance.dispose();
                    this.live2dInstance = null;
                }
                return;
            }

            this.isLive2dLoading = true;
            this.live2dError = null;

            try {
                // 清理现有实例
                if (this.live2dInstance) {
                    this.live2dInstance.dispose && this.live2dInstance.dispose();
                }

                this.live2dInstance = await loadLive2d({
                    canvas: "live2d",
                    baseUrl: this.currentLive2dModel.substring(0, this.currentLive2dModel.lastIndexOf('/')),
                    model: this.currentLive2dModel,
                    globalFollowPointer: true,
                    allowSound: true,
                    height: "800"
                });
            } catch (error) {
                console.error('Live2D 加载失败:', error);
                this.live2dError = error.message || '初始化失败';
            } finally {
                this.isLive2dLoading = false;
            }
        },
        /**
         * 跳转页面函数
         * @param path
         */
        goTo(path) {
            this.$router.push(path)
        }
    },
    watch: {
        "$store.state.app.chat": {
            deep: true,
            handler: function(newVal, oldVal) {
                const isAtBottom = this.$refs.homeRef.scrollTop + this.$refs.homeRef.clientHeight >= this.$refs.homeRef.scrollHeight - 200;
                if (isAtBottom) {
                    this.scrollToBottom();
                }
            }
        },
        "$store.state.app.active": {
            deep: true,
            handler: function() {
                this.scrollToBottom();
            }
        },
        query() {
            this.scrollToBottom();
        },
        currentLive2dModel: {
            handler: function() {
                this.initLive2d();
            }
        },
        live2dEnabled: {
            handler: function() {
                this.initLive2d();
            }
        }
    },
    mounted() {
        this.initLive2d();
    },
    created() {
        this.scrollToBottom();
    }
}
</script>

<style lang="scss" scoped>
/* 确保容器可以滚动 */
.home {
    height: 100%;
    overflow-y: scroll;
    scrollbar-width: none;
    /* Firefox */
}

.home::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari 和 Opera */
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

/* 修改live2d容器样式 */
#live2d {
    // border: 1px solid #000;
    width: 200px;
    position: fixed; /* 改为固定定位 */
    bottom: 82px; /* 固定在底部 */
    right: -20px; /* 固定在右侧 */
    z-index: 100; /* 确保在其他元素上层 */
    
    /* 在小屏幕设备上隐藏live2d */
    @media screen and (max-width: 768px) {
        display: none;
    }
}
</style>
