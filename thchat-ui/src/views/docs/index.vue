<template>
    <div>

        <el-row :gutter="24" justify="center" style="margin-left: 0;margin-right: 0;">

            <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="12">
                <h2 class="doc-title">文档中心</h2>

                <el-tabs tab-position="top" class="demo-tabs centered-tabs">
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <el-tab-pane label="介绍">
                            <v-md-preview :text="intro_md" @copy-code-success="handleCopyCodeSuccess"></v-md-preview>
                        </el-tab-pane>
                        <el-tab-pane label="使用教程">
                            <v-md-preview :text="tutorial_md" @copy-code-success="handleCopyCodeSuccess"></v-md-preview>
                        </el-tab-pane>
                        <el-tab-pane label="快速开发">
                            <v-md-preview :text="quickDev_md" @copy-code-success="handleCopyCodeSuccess"></v-md-preview>
                        </el-tab-pane>
                        <el-tab-pane label="国际化">
                            <v-md-preview :text="i18n_md" @copy-code-success="handleCopyCodeSuccess"></v-md-preview>
                        </el-tab-pane>
                        <el-tab-pane label="高级开发">
                            <v-md-preview :text="senior_md" @copy-code-success="handleCopyCodeSuccess"></v-md-preview>
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

export default {
    name: 'Docs',
    data() {
        return {
            intro_md: introContent,
            tutorial_md: tutorialContent,
            quickDev_md: quickDevContent,
            i18n_md: i18nContent,
            senior_md: seniorContent
        }
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
    },
};
</script>

<style scoped>
:deep(.el-tabs__item, .el-tabs__item label)[aria-selected="false"] {
    color: var(--common-color);
    font-weight: bold;
}

:deep(.el-form-item__label) {
    color: var(--common-color);
}

.doc-title {
    text-align: center;
    margin-bottom: 20px;
}

.centered-tabs :deep(.el-tabs__header) {
    display: flex;
    justify-content: center;
}

.centered-tabs :deep(.el-tabs__nav-wrap) {
    justify-content: center;
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
:deep(.vuepress-markdown-body) {
    font-size: 14px;
    color: var(--common-color);
    background: none;
    word-wrap: break-word;
    font-family: var(--thchatui-font-family);
}
</style>
