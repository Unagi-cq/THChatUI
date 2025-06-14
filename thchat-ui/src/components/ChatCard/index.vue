<template>
    <div class="container">
        <!-- 用户消息 -->
        <div class="user-message" v-show="query">
            <!-- 用户上传的文件展示 -->
            <div v-if="files && files.length > 0" class="uploaded-files">
                <el-image v-for="x in files" style="width: 100px; height: 100px" :src="x.base64" :zoom-rate="1.2"
                    :max-scale="7" :min-scale="0.2" :preview-src-list="files.map(file => file.base64)"
                    :initial-index="0" fit="cover" />
            </div>
            <!-- 用户文字提问 -->
            <div class="message-content">
                <p :class="{ 'collapse-p': !queryExpanded }" ref="queryText">{{ query }}</p>
            </div>
            <!-- 用户输入统计/操作 -->
            <div class="user-stats" v-if="query">
                <el-tooltip :content="queryExpanded ? '收起' : '展开'" placement="bottom" v-if="queryTruncatable">
                    <SvgIcon @click="queryExpanded = !queryExpanded"
                        :icon-class="queryExpanded ? 'circle-arrow-up' : 'circle-arrow-down'"
                        style="width: 15px; height: 15px;" />
                </el-tooltip>
                <el-tooltip :content="'复制用户输入'" placement="bottom">
                    <SvgIcon @click="copyUserQuery" icon-class="copyPT" style="width: 15px; height: 15px;" />
                </el-tooltip>
            </div>
        </div>

        <!-- 机器人消息 -->
        <div class="bot-message">
            <!-- 头像 名称 -->
            <div class="avatar-header">
                <SvgIcon :icon-class="series" class="avatar" />
                <span class="avatar-name">{{ modelName }}</span>
            </div>
            
            <!-- 召回内容卡片 -->
            <SearchResultCard v-if="recall && recall.length > 0" :items="recall" type="recall" />
            
            <!-- 网络搜索结果 -->
            <SearchResultCard v-if="webSearchResults && webSearchResults.length > 0" :items="webSearchResults" type="web-search" />
            
            <!-- 思考内容 -->
            <div v-if="reason" class="reason-content">
                <div class="reason-header" @click="reasonExpanded = !reasonExpanded">
                    思考内容
                    <el-icon class="reason-collapse-icon">
                        <ArrowDown v-if="!reasonExpanded" />
                        <ArrowUp v-else />
                    </el-icon>
                </div>
                <div v-show="reasonExpanded">
                    <v-md-preview :text="reason.split('\n').map(line => `> ${line}`).join('\n')"></v-md-preview>
                </div>
            </div>
            <!-- 回答内容 -->
            <v-md-preview :text="answer" @copy-code-success="handleCopyCodeSuccess"
                v-if="modelType === 'llm' || modelType === 'vim'"></v-md-preview>
            <!-- 图片生成 -->
            <div class="uploaded-files" v-if="modelType === 'igm'">
                <template v-if="answer">
                    <el-image v-for="(image, index) in [answer]" :key="index" style="width: 100px; height: 100px"
                        :src="image" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" :preview-src-list="[answer]"
                        :initial-index="0" fit="cover" />
                </template>
                <el-skeleton animated variant="image" v-else>
                    <template #template>
                        <el-skeleton-item variant="image" style="width: 100px; height: 100px; border-radius: 10px;" />
                    </template>
                </el-skeleton>
            </div>
        </div>
        <!-- 回答统计 -->
        <div class="answer-stats" v-if="chat_detail && responseTime && finishTime">
            <el-tooltip :content="'复制 Markdown'" placement="bottom">
                <SvgIcon @click="copyMarkdown" icon-class="copyMD" style="width: 15px; height: 15px;" />
            </el-tooltip>
            <el-tooltip :content="'复制纯文本'" placement="bottom">
                <SvgIcon @click="copyPlainText" icon-class="copyPT" style="width: 15px; height: 15px;" />
            </el-tooltip>
            <el-tooltip :content="'删除对话'" placement="bottom">
                <SvgIcon @click="deleteQA" icon-class="deleteQA" style="width: 15px; height: 15px;" />
            </el-tooltip>
            <el-tooltip v-if="isLast" :content="'重新生成'" placement="bottom">
                <SvgIcon @click="regenerate" icon-class="refresh" style="width: 15px; height: 15px;" />
            </el-tooltip>
            <span>{{ answer.length }} words</span>
            <span>{{ finishTime - responseTime }} ms</span>
        </div>
        <div class="answer-stats" v-else-if="chat_detail">
            <el-tooltip :content="'删除对话'" placement="bottom">
                <SvgIcon @click="deleteQA" icon-class="deleteQA" style="width: 15px; height: 15px;" />
            </el-tooltip>
        </div>

    </div>
</template>

