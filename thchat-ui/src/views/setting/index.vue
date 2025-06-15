<template>
    <div class="setting-container">
        <div class="setting-sidebar">
            <div class="sidebar-header">
                <h4>设置</h4>
            </div>
            <div class="setting-menu">
                <div v-for="(item, key) in settingMenus" :key="key"
                    :class="['menu-item', { active: currentMenu === key }]" @click="selectMenu(key)">
                    {{ item.label }}
                </div>
            </div>
        </div>

        <div class="setting-content">
            <div v-if="!currentMenu" class="empty-state">
                请选择一个设置项
            </div>
            <div v-else class="setting-config">
                <div class="config-header">
                    <h2>{{ settingMenus[currentMenu].label }}</h2>
                </div>

                <div class="config-form">
                    <!-- 模型设置 -->
                    <div v-if="currentMenu === 'model'" class="form-content">
                        <el-form label-width="100" label-position="left">
                            <!-- 第三方平台列表 -->
                            <div class="form-item">
                                <div class="form-label">平台</div>
                                <el-radio-group v-model="platform" class="platform-radio-group">
                                    <el-radio :value="y" v-for="(x, y) in model_list" :key="y">
                                        {{ x.platform_name }}
                                    </el-radio>
                                </el-radio-group>
                            </div>
                            <!-- 文本模型选择 -->
                            <div class="form-item">
                                <div class="form-label">文本模型</div>
                                <el-radio-group v-model="model_version" class="platform-radio-group">
                                    <el-radio :value="x.version"
                                        v-for="x in model_list[platform].list.filter(m => m.type === 'llm')">
                                        {{ x.version }}
                                        <el-tag v-if="x.can_web_search" class="web-tag">Web</el-tag>
                                    </el-radio>
                                </el-radio-group>
                            </div>
                            <!-- 图片理解模型选择 -->
                            <div class="form-item" v-if="model_list[platform].list.some(m => m.type === 'vim')">
                                <div class="form-label">图片理解模型</div>
                                <el-radio-group v-model="model_version" class="platform-radio-group">
                                    <el-radio :value="x.version"
                                        v-for="x in model_list[platform].list.filter(m => m.type === 'vim')">
                                        {{ x.version }}
                                    </el-radio>
                                </el-radio-group>
                            </div>
                            <!-- 图片生成模型选择 -->
                            <div class="form-item" v-if="model_list[platform].list.some(m => m.type === 'igm')">
                                <div class="form-label">图片生成模型</div>
                                <el-radio-group v-model="model_version" class="platform-radio-group">
                                    <el-radio :value="x.version"
                                        v-for="x in model_list[platform].list.filter(m => m.type === 'igm')">
                                        {{ x.version }}
                                    </el-radio>
                                </el-radio-group>
                            </div>
                        </el-form>
                    </div>

                    <!-- 通用设置 -->
                    <div v-if="currentMenu === 'general'" class="form-content">
                        <el-form label-width="130" label-position="left">
                            <!-- 系统主题 -->
                            <div class="form-item">
                                <div class="form-label">系统主题</div>
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
                            </div>
                            <!-- 多轮对话 -->
                            <div class="form-item">
                                <div class="form-label">多轮对话</div>
                                <el-switch v-model="memory" />
                            </div>
                            <!-- 多轮对话轮数 -->
                            <div class="form-item">
                                <div class="form-label">历史对话轮数</div>
                                <el-input-number v-model="memoryLimit" :min="3" :max="8" :step="1"
                                    controls-position="right" />
                            </div>
                            <!-- 统计信息 -->
                            <div class="form-item">
                                <div class="form-label">聊天统计信息</div>
                                <el-switch v-model="chat_detail" />
                            </div>
                            <!-- 背景图片 -->
                            <div class="form-item" v-if="theme === 'glass'">
                                <div class="form-label">背景图片</div>
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
                            </div>
                            <!-- 清除缓存 -->
                            <div class="form-item form-item-vertical">
                                <div class="form-label">缓存管理</div>
                                <el-button type="warning" @click="clearLocalStorage">清空本地缓存</el-button>
                            </div>
                        </el-form>
                    </div>

                    <!-- API密钥设置 -->
                    <div v-if="currentMenu === 'apikey'" class="form-content">
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
                                            <div class="platform-tags" v-if="x.list.some(m => m.type === 'llm' || m.type === 'vim' || m.type === 'igm')">
                                                <span v-if="x.list.some(m => m.type === 'llm')"
                                                    class="custom-tag">LLM</span>
                                                <span v-if="x.list.some(m => m.type === 'vim')"
                                                    class="custom-tag">VIM</span>
                                                <span v-if="x.list.some(m => m.type === 'igm')"
                                                    class="custom-tag">IGM</span>
                                            </div>
                                            <div class="platform-tags" v-else>
                                                <span class="placeholder-tag">&nbsp;</span>
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
                                    <div class="content-header" @click="toggleCard(y)">
                                        <div class="left-section">
                                            <el-icon class="collapse-icon">
                                                <ArrowDown v-if="expandedCard !== y" />
                                                <ArrowUp v-else />
                                            </el-icon>
                                            <span class="header-title">模型列表</span>
                                        </div>
                                        <div class="right-section" v-if="x.model_config">
                                            <button class="model-add-btn" @click.stop="showModeConfigCard(y)">
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
                    </div>

                    <!-- 知识库设置 -->
                    <div v-if="currentMenu === 'knowledge'" class="form-content">
                        <el-form label-width="130" label-position="left">
                            <!-- 知识库启用按钮 -->
                            <div class="form-item">
                                <div class="form-label">启用</div>
                                <el-switch v-model="knowledgeEnabled" />
                            </div>
                            <!-- 分隔线 -->
                            <div class="openai-divider">
                                <span>以下配置在平台选择本地调用时无效</span>
                            </div>
                            <!-- 知识库选择 -->
                            <div class="form-item" v-if="knowledgeEnabled">
                                <div class="form-label">选择知识库</div>
                                <el-select v-model="selectedRepoId" clearable>
                                    <el-option v-for="item in repoList" :key="item.repoId" :label="item.name"
                                        :value="item.repoId" />
                                </el-select>
                            </div>
                            <!-- chunk大小 -->
                            <div class="form-item">
                                <div class="form-label">
                                    分块大小
                                    <el-tooltip content="文档分块大小（字符数）" effect="dark" placement="top">
                                        <el-icon class="tips-icon">
                                            <QuestionFilled />
                                        </el-icon>
                                    </el-tooltip>
                                </div>
                                <el-input-number v-model="chunkSize" :min="200" :max="1000" :step="100"
                                    controls-position="right" />
                            </div>
                            <!-- 召回数量 -->
                            <div class="form-item">
                                <div class="form-label">
                                    召回数量
                                    <el-tooltip content="单次查询返回的相关文段数量" effect="dark" placement="top">
                                        <el-icon class="tips-icon">
                                            <QuestionFilled />
                                        </el-icon>
                                    </el-tooltip>
                                </div>
                                <el-input-number v-model="recallCount" :min="1" :max="3" :step="1"
                                    controls-position="right" />
                            </div>
                        </el-form>
                    </div>

                    <!-- 联网搜索设置 -->
                    <div v-if="currentMenu === 'websearch'" class="form-content">
                        <el-form label-width="130" label-position="left">
                            <!-- 启用按钮 -->
                            <div class="form-item">
                                <div class="form-label">启用</div>
                                <el-switch v-model="webSearchEnabled" />
                            </div>

                            <!-- 分隔线 -->
                            <div class="openai-divider">
                                <span>以下为TavilySearch搜索配置</span>
                            </div>

                            <!-- TavilySearch 使用开关 -->
                            <div class="form-item">
                                <div class="form-label">
                                    使用 Tavily
                                    <el-tooltip content="如不使用TavilySearch，将优先使用模型内置联网搜索，但是大部分模型没有内置联网功能；使用内置联网不会展示联网搜索内容" effect="dark" placement="top">
                                        <el-icon class="tips-icon">
                                            <QuestionFilled />
                                        </el-icon>
                                    </el-tooltip>
                                </div>
                                <el-switch v-model="isTavilySearch" />
                            </div>

                            <!-- TavilySearch API Key -->
                            <div class="form-item">
                                <div class="form-label">
                                    Tavily API Key
                                    <el-tooltip content="Tavily每月1000次免费使用额度" effect="dark" placement="top">
                                        <el-icon class="tips-icon">
                                            <QuestionFilled />
                                        </el-icon>
                                    </el-tooltip>
                                </div>
                                <el-input v-model="tavilySearchKey" placeholder="请输入 Tavily API Key" show-password />
                            </div>
                        </el-form>
                    </div>

                    <!-- 看板娘设置 -->
                    <div v-if="currentMenu === 'live2d'" class="form-content">
                        <el-form label-width="130" label-position="left">
                            <!-- 启用按钮 -->
                            <div class="form-item">
                                <div class="form-label">启用</div>
                                <el-switch v-model="live2dEnabled" />
                            </div>

                            <!-- 模型选择 -->
                            <div class="form-item" v-if="live2dEnabled">
                                <div class="form-label">模型</div>
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
                            </div>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>

        <!-- 模型KEY配置弹窗 -->
        <CustomDialog v-model="apiKeyCardVisible" title="API Key" width="500px">
            <ApiKeyCard :platform="currentPlatform" :initial-data="model_list[currentPlatform]['api_key_config'] || {}"
                @submit="handleApiKeySubmit" @close="apiKeyCardVisible = false" />
        </CustomDialog>

        <!-- 添加模型弹窗 -->
        <CustomDialog v-model="modeConfigCardVisible" title="添加模型" width="500px">
            <ModelConfigCard :platform="currentPlatform" @submit="handleModeConfigSubmit" @close="modeConfigCardVisible = false" />
        </CustomDialog>
    </div>
