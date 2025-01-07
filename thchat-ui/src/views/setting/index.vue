<template>
    <el-tabs class="demo-tabs">
        <!-- 模型设置标签页 -->
        <el-tab-pane :label="$t('Setting.tabs.model')">
            <el-form label-width="100" label-position="left">

                <el-form-item :label="$t('Setting.model.platform')">
                    <el-radio-group v-model="platform" class="platform-radio-group" size="small">
                        <el-radio :value="y" v-for="(x, y) in model_list" :key="y">
                            {{ x.platform_name }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item :label="$t('Setting.model.textModel')">
                    <el-radio-group v-model="model_version" class="platform-radio-group" size="small">
                        <el-radio :value="x.version"
                            v-for="x in model_list[platform].list.filter(m => m.type === 'llm')">
                            {{ x.name }}
                            <el-tag v-if="x.can_web_search" size="small" class="web-tag">Web</el-tag>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item :label="$t('Setting.model.visualInterpretationModel')"
                    v-if="model_list[platform].list.some(m => m.type === 'vim')">
                    <el-radio-group v-model="model_version" class="platform-radio-group" size="small">
                        <el-radio :value="x.version"
                            v-for="x in model_list[platform].list.filter(m => m.type === 'vim')" class="vl-model">
                            {{ x.name }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item :label="$t('Setting.model.imageGenerationModel')"
                    v-if="model_list[platform].list.some(m => m.type === 'igm')">
                    <el-radio-group v-model="model_version" class="platform-radio-group" size="small">
                        <el-radio :value="x.version"
                            v-for="x in model_list[platform].list.filter(m => m.type === 'igm')" class="vl-model">
                            {{ x.name }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>

            </el-form>
        </el-tab-pane>

        <!-- 通用设置标签页 -->
        <el-tab-pane :label="$t('Setting.tabs.general')" class="flex-form-item">

            <el-form label-width="130" label-position="left">
                <el-form-item :label="$t('Setting.general.theme')">
                    <el-segmented v-model="theme" :options="[
                        { label: $t('Setting.general.themeOptions.glass'), value: 'glass' },
                        { label: $t('Setting.general.themeOptions.dark'), value: 'dark' },
                        { label: $t('Setting.general.themeOptions.light'), value: 'light' }
                    ]">
                        <template #default="{ item }">
                            <div class="flex flex-col items-center">
                                <div>{{ item.label }}</div>
                            </div>
                        </template>
                    </el-segmented>
                </el-form-item>

                <el-form-item :label="$t('Setting.general.language')">
                    <el-select v-model="locale">
                        <el-option label="简体中文" value="zh-CN" />
                        <el-option label="English" value="en-US" />
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('Setting.general.multiRound')" prop="memory">
                    <el-switch v-model="memory" />
                </el-form-item>

                <el-form-item :label="$t('Setting.general.chatStats')" prop="chat_detail">
                    <el-switch v-model="chat_detail" />
                </el-form-item>

                <el-form-item :label="$t('Setting.general.background')" v-if="theme === 'glass'">
                    <div class="preset-bg-container">
                        <div v-for="(bgImage, index) in presetBgs" :key="index" class="preset-bg-item"
                            :class="{ active: currentBg === bgImage }" @click="selectPresetBg(bgImage)">
                            <img :src="bgImage" alt="preset background" />
                        </div>

                        <el-upload class="preset-bg-item avatar-uploader" action="" :show-file-list="false"
                            :auto-upload="false" accept="image/*" :on-change="handleBgChange">
                            <img v-if="currentBg && !presetBgs.includes(currentBg)" :src="currentBg" class="preview-img"
                                alt="background">
                            <el-icon v-else class="avatar-uploader-icon">
                                <Plus />
                            </el-icon>
                        </el-upload>
                    </div>
                </el-form-item>

                <el-form-item>
                    <el-button class="mt-2" type="warning" @click="clearLocalStorage">
                        {{ $t('Setting.general.clearCache') }}
                    </el-button>
                </el-form-item>
            </el-form>

        </el-tab-pane>

        <!-- API密钥设置标签页 -->
        <el-tab-pane :label="$t('Setting.tabs.key')" class="flex-form-item">
            <el-form label-width="100" label-position="left">
                <el-form-item :label="x.platform_name" v-for="(x, y) in model_list" :key="y">
                    <el-text v-if="y === 'Xunfei_Spark'" type="info">{{ $t('Setting.key.xunfeiTip') }}</el-text>
                    <el-text v-else-if="y === 'Local'" type="info">{{ $t('Setting.key.localTip') }}</el-text>
                    <el-input v-else v-model="api_key_map[y]"
                        :placeholder="$t('Setting.key.placeholder', { platform: x.platform_name })"
                        @change="updateApiKey(y, $event)" />
                </el-form-item>
            </el-form>
        </el-tab-pane>

        <!-- 知识库设置标签页 -->
        <el-tab-pane :label="$t('Setting.tabs.knowledge')" class="flex-form-item">
            <el-form label-width="130" label-position="left">
                <el-form-item>
                    <template #label>
                        {{ $t('Setting.knowledge.chunkSize') }}
                        <el-tooltip :content="$t('Setting.knowledge.chunkSizeTip')" effect="dark" placement="top">
                            <el-icon class="tips-icon">
                                <QuestionFilled />
                            </el-icon>
                        </el-tooltip>
                    </template>
                    <el-input-number v-model="chunkSize" :min="200" :max="1000" :step="100"
                        controls-position="right" />
                </el-form-item>

                <el-form-item>
                    <template #label>
                        {{ $t('Setting.knowledge.recall') }}
                        <el-tooltip :content="$t('Setting.knowledge.recallTip')" effect="dark" placement="top">
                            <el-icon class="tips-icon">
                                <QuestionFilled />
                            </el-icon>
                        </el-tooltip>
                    </template>
                    <el-input-number v-model="recallCount" :min="1" :max="3" :step="1" controls-position="right" />
                </el-form-item>
            </el-form>
        </el-tab-pane>

    </el-tabs>
</template>

<script>
import { model_list } from "@/util/config";
import bg from '@/assets/images/bg.jpg'
import bg2 from '@/assets/images/bg2.jpg'
import { QuestionFilled } from '@element-plus/icons-vue'

export default {
    name: 'Setting',
    components: {
        QuestionFilled
    },
    data() {
        return {
            model_list: model_list,
            presetBgs: [bg, bg2]
        };
    },
    computed: {
        // 系统主题设置，支持 glass/dark/light 三种模式
        theme: {
            get() {
                return this.$store.state.setting.theme;
            },
            set(val) {
                document.body.className = val + '-theme';
                this.$store.dispatch('changeSetting', {
                    key: 'theme',
                    value: val
                })
            }
        },
        // AI平台选择，切换时会自动选择该平台的第一个可用模型
        platform: {
            get() {
                return this.$store.state.setting.platform;
            },
            set(val) {
                this.$store.dispatch('changeSetting', {
                    key: 'platform',
                    value: val
                })
                // api平台更换时 把默认模型设置为平台内的第一个
                this.model_version = this.model_list[val].list[0].version
            }
        },
        // api_key
        api_key: {
            get() {
                return this.$store.state.setting.api_key;
            },
            set(val) {
                this.$store.dispatch('changeSetting', {
                    key: 'api_key',
                    value: val
                })
            }
        },
        // 多轮对话开关，控制是否保持对话上下文
        memory: {
            get() {
                return this.$store.state.setting.memory;
            },
            set(val) {
                this.$store.dispatch('changeSetting', {
                    key: 'memory',
                    value: val
                })
            }
        },
        // 聊天统计信息显示开关
        chat_detail: {
            get() {
                return this.$store.state.setting.chat_detail;
            },
            set(val) {
                this.$store.dispatch('changeSetting', {
                    key: 'chat_detail',
                    value: val
                })
            }
        },
        // 当前选择的模型版本
        model_version: {
            get() {
                return this.$store.state.setting.model_config.version;
            },
            set(val) {
                // 获取选中模型的整体配置
                const model_config = this.model_list[this.platform].list.find(option => option.version === val);
                this.$store.dispatch('changeSetting', {
                    key: 'model_config',
                    value: model_config
                });
            }
        },
        // 系统界面语言设置
        locale: {
            get() {
                return this.$i18n.locale
            },
            set(value) {
                this.$i18n.locale = value
                localStorage.setItem('locale', value)
            }
        },
        // 当前设置的背景图片（保存在缓存内）
        currentBg() {
            return this.$store.state.setting.bg;
        },
        // api key map
        api_key_map() {
            return this.$store.state.setting.api_key_map;
        },
        // 知识库分块大小设置
        chunkSize: {
            get() {
                return this.$store.state.setting.chunk_size || 500;
            },
            set(val) {
                this.$store.dispatch('changeSetting', {
                    key: 'chunk_size',
                    value: val
                })
            }
        },
        // 知识库召回数量设置
        recallCount: {
            get() {
                return this.$store.state.setting.recall_count || 3;
            },
            set(val) {
                this.$store.dispatch('changeSetting', {
                    key: 'recall_count',
                    value: val
                })
            }
        }
    },
    methods: {
        /**
         * 处理背景图片上传
         * @param {File} file - 上传的图片文件
         * @description 限制图片大小不超过3MB，支持预览
         */
        handleBgChange(file) {
            // 添加文件大小限制检查 (1MB = 1024 * 1024 bytes)
            const isLt1M = file.raw.size / 1024 / 1024 < 3;

            if (!isLt1M) {
                this.$notify({
                    title: this.$t('Setting.upload.failed'),
                    message: this.$t('Setting.upload.sizeLimit'),
                    type: 'warning',
                });
                return;
            }

            const reader = new FileReader()
            reader.readAsDataURL(file.raw)
            reader.onload = () => {
                this.bg = reader.result
                this.$store.dispatch('changeSetting', {
                    key: 'bg',
                    value: reader.result
                })
            }
        },

        /**
         * 清空本地存储的所有设置
         * @description 会弹出确认框，确认后刷新页面
         */
        clearLocalStorage() {
            this.$confirm(
                this.$t('Setting.general.clearCacheConfirm'),
                this.$t('Common.warn'),
                {
                    confirmButtonText: this.$t('Common.confirm'),
                    cancelButtonText: this.$t('Common.cancel'),
                    type: 'warning'
                }
            ).then(() => {
                this.$store.dispatch('clearAll');
                this.$notify({
                    title: this.$t('Common.success'),
                    message: this.$t('Setting.general.clearCacheSuccess'),
                    type: 'success'
                });
                window.location.reload();
            }).catch(() => { });
        },

        /**
         * 更新指定平台的API密钥
         * @param {string} platform - 平台标识
         * @param {string} value - API密钥值
         */
        updateApiKey(platform, value) {
            const newApiKeys = { ...this.api_key_map };
            newApiKeys[platform] = value;
            this.$store.dispatch('changeSetting', {
                key: 'api_key_map',
                value: newApiKeys
            });
        },

        /**
         * 选择预设背景图片
         * @param {string} bgImage - 背景图片路径
         */
        selectPresetBg(bgImage) {
            this.$store.dispatch('changeSetting', {
                key: 'bg',
                value: bgImage
            });
        }
    }
}
</script>

<style scoped>
:deep(.el-tabs__item, .el-tabs__item label)[aria-selected="false"] {
    color: var(--common-color);
    font-weight: bold;
}

:deep(.el-form-item__label) {
    color: var(--common-color);
}

.bg-preview-container {
    display: flex;
    align-items: flex-start;
}

.avatar-uploader {
    position: relative;
    width: 200px;
    border-radius: 4px;
    cursor: pointer;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
}

/* 添加hover遮罩层 */
.avatar-uploader::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0);
    transition: background-color 0.3s;
    z-index: 1;
}

