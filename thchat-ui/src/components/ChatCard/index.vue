<template>
    <div class="container">
        <!-- 用户消息 -->
        <div class="user-message" v-show="query">
            <div class="avatar-header">
                <img class="avatar" :src="avatar_list.user" alt="User Avatar">
                <span class="avatar-name">{{ $t('ChatCard.user_name') }}</span>
            </div>
            <p :class="{ 'collapse-p': !isExpanded }" ref="queryText">
                {{ query }}
            </p>
            <div v-if="files && files.length > 0" class="uploaded-files">
                <el-image v-for="x in files" style="width: 100px; height: 100px" :src="x.base64" :zoom-rate="1.2"
                    :max-scale="7" :min-scale="0.2" :preview-src-list="files.map(file => file.base64)"
                    :initial-index="0" fit="cover" />
            </div>
            <el-icon v-if="isTruncatable" @click="isExpanded = !isExpanded" class="collapse-icon">
                <ArrowDown v-if="!isExpanded" />
                <ArrowUp v-else />
            </el-icon>
        </div>

        <div>
            <!-- 机器人消息 -->
            <div class="bot-message">
                <!-- 头像 名称 -->
                <div class="avatar-header">
                    <img v-if="avatar_list[series]" class="avatar" :src="avatar_list[series]" alt="Bot Avatar">
                    <img v-else class="avatar" :src="avatar_list.local" alt="Default Bot Avatar">
                    <span class="avatar-name">{{ modelName }}</span>
                </div>
                <!-- 召回内容卡片 -->
                <div v-if="recall && recall.length > 0" class="recall-content">
                    <div class="recall-header">{{ $t('ChatCard.knowledge_base') }}</div>
                    <div v-for="(item, index) in recall" :key="index" class="recall-item" 
                        @click="toggleRecallItem(index)">
                        <div class="recall-title">
                            {{ item.filename }}
                            <span class="recall-score">{{ $t('ChatCard.relevance_score', { score: (item.score * 100).toFixed(1) }) }}</span>
                        </div>
                        <div class="recall-text" :class="{ 'recall-collapse': !expandedRecalls[index] }">{{ item.content }}</div>
                    </div>
                </div>
                <!-- 回答内容 -->   
                <v-md-preview :text="answer" @copy-code-success="handleCopyCodeSuccess" v-if="modelType === 'llm' || modelType === 'vim'"></v-md-preview>
                <!-- 图片生成 -->
                <div class="uploaded-files" v-if="modelType === 'igm'">
                    <template v-if="answer">
                        <el-image v-for="(image, index) in [answer]" :key="index" style="width: 100px; height: 100px"
                            :src="image" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" :preview-src-list="[answer]"
                            :initial-index="0" fit="cover" />
                    </template>
                    <el-skeleton animated variant="image" v-else>
                        <template #template>
                            <el-skeleton-item class="avatar" variant="image" style="width: 100px; height: 100px; border-radius: 10px;" />
                        </template>
                    </el-skeleton>
                </div>
            </div>
            <!-- 回答统计 -->
            <div class="answer-stats" v-if="chat_detail && responseTime && finishTime">
                <el-tooltip :content="$t('ChatCard.copyMarkdownTooltip')" placement="bottom">
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
                <el-tooltip :content="$t('ChatCard.copyPlainTextTooltip')" placement="bottom">
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
                <el-tooltip :content="$t('ChatCard.deleteConversationTooltip')" placement="bottom">
                    <svg @click="deleteQA" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14"
                        fill="none">
                        <path d="M14.9994 15L9 9M9.00064 15L15 9" stroke="currentColor" stroke-width="1.5"
                            stroke-linecap="round" stroke-linejoin="round" />
                        <path
                            d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
                            stroke="currentColor" stroke-width="1.5" />
                    </svg>
                </el-tooltip>
                <span>{{ $t('ChatCard.characterCount', { count: answer.length }) }}</span>
                <span>{{ finishTime - responseTime }} ms</span>
            </div>
            <div class="answer-stats" v-else-if="chat_detail">
                <el-tooltip :content="$t('ChatCard.deleteConversationTooltip')" placement="bottom">
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
            // 用户文本是否可折叠
            isTruncatable: false,
            // 召回内容是否可折叠
            expandedRecalls: [],
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
        files: Array,
        // 模型类型
        modelType: String,
        // 召回内容
        recall: Array
    },
    computed: {
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
                moonshot: new URL('@/assets/images/moonshot.svg', import.meta.url).href,
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
        /**
         * 复制代码成功
         */
        handleCopyCodeSuccess() {
            this.$notify({
                title: this.$t('ChatCard.notifications.codeCopySuccess'),
                type: 'success',
            });
        },

        /**
         * 通用复制函数
         */
        async copyToClipboard(text) {
            try {
                // 尝试使用 navigator.clipboard API
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(text);
                    return true;
                }

                // 后备方案：用传统的 document.execCommand
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                try {
                    document.execCommand('copy');
                    textArea.remove();
                    return true;
                } catch (err) {
                    textArea.remove();
                    return false;
                }
            } catch (error) {
                console.error('复制失败:', error);
                return false;
            }
        },

        /**
         * md复制
         */
        async copyMarkdown() {
            const success = await this.copyToClipboard(this.answer);
            this.$notify({
                title: success
                    ? this.$t('ChatCard.notifications.markdownCopySuccess')
                    : this.$t('ChatCard.notifications.markdownCopyFailed'),
                type: success ? 'success' : 'error',
            });
        },

        /**
         * 纯文本复制
         */
        async copyPlainText() {
            const div = document.createElement('div');
            div.innerHTML = marked.parse(this.answer);
            const plainText = div.textContent || div.innerText || '';

            const success = await this.copyToClipboard(plainText);
            this.$notify({
                title: success
                    ? this.$t('ChatCard.notifications.plainTextCopySuccess')
                    : this.$t('ChatCard.notifications.plainTextCopyFailed'),
                type: success ? 'success' : 'error',
            });
        },

        /**
         * 删除对话
         */
        deleteQA() {
            chatStoreHelper.delQA(this.$store.state.app.active, this.qaId);
        },

        /**
         * 切换单个recall项的展开状态
         */
        toggleRecallItem(index) {
            this.expandedRecalls[index] = !this.expandedRecalls[index];
        }
    },
    watch: {
        // 当recall数据变化时重置展开状态
        recall: {
            immediate: true,
            handler(newVal) {
                this.expandedRecalls = new Array(newVal?.length || 0).fill(false);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
/**
 * 主容器
 * 使用flex布局，垂直排列子元素
 */
.container {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
}

/**
 * 用户和机器人消息的共同样式
 * 使用相对定位便于内部元素绝对定位
 */
.user-message,
.bot-message {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0.3rem 0;
}

/**
 * 用户和机器人头像的共同样式
 * 设置圆形头像
 */
.user-message img,
.bot-message img {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    object-fit: cover;
}

/**
 * 用户消息文本样式
 * 设置文本换行和断词规则
 */
.user-message p {
    width: 100%;
    padding: 0.4rem 0 0 0;
    margin: 0;
    text-align: left;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
}

/**
 * Markdown预览区域样式
 */
:deep(.v-md-editor-preview) {
    width: 100%;
    text-align: left;

    // 代码块水平滚动条样式
    pre {
        overflow-x: auto;
        scrollbar-width: none;
    }
}

/**
 * Markdown内容区域内边距
 */
:deep(.vuepress-markdown-body:not(.custom)) {
    padding: 0.4rem 0 0.1rem 0;
}

/**
 * 移动端适配
 */
@media (max-width: 419px) {
    :deep(.vuepress-markdown-body div[class*=v-md-pre-wrapper-]) {
        margin: 0;
    }
}

/**
 * 消息文本的基本样式
 */
.user-message p,
:deep(.vuepress-markdown-body) {
    font-size: 13px;
    color: var(--common-color);
    background: none;
    word-wrap: break-word;
}

/**
 * 头像区域样式
 */
.avatar-header {
    display: flex;
    align-items: center;
    gap: 8px;

    // 头像边框
    >.avatar {
        border: 1px solid var(--common-color);
    }

    // 用户名样式
    >.avatar-name {
        font-size: 13px;
        color: var(--common-color);
        font-weight: bold;
    }
}

/**
 * 底部统计信息样式
 */
.answer-stats {
    font-size: 10px;
    color: var(--answer-stats-color);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;

    // 图标样式
    svg {
        vertical-align: middle;
        cursor: pointer;

        &:hover {
            color: var(--el-color-primary);
        }
    }
}

/**
 * 折叠相关样式
 */
.collapse {
    // 折叠段落
    &-p {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        max-height: none;
    }

    // 折叠图标
    &-icon {
        position: absolute;
        bottom: 5px;
        right: -14px;
        font-size: 13px;
        color: var(--common-color);
        cursor: pointer;
    }
}

/**
 * 上传文件区域样式
 */
.uploaded-files {
    margin-top: 8px;
}

/**
 * 图片圆角样式
 */
.el-image {
    border-radius: 10px;
}

/**
 * 召回内容相关样式
 */
.recall {
    // 召回内容容器
    &-content {
        margin: 8px 0 0 0;
        padding: 10px;
        border-radius: 8px;
        background-color: var(--recall-bg-color);
        font-size: 13px;
    }

    // 召回标题
    &-header {
        color: var(--common-color);
        font-weight: bold;
        margin-bottom: 8px;
    }

    // 召回项目
    &-item {
        margin-bottom: 8px;
        padding: 8px;
        border-radius: 4px;
        background-color: var(--recall-item-bg-color);
        cursor: pointer;

        &:last-child {
            margin-bottom: 0;
        }
    }

    // 召回项目标题
    &-title {
        color: var(--recall-item-title-color);
        font-weight: bold;
        margin-bottom: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    // 相关度分数
    &-score {
        font-size: 12px;
        color: var(--recall-item-title-color);
        font-weight: normal;
    }

    // 召回文本
    &-text {
        color: var(--answer-stats-color);
        line-height: 1.5;
        position: relative;
    }

    // 折叠的召回文本
    &-collapse {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>