</template>

<script>
import bg from '@/assets/images/bg.jpg'
import bg2 from '@/assets/images/bg2.jpg'
import live2dModels from '@/util/live2d_models.js'
import cache from '@/util/cache'
import { defaultSettings } from '@/store/setting'

export default {
    name: 'Setting',
    data() {
        return {
            // 预设背景图片
            presetBgs: [bg, bg2],
            // 标签页位置
            tabPosition: window.innerWidth <= 768 ? 'top' : 'left',
            // 当前展开的卡片
            expandedCard: null,
            // 模型KEY配置弹窗
            apiKeyCardVisible: false,
            // 添加模型弹窗
            modeConfigCardVisible: false,
            // 当前平台
            currentPlatform: '',
            // 设置菜单
            settingMenus: {
                model: { label: '模型' },
                general: { label: '通用' },
                apikey: { label: 'API Key' },
                knowledge: { label: '知识库' },
                websearch: { label: '联网搜索' },
                live2d: { label: '动漫人物' }
            },
            // 当前选择的菜单
            currentMenu: 'model'
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
                "确定要清空所有本地缓存吗？这将会清除所有API KEY、模型配置，聊天记录将会保留。",
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: 'warning'
                }
            ).then(() => {
                cache.local.setJSON('settingStorage', defaultSettings);
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
        },

        // 选择菜单
        selectMenu(menu) {
            this.currentMenu = menu;
        }
    }
}
</script>

