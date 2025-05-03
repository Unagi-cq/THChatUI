<template>
    <div class="header-content">
        <div class="title-container">
            <span class="header-title" :contenteditable="header_title !== 'THChatUI'" @blur="updateTitle"
                @keydown.enter.prevent="$event.target.blur()" @input="limitTitleLength($event)">
                {{ header_title }}
            </span>
            <SvgIcon icon-class="magic-wand" style="width: 20px; height: 20px;" v-show="header_title !== 'THChatUI'"
                class="title-edit-icon" />
        </div>
        <!-- 右侧模型信息 -->
        <div class="model-info">
            <el-tooltip effect="dark" placement="bottom" :content="tooltip_content" popper-class="settings-tooltip">
                <div class="model-info-content">
                    <span class="model-name">{{ header_msg }}</span>
                    <SvgIcon icon-class="vim" style="width: 20px; height: 20px;" class="dropdown-icon"
                        v-if="model_type === 'vim' || model_type === 'igm'" />
                    <SvgIcon icon-class="llm" style="width: 20px; height: 20px;" class="dropdown-icon"
                        v-if="model_type === 'llm'" />
                </div>
            </el-tooltip>
        </div>
    </div>
</template>

<script>
import tabStoreHelper from '@/schema/tabStoreHelper'

export default {
    name: 'AppHeader',
    data() {
        return {
            max_title_length: 12,
            default_title: 'THChatUI'
        }
    },
    computed: {
        active() {
            return this.$store.state.app.active;
        },
        tooltip_content() {
            const { platform, model_config, memory, chat_detail } = this.$store.state.setting;
            return `平台：${platform}
                    模型：${model_config.version}
                    对话模式：${memory ? '多轮对话' : '单轮对话'}
                    回答统计：${chat_detail ? '开启' : '隐藏'} 
                    模型类型：${this.model_type === 'vim' ? '视觉模型' : '语言模型'}
                    支持联网搜索：${model_config.can_web_search ? "是" : "否"}`
        },
        header_msg() {
            const { model_config } = this.$store.state.setting;
            return model_config.version;
        },
        header_title() {
            const { ready, active, tab } = this.$store.state.app;

            // 等app数据加载之后再执行逻辑 否则会闪屏
            if (!ready) {
                return '';
            }

            const currentTab = tab.findTab(active);
            if (!currentTab) {
                return this.default_title;
            }

            const { title } = currentTab;
            return title.length > this.max_title_length ?
                `${title.slice(0, this.max_title_length)}...` :
                title;
        },
        model_type() {
            const { model_config } = this.$store.state.setting;
            return model_config.type;
        }
    },
    methods: {
        /**
         * 更新聊天选项卡标题
         * @param event 编辑标题的事件对象
         */
        updateTitle(event) {
            const newTitle = event.target.innerText.trim();
            if (newTitle && this.header_title !== this.default_title) {
                tabStoreHelper.upd(this.active, newTitle);
            }
        },
        limitTitleLength(event) {
            const text = event.target.innerText;
            if (text.length > this.max_title_length) {
                event.target.innerText = text.slice(0, this.max_title_length);
                // 将光标移到末尾
                const range = document.createRange();
                const sel = window.getSelection();
                range.selectNodeContents(event.target);
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);
            }
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

    .title-container {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .header-title {
        color: var(--common-color);
        outline: none;
        padding: 2px 4px;
        border-radius: 4px;
    }

    .header-title[contenteditable="true"]:hover {
        background: var(--aside-active-hover-bg);
    }

    .header-title[contenteditable="true"]:focus {
        background: var(--aside-active-hover-bg);
    }

    .title-edit-icon {
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
            font-weight: bold;
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
