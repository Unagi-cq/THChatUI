<template>
    <div class="container">
        <!-- 用户消息 -->
        <div class="user-message" v-if="query">
            <div class="avatar-header">
                <img class="avatar" :src="avatar_list.user" alt="User Avatar">
                <span class="avatar-name">用户</span>
            </div>
            <p :class="{ 'collapse-p': !isExpanded }" ref="queryText">
                {{ query }}
            </p>
            <div v-if="files && files.length > 0" class="uploaded-files">
                <el-image 
                v-for="x in files"
                style="width: 100px; height: 100px" 
                :src="x.base64" 
                :zoom-rate="1.2" 
                :max-scale="7"
                :min-scale="0.2" 
                :preview-src-list="files.map(file => file.base64)" 
                :initial-index="0"
                fit="cover" />
            </div>
            <el-icon v-if="isTruncatable" @click="toggleExpand" class="collapse-icon">
                <ArrowDown v-if="!isExpanded" />
                <ArrowUp v-else />
            </el-icon>
        </div>

        <div v-if="answer || responseTime && finishTime">
            <!-- 机器人消息 -->
            <div class="bot-message" v-if="answer">
                <div class="avatar-header">
                    <img v-if="avatar_list[series]" class="avatar" :src="avatar_list[series]" alt="Bot Avatar">
                    <img v-else class="avatar" :src="avatar_list.local" alt="Default Bot Avatar">
                    <span class="avatar-name">{{ modelName }}</span>
                </div>
                <v-md-preview :text="answer" @copy-code-success="handleCopyCodeSuccess"></v-md-preview>
            </div>
            <!-- 新增的回答统计 -->
            <div class="answer-stats" v-if="chat_detail && responseTime && finishTime">
                <el-tooltip content="复制 Markdown" placement="bottom">
                    <svg @click="copyMarkdown" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14"
                        height="14" fill="none">
                        <path
                            d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z"
                            stroke="currentColor" stroke-width="1.5" />
                        <path d="M11 7L17 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                        <path d="M7 7L8 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                        <path d="M7 12L8 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                        <path d="M7 17L8 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                        <path d="M11 12L17 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                        <path d="M11 17L17 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                </el-tooltip>
                <el-tooltip content="复制纯文本" placement="bottom">
                    <svg @click="copyPlainText" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14"
                        height="14" fill="none">
                        <path
                            d="M9 15C9 12.1716 9 10.7574 9.87868 9.87868C10.7574 9 12.1716 9 15 9L16 9C18.8284 9 20.2426 9 21.1213 9.87868C22 10.7574 22 12.1716 22 15V16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H15C12.1716 22 10.7574 22 9.87868 21.1213C9 20.2426 9 18.8284 9 16L9 15Z"
                            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path
                            d="M16.9999 9C16.9975 6.04291 16.9528 4.51121 16.092 3.46243C15.9258 3.25989 15.7401 3.07418 15.5376 2.90796C14.4312 2 12.7875 2 9.5 2C6.21252 2 4.56878 2 3.46243 2.90796C3.25989 3.07417 3.07418 3.25989 2.90796 3.46243C2 4.56878 2 6.21252 2 9.5C2 12.7875 2 14.4312 2.90796 15.5376C3.07417 15.7401 3.25989 15.9258 3.46243 16.092C4.51121 16.9528 6.04291 16.9975 9 16.9999"
                            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </el-tooltip>
                <el-tooltip content="删除对话" placement="bottom">
                    <svg @click="deleteQA" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14"
                        fill="none">
                        <path d="M14.9994 15L9 9M9.00064 15L15 9" stroke="currentColor" stroke-width="1.5"
                            stroke-linecap="round" stroke-linejoin="round" />
                        <path
                            d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
                            stroke="currentColor" stroke-width="1.5" />
                    </svg>
                </el-tooltip>
                <span>字数统计: {{ answer.length }} 字符</span>
                <span>{{ finishTime - responseTime }} ms</span>
            </div>
            <div class="answer-stats" v-else-if="chat_detail">
                <el-tooltip content="删除对话" placement="bottom">
                    <svg @click="deleteQA" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14"
                        fill="none">
                        <path d="M14.9994 15L9 9M9.00064 15L15 9" stroke="currentColor" stroke-width="1.5"
                            stroke-linecap="round" stroke-linejoin="round" />
                        <path
                            d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
                            stroke="currentColor" stroke-width="1.5" />
                    </svg>
                </el-tooltip>
            </div>
        </div>

        <!-- 机器人回复消息占位 -->
        <!--        <div v-if="!answer">
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
import chatStoreHelper from '@/schema/chatStoreHelper';

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
        // QA的id
        qaId: Number,
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
        // 模型名称
        modelName: String,
        // 文件
        files: Array
    },
    computed: {
        active() {
            return this.$store.state.app.active;
        },
        // 是否开启回答统计
        chat_detail() {
            return this.$store.state.setting.chat_detail;
        },
        // 使用计算属性动态获取头像
        avatar_list() {
            return {
                user: new URL('@/assets/images/user.png', import.meta.url).href,
                qwen: new URL('@/assets/images/qwen.jpg', import.meta.url).href,
                baichuan: new URL('@/assets/images/baichuan.png', import.meta.url).href,
                xunfei: new URL('@/assets/images/xunfei.svg', import.meta.url).href,
                zhipu: new URL('@/assets/images/zhipu.png', import.meta.url).href,
                wenxin: new URL('@/assets/images/wenxin.png', import.meta.url).href,
                yi: new URL('@/assets/images/yi.svg', import.meta.url).href,
                local: new URL('@/assets/images/logo.png', import.meta.url).href
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
        deleteQA() {
            chatStoreHelper.delQA(this.active, this.qaId);
        },
        toggleExpand() {
            this.isExpanded = !this.isExpanded;
        }
    },
}
</script>

<style lang="scss" scoped>
/**
 * 容器样式
 */
.container {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
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
    padding: 0.3rem 0;
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
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
}

:deep(.v-md-editor-preview) {
    width: 100%;
    text-align: left;

    pre {
        overflow-x: auto;
        scrollbar-width: none;
    }
}

:deep(.vuepress-markdown-body:not(.custom)) {
    padding: 0.4rem 0 0.1rem 0;
}

@media (max-width: 419px) {
    :deep(.vuepress-markdown-body div[class*=v-md-pre-wrapper-]) {
        margin: 0;
    }
}

.user-message p,
:deep(.vuepress-markdown-body) {
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

    >.avatar {
        border: 1px solid var(--common-color);
    }

    >.avatar-name {
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
    justify-content: flex-start;
    align-items: center;
    gap: 10px;

    svg {
        vertical-align: middle;
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
    max-height: none;
}

.collapse-icon {
    position: absolute;
    bottom: 5px;
    right: -14px;
    font-size: 13px;
    color: var(--common-color);
    cursor: pointer;
}

.uploaded-files {
    margin-top: 8px;
}

</style>