<script>
import { marked } from 'marked';
import chatStoreHelper from '@/schema/chatStoreHelper';
import eventBus from '@/eventBus';
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';
import SearchResultCard from './SearchResultCard.vue';

export default {
    name: 'ChatCard',
    components: {
        ArrowDown,
        ArrowUp,
        SearchResultCard
    },
    data() {
        return {
            // 用户文本是否展开
            queryExpanded: false,
            // 用户文本最大显示高度
            maxQueryHeight: 60,
            // 用户文本是否可折叠
            queryTruncatable: false,
            // 思考内容是否展开
            reasonExpanded: true,
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
        recall: Array,
        // 思考内容
        reason: String,
        // 联网搜索内容
        webSearchResults: Array,
        // 是否为最后一个ChatCard
        isLast: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        // 是否开启回答统计
        chat_detail() {
            return this.$store.state.setting.chat_detail;
        }
    },
    mounted() {
        this.$nextTick(() => {
            const queryTextElement = this.$refs.queryText;
            if (queryTextElement.scrollHeight > this.maxQueryHeight) {
                this.queryTruncatable = true;
            }
        });
    },
    methods: {
        /**
         * 复制代码成功
         */
        handleCopyCodeSuccess() {
            this.$notify({
                title: '代码复制成功！',
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
                    ? 'Markdown复制成功！'
                    : '复制失败！',
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
                    ? '纯文本复制成功！'
                    : '复制失败！',
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
         * 复制用户输入
         */
        async copyUserQuery() {
            const success = await this.copyToClipboard(this.query);
            this.$notify({
                title: success ? '用户输入复制成功！' : '复制失败！',
                type: success ? 'success' : 'error',
            });
        },

        /**
         * 重新生成
         */
        regenerate() {
            this.$emit('regenerate', this.qaId);
        }
    },
    watch: {
        // 当qaId变化时重置所有状态
        qaId: {
            immediate: true,
            handler() {
                this.queryExpanded = false;
                this.queryTruncatable = false;
                this.$nextTick(() => {
                    const queryTextElement = this.$refs.queryText;
                    if (queryTextElement && queryTextElement.scrollHeight > this.maxQueryHeight) {
                        this.queryTruncatable = true;
                    }
                });
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
 * 上传文件区域样式
 */
.uploaded-files {
    margin-top: 8px;
    max-width: 80%; // 与消息内容保持一致的最大宽度
}

/**
 * 用户消息文本样式
 * 设置文本换行和断词规则
 */
.user-message {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-end; // 靠右对齐
    padding: 0.3rem 0;

    .message-content {
        position: relative;
        max-width: 80%; // 限制最大宽度
        background-color: var(--aside-active-hover-bg); // 背景
        border-radius: 8px;
        padding: 8px 12px;
    }

    p {
        width: 100%;
        padding: 0;
        margin: 0;
        text-align: left;
        line-height: 1.6;
        white-space: pre-wrap;
        word-break: break-word;
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
            bottom: 0px;
            right: -14px;
            color: var(--common-color);
            cursor: pointer;
        }
    }
}

/**
 * Bot头像区域样式
 */
.avatar-header {
    display: flex;
    align-items: center;
    gap: 8px;

    >.avatar {
        width: 30px;
        height: 30px;
    }

    // 用户名样式
    >.avatar-name {
        font-size: 16px;
        color: var(--common-color);
        font-weight: bold;
    }
}

/**
 * 思考内容相关样式
 */
.reason {
    &-content {
        width: 100%;
        margin-top: 8px;
    }

    &-header {
        border-radius: 8px;
        padding: 8px;
        background-color: var(--thinking-bg-color);
        color: var(--common-color);
        font-weight: bold;
        margin-bottom: 2px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
    }

    &-collapse-icon {
        color: var(--common-color);
        cursor: pointer;
    }
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
 * Markdown内容区域块引用样式
 */
:deep(.vuepress-markdown-body) blockquote {
    color: var(--common-color);
    opacity: 0.5;
    font-size: 14px;
    font-family: var(--thchatui-font-family);
}

/**
 * Markdown移动端适配
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
    font-size: 14px;
    color: var(--common-color);
    background: none;
    word-wrap: break-word;
    font-family: var(--thchatui-font-family);
}

/**
 * 底部统计信息样式
 */
.answer-stats {
    color: var(--answer-stats-color);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;

    // 图标样式
    svg {
        vertical-align: middle;
        cursor: pointer;
        outline: none;

        &:hover {
            color: var(--el-color-primary);
        }
    }
}

/**
 * 图片圆角样式
 */
.el-image {
    border-radius: 10px;
}

/**
 * 用户输入统计/操作
 */
.user-stats {
    color: var(--answer-stats-color);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    margin-top: 8px;
    margin-bottom: 4px;

    // 图标样式
    svg {
        vertical-align: middle;
        cursor: pointer;
        outline: none;

        &:hover {
            color: var(--el-color-primary);
        }
    }
}
</style>
