<template>
    <div class="header-content">
        <!-- 左侧标题 -->
        <span class="header-title">{{ header_title }}</span>

        <!-- 右侧模型信息 -->
        <div class="model-info">
            <el-tooltip effect="dark" placement="bottom" :content="tooltip_content" popper-class="settings-tooltip">
                <div class="model-info-content">
                    <span class="model-name">{{ header_msg }}</span>
                    <svg class="dropdown-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20"
                        v-if="model_type === 'vim' || model_type === 'igm'" height="20" fill="none">
                        <path
                            d="M14 3.5H10C6.22876 3.5 4.34315 3.5 3.17157 4.67157C2 5.84315 2 7.72876 2 11.5V13.5C2 17.2712 2 19.1569 3.17157 20.3284C4.34315 21.5 6.22876 21.5 10 21.5H14C17.7712 21.5 19.6569 21.5 20.8284 20.3284C22 19.1569 22 17.2712 22 13.5V11.5C22 7.72876 22 5.84315 20.8284 4.67157C19.6569 3.5 17.7712 3.5 14 3.5Z"
                            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <circle cx="8.5" cy="9" r="1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                            stroke-linejoin="round" />
                        <path
                            d="M21.5 17.5L16.348 11.8797C16.1263 11.6377 15.8131 11.5 15.485 11.5C15.1744 11.5 14.8766 11.6234 14.6571 11.8429L10 16.5L7.83928 14.3393C7.62204 14.122 7.32741 14 7.02019 14C6.68931 14 6.37423 14.1415 6.15441 14.3888L2.5 18.5"
                            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <svg class="dropdown-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20"
                        height="20" v-if="model_type === 'llm'" fill="none">
                        <path
                            d="M6.99892 9.5C6.75828 7.50503 7.91475 7.09687 11.9989 7M11.9989 7C16.1223 7.10058 17.3402 7.59829 16.9989 9.5M11.9989 7V17M9.99892 17H13.9989"
                            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path
                            d="M3.89124 3.89124C2.5 5.28249 2.5 7.52166 2.5 12C2.5 16.4783 2.5 18.7175 3.89124 20.1088C5.28249 21.5 7.52166 21.5 12 21.5C16.4783 21.5 18.7175 21.5 20.1088 20.1088C21.5 18.7175 21.5 16.4783 21.5 12C21.5 7.52166 21.5 5.28249 20.1088 3.89124C18.7175 2.5 16.4783 2.5 12 2.5C7.52166 2.5 5.28249 2.5 3.89124 3.89124Z"
                            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
            </el-tooltip>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AppHeader',
    data() {
        return {
            showSettings: false
        }
    },
    computed: {
        tooltip_content() {
            const { platform, model_config, memory, chat_detail } = this.$store.state.setting;
            return `${this.$t('AppHeader.platform')}：${platform}
                    ${this.$t('AppHeader.model')}：${model_config.name}
                    ${this.$t('AppHeader.chatMode')}：${memory ? this.$t('AppHeader.multiRound') : this.$t('AppHeader.singleRound')}
                    ${this.$t('AppHeader.statistics')}：${chat_detail ? this.$t('AppHeader.show') : this.$t('AppHeader.hide')} 
                    ${this.$t('AppHeader.modelType')}：${this.model_type === 'vim' ? this.$t('AppHeader.visionModel') : this.$t('AppHeader.languageModel')}
                    ${this.$t('AppHeader.canWebSearch')}：${model_config.can_web_search ? this.$t('Common.is_true') : this.$t('Common.is_false')}`
        },
        header_msg() {
            const { model_config } = this.$store.state.setting;
            return model_config.name;
        },
        header_title() {
            const { ready, active, tab } = this.$store.state.app;
            const DEFAULT_TITLE = 'THChatUI';
            const MAX_LENGTH = 10;

            // 等app数据加载之后再执行逻辑 否则会闪屏
            if (!ready || !active) {
                return DEFAULT_TITLE;
            }

            const currentTab = tab.findTab(active);
            if (!currentTab) {
                return DEFAULT_TITLE;
            }

            const { title } = currentTab;
            return title.length > MAX_LENGTH ?
                `${title.slice(0, MAX_LENGTH)}...` :
                title;
        },
        model_type() {
            const { model_config } = this.$store.state.setting;
            return model_config.type;
        }
    },
    methods: {
        toggleSettings() {
            this.showSettings = !this.showSettings;
        }
    }
}
</script>

<style scoped>
.header-content {
    height: 100%;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header-title {
        font-size: 14px;
        color: var(--common-color);
    }

    .model-info {
        padding: 8px;
        position: relative;
        display: flex;
        align-items: center;
        cursor: pointer;

        .model-info-content {
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .model-name {
            font-size: 14px;
            font-weight: bold;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            letter-spacing: 0px;
        }

        .dropdown-icon {
            color: var(--common-color);
            display: flex;
            align-items: center;
        }

        &.active,
        &:hover {
            background: var(--aside-active-hover-bg);
            border-radius: 8px;
        }
    }
}
</style>

<style>
.settings-tooltip {
    white-space: pre-line !important;
    line-height: 1.5;
}
</style>