<style lang="scss" scoped>
/* 设置页面容器 - 采用MCP页面布局 */
.setting-container {
    display: flex;
    height: 100%;
    overflow: hidden;
    color: var(--page-mcp-text-color);
    transition: all 0.3s ease;
}

.setting-sidebar {
    margin: 20px 0;
    border: 1px solid var(--page-mcp-sidebar-border);
    display: flex;
    flex-direction: column;
    overflow: auto;
    background-color: var(--standard-page-bg-color);
    transition: all 0.3s ease;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    box-shadow: 0 2px 12px 0 var(--page-mcp-content-shadow);
}

.sidebar-header {
    padding: 20px;
    border-bottom: 1px solid var(--page-mcp-sidebar-border);
    display: flex;
    justify-content: center;
    
    h4 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: var(--page-mcp-header-text);
    }
}

.setting-menu {
    flex: 1;
    overflow: auto;
    padding: 8px 0;
}

.menu-item {
    padding: 10px 20px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    margin: 4px 8px;
    border-radius: 6px;
    font-weight: 500;
    position: relative;
    overflow: hidden;
}

.menu-item:hover {
    background-color: var(--page-mcp-server-hover-bg);
    transform: translateX(2px);
}

.menu-item.active {
    background-color: var(--page-mcp-server-active-bg);
    color: var(--page-mcp-server-active-color);
}

.setting-content {
    flex: 1;
    padding: 30px;
    overflow: auto;
    background-color: var(--standard-page-bg-color);
    margin: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 var(--page-mcp-content-shadow);
    transition: all 0.3s ease;
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.empty-state {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--page-mcp-empty-text-color);
    font-size: 18px;
    opacity: 0.7;
}

.config-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--page-mcp-header-border);
}

.config-header h2 {
    margin: 0;
    font-size: 22px;
    font-weight: 600;
    color: var(--page-mcp-header-text);
    position: relative;
    padding-left: 16px;
}

.config-header h2::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 60%;
    width: 4px;
    background-color: var(--page-mcp-header-accent);
    border-radius: 2px;
}

.config-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
    transition: all 0.3s ease;
    animation: slideIn 0.4s ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.form-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.form-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 12px 0;
    transition: all 0.2s ease;
    border-bottom: 1px solid transparent;
}

