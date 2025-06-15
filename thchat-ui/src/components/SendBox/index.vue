<template>
    <el-row :gutter="24" justify="center" style="margin-left: 0;margin-right: 0;">
        <el-col :md="18">
            <div class="search-container">
                <!--    输入框    -->
                <el-input placeholder="请输入你的问题或需求，按'↑'可快捷复制问题" v-model="query" :autosize="{ minRows: 2, maxRows: 8 }"
                    resize="none" @keydown.enter="onEnterKeyDown" @keydown.up="onEnterKeyUp" type="textarea"
                    :class="{ 'has-files': uploadedFiles.length > 0 }">
                </el-input>

                <div class="left-icons" v-if="uploadedFiles.length === 0">
                    <!-- 上传图标 -->
                    <el-upload action="" :show-file-list="false" :auto-upload="false" accept="image/*" :multiple="false"
                        :on-change="handleImageUpload" :limit="upload_limit"
                        :disabled="uploadedFiles.length >= upload_limit">
                        <SvgIcon icon-class="upload" style="width: 20px; height: 20px;" />
                    </el-upload>
                    <!-- 知识库图标 -->
                    <div class="web-search-icon-wrapper" :class="{ 'selected': knowledgeEnabled }"
                        @click="knowledgeEnabled = !knowledgeEnabled">
                        <SvgIcon icon-class="knowledge" style="width: 20px; height: 20px;" />
                        <span v-if="knowledgeEnabled" class="search-text rag">{{ selectedRepo?.name }}</span>
                    </div>
                    <!-- 联网图标 -->
                    <div class="web-search-icon-wrapper" :class="{ 'selected': webSearchEnabled }"
                        @click="webSearchEnabled = !webSearchEnabled">
                        <SvgIcon icon-class="web-search" style="width: 20px; height: 20px;" />
                        <span v-if="webSearchEnabled" class="search-text">联网搜索</span>
                    </div>
                </div>

                <div class="right-icons">
                    <!--    发送ICON    -->
                    <el-button type="primary" @click="onSubmitChat" v-if="controller === undefined"
                        class="right-send-stop-button">
                        <SvgIcon icon-class="send" style="width: 16px; height: 16px;" />
                    </el-button>
                    <!--    停止发送ICON    -->
                    <el-button type="danger" @click="stopChat" v-if="controller !== undefined"
                        class="right-send-stop-button">
                        <SvgIcon icon-class="stop" style="width: 16px; height: 16px;" />
                    </el-button>
                </div>

                <!-- 文件预览容器 -->
                <div class="file-preview-container" v-if="uploadedFiles.length > 0">
                    <div class="file-preview-item" v-for="(file, index) in uploadedFiles" :key="index">
                        <img :src="file.base64" alt="uploaded file" />
                        <div class="delete-icon" @click="removeFile(index)">
                            <SvgIcon icon-class="delete" style="width: 16px; height: 16px;" />
                        </div>
                    </div>
                </div>
            </div>
        </el-col>
    </el-row>
</template>

<script>
import tabStoreHelper from "@/schema/tabStoreHelper";
import chatStoreHelper from "@/schema/chatStoreHelper";
import { QA, Session } from "@/schema/chat";
import { Segment, useDefault } from 'segmentit';
import { TavilySearch } from "@langchain/tavily";
import eventBus from '@/eventBus';

const segmentit = useDefault(new Segment());

