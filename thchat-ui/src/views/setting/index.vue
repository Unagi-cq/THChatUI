<template>
    <el-row :gutter="24" justify="center" style="margin-left: 0;margin-right: 0;">
        <el-col :md="22" :sm="22" :xs="22">
            <el-tabs class="demo-tabs" :tab-position="tabPosition">

                <!-- 模型设置标签页 -->
                <el-tab-pane label="模型">
                    <el-form label-width="100" label-position="left">
                        <!-- 第三方平台列表 -->
                        <el-form-item label="平台">
                            <el-radio-group v-model="platform" class="platform-radio-group">
                                <el-radio :value="y" v-for="(x, y) in model_list" :key="y">
                                    {{ x.platform_name }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <!-- 文本模型选择 -->
                        <el-form-item label="文本模型">
                            <el-radio-group v-model="model_version" class="platform-radio-group">
                                <el-radio :value="x.version"
                                    v-for="x in model_list[platform].list.filter(m => m.type === 'llm')">
                                    {{ x.version }}
                                    <el-tag v-if="x.can_web_search" class="web-tag">Web</el-tag>
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <!-- 图片理解模型选择 -->
                        <el-form-item label="图片理解模型" v-if="model_list[platform].list.some(m => m.type === 'vim')">
                            <el-radio-group v-model="model_version" class="platform-radio-group">
                                <el-radio :value="x.version"
                                    v-for="x in model_list[platform].list.filter(m => m.type === 'vim')"
                                    class="vl-model">
                                    {{ x.version }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <!-- 图片生成模型选择 -->
                        <el-form-item label="图片生成模型" v-if="model_list[platform].list.some(m => m.type === 'igm')">
                            <el-radio-group v-model="model_version" class="platform-radio-group">
                                <el-radio :value="x.version"
                                    v-for="x in model_list[platform].list.filter(m => m.type === 'igm')"
                                    class="vl-model">
                                    {{ x.version }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>

                <!-- 通用设置标签页 -->
                <el-tab-pane label="通用" class="flex-form-item">
                    <el-form label-width="130" label-position="left">

                        <!-- 系统主题 -->
                        <el-form-item label="系统主题">
                            <el-segmented v-model="theme" :options="[
                                { label: '毛玻璃', value: 'glass' },
                                { label: '深色', value: 'dark' },
                                { label: '浅色', value: 'light' }
                            ]">
                                <template #default="{ item }">
                                    <div class="flex flex-col items-center">
                                        <div>{{ item.label }}</div>
                                    </div>
                                </template>
                            </el-segmented>
                        </el-form-item>
                        <!-- 多轮对话 -->
                        <el-form-item label="多轮对话" prop="memory">
                            <el-switch v-model="memory" />
                        </el-form-item>
                        <!-- 多轮对话轮数 -->
                        <el-form-item label="历史对话轮数">
                            <el-input-number v-model="memoryLimit" :min="3" :max="8" :step="1"
                                controls-position="right" />
                        </el-form-item>
                        <!-- 统计信息 -->
                        <el-form-item label="聊天统计信息" prop="chat_detail">
                            <el-switch v-model="chat_detail" />
                        </el-form-item>
                        <!-- 背景图片 -->
                        <el-form-item label="背景图片" v-if="theme === 'glass'">
                            <div class="preset-bg-container">
                                <div v-for="(bgImage, index) in presetBgs" :key="index" class="preset-bg-item"
                                    :class="{ active: currentBg === bgImage }" @click="selectPresetBg(bgImage)">
                                    <img :src="bgImage" alt="preset background" />
                                </div>
                                <el-upload class="preset-bg-item avatar-uploader" action="" :show-file-list="false"
                                    :auto-upload="false" accept="image/*" :on-change="handleBgChange">
                                    <img v-if="currentBg && !presetBgs.includes(currentBg)" :src="currentBg"
                                        class="preview-img" alt="background">
                                    <el-icon v-else class="avatar-uploader-icon">
                                        <Plus />
                                    </el-icon>
                                </el-upload>
                            </div>
                        </el-form-item>
                        <!-- 清除缓存 -->
                        <el-form-item>
                            <el-button class="mt-2" type="warning" @click="clearLocalStorage">清空本地缓存</el-button>
                        </el-form-item>
                    </el-form>

                </el-tab-pane>

                <!-- API密钥设置标签页 -->
                <el-tab-pane label="API Key" class="flex-form-item">
                    <!-- API密钥卡片容器 -->
                    <div class="api-key-cards">
                        <div v-for="(x, y) in model_list" :key="y" class="api-key-card">
                            <div class="card-header">
                                <div class="left-section">
                                    <div class="platform-logo">
                                        <SvgIcon v-if="x.avatar" :icon-class="x.avatar" />
                                        <el-icon v-else>
                                            <Platform />
                                        </el-icon>
                                    </div>
                                    <div class="platform-info">
                                        <div class="platform-name">{{ x.platform_name }}</div>
                                        <div class="platform-tags">
                                            <span v-if="x.list.some(m => m.type === 'llm')"
                                                class="custom-tag">LLM</span>
                                            <span v-if="x.list.some(m => m.type === 'vim')"
                                                class="custom-tag">VIM</span>
                                            <span v-if="x.list.some(m => m.type === 'igm')"
                                                class="custom-tag">IGM</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="right-section" v-if="x.api_key_config">
                                    <p>API-KEY</p>
                                    <button class="api-key-btn" @click="showApiKeyCard(y)">
                                        设置
                                    </button>
                                </div>
                            </div>
                            <div class="card-content" :class="{ expanded: expandedCard === y }">
                                <div class="content-divider"></div>
                                <div class="content-header">
                                    <div class="left-section">
                                        <el-icon @click="toggleCard(y)" class="collapse-icon">
                                            <ArrowDown v-if="expandedCard !== y" />
                                            <ArrowUp v-else />
                                        </el-icon>
                                        <span class="header-title">模型列表</span>
                                    </div>
                                    <div class="right-section" v-if="x.model_config">
                                        <button class="model-add-btn" @click="showModeConfigCard(y)">
                                            添加模型
                                        </button>
                                    </div>
                                </div>

                                <div class="model-list" v-if="expandedCard === y">
                                    <div v-for="model in x.list" :key="model.version" class="model-item">
                                        <div class="model-info">
                                            <SvgIcon v-if="model.series" :icon-class="model.series" class="model-avatar"  />
                                            <el-icon v-else class="model-avatar">
                                                <Platform />
                                            </el-icon>
                                            <span class="model-version">{{ model.version }}</span>
                                        </div>
                                        <el-icon class="delete-icon" @click.stop="deleteModel(y, model.version)">
                                            <SvgIcon icon-class="delete" />
                                        </el-icon>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>

                <!-- 知识库设置标签页 -->
                <el-tab-pane label="知识库" class="flex-form-item">
                    <el-form label-width="130" label-position="left">

                        <!-- 知识库启用按钮 -->
                        <el-form-item label="启用">
                            <el-switch v-model="knowledgeEnabled" />
                        </el-form-item>
                        <!-- 分隔线 -->
                        <div class="openai-divider">
                            <span>以下配置在平台选择本地调用时无效</span>
                        </div>
                        <!-- 知识库选择 -->
                        <el-form-item label="选择知识库" v-if="knowledgeEnabled">
                            <el-select v-model="selectedRepoId" clearable>
                                <el-option v-for="item in repoList" :key="item.repoId" :label="item.name"
                                    :value="item.repoId" />
                            </el-select>
                        </el-form-item>
                        <!-- chunk大小 -->
                        <el-form-item>
                            <template #label>
                                分块大小
                                <el-tooltip content="文档分块大小（字符数）" effect="dark" placement="top">
                                    <el-icon class="tips-icon">
                                        <QuestionFilled />
                                    </el-icon>
                                </el-tooltip>
                            </template>
                            <el-input-number v-model="chunkSize" :min="200" :max="1000" :step="100"
                                controls-position="right" />
                        </el-form-item>
                        <!-- 召回数量 -->
                        <el-form-item>
                            <template #label>
                                召回数量
                                <el-tooltip content="单次查询返回的相关文段数量" effect="dark" placement="top">
                                    <el-icon class="tips-icon">
                                        <QuestionFilled />
                                    </el-icon>
                                </el-tooltip>
                            </template>
                            <el-input-number v-model="recallCount" :min="1" :max="3" :step="1"
                                controls-position="right" />
                        </el-form-item>

                    </el-form>
                </el-tab-pane>

                <!-- 联网搜索设置标签页 -->
                <el-tab-pane label="联网搜索" class="flex-form-item">
                    <el-form label-width="130" label-position="left">

                        <!-- 启用按钮 -->
                        <el-form-item label="启用">
                            <el-switch v-model="webSearchEnabled" />
                        </el-form-item>

                        <!-- 分隔线 -->
                        <div class="openai-divider">
                            <span>以下为TavilySearch搜索配置</span>
                        </div>

                        <!-- TavilySearch 使用开关 -->
                        <el-form-item>
                            <template #label>
                                使用 Tavily
                                <el-tooltip content="如不使用TavilySearch，将优先使用模型内置联网搜索，但是大部分模型没有内置联网功能；使用内置联网不会展示联网搜索内容" effect="dark" placement="top">
                                    <el-icon class="tips-icon">
                                        <QuestionFilled />
                                    </el-icon>
                                </el-tooltip>
                            </template>
                            <el-switch v-model="isTavilySearch" />
                        </el-form-item>

                        <!-- TavilySearch API Key -->
                        <el-form-item>
                            <template #label>
                                Tavily API Key
                                <el-tooltip content="Tavily每月1000次免费使用额度" effect="dark" placement="top">
                                    <el-icon class="tips-icon">
                                        <QuestionFilled />
                                    </el-icon>
                                </el-tooltip>
                            </template>
                            <el-input v-model="tavilySearchKey" placeholder="请输入 Tavily API Key" show-password />
                        </el-form-item>

                    </el-form>
                </el-tab-pane>

                <!-- 看板娘设置标签页 -->
                <el-tab-pane label="动漫人物" class="flex-form-item">
                    <el-form label-width="130" label-position="left">
                        <!-- 启用按钮 -->
                        <el-form-item label="启用">
                            <el-switch v-model="live2dEnabled" />
                        </el-form-item>

                        <!-- 模型选择 -->
                        <el-form-item label="模型" v-if="live2dEnabled">
                            <div class="live2d-model-selector">
                                <el-button :disabled="currentModelIndex <= 0" @click="prevModel">
                                    <el-icon>
                                        <ArrowLeft />
                                    </el-icon>
                                </el-button>

                                <el-input v-model="currentModelIndex" style="width: 60px;" />

                                <el-button :disabled="currentModelIndex >= live2dModels.length - 1" @click="nextModel">
                                    <el-icon>
                                        <ArrowRight />
                                    </el-icon>
                                </el-button>
                            </div>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>

            </el-tabs>
        </el-col>
    </el-row>

    <!-- 模型KEY配置弹窗 -->
    <CustomDialog v-model="apiKeyCardVisible" title="API Key" width="500px">
        <ApiKeyCard :platform="currentPlatform" :initial-data="model_list[currentPlatform]['api_key_config'] || {}"
            @submit="handleApiKeySubmit" @close="apiKeyCardVisible = false" />
    </CustomDialog>

    <!-- 添加模型弹窗 -->
    <CustomDialog v-model="modeConfigCardVisible" title="添加模型" width="500px">
        <ModelConfigCard :platform="currentPlatform" @submit="handleModeConfigSubmit" @close="modeConfigCardVisible = false" />
    </CustomDialog>
</template>

<script>
import bg from '@/assets/images/bg.jpg'
import bg2 from '@/assets/images/bg2.jpg'
import live2dModels from '@/util/live2d_models.js'

export default {
    name: 'Setting',
    data() {
        return {
            // 预设背景图片
            presetBgs: [bg, bg2],
            // 标签页位置
            tabPosition: 'left',
            // 当前展开的卡片
            expandedCard: null,
            // 模型KEY配置弹窗
            apiKeyCardVisible: false,
            // 添加模型弹窗
            modeConfigCardVisible: false,
            // 当前平台
            currentPlatform: ''
        };
    },
    computed: {
        // 模型列表 从缓存中获取 缓存又从api/config.js中初始化
        model_list: {
            get() {
                return this.$store.state.setting.model_list;
            },
            set(val) {
                this.$store.dispatch('changeSetting', {
                    key: 'model_list',
                    value: val
                })
            }
        },
        // 第三方平台选择，切换时会自动选择该平台的第一个可用模型
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
        // 历史对话轮数限制
        memoryLimit: {
            get() {
                return this.$store.state.setting.memory_limit || 3;
            },
            set(val) {
                this.$store.dispatch('changeSetting', {
                    key: 'memory_limit',
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
        // 知识库启用状态
        knowledgeEnabled: {
            get() {
                return this.$store.state.setting.kb_enabled || false;
            },
            set(val) {
                this.$store.dispatch('changeSetting', {
                    key: 'kb_enabled',
                    value: val
                })
            }
        },
        // 选中的知识库
        selectedRepoId: {
            get() {
                return this.$store.state.setting.selected_repoId;
            },
            set(val) {
                this.$store.dispatch('changeSetting', {
                    key: 'selected_repoId',
                    value: val
                })
            }
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
        },
        // 联网搜索启用状态
        webSearchEnabled: {
            get() {
                return this.$store.state.setting.web_search_enabled;
            },
            set(val) {
                this.$store.dispatch('changeSetting', {
                    key: 'web_search_enabled',
                    value: val
                })
            }
        },
        // 是否使用 TavilySearch
        isTavilySearch: {
            get() {
                return this.$store.state.setting.is_tavily_search;
            },
            set(val) {
                this.$store.dispatch('changeSetting', {
                    key: 'is_tavily_search',
                    value: val
                })
            }
        },
        // TavilySearch API Key
        tavilySearchKey: {
            get() {
                return this.$store.state.setting.tavily_search_key;
            },
            set(val) {
                this.$store.dispatch('changeSetting', {
                    key: 'tavily_search_key',
                    value: val
                })
            }
        },
        // 当前设置的背景图片（保存在缓存内）
        currentBg() {
            return this.$store.state.setting.bg;
        },
        // 可选知识库列表
        repoList() {
            return this.$store.state.app.kb.list || []
        },
        // 看板娘启用状态
        live2dEnabled: {
            get() {
                return this.$store.state.setting.live2d_enabled || false;
            },
            set(val) {
                this.$store.dispatch('changeSetting', {
                    key: 'live2d_enabled',
                    value: val
                })
            }
        },
        // 当前看板娘模型索引
        currentModelIndex: {
            get() {
                return this.$store.state.setting.live2d_model_index || 0;
            },
            set(val) {
                this.$store.dispatch('changeSetting', {
                    key: 'live2d_model_index',
                    value: val
                })
                this.updateLive2dModel();
            }
        }
    },
    created() {
        this.loadLive2dModels();
        // 添加窗口大小变化监听
        window.addEventListener('resize', this.handleResize);
    },
    beforeDestroy() {
        // 组件销毁前移除监听器
        window.removeEventListener('resize', this.handleResize);
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
                    title: "上传失败",
                    message: "上传图片大小不能超过 3MB!",
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
                "确定要清空所有本地缓存吗？这将会清除所有聊天记录。",
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: 'warning'
                }
            ).then(() => {
                this.$store.dispatch('clearAll');
                this.$notify({
                    title: "成功",
                    message: "本地缓存已清空",
                    type: 'success'
                });
                window.location.reload();
            }).catch(() => { });
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
        },

        // 加载看板娘模型列表
        async loadLive2dModels() {
            try {
                this.live2dModels = live2dModels.live2d_models;
            } catch (error) {
                console.error('加载看板娘模型列表失败:', error);
                this.live2dModels = [];
            }
        },

        // 切换到上一个模型
        prevModel() {
            if (this.currentModelIndex > 0) {
                this.currentModelIndex--;
                this.updateLive2dModel();
            }
        },

        // 切换到下一个模型
        nextModel() {
            if (this.currentModelIndex < this.live2dModels.length - 1) {
                this.currentModelIndex++;
                this.updateLive2dModel();
            }
        },

        // 更新看板娘模型
        updateLive2dModel() {
            const currentModel = this.live2dModels[this.currentModelIndex];
            if (currentModel) {
                this.$store.dispatch('changeSetting', {
                    key: 'live2d_model',
                    value: currentModel
                });
            }
        },

        // 显示API Key卡片
        showApiKeyCard(platform) {
            this.currentPlatform = platform
            this.apiKeyCardVisible = true
        },

        // 显示模型配置卡片
        showModeConfigCard(platform) {
            this.currentPlatform = platform
            this.modeConfigCardVisible = true
        },

        // 处理API Key提交
        handleApiKeySubmit(data) {
            this.model_list[data.platform]['api_key_config'] = data.api_key_config

            this.$store.dispatch('changeSetting', {
                key: 'model_list',
                value: this.model_list
            })

            this.$notify({
                title: "成功",
                message: "API Key 保存成功",
                type: 'success'
            })

            this.apiKeyCardVisible = false
        },

        // 处理模型配置提交
        handleModeConfigSubmit(data) {
            // 获取当前平台的模型列表
            const platformModels = this.model_list[data.platform].list || [];

            // 创建新模型配置
            const newModelConfig = {
                ...data.new_model_config,
            };

            // 检查是否已存在相同版本的模型
            const existingModelIndex = platformModels.findIndex(m => m.version === newModelConfig.version);

            if (existingModelIndex >= 0) {
                // 如果存在相同版本，替换它
                platformModels[existingModelIndex] = newModelConfig;
                this.$notify({
                    title: "成功",
                    message: "模型更新成功",
                    type: 'success'
                });
            } else {
                // 添加新模型到列表
                platformModels.push(newModelConfig);
                this.$notify({
                    title: "成功",
                    message: "模型添加成功",
                    type: 'success'
                });
            }

            // 更新Vuex中的模型列表
            this.$store.dispatch('changeSetting', {
                key: 'model_list',
                value: this.model_list
            });

            this.modeConfigCardVisible = false;
        },

        // 切换卡片
        toggleCard(platform) {
            this.expandedCard = this.expandedCard === platform ? null : platform;
        },

        // 窗口大小变化处理
        handleResize() {
            this.tabPosition = window.innerWidth <= 768 ? 'top' : 'left';
            // 强制更新计算属性
            this.$forceUpdate();
        },

        // 删除模型
        deleteModel(platform, version) {
            this.$confirm(
                `确定要删除模型 "${version}" 吗？`,
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: 'warning'
                }
            ).then(() => {
                // 获取当前平台的模型列表
                const platformModels = this.model_list[platform].list || [];

                // 找到要删除的模型
                const modelIndex = platformModels.findIndex(m => m.version === version);

                if (modelIndex >= 0) {
                    // 删除模型
                    platformModels.splice(modelIndex, 1);
                    this.$notify({
                        title: "成功",
                        message: "模型删除成功",
                        type: 'success'
                    });

                    // 更新Vuex中的模型列表
                    this.$store.dispatch('changeSetting', {
                        key: 'model_list',
                        value: this.model_list
                    });
                }
            }).catch(() => {});
        }
    }
}
</script>

<style lang="scss" scoped>
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
    background-color: rgba(0, 0, 0, 0.1);
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
    color: var(--answer-stats-color);
    cursor: help;
}

.openai-divider {
    display: flex;
    align-items: center;
    margin: 20px 0;
    color: var(--common-color);

    &::before,
    &::after {
        content: '';
        flex: 1;
        height: 1px;
        background: var(--common-color);
        opacity: 0.2;
    }

    >span {
        padding: 0 10px;
        font-weight: 500;
    }
}


.live2d-model-selector {
    display: flex;
    align-items: center;
    gap: 10px;
}

.live2d-model-selector .model-name {
    min-width: 120px;
    text-align: center;
    color: var(--common-color);
}

.live2d-model-selector .el-button {
    padding: 8px;
}

/* 修改API密钥卡片样式 */
.api-key-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
}

