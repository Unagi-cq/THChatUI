<template>
    <div class="header-content">
        <div class="title-container">
            <span class="header-title" :contenteditable="header_title !== 'THChatUI'"
                @keydown.enter.prevent="$event.target.blur()" @input="limitTitleLength($event)" @focus="isActive = true"
                @blur="onBlur($event)">
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
            default_title: 'THChatUI',
            isActive: false
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
        },
        onBlur(event) {
            this.isActive = false;
            this.updateTitle(event);
        }
    }
}
</script>

<style scoped lang="scss">
@mixin underline-animation {
    &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 0;
        height: 2px;
        background-color: var(--page-appheader-hover-underline);
        transition: width 0.3s ease;
        border-radius: 2px;
    }

    &:hover::after {
        width: 100%;
    }
}

.header-content {
    height: 100%;
    padding: 0 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.title-container {
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    position: relative;
}

.header-title {
    color: var(--page-appheader-title-color);
    outline: none;
    padding: 6px 10px;
    border-radius: 6px;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    position: relative;
    letter-spacing: 0.3px;
    box-shadow: 0 0 0 rgba(0, 0, 0, 0);

    @include underline-animation;
}

.header-title[contenteditable="true"]:focus {
    background: var(--page-appheader-title-focus-bg);
}

.title-edit-icon {
    color: var(--page-appheader-icon-color);
    transition: all 0.3s ease;
    opacity: 0.8;
}

.title-container:hover .title-edit-icon {
    transform: rotate(15deg) scale(1.1);
    opacity: 1;
}

.model-info {
    padding: 6px 10px;
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

    @include underline-animation;
}

.model-info-content {
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
    position: relative;
    z-index: 1;
}

.model-name {
    font-weight: 600;
    letter-spacing: 0.5px;
    transition: letter-spacing 0.3s ease;
}

.dropdown-icon {
    color: var(--page-appheader-icon-color);
    display: flex;
    align-items: center;
    transition: transform 0.3s ease, color 0.3s ease;
}

.model-info:hover .dropdown-icon {
    transform: rotate(15deg) scale(1.1);
    opacity: 1;
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
    .model-info {
        padding: 6px 8px;
    }
}
</style>

<style>
.settings-tooltip {
    padding: 10px;
    white-space: pre-line !important;
    line-height: 1.5;
}
</style>