export default {
    name: 'SendBox',
    data() {
        return {
            // 输入框内容
            query: "",
            // 聊天控制
            controller: undefined,
            // 存储上传的多个文件
            uploadedFiles: []
        }
    },
    mounted() {
        // 添加粘贴事件监听
        document.addEventListener('paste', this.handlePaste);
        // 先移除再注册，防止重复
        eventBus.off('regenerate', this.handleRegenerate);
        eventBus.on('regenerate', this.handleRegenerate);
    },
    beforeDestroy() {
        // 移除粘贴事件监听
        document.removeEventListener('paste', this.handlePaste);
        // 移除eventBus监听
        eventBus.off('regenerate', this.handleRegenerate);
    },
    computed: {
        // 当前激活的聊天选项卡uuid
        active: {
            get() {
                return this.$store.state.app.active;
            },
            set(val) {
                this.$store.dispatch('setActive', val);
            }
        },
        // 获取所有聊天内容
        chat() {
            return this.$store.state.app.chat;
        },
        // 激活会话的QA对
        active_session_qa_data() {
            const activeSession = this.chat.findSession(this.active);
            return activeSession?.data || [];
        },
        // 平台标识
        platform() {
            return this.$store.state.setting.platform;
        },
        // 模型配置
        model_config() {
            return this.$store.state.setting.model_config;
        },
        // 单次上传的文件数量
        upload_limit() {
            return this.$store.state.setting.upload_limit;
        },
        // 限制文件大小
        upload_size() {
            return this.$store.state.setting.upload_size;
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
        // 联网搜索启用状态
        webSearchEnabled: {
            get() {
                return this.$store.state.setting.web_search_enabled;
            },
            set(val) {
                this.$store.dispatch('changeSetting', {
                    key: 'web_search_enabled',
                    value: val
                }
                )
            }
        },
        // 是否使用TavilySearch
        isTavilySearch() {
            return this.$store.state.setting.is_tavily_search
        },
        // TavilySearch Key
        tavilySearchKey() {
            return this.$store.state.setting.tavily_search_key
        },
        // 选中的知识库
        selectedRepo() {
            const repoList = this.$store.state.app.kb.list || [];
            const selectedId = this.$store.state.setting.selected_repoId;
            const selectedRepo = repoList.find(repo => repo.repoId === selectedId);
            return selectedRepo;
        }
    },
    methods: {
        /**
         * 控制Shift+Enter不触发发送请求事件
         * @param {KeyboardEvent} e - 键盘事件对象
         */
        onEnterKeyDown(e) {
            // 检查是否是Enter键
            if (e.key === 'Enter') {
                // 当没有按下Shift键时执行发送
                if (!e.shiftKey) {
                    e.preventDefault(); // 阻止默认行为，比如表单提交
                    // 在这里调用发送消息的方法
                    this.onSubmitChat();
                }
            }
        },

        /**
         * 控制按下 上键 自动填入最近一条问题
         */
        onEnterKeyUp() {
            if (this.query === '') {
                if (this.active_session_qa_data.length > 0) {
                    this.query = this.active_session_qa_data[this.active_session_qa_data.length - 1].query;
                }
            }
        },

        /**
         * 中断聊天请求 但是其实后端模型还在回答
         */
        stopChat() {
            if (this.controller) {
                this.controller.abort();
                this.controller = undefined;
            }
        },

        /**
         * 动态导入不同平台的远程接口规范
         */
        async getDynamicCall() {
            try {
                const apiModule = await import(`@/api/${this.platform}`);
                return [apiModule.fetchAPI, apiModule.postProcess];
            } catch (error) {
                console.error(`加载平台 ${this.platform} 的API模块失败:`, error);
                return [null, null];
            }
        },

        /**
         * 提交聊天请求并处理响应
         */
        async onSubmitChat(queryParam, filesParam, qaIdParam) {
            // 如果是点击事件对象，重置为 undefined
            if (queryParam && queryParam instanceof Event) {
                queryParam = undefined;
            }

            let query, qaId, files;
            if (queryParam !== undefined) {
                query = queryParam;
                qaId = qaIdParam || Date.now();
                files = filesParam ? JSON.parse(JSON.stringify(filesParam)) : [];
            } else {
                this.query = this.query.trim();
                if (this.query === '') {
                    return;
                }
                query = this.query;
                qaId = Date.now();
                files = JSON.parse(JSON.stringify(this.uploadedFiles));
                // 重置输入
                this.query = '';
                this.uploadedFiles = [];
            }

            let qa = new QA(qaId, query, "", files, undefined, undefined, this.model_config.series, this.model_config.version, this.model_config.type);

            // active为空表示现在是新建会话，否则表示是已有会话
            if (this.active === '') {
                // 生成一个新Tab并缓存
                tabStoreHelper.add(query, qaId);
                // 生成一个新聊天记录并缓存
                let session = new Session(qaId, [qa]);
                chatStoreHelper.addSession(session);
                // 激活当前聊天
                this.active = qaId;
            } else {
                // 更新聊天记录
                chatStoreHelper.addQA(this.active, qa);
            }

            /**
             * 此处控制是否传入会话历史
             */
            let history = [];
            if (this.$store.state.setting.memory) {
                let endIndex = this.active_session_qa_data.length - 1;
                let n = this.$store.state.setting.memory_limit;
                // 只保留最近memory_limit条有效对话
                history = this.active_session_qa_data
                    .slice(Math.max(endIndex - n, 0), Math.max(endIndex, 0))
                    .filter(item => item.answer && item.answer.trim());
            }

            let prompt = "";

            /**
             * 此处控制TavilySearch联网搜索
             * 注意不是模型内置联网搜索
             */
            if (this.webSearchEnabled && this.isTavilySearch) {
                try {
                    const tool = new TavilySearch({
                        maxResults: 10,
                        topic: "general",
                        tavilyApiKey: this.tavilySearchKey
                    });
                    const searchResult = await tool.invoke({
                        query: query
                    });

                    qa.webSearchResults = searchResult.results;
                    // 更新聊天记录
                    chatStoreHelper.addQA(this.active, qa);
                    console.log('搜索结果:', searchResult);
                    prompt = `以下是搜索结果:\n${searchResult.results.map(result => `标题: ${result.title}\n内容: ${result.content}`).join('\n\n')}\n\n`;
                } catch (error) {
                    console.error('联网搜索错误:', error);
                    this.$notify({
                        title: '联网搜索失败',
                        message: '搜索过程中发生错误 请确保搜索key正确或网络可达',
                        type: 'error'
                    });
                    return;
                }
            }

            /**
             * 此处控制知识库召回
             */
            if (this.knowledgeEnabled && this.selectedRepo) {
                // 在知识库中匹配相关内容
                const matches = this.matchKnowledgeBase(query);
                // 将匹配内容加入到 prompt
                if (matches.length > 0) {
                    prompt += `以下是知识库召回内容:\n${matches.map(chunk => chunk.content).join('\n')}\n\n`;
                    qa.recall = matches;
                    // 更新聊天记录
                    chatStoreHelper.addQA(this.active, qa);
                }
            }

            query = prompt + query;

            let [fetchAPI, postProcess] = await this.getDynamicCall();

            try {
                this.controller = new AbortController();
                fetchAPI({
                    prompt: query,
                    history: history,
                    files: files,
                    controller: this.controller,
                    onopen: (event) => {
                        // SSE的500错误需要在onopen中检测 https://github.com/Azure/fetch-event-source/issues/70
                        console.log('连接成功')
                        if (event !== undefined && event.status === 401) {
                            this.$notify({
                                title: '远程调用失败!',
                                message: '请检查API KEY是否填写或过期',
                                type: 'error',
                            });
                        }
                        if (event !== undefined && (event.status === 500 || event.status === 404)) {
                            this.$notify({
                                title: '无法连接本地接口!',
                                message: '请检测网络或接口是否开启',
                                type: 'error',
                            });
                        } else if (event !== undefined && event.status === 422) {
                            this.$notify({
                                title: '本地接口错误!',
                                message: '请检测接口是否正常',
                                type: 'error',
                            })
                        }
                        qa.responseTime = new Date().getTime();
                        // 更新聊天记录
                        chatStoreHelper.addQA(this.active, qa);
                    },
                    onmessage: (event) => {
                        console.log("消息传输")
                        // 过滤接口内部错误消息
                        if (event.event === 'error') {
                            this.$notify({
                                title: '本地接口错误!',
                                message: '请检测接口内部是否发生错误或异常',
                                type: 'error',
                            });
                            qa.finishTime = new Date().getTime();
                            this.stopChat()
                            return;
                        }

                        if (event !== undefined && event.error && event.error.code === '1301') { // 智谱平台错误返回
                            this.$notify({
                                title: "失败",
                                message: event.error.message,
                                type: 'error',
                            })
                            return;
                        }

                        // 批量更新优化
                        try {
                            const res = postProcess(event);
                            if (res && res.content) {
                                qa.answer = (qa.answer || '') + res.content;
                                chatStoreHelper.addQA(this.active, qa);
                            } else if (res && res.reasoning_content) {
                                qa.reason = (qa.reason || '') + res.reasoning_content;
                                chatStoreHelper.addQA(this.active, qa);
                            }
                        } catch (e) {
                            console.error("解析响应错误:", e, event);
                        }
                    },
                    onclose: () => {
                        console.log("连接关闭")
                        qa.finishTime = new Date().getTime();
                        this.stopChat()
                        // 更新聊天记录
                        chatStoreHelper.addQA(this.active, qa);
                    },
                    onerror: (error) => {
                        this.stopChat()
                        this.$message.error('系统错误：' + error)
                        throw new Error('系统错误：' + error)
                    }
                });
            } catch (e) {
                console.error(e);
            }
        },

        /**
         * 处理图片文件,验证大小和类型限制
         * @param {File} file - 要处理的图片文件
         */
        processImage(file) {
            if (this.uploadedFiles.length >= this.upload_limit) {
                this.$notify({
                    title: '上传失败',
                    message: '最多只能上传' + this.upload_limit + '个文件!',
                    type: 'error'
                });
                return false;
            }

            const isImage = file.type.startsWith(this.$store.state.setting.upload_type);
            const isLt2M = file.size / 1024 / 1024 <= this.upload_size;

            if (!isImage) {
                this.$notify({
                    title: '上传失败',
                    message: '只能上传图片文件!',
                    type: 'error'
                });
                return false;
            }
            if (!isLt2M) {
                this.$notify({
                    title: '上传失败',
                    message: '图片大小不能超过 ' + this.upload_size + 'MB!',
                    type: 'error'
                });
                return false;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.uploadedFiles.push({
                    base64: reader.result,
                    file: file
                });
            };
            return true;
        },

        /**
         * 处理图片上传
         * @param {Object} file - 上传的文件对象
         */
        handleImageUpload(file) {
            this.processImage(file.raw);
        },

        /**
         * 处理粘贴事件,支持粘贴图片
         * @param {ClipboardEvent} event - 剪贴板事件对象
         */
        handlePaste(event) {
            const items = (event.clipboardData || event.originalEvent.clipboardData).items;
            for (const item of items) {
                if (item.type.indexOf('image') !== -1) {
                    const file = item.getAsFile();
                    this.processImage(file);
                    break;
                }
            }
        },

        /**
         * 移除已上传的文件
         * @param {number} index - 要移除文件的索引
         */
        removeFile(index) {
            this.uploadedFiles.splice(index, 1);
        },

        /**
         * 计算文本相关性分数 - 使用BM25算法 这里只是简化的算法
         * 生产上 数据一般会存在ElasticSearch中 不需要在前端计算
         * @param {string} query - 用户输入的问题
         * @param {Array} words - 文本块分词后的词数组
         * @returns {number} 相关性分数
         */
        calculateRelevanceScore(query, words) {
            // BM25参数
            const k1 = 1.5;  // 词频饱和参数
            const b = 0.75;  // 文档长度归一化参数

            // 将查询文本分词
            const queryWords = segmentit.doSegment(query.toLowerCase()).map(word => word.w);

            // 计算平均文档长度(这里简化处理,实际应该是所有文档的平均长度)
            const avgDocLength = words.length;

            // 计算BM25分数
            let score = 0;
            const wordFreq = new Map(); // 词频统计

            // 统计词频
            words.forEach(word => {
                wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
            });

            // 对每个查询词计算得分
            queryWords.forEach(qWord => {
                // 文档中该词的频率
                const tf = wordFreq.get(qWord) || 0;
                if (tf === 0) return;

                // 简化的IDF计算(实际应该基于语料库统计)
                const idf = Math.log(1.5);

                // BM25公式
                const numerator = tf * (k1 + 1);
                const denominator = tf + k1 * (1 - b + b * (words.length / avgDocLength));

                score += idf * (numerator / denominator);
            });

            // 归一化分数到0-1范围
            return Math.min(score, 1);
        },

        /**
         * 在知识库中匹配相关内容
         * @param {string} query - 用户输入的问题
         */
        matchKnowledgeBase(query) {
            if (!this.selectedRepo) return [];

            const allChunks = [];
            this.selectedRepo.list.forEach(file => {
                file.list.forEach(chunk => {
                    allChunks.push({
                        content: chunk.content,
                        score: this.calculateRelevanceScore(query, chunk.words),
                        filename: file.name
                    });
                });
            });

            // 按BM25分数排序
            allChunks.sort((a, b) => b.score - a.score);

            // 返回分数最高的recall_count个文本块,且分数需大于阈值
            return allChunks
                .slice(0, this.$store.state.setting.recall_count)
                .filter(chunk => chunk.score > 0.6);
        },

        /**
         * 处理重新生成事件
         */
        handleRegenerate(qa) {
            // 重新生成时，直接用qa对象的query和qaId重新发起请求
            this.onSubmitChat(qa.query, qa.files, qa.qaId);
        }
    }
}
</script>

<style lang="scss" scoped>
/**
 * 变量定义
 */
$icon-length: 32px;

/**
 * 通用的hover效果定义
 */
@mixin hover-effect {
    &.active,
    &:hover {
        background: var(--aside-active-hover-bg);
        border-radius: 4px;
    }
}

/**
 * 发送框容器
 */
.search-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    min-height: 80px;
}