.api-key-card {
    border-radius: 8px;
    padding: 10px 10px 0 10px;
    border: 1px solid var(--answer-stats-color);

    .card-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;

        .left-section {
            display: flex;
            gap: 12px;

            .platform-logo {
                width: 20px;
                height: 20px;
                border-radius: 6px;
                display: flex;
                justify-content: center;

                img,
                svg {
                    width: 20px;
                    height: 20px;
                }
            }

            .platform-info {
                .platform-name {
                    font-weight: 500;
                    color: var(--common-color);
                    margin-bottom: 4px;
                }

                .platform-tags {
                    display: flex;
                    gap: 6px;

                    .el-tag {
                        height: 20px;
                        padding: 0 6px;
                    }
                }
            }
        }

        .right-section {
            width: 70px;
            border-radius: 8px;
            padding: 4px;
            border: 1px solid rgba(0, 0, 0, 0.1);
            font-size: 12px;

            p {
                margin: 4px;
            }

            .api-key-btn,
            .model-add-btn {
                width: 100%;
                background: var(--recall-bg-color);
                border: 0;
                color: var(--answer-stats-color);
                padding: 2px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-family: var(--thchatui-font-family);

                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                text-decoration: none;
                outline: none;

                &:hover {
                    background: var(--el-color-primary);
                    color: white;
                }
            }
        }
    }

    .card-content {
        border-radius: 6px;
        // background: var(--recall-bg-color);
        overflow: hidden;
        font-size: 12px;

        &.expanded {
            display: block;
        }

        .content-header {
            padding: 8px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .left-section {
                display: flex;
                align-items: center;

                .collapse-icon {
                    cursor: pointer;
                    margin-right: 10px;
                    color: var(--common-color);
                }

                .header-title {
                    font-weight: 500;
                    color: var(--common-color);
                }
            }

            .right-section {
                width: 75px;
                border-radius: 6px;
                padding: 2px 4px;
                font-size: 12px;

                .model-add-btn {
                    width: 80px;
                    background: var(--recall-bg-color);
                    border: 0;
                    color: var(--answer-stats-color);
                    padding: 2px 8px 3px 8px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-family: var(--thchatui-font-family);
                    font-size: 12px;
                    text-align: center;

                    transition: all 0.3s ease;
                    text-decoration: none;
                    outline: none;

                    &:hover {
                        background: var(--el-color-primary);
                        color: white;
                    }
                }
            }
        }

        .content-divider {
            height: 1px;
            background: var(--app-small-border-color);
            opacity: 0.5;
        }

        .model-list {
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 8px;

            .model-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 8px;
                border-radius: 4px;
                background: var(--recall-bg-color);

                .model-info {
                    display: flex;
                    align-items: center;
                    gap: 10px;

                    .model-avatar {
                        width: 20px;
                        height: 20px;
                        display: flex;
                        justify-content: center;

                        img,
                        svg {
                            width: 20px;
                            height: 20px;
                        }
                    }

                    .model-version {
                        color: var(--el-text-color-secondary);
                    }
                }

                .delete-icon {
                    cursor: pointer;
                    color: var(--el-color-danger);
                }
            }
        }
    }
}

.custom-tag {
    border-radius: 4px;
    border: 1px solid var(--answer-stats-color);
    padding: 1px 6px;
    color: var(--answer-stats-color);
    font-size: 12px;
}
</style>