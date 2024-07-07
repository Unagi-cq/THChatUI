<template>
    <div class="container theme-bg dashed-border">
        <!-- 用户消息 -->
        <div class="user-message" v-if="query">
            <img class="avatar" :src="baseAvatar['user']" alt="User" >
            <p>{{ query }}</p>
        </div>

        <div class="bot-div" v-if="answer">
            <!-- 机器人消息 -->
            <div class="bot-message" v-if="answer">
                <img v-if="baseAvatar[model_name]" class="avatar" :src="baseAvatar[model_name]" alt="Bot Avatar" >
                <img v-else class="avatar" :src="baseAvatar['default']" alt="Default Bot Avatar" >
                <v-md-preview :text="answer" @copy-code-success="handleCopyCodeSuccess"></v-md-preview>
            </div>
            <!-- 新增的回答统计 -->
            <div class="answer-stats" v-if="chat_detail && responseTime && finishTime">
                <span>回答耗时: {{finishTime - responseTime}} ms</span>
                <el-icon @click="copyText"><CopyDocument /></el-icon>
                <span>字数统计: {{answer.length}} 字符</span>
            </div>
        </div>

        <!-- 机器人回复消息占位 -->
<!--        <div class="bot-div" v-if="!answer">
            <el-skeleton class="bot-message" v-if="!answer" animated :throttle="1000">
                <template #template>
                    <el-skeleton-item class="avatar" variant="image" style="width: 40px; height: 40px;border-radius: 50%;object-fit: cover;top: 0;" />
                    <div style="padding: 14px;width: 300px">
                        <el-skeleton-item variant="p" style="width: 70%" />
                        <el-skeleton-item variant="text" style="width: 100%" />
                    </div>
                </template>
            </el-skeleton>
        </div>-->

    </div>
</template>

<script>
export default {
    name: 'ChatCard',
    data() {
        return {
            // 本地头像列表
            baseAvatar: this.$store.state.setting.baseAvatar
        }
    },
    props: {
        // AI回答
        answer: String,
        // 用户提问
        query: String,
        // 模型名称
        model_name: String,
        // 回复时间
        responseTime: Number,
       // 结束时间
        finishTime: Number,
    },
    computed: {
        // 是否开启回答统计
        chat_detail() {
            return this.$store.state.setting.chat_detail;
        }
    },
    created() {

    },
    methods: {
        // 复制代码成功
        handleCopyCodeSuccess(code) {
            this.$notify({
                title: '复制成功！',
                type: 'success',
            });
        },
        // 复制AI回答
        async copyText() {
            try {
                await navigator.clipboard.writeText(this.answer);
                this.$notify({
                    title: '复制成功！',
                    type: 'success',
                });
            } catch (error) {
                console.log('文本内容复制error:', error)
                this.$notify({
                    title: '复制失败！',
                    type: 'error',
                });
            }
        }
    },
}
</script>

<style lang="scss" scoped>
/**
 * 变量定义
 */
$border-radius: 15px;

/**
 * 容器样式
 */
.container {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    border-radius: $border-radius;
}

/**
 * 用户消息与机器人消息的样式
 */
.user-message,
.bot-message {
    display: flex;
    align-items: start;
    padding: 0.4rem 0.4rem;
}

.bot-div {
    border-top: 1px dashed grey;
}

.user-message img,
.bot-message img, {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    top: 0;
}

.user-message p {
    width: 100%;
    padding: 0.8rem 0.8rem;
    margin: 0;
}

:deep(.v-md-editor-preview) {
    width: 100%;
}

:deep(.vuepress-markdown-body:not(.custom)) {
    padding: 0.4rem 0.8rem;
}

@media (max-width: 419px) {
    :deep(.vuepress-markdown-body div[class*=v-md-pre-wrapper-]) {
        margin: 0;
    }
}

.user-message p, :deep(.vuepress-markdown-body) {
    font-size: 12px;
    color: var(--chat-card-font-color);
    background: none;
    word-wrap: break-word;
}

/**
 * 底部信息
 */
.answer-stats {
    font-size: 10px;
    color: #666;
    display: flex;
    justify-content: space-between;
    padding: 0.2rem 0.8rem;
    margin-top: 5px; // 新增的上边距

    > .el-icon {
        cursor: pointer;

        &:hover {
            color: var(--el-color-primary);
        }
    }
}
</style>