/**
 * 左侧icons
 */
.left-icons {
    position: absolute;
    left: 6px;
    bottom: 0;
    display: flex;
    gap: 8px;
    z-index: 88;

    svg {
        padding: 2px;
        cursor: pointer;
        color: var(--common-color);
        opacity: 0.6;
        transition: opacity 0.2s;

        &:hover {
            opacity: 1;
        }

        @include hover-effect;
    }

    .web-search-icon-wrapper {
        height: 24px;
        display: flex;
        align-items: center;
        gap: 4px;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
        min-width: 24px; // 设置最小宽度
        overflow: hidden; // 隐藏溢出内容

        svg {
            flex-shrink: 0; // 防止 svg 被压缩
        }

        .search-text {
            font-size: 12px;
            color: var(--el-color-primary);
            white-space: nowrap;
            opacity: 0;
            max-width: 0;
            transition: all 0.3s ease;
        }

        &.selected {
            svg {
                color: rgb(2 133 255);
                opacity: 1;
                pointer-events: none;

                &.rag {
                    color: var(--el-color-danger);
                }
            }

            background-color: var(--el-color-primary-light-9);
            padding: 0 8px 0 0;
        }

        .search-text {
            opacity: 1;
            max-width: 100px;
            font-size: 12px;
            font-weight: bold;
            color: rgb(2 133 255);

            &.rag {
                color: var(--el-color-danger);
            }
        }
    }
}