.avatar-uploader:hover::before {
    background-color: rgba(0, 0, 0, 0.3);
}

.avatar-uploader-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 28px;
    color: var(--common-color);
    z-index: 2;
    /* 确保图标在遮罩层上方 */
}

.preview-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.current-bg {
    width: 200px;
}

.current-bg .preview-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* 单选框样式调整 */
.platform-radio-group {
    gap: 5px;

    .el-radio {
        font-weight: 100;
        color: var(--common-color);
        margin-right: 10px;

        &.vl-model {
            border-color: var(--el-color-danger);
        }
    }
}

.flex-form-item {
    :deep(.el-form-item) {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    :deep(.el-form-item__content) {
        margin-left: auto !important;
        flex: none;
    }

    :deep(.el-select) {
        width: 100px;
    }
}

.preset-bg-container {
    display: flex;
    gap: 10px;
    margin-top: 10px;
}

.preset-bg-item {
    width: 70px;
    height: 45px;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.3s;

    &:hover {
        transform: translateY(-2px);
    }

    &.active {
        border-color: var(--el-color-primary);
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.web-tag {
    background-color: transparent !important;
    border: none !important;
    color: var(--el-color-warning);
}

.tips-icon {
    margin-left: 4px;
    font-size: 14px;
    color: var(--answer-stats-color);
    cursor: help;
}
</style>