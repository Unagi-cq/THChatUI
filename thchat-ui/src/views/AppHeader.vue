<template>
    <div class="header-content">
        <!-- 左侧标题 -->
        <span class="header-title">{{ header_title }}</span>

        <!-- 右侧模型信息 -->
        <div class="model-info">
            <el-tooltip effect="dark" placement="bottom" :content="`平台：${$store.state.setting.platform}
                模型：${$store.state.setting.model_config.name}
                对话模式：${$store.state.setting.memory ? '多轮对话' : '单轮对话'}
                回答统计：${$store.state.setting.chat_detail ? '开启' : '隐藏'}
                `" popper-class="settings-tooltip">
                <div class="model-info-content">
                    <span class="model-name">{{ header_msg }}</span>
                    <svg class="dropdown-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20"
                        height="20" fill="none">
                        <path
                            d="M15.0014 9.98894C15.0014 11.6432 13.6596 12.9841 12.0043 12.9841C10.349 12.9841 9.0072 11.6432 9.0072 9.98894C9.0072 8.33474 10.349 6.99374 12.0043 6.99374C13.6596 6.99374 15.0014 8.33474 15.0014 9.98894Z"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                        <path d="M11.9945 16.9777H12.0035" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                        <path d="M20.496 2.00174C20.3294 2.9003 19.497 4.75732 17.4989 4.99693" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" />
                        <path d="M3.51257 2.00174C3.67908 2.9003 4.5116 4.75732 6.50965 4.99693" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" />
                        <path
                            d="M8.84021 3.69349C5.58633 5.14195 4.44413 8.62401 4.52092 10.4658C3.3979 10.389 2.0227 10.5148 2.00157 11.9509C1.98043 13.387 3.46509 13.6409 4.52092 13.4682V19.8759C4.53861 20.4063 4.58624 21.1002 5.13522 21.3436C6.41182 21.9095 7.48685 20.1925 8.6549 20.2712C9.56297 20.3324 10.8774 22.0907 12.0332 21.9945C13.3719 21.883 14.4022 20.2767 15.4258 20.2767C16.6397 20.2767 16.8523 21.2774 18.314 21.4367C19.4042 21.5556 19.515 20.516 19.515 19.9564V13.4802C21.4043 13.7145 22.1531 12.8775 21.9725 11.6986C21.7595 10.3074 20.1259 10.4067 19.4757 10.4956C19.5768 9.46112 19.1104 8.15549 18.909 7.64373C18.6122 6.73267 17.3925 4.57907 14.7721 3.51122C12.1516 2.44338 9.71367 3.23306 8.84021 3.69349Z"
                            stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
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
        header_msg() {
            const { model_config } = this.$store.state.setting;
            return model_config.name;
        },
        header_title() {
            const active = this.$store.state.app.active;
            const tabs = this.$store.state.app.tabs;
            if (!active || !tabs.length) {
                return 'AI Assistant';
            }
            const currentTab = tabs.find(tab => tab.uuid === active);
            const title = currentTab ? currentTab.title : 'AI Assistant';
            // 如果标题长度超过10，截取前10个字符并添加省略号
            return title.length > 10 ? title.slice(0, 10) + '...' : title;
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