/**
 * 右侧icons
 */
.right-icons {
    position: absolute;
    bottom: 4px;
    right: 2px;
    z-index: 88;

    .right-send-stop-button {
        height: $icon-length;
        width: $icon-length;
        border-radius: 10px;
    }
}

/**
 * elementui输入框
 */
:deep(.el-textarea) {
    z-index: 2;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    border-radius: 10px;
    border: 2px solid var(--common-color);
    background: var(--sendBox-bg-color);
    padding-bottom: $icon-length;
    transition: padding-bottom 0.2s ease;

    &.has-files {
        padding-bottom: $icon-length * 2;
    }
}

:deep(.el-textarea__inner) {
    max-height: 200px;
    font-size: 14px;
    color: var(--common-color);
    background: var(--sendBox-bg-color);
    padding: 6px 32px 0 6px;
    border-radius: 10px;
    box-shadow: 0 0;
    font-weight: 100;
    height: calc(100% - $icon-length);
    scrollbar-width: none;

    &::placeholder {
        color: var(--common-color);
        opacity: 0.2;
    }
}

:deep(.el-textarea__inner)::-webkit-scrollbar {
    display: none;
}

/**
 * 文件预览容器样式
 */
.file-preview-container {
    z-index: 3;
    position: absolute;
    left: 3px;
    top: -20px;
    display: flex;
    gap: 8px;
    max-width: 100%;
    height: 50px;
    overflow-x: auto;
    padding: 4px;

    .file-preview-item {
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        border: 1px solid var(--app-small-border-color);
        width: 50px;

        img {
            width: 300%;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            object-fit: cover;
            object-position: center;
        }

        .delete-icon {
            position: absolute;
            top: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 10%;
            padding: 0;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.3s ease;

            svg {
                color: white;
            }

            &:hover {
                background: rgba(0, 0, 0, 0.7);
            }
        }
    }
}
</style>