.form-label {
    font-weight: 500;
    font-size: 15px;
    color: var(--page-mcp-form-label);
    min-width: 120px;
    flex-shrink: 0;
}

.form-label.required::before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
}

/* 分隔线样式 */
.openai-divider {
    display: flex;
    align-items: center;
    margin: 24px 0;
    color: var(--page-mcp-text-color);

    &::before,
    &::after {
        content: '';
        flex: 1;
        height: 1px;
        background: var(--page-mcp-sidebar-border);
        opacity: 0.6;
    }

    >span {
        padding: 0 16px;
        font-weight: 500;
        font-size: 14px;
        white-space: nowrap;
        color: var(--answer-stats-color);
    }
}

/* 预设背景容器 */
.preset-bg-container {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 10px;
}

.preset-bg-item {
    width: 80px;
    height: 50px;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.3s;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &.active {
        border-color: var(--el-color-primary);
        box-shadow: 0 0 0 2px var(--el-color-primary-light-8);
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

/* 看板娘模型选择器 */
.live2d-model-selector {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .el-input {
        width: 80px;
    }
    
    .el-button {
        padding: 8px;
        border-radius: 8px;
    }
}

/* 单选框样式调整 */
.platform-radio-group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .el-radio {
        font-weight: 400;
        color: var(--page-mcp-text-color);
        margin-right: 0;
        transition: all 0.3s;
        padding: 8px 12px;
        border-radius: 6px;
        border: 1px solid var(--page-mcp-sidebar-border);
        background-color: var(--page-mcp-sidebar-bg);
        
        &:hover {
            color: var(--el-color-primary);
            border-color: var(--el-color-primary);
            transform: translateY(-1px);
        }
        
        &.is-checked {
            background-color: var(--el-color-primary-light-9);
            border-color: var(--el-color-primary);
            color: var(--el-color-primary);
        }
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

.custom-tag {
    border-radius: 4px;
    border: 1px solid var(--answer-stats-color);
    padding: 2px 8px;
    color: var(--answer-stats-color);
    font-size: 12px;
    background-color: rgba(var(--el-color-info-rgb), 0.1);
    transition: all 0.3s;
}

.placeholder-tag {
    height: 21px;
    display: inline-block;
}

/* 修改API密钥卡片样式 */
.api-key-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    animation: fadeIn 0.5s ease-out;
}

.api-key-card {
    border-radius: 12px;
    padding: 16px;
    border: none;
    background-color: var(--standard-page-bg-color);
    box-shadow: 0 2px 12px 0 var(--page-mcp-content-shadow);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    margin-bottom: 16px;
    position: relative;
    overflow: hidden;
    
    &:hover {
        transform: translateY(-5px);
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
        height: 60px;

        .left-section {
            display: flex;
            gap: 12px;

            .platform-logo {
                width: 24px;
                height: 24px;
                border-radius: 6px;
                display: flex;
                justify-content: center;
                background-color: var(--page-mcp-sidebar-bg);
                padding: 4px;
                transition: all 0.3s;

                img,
                svg {
                    width: 24px;
                    height: 24px;
                }
            }

            .platform-info {
                .platform-name {
                    font-weight: 600;
                    color: var(--page-mcp-header-text);
                    margin-bottom: 4px;
                    font-size: 16px;
                }

                .platform-tags {
                    display: flex;
                    gap: 6px;
                }
            }
        }

        .right-section {
            width: 70px;
            border-radius: 8px;
            padding: 4px;
            font-size: 12px;
            border: 1px solid var(--page-mcp-sidebar-border);
            text-align: center;

            p {
                margin: 4px;
                color: var(--answer-stats-color);
            }

            .api-key-btn,
            .model-add-btn {
                width: 100%;
                background: var(--page-mcp-sidebar-bg);
                border: 0;
                color: var(--page-mcp-text-color);
                padding: 4px 12px;
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
        border-radius: 8px;
        overflow: hidden;
        font-size: 12px;
        background-color: var(--page-mcp-sidebar-bg);
        margin-top: 8px;
        
        /* 移除隐藏非展开卡片的CSS，默认显示内容头部 */
        display: block;

        .content-header {
            padding: 4px 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            transition: background-color 0.3s;
            height: 30px;
            
            &:hover {
                background-color: rgba(var(--el-color-primary-rgb), 0.05);
            }

            .left-section {
                display: flex;
                align-items: center;

                .collapse-icon {
                    cursor: pointer;
                    margin-right: 10px;
                    color: var(--page-mcp-text-color);
                }

                .header-title {
                    font-weight: 500;
                    color: var(--page-mcp-header-text);
                }
            }

            .right-section {
                width: 80px;
                border-radius: 6px;
                padding: 2px 4px;
                font-size: 12px;

                .model-add-btn {
                    width: 80px;
                    background: var(--standard-page-bg-color);
                    border: 0;
                    color: var(--page-mcp-text-color);
                    padding: 4px 8px;
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
            background: var(--page-mcp-sidebar-border);
            opacity: 0.5;
        }

        .model-list {
            padding: 4px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            display: none; /* 默认隐藏模型列表 */

            &.expanded {
                display: flex; /* 展开时显示 */
                animation: expandContent 0.3s ease-out;
            }

            .model-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-radius: 8px;
                background: var(--standard-page-bg-color);
                transition: all 0.3s;

                .model-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;

                    .model-avatar {
                        width: 24px;
                        height: 24px;
                        display: flex;
                        justify-content: center;
                        padding: 4px;
                        border-radius: 6px;

                        img,
                        svg {
                            width: 24px;
                            height: 24px;
                        }
                    }

                    .model-version {
                        color: var(--page-mcp-text-color);
                        font-weight: 500;
                    }
                }

                .delete-icon {
                    margin-right: 5px;
                    cursor: pointer;
                    color: var(--el-color-danger);
                    opacity: 0.7;
                    transition: all 0.2s;
                    padding: 6px;
                    border-radius: 50%;
                    
                    &:hover {
                        opacity: 1;
                        background-color: rgba(var(--el-color-danger-rgb), 0.1);
                    }
                }
            }
        }
        
        /* 展开时显示模型列表 */
        &.expanded {
            .model-list {
                display: flex;
            }
        }
    }
}

@keyframes expandContent {
    from {
        opacity: 0;
        max-height: 0;
    }
    to {
        opacity: 1;
        max-height: 1000px;
    }
}

.avatar-uploader {
    position: relative;
    width: 200px;
    border-radius: 8px;
    cursor: pointer;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    border: 2px dashed var(--page-mcp-sidebar-border);
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

.avatar-uploader:hover {
    border-color: var(--el-color-primary);
    transform: translateY(-5px);
}

.avatar-uploader-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 28px;
    color: var(--page-mcp-text-color);
    z-index: 2;
    /* 确保图标在遮罩层上方 */
}

.preview-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

/* 表单元素样式优化 */
:deep(.el-form) {
    .el-input, .el-input-number, .el-select, .el-textarea {
        .el-input__wrapper {
            background-color: var(--page-mcp-sidebar-bg);
            box-shadow: none;
            border: 1px solid var(--page-mcp-sidebar-border);
            border-radius: 8px;
            transition: all 0.3s;
            
            &:hover, &.is-focus {
                border-color: var(--el-color-primary);
                box-shadow: 0 0 0 1px var(--el-color-primary-light-8);
            }
        }
    }

    .el-radio {
        height: 32px;
        padding: 0 12px;
        border-radius: 6px;
        transition: all 0.3s;
        
        &.is-checked {
            background-color: var(--el-color-primary-light-9);
            
            .el-radio__label {
                color: var(--el-color-primary);
            }
        }
    }

    .el-switch {
        --el-switch-off-color: var(--page-mcp-sidebar-border);
    }
}

/* 按钮样式优化 */
:deep(.el-button) {
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s;
    
    &:not(.is-text) {
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        
        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
    }
    
    &.is-text {
        &:hover {
            background-color: var(--page-mcp-sidebar-bg);
        }
    }
    
    &.el-button--primary {
        &:hover {
            background-color: var(--el-color-primary-light-3);
        }
    }
    
    &.el-button--warning {
        &:hover {
            background-color: var(--el-color-warning-light-3);
        }
    }
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
    .setting-container {
        flex-direction: column;
    }

    .setting-sidebar {
        margin: 10px;
        max-height: 200px;
        border-radius: 8px;
    }

    .setting-content {
        margin: 10px;
        padding: 20px;
    }

    .menu-item {
        margin: 2px 4px;
        padding: 12px 16px;
    }

    .config-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
    }

    .api-key-cards {
        grid-template-columns: 1fr;
    }
    
    .preset-bg-container {
        justify-content: center;
    }
}

/* 分段选择器样式优化 */
:deep(.el-segmented) {
    background-color: var(--page-mcp-sidebar-bg);
    border: 1px solid var(--page-mcp-sidebar-border);
    border-radius: 8px;
    
    .el-segmented__item {
        color: var(--page-mcp-text-color);
        
        &.is-selected {
            background-color: var(--el-color-primary);
            color: white;
        }
    }
}
</style>