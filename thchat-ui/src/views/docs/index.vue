<template>
    <div class="docs-container standard-page-container">
        <el-row :gutter="24" justify="center" style="margin-left: 0;margin-right: 0;">
            <el-col>
                <div class="docs-header standard-page-header">
                    <h4>文档中心</h4>
                    <div class="docs-stats standard-page-stats">
                        <span v-if="activeTab" class="active-doc">当前：{{ activeTab }}</span>
                    </div>
                </div>

                <el-tabs v-model="activeTabName" tab-position="top" class="docs-tabs" @tab-click="handleTabClick">
                    <el-col style="padding: 0;">
                        <el-tab-pane label="介绍" name="intro">
                            <div class="doc-content-wrapper" ref="introContent">
                                <v-md-preview :text="intro_md" @copy-code-success="handleCopyCodeSuccess"></v-md-preview>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="使用教程" name="tutorial">
                            <div class="doc-content-wrapper" ref="tutorialContent">
                                <v-md-preview :text="tutorial_md" @copy-code-success="handleCopyCodeSuccess"></v-md-preview>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="快速开发" name="quickDev">
                            <div class="doc-content-wrapper" ref="quickDevContent">
                                <v-md-preview :text="quickDev_md" @copy-code-success="handleCopyCodeSuccess"></v-md-preview>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="国际化" name="i18n">
                            <div class="doc-content-wrapper" ref="i18nContent">
                                <v-md-preview :text="i18n_md" @copy-code-success="handleCopyCodeSuccess"></v-md-preview>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="高级开发" name="senior">
                            <div class="doc-content-wrapper" ref="seniorContent">
                                <v-md-preview :text="senior_md" @copy-code-success="handleCopyCodeSuccess"></v-md-preview>
                            </div>
                        </el-tab-pane>
                    </el-col>
                </el-tabs>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import introContent from '@/assets/docs/intro.md?raw'
import tutorialContent from '@/assets/docs/tutorial.md?raw'
import quickDevContent from '@/assets/docs/quick_dev.md?raw'
import i18nContent from '@/assets/docs/i18n.md?raw'
import seniorContent from '@/assets/docs/senior.md?raw'
import { ArrowUp } from '@element-plus/icons-vue'

export default {
    name: 'Docs',
    components: {
        ArrowUp
    },
    data() {
        return {
            intro_md: introContent,
            tutorial_md: tutorialContent,
            quickDev_md: quickDevContent,
            i18n_md: i18nContent,
            senior_md: seniorContent,
            activeTabName: 'intro',
            showBackToTop: false
        }
    },
    computed: {
        activeTab() {
            const tabMap = {
                'intro': '介绍',
                'tutorial': '使用教程',
                'quickDev': '快速开发',
                'i18n': '国际化',
                'senior': '高级开发'
            };
            return tabMap[this.activeTabName];
        }
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll);
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        /**
         * 复制代码成功
         */
        handleCopyCodeSuccess() {
            this.$notify({
                title: "代码复制成功！",
                type: 'success',
            });
        },
        
        /**
         * 处理标签页点击
         */
        handleTabClick() {
            // 保留空方法用于事件处理
        },
        
        /**
         * 处理页面滚动
         */
        handleScroll() {
            this.showBackToTop = window.scrollY > 300;
        },
        
        /**
         * 滚动到顶部
         */
        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    },
};
</script>

<style lang="scss" scoped>
/**
 * 文档容器
 */
.docs-container {
    display: flex;
    flex-direction: column;
    padding: 20px;
}

/**
 * 标签页样式
 */
.docs-tabs {
    background-color: var(--standard-page-bg-color);
    border-radius: 8px;
    padding: 20px;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    animation: elementFadeIn 0.3s ease-out;
}

:deep(.el-tabs__item) {
    color: var(--common-color);
    font-weight: 500;
    padding: 0 20px;
    height: 40px;
    line-height: 40px;
    transition: all 0.3s;
    position: relative;
    
    &:hover {
        color: var(--el-color-primary);
    }
    
    &.is-active {
        color: var(--el-color-primary);
        font-weight: 600;
    }
    
    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%) scaleX(0);
        width: 80%;
        height: 2px;
        background-color: var(--el-color-primary);
        transition: transform 0.3s ease;
    }
    
    &.is-active::after {
        transform: translateX(-50%) scaleX(1);
    }
}

:deep(.el-tabs__header) {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    border-bottom: 1px solid var(--page-mcp-sidebar-border);
    padding-bottom: 0;
}

:deep(.el-tabs__nav-wrap) {
    justify-content: center;
    
    &::after {
        display: none;
    }
}

:deep(.el-tabs__active-bar) {
    display: none;
}

/**
 * Markdown内容区域内边距
 */
:deep(.vuepress-markdown-body:not(.custom)) {
    border-radius: 8px;
    transition: all 0.3s ease;
}

/**
 * 消息文本的基本样式
 */
:deep(.vuepress-markdown-body) {
    font-size: 14px;
    color: var(--page-mcp-text-color);
    background: none;
    word-wrap: break-word;
    font-family: var(--thchatui-font-family);
    line-height: 1.6;
    
    /* 标题样式 */
    h1, h2, h3, h4, h5, h6 {
        color: var(--page-mcp-header-text);
        margin-top: 1.5rem;
        margin-bottom: 1rem;
        font-weight: 600;
        line-height: 1.25;
        position: relative;
        
        &::before {
            content: '';
            position: absolute;
            left: -1rem;
            top: 0.2rem;
            height: 80%;
            width: 3px;
            background-color: var(--page-mcp-header-accent);
            border-radius: 2px;
        }
    }
    
    /* 链接样式 */
    a {
        color: var(--el-color-primary);
        text-decoration: none;
        transition: all 0.2s;
        
        &:hover {
            text-decoration: underline;
            opacity: 0.8;
        }
    }
    
    /* 代码块样式 */
    pre {
        border-radius: 8px;
        margin: 1rem 0;
        padding: 1rem;
        overflow: auto;
        position: relative;
        transition: all 0.3s;
        
        &:hover {
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            transform: translateY(-2px);
        }
        
        code {
            font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
            font-size: 13px;
        }
    }
    
    /* 行内代码样式 */
    :not(pre) > code {
        padding: 0.2em 0.4em;
        margin: 0 0.2em;
        border-radius: 3px;
        font-size: 85%;
        background-color: var(--standard-page-bg-color);
    }
    
    /* 表格样式 */
    table {
        width: 100%;
        border-collapse: collapse;
        margin: 1rem 0;
        overflow-x: auto;
        display: block;
        
        th, td {
            border: 1px solid var(--page-mcp-sidebar-border);
            padding: 0.6rem 1rem;
            text-align: left;
        }
        
        th {
            background-color: var(--standard-page-bg-color);
            font-weight: 600;
        }
        
        tr:nth-child(2n) {
            background-color: var(--standard-page-bg-color);
        }
    }
    
    /* 引用块样式 */
    blockquote {
        border-left: 4px solid var(--el-color-primary);
        margin: 1rem 0;
        padding: 0.5rem 1rem;
        background-color: var(--standard-page-bg-color);
        border-radius: 0 4px 4px 0;
        color: var(--page-mcp-text-color);
        font-style: italic;
    }
    
    /* 列表样式 */
    ul, ol {
        padding-left: 1.5rem;
        
        li {
            margin: 0.5rem 0;
            position: relative;
        }
    }
    
    /* 分割线样式 */
    hr {
        border: 0;
        border-top: 1px solid var(--page-mcp-sidebar-border);
        margin: 1.5rem 0;
    }
    
    /* 图片样式 */
    img {
        max-width: 100%;
        border-radius: 4px;
        margin: 1rem 0;
        transition: all 0.3s;
        
        &:hover {
            transform: scale(1.02);
        }
    }
}

/**
 * 移动端适配
 */
@media screen and (max-width: 768px) {
    .docs-container {
        padding: 10px;
    }

    .docs-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;

        .docs-stats {
            width: 100%;
            justify-content: space-between;
        }
    }
    
    :deep(.el-tabs__item) {
        padding: 0 12px;
        font-size: 14px;
    }
    
    :deep(.vuepress-markdown-body) {
        font-size: 13px;
        
        h1 {
            font-size: 1.6rem;
        }
        
        h2 {
            font-size: 1.4rem;
        }
        
        h3 {
            font-size: 1.2rem;
        }
        
        pre {
            font-size: 12px;
        }
    }

    :deep(.vuepress-markdown-body:not(.custom)) {
        padding: 1rem;
    }

    :deep(.vuepress-markdown-body div[class*=v-md-pre-wrapper-]) {
        margin: 0;
    }
}

/* 添加更多动画效果 */
@keyframes pulse {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.05);
    }

    100% {
        transform: scale(1);
    }
}

/* 代码复制按钮动画 */
:deep(.v-md-copy-code-btn) {
    transition: all 0.3s;
    
    &:hover {
        transform: scale(1.2);
    }
}

/* 标签页内容切换动画 */
:deep(.el-tab-pane) {
    animation: elementFadeIn 0.5s ease-out;
}

/* 图片加载动画 */
:deep(.vuepress-markdown-body img) {
    opacity: 0;
    animation: elementFadeIn 0.5s ease-out forwards;
}

/* 优化滚动条样式 */
:deep(.vuepress-markdown-body) {
    &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: var(--page-mcp-sidebar-border);
        border-radius: 3px;
    }
    
    &::-webkit-scrollbar-track {
        background: var(--standard-page-bg-color);
        border-radius: 3px;
    }
    
    pre::-webkit-scrollbar {
        width: 4px;
        height: 4px;
    }
    
    pre::-webkit-scrollbar-thumb {
        background: var(--page-mcp-sidebar-border);
        border-radius: 2px;
    }
    
    pre::-webkit-scrollbar-track {
        background: transparent;
    }
}

/**
 * 文档内容包装器
 */
.doc-content-wrapper {
    position: relative;
    overflow-y: auto;
    border-radius: 8px;
    
    &::-webkit-scrollbar {
        width: 6px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: var(--page-mcp-sidebar-border);
        border-radius: 3px;
    }
    
    &::-webkit-scrollbar-track {
        background: var(--standard-page-bg-color);
        border-radius: 3px;
    }
}

/**
 * 活动文档标签
 */
.active-doc {
    background-color: var(--el-color-primary-light-9) !important;
    color: var(--el-color-primary) !important;
    border: 1px solid var(--el-color-primary-light-5);
}
</style>
