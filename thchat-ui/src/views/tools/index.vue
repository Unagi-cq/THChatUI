<template>
    <div>
        <el-page-header @back="onBack" title="关闭" content="工具箱" :icon="CloseBold" style="margin-bottom: 15px;"></el-page-header>

            <el-row :gutter="24" style="margin-left: 0;margin-right: 0;">

                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
                    <div class="tool-card dashed-border theme-bg">
                        <div class="tool-card-header">
                            <span class="tool-card-title">联网搜索</span>
                            <el-switch  v-model="is_search"/>
                        </div>
                        <p class="tool-card-description">
                            仅支持本地调用，使用前请运行tools文件夹下脚本。
                            <p>详情请参考文档。</p>
                        </p>

                    </div>
                </el-col>

                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
                    <div class="tool-card dashed-border theme-bg">
                        <div class="tool-card-header">
                            <span class="tool-card-title">知识库检索</span>
                            <el-switch  v-model="is_rag"/>
                        </div>
                        <p class="tool-card-description">
                            仅支持本地调用，使用前请运行rag文件夹下脚本。
                            <p>详情请参考文档。</p>
                        </p>
                    </div>
                </el-col>


            </el-row>

        </div>
</template>

<script>
import {CloseBold} from "@element-plus/icons-vue";

export default {
    name: 'Tools',
    computed: {
        CloseBold() {
            return CloseBold
        },
        is_search: {
            get() {
                return this.$store.state.setting.chat_type === 'search';
            },
            set(val) {
                if (val) {
                    this.$store.dispatch('changeSetting', {
                        key: 'chat_type',
                        value: 'search'
                    })
                } else {
                    this.$store.dispatch('changeSetting', {
                        key: 'chat_type',
                        value: 'chat'
                    })
                }
            }
        },
        is_rag: {
            get() {
                return this.$store.state.setting.chat_type === 'rag';
            },
            set(val) {
                if (val) {
                    this.$store.dispatch('changeSetting', {
                        key: 'chat_type',
                        value: 'rag'
                    })
                } else {
                    this.$store.dispatch('changeSetting', {
                        key: 'chat_type',
                        value: 'chat'
                    })
                }
            }
        }
    },
    methods: {
        onBack() {
            // 返回首页
            this.$router.push('/');
        }
    },
};
</script>

<style scoped>
.tool-card {
    display: flex;
    flex-direction: column;
    width: 90%;
    padding: 5px 18px;
    border-radius: 8px;
    margin: 5px 0 5px 0;

    > .tool-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        > .tool-card-title {
            font-size: 14px;
            font-weight: bold;
        }
    }

    > .tool-card-description {
        font-size: 12px;
        line-height: 30px;
        color: #666;
    }
}

:deep(.el-page-header__content), :deep(.el-page-header__back) {
    color: var(--chat-card-font-color);
}
</style>
