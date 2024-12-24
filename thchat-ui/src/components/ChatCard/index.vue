<template>
    <div class="container dashed-border">
        <!-- 用户消息 -->
        <div class="user-message" v-if="query">
            <div class="avatar-header">
                <img class="avatar" :src="avatar_list.user" alt="User">
                <span class="avatar-name">用户</span>
            </div>
            <p :class="{ 'collapse-p': !isExpanded }" ref="queryText">
                {{ query }}
            </p>
            <el-icon v-if="isTruncatable" @click="toggleExpand" class="collapse-icon">
                <ArrowDown v-if="!isExpanded" />
                <ArrowUp v-else />
            </el-icon>
        </div>

        <div class="bot-div" v-if="answer || responseTime && finishTime">
            <!-- 机器人消息 -->
            <div class="bot-message" v-if="answer">
                <div class="avatar-header">
                    <img v-if="avatar_list[series]" class="avatar" :src="avatar_list[series]" alt="Bot Avatar" >
                    <img v-else class="avatar" :src="avatar_list.local" alt="Default Bot Avatar" >
                    <span class="avatar-name">{{ model_name }}</span>
                </div>
                <v-md-preview :text="answer" @copy-code-success="handleCopyCodeSuccess"></v-md-preview>
            </div>
            <!-- 新增的回答统计 -->
            <div class="answer-stats" v-if="chat_detail && responseTime && finishTime">
                <span>回答耗时: {{finishTime - responseTime}} ms</span>
                <el-tooltip content="复制 Markdown" placement="bottom">
                    <el-icon @click="copyMarkdown"><CopyDocument /></el-icon>
                </el-tooltip>
                <el-tooltip content="复制纯文本" placement="bottom">
                    <el-icon @click="copyPlainText"><Document /></el-icon>
                </el-tooltip>
                <el-tooltip content="删除对话" placement="bottom">
                    <el-icon @click="deleteChat"><Delete /></el-icon>
                </el-tooltip>
                <span>字数统计: {{answer.length}} 字符</span>
            </div>
            <div class="answer-stats" v-else-if="chat_detail">
                <el-tooltip content="删除对话" placement="bottom">
                    <el-icon @click="deleteChat"><Delete /></el-icon>
                </el-tooltip>
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
import { marked } from 'marked';
import user from '../../assets/images/user.png';
import qwen from '../../assets/images/qwen.jpg';
import baichuan from '../../assets/images/baichuan.png';
import xunfei from '../../assets/images/xunfei.svg';
import zhipu from '../../assets/images/zhipu.png';
import wenxin from '../../assets/images/wenxin.png';
import yi from '../../assets/images/yi.svg';
import local from '../../assets/images/logo.png';

export default {
    name: 'ChatCard',
    data() {
        return {
            // 是否展开
            isExpanded: false,
            // 用户文本最大显示高度
            maxHeight: 60,
            // 是否可折叠
            isTruncatable: false,
        }
    },
    props: {
        // AI回答
        answer: String,
        // 用户提问
        query: String,
        // 模型系列
        series: String,
        // 回复时间
        responseTime: Number,
        // 结束时间
        finishTime: Number,
        // 用于标识对话
        sessionId: Number,
        // 模型名称
        model_name: String
    },
    computed: {
        // 是否开启回答统计
        chat_detail() {
            return this.$store.state.setting.chat_detail;
        },
        // 使用计算属性动态获取头像
        avatar_list() {
            return {
                user: user,
                qwen: qwen,
                baichuan: baichuan,
                xunfei: xunfei,
                zhipu: zhipu,
                wenxin: wenxin,
                yi: yi,
                local: local
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            const queryTextElement = this.$refs.queryText;
            if (queryTextElement.scrollHeight > this.maxHeight) {
                this.isTruncatable = true;
            }
        });
    },
    methods: {
        // 复制代码成功
        handleCopyCodeSuccess(code) {
            this.$notify({
                title: '代码复制成功！',
                type: 'success',
            });
        },
        // md复制
        async copyMarkdown() {
            try {
                await navigator.clipboard.writeText(this.answer);
                this.$notify({
                    title: 'Markdown复制成功！',
                    type: 'success',
                });
            } catch (error) {
                console.log('Markdown内容复制error:', error)
                this.$notify({
                    title: '复制失败！',
                    type: 'error',
                });
            }
        },
        // 纯文本复制
        async copyPlainText() {
            try {
                // 创建临时DOM元素来解析Markdown
                const div = document.createElement('div');
                div.innerHTML = marked.parse(this.answer);
                const plainText = div.textContent || div.innerText || '';
                
                await navigator.clipboard.writeText(plainText);
                this.$notify({
                    title: '纯文本复制成功！',
                    type: 'success',
                });
            } catch (error) {
                console.log('纯文本复制error:', error)
                this.$notify({
                    title: '复制失败！',
                    type: 'error',
                });
            }
        },
        // 删除对话
        deleteChat() {
            this.$emit('delete-chat', this.sessionId);
        },
        toggleExpand() {
            this.isExpanded = !this.isExpanded;
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
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0.3rem 0.8rem;
}

.bot-div {
    border-top: 1px dashed grey;
}

.user-message img,
.bot-message img {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    object-fit: cover;
}

.user-message p {
    width: 100%;
    padding: 0.4rem 0 0 0;
    margin: 0;
    text-align: left;
}

:deep(.v-md-editor-preview) {
    width: 100%;
    text-align: left;
}

:deep(.vuepress-markdown-body:not(.custom)) {
    padding: 0.4rem 0;
}

@media (max-width: 419px) {
    :deep(.vuepress-markdown-body div[class*=v-md-pre-wrapper-]) {
        margin: 0;
    }
}

.user-message p, :deep(.vuepress-markdown-body) {
    font-size: 13px;
    color: var(--common-color);
    background: none;
    word-wrap: break-word;
}

/**
 * 用户与AI头像样式
 */
.avatar-header {
    display: flex;
    align-items: center;
    gap: 8px;

    > .avatar {
        border: 1px solid var(--common-color);
    }

    > .avatar-name {
        font-size: 13px;
        color: var(--common-color);
        font-weight: bold;
    }
}

/**
 * 底部信息
 */
.answer-stats {
    font-size: 10px;
    color: var(--answer-stats-color);
    display: flex;
    justify-content: space-between;
    padding: 0.2rem 0.8rem;

    > .el-icon {
        cursor: pointer;

        &:hover {
            color: var(--el-color-primary);
        }
    }
}

.collapse-p {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.collapse-icon {
    position: absolute;
    bottom: 5px;
    right: -14px;
    font-size: 13px;
    color: var(--common-color);
    cursor: pointer;
}
</style>
