<template>
    <div class="kb-container standard-page-container">
        <div class="kb-header standard-page-header">
            <h4>知识库</h4>
            <div class="kb-stats standard-page-stats">
                <span>总文件数: {{ totalFiles }}</span>
                <span>总分段数: {{ totalChunks }}</span>
            </div>
        </div>

        <!-- 知识库列表 -->
        <el-row :gutter="24" justify="center" style="margin-left: 0;margin-right: 0;">
            <el-col :md="24" :sm="24" :xs="24">
                <!-- 知识库卡片列表 -->
                <el-row :gutter="24">
                    <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
                        <div class="kb-card create-kb-card" @click="createRepoDialogVisible = true">
                            <div class="create-kb-content">
                                <el-icon :size="40">
                                    <Plus />
                                </el-icon>
                                <span class="create-text">创建知识库</span>
                            </div>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6" v-for="repo in repos" :key="repo.repoId">
                        <div class="kb-card">
                            <div class="kb-card-header">
                                <div class="kb-card-title-row">
                                    <span class="kb-card-title">{{ repo.name }}</span>
                                    <div class="kb-card-actions">
                                        <el-tooltip content="管理" placement="top">
                                            <SvgIcon icon-class="settings" style="width: 16px; height: 16px;"
                                                @click="openRepo(repo)" class="action-icon settings" />
                                        </el-tooltip>

                                        <el-tooltip content="删除" placement="top">
                                            <SvgIcon icon-class="trash" style="width: 16px; height: 16px;"
                                                @click="deleteRepo(repo.repoId)" class="action-icon delete" />
                                        </el-tooltip>
                                    </div>
                                </div>
                            </div>
                            <p class="kb-card-description">{{ repo.description }}</p>
                            <div class="kb-card-footer">
                                <span class="create-time">创建时间: {{ repo.createTime }}</span>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>

        <!-- 自定义弹窗 -->
        <CustomDialog v-model="createRepoDialogVisible" title="知识库详情">
            <el-form :model="newKbForm" label-width="100px" :rules="rules" ref="newKbForm">
                <el-form-item label="知识库名称" prop="name">
                    <el-input v-model="newKbForm.name" maxlength="10" show-word-limit />
                </el-form-item>
                <el-form-item label="知识库描述" prop="description">
                    <el-input type="textarea" v-model="newKbForm.description" />
                </el-form-item>
            </el-form>
            <div style="text-align: right; margin-top: 20px;">
                <el-button type="primary" @click="createRepo">确定</el-button>
                <el-button @click="createRepoDialogVisible = false">取消</el-button>
            </div>
        </CustomDialog>

        <!-- 知识库的文件列表弹窗 -->
        <CustomDialog v-model="repoDialogVisible" :title="`${activeRepo?.name || ''} - 文件列表`">
            <div class="file-container">
                <!-- 文件展示部分 -->
                <div class="file-card" v-for="x in files">
                    <img src="@/assets/images/file.svg" alt="File Icon" class="file-icon" />
                    <div class="file-details">
                        <div class="file-title">
                            {{ x.name }}
                            <el-button type="text" @click="toggleChunks(x)">
                                {{ x.showChunks ? '收起分段' : '查看分段' }}
                            </el-button>
                            <button class="delete-btn" @click="delFile(x.fileId)">&#x2715;</button>
                        </div>
                        <div class="file-info">
                            <span class="upload-time">上传时间: {{ x.createTime }}</span>
                            <span class="file-size">文件大小: {{ formatFileSize(x.size) }}</span>
                        </div>
                        <!-- chunks预览部分 -->
                        <div v-if="x.showChunks" class="chunks-preview">
                            <div class="chunks-grid">
                                <div v-for="(chunk, index) in x.list" :key="index" class="chunk-square"
                                    @click="toggleChunkContent(x.fileId, index)"
                                    :class="{ 'expanded': isChunkExpanded(x.fileId, index) }">
                                    <div class="chunk-square-content">
                                        <template v-if="!isChunkExpanded(x.fileId, index)">
                                            <div class="chunk-number">{{ index + 1 }}</div>
                                        </template>
                                        <template v-else>
                                            <div class="chunk-expanded-header">
                                                <span>分段 {{ index + 1 }}</span>
                                                <span class="chunk-length">{{ chunk.content.length }} 字符</span>
                                            </div>
                                            <div class="chunk-expanded-content">
                                                <el-scrollbar height="200px">
                                                    {{ chunk.content }}
                                                </el-scrollbar>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 文件上传部分 -->
                <div class="upload-card">
                    <el-upload class="upload-button" drag :auto-upload="true" :http-request="handleLocalUpload" multiple
                        :before-upload="beforeUpload" :show-file-list="false" accept=".pdf,.doc,.docx,.txt">
                        <template v-if="!isUploading">
                            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                            <div class="el-upload__text">
                                将文件拖拽至此处 或 点击上传
                            </div>
                        </template>
                        <template v-else>
                            <el-progress type="circle" :percentage="uploadProgress"
                                :status="uploadProgress === 100 ? 'success' : ''" />
                            <div class="upload-progress-text">{{ uploadStatusText }}</div>
                        </template>
                        <template #tip>
                            <div class="el-upload__tip">
                                目前仅支持5MB以内的PDF/DOC/DOCX/TXT文件上传，请确保文件格式正确
                            </div>
                        </template>
                    </el-upload>
                </div>
            </div>
        </CustomDialog>

    </div>
</template>

<script>
import { Repository, File, Chunk } from '@/schema/kb';
import kbStoreHelper from '@/schema/kbStoreHelper';
import { Segment, useDefault } from 'segmentit';

const segmentit = useDefault(new Segment());

export default {
    name: "Kb",
    data() {
        return {
            // 当前选中的知识库
            activeRepo: null,
            // 创建知识库弹窗是否显示
            createRepoDialogVisible: false,
            // 创建知识库表单
            newKbForm: {
                // 知识库名称
                name: '',
                // 知识库描述
                description: ''
            },
            // 创建知识库表单校验规则
            rules: {
                name: [
                    { required: true, message: "请输入知识库名称", trigger: 'blur' }
                ],
                description: [
                    { required: true, message: "请输入知识库描述", trigger: 'blur' }
                ]
            },
            // 知识库详情弹窗是否显示
            repoDialogVisible: false,
            uploadProgress: 0, // 上传进度状态
            isUploading: false, // 上传状态标志
            uploadStatusText: '',
            progressTimer: null, // 计时器变量
            fileChunksVisibility: {}, // 用于存储每个文件的 chunks 显示状态
            expandedChunks: {}, // 存储展开状态的chunks
        }
    },
    computed: {
        // 所有知识库列表
        repos() {
            return this.$store.state.app.kb.list;
        },
        // 当前选中知识库的文件列表,如果没有选中知识库则返回空数组
        files() {
            return this.activeRepo?.list || [];
        },
        // chunkSize
        chunkSize() {
            return this.$store.state.setting.chunk_size;
        },
        // 总文件数
        totalFiles() {
            return this.$store.state.app.kb.statistics.totalFiles;
        },
        // 总分段数
        totalChunks() {
            return this.$store.state.app.kb.statistics.totalChunks;
        }
    },
    created() {

    },
    methods: {
        /**
         * 创建知识库
         */
        createRepo() {
            this.$refs.newKbForm.validate((valid) => {
                if (valid) {
                    const newRepo = new Repository(
                        Date.now(),
                        this.newKbForm.name,
                        new Date().toLocaleString(),
                        this.newKbForm.description,
                        []
                    );
                    kbStoreHelper.addRepo(newRepo);
                    this.createRepoDialogVisible = false;
                    this.newKbForm = { name: '', description: '' };
                    this.$refs.newKbForm.resetFields();
                }
            });
        },

        /**
         * 打开知识库详情页面弹窗
         * @param {Repository} repo 要打开的知识库对象
         */
        openRepo(repo) {
            this.activeRepo = repo;
            this.repoDialogVisible = true;
        },

        /**
         * 删除知识库
         * @param {Number} repoId 要删除的知识库ID
         */
        deleteRepo(repoId) {
            this.$confirm("确认要删除吗？", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: 'warning'
            }).then(() => {
                kbStoreHelper.delRepo(repoId);
                this.$notify({
                    title: "成功",
                    message: "删除成功",
                    type: 'success'
                });
            }).catch(() => { });
        },

        /**
         * 上传文件前校验文件大小
         * @param {File} file 待上传的文件对象
         * @returns {boolean} 是否允许上传
         */
        beforeUpload(file) {
            const maxSize = this.$store.state.setting.kb_file_size * 1024 * 1024;
            if (file.size > maxSize) {
                this.$notify({
                    title: "错误",
                    message: "失败",
                    type: 'error'
                });
                return false; // 阻止上传
            }
            return true; // 允许上传
        },

        /**
         * 处理本地文件上传
         * @param {Object} options 上传选项对象
         */
        async handleLocalUpload(options) {
            const file = options.file;

            // 重置上传状态
            this.isUploading = true;
            this.uploadProgress = 0;
            this.uploadStatusText = '准备上传...';

            try {
                // 模拟文件读取进度，使用衰减增长
                const simulateProgress = setInterval(() => {
                    if (this.uploadProgress < 90) {
                        // 计算剩余进度空间
                        const remainingProgress = 90 - this.uploadProgress;
                        // 使用衰减因子，随着进度增加而减少增量
                        const increment = Math.max(1, Math.floor(remainingProgress * 0.2));
                        this.uploadProgress += increment;
                        this.uploadStatusText = '正在处理文件...';
                    }
                }, 1000);

                // 读取文件内容
                const content = await this.readFileContent(file);

                // 检查内容是否为空
                if (!content || content.trim() === '') {
                    this.$notify({
                        title: "警告",
                        message: "未识别到文件内容",
                        type: 'warning'
                    });
                    this.isUploading = false;
                    this.uploadProgress = 0;
                    this.uploadStatusText = '';
                    return;
                }

                // 将内容分割成chunks
                const chunks = this.splitContentIntoChunks(content, this.chunkSize);

                // 清除进度模拟
                clearInterval(simulateProgress);

                // 创建文件对象
                const fileData = new File(
                    Date.now(),
                    file.name,
                    new Date().toLocaleString(),
                    file.name.split('.').pop().toLowerCase(),
                    '',
                    file.size,
                    chunks.map(chunk => new Chunk(Date.now(), chunk, segmentit.doSegment(chunk.toLowerCase()).map(word => word.w))) // 添加chunks并分词
                );

                // 添加文件到知识库
                kbStoreHelper.addFile(this.activeRepo.repoId, fileData);

                // 完成上传
                this.uploadProgress = 100;
                this.uploadStatusText = '上传完成！';

                // 显示成功通知
                this.$notify({
                    title: "成功",
                    message: '上传完成！',
                    type: 'success'
                });

                // 重置状态
                setTimeout(() => {
                    this.isUploading = false;
                    this.uploadProgress = 0;
                    this.uploadStatusText = '';
                }, 1500);

            } catch (error) {
                console.error('文件上传失败:', error);
                this.uploadStatusText = '上传失败';

                this.$notify({
                    title: "错误",
                    message: "上传失败",
                    type: 'error'
                });

                // 重置状态
                setTimeout(() => {
                    this.isUploading = false;
                    this.uploadProgress = 0;
                    this.uploadStatusText = '';
                }, 1500);
            }
        },

        /**
         * 读取文件内容 分流处理
         * @param {File} file 文件对象
         */
        async readFileContent(file) {
            const fileType = file.name.split('.').pop().toLowerCase();

            switch (fileType) {
                case 'pdf':
                    return await this.readPdfContent(file);
                case 'doc':
                case 'docx':
                    return await this.readDocContent(file);
                case 'txt':
                    return await this.readTxtContent(file);
                default:
                    throw new Error('不支持的文件格式');
            }
        },

        /**
         * 读取txt文本文件内容
         * @param {File} file 文件对象
         */
        readTxtContent(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = (e) => reject(e);
                reader.readAsText(file, 'UTF-8');
            });
        },

        /**
         * 读取pdf文件内容
         * @param {File} file 文件对象
         */
        async readPdfContent(file) {
            return new Promise((resolve, reject) => {
                const fileReader = new FileReader();

                fileReader.onload = async (event) => {
                    try {
                        const pdfData = new Uint8Array(event.target.result);
                        const pdf = await import('pdfjs-dist');
                        pdf.GlobalWorkerOptions.workerSrc = '/pdfjs-dist@5.2.133/pdf.worker.min.mjs';

                        const loadingTask = pdf.getDocument(pdfData);
                        const pdfDoc = await loadingTask.promise;

                        let fullText = '';
                        for (let i = 1; i <= pdfDoc.numPages; i++) {
                            const page = await pdfDoc.getPage(i);
                            const textContent = await page.getTextContent();
                            const pageText = textContent.items.map(item => item.str).join(' ');
                            fullText += pageText + '\n';
                        }

                        resolve(fullText);
                    } catch (error) {
                        reject(error);
                    }
                };
                fileReader.onerror = reject;
                fileReader.readAsArrayBuffer(file);
            });
        },

        /**
         * 读取doc/docx文件内容
         * @param {File} file 文件对象
         */
        async readDocContent(file) {
            const mammoth = await import('mammoth');
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer });
            return result.value;
        },

        /**
         * 删除文件
         * @param {string} fileId 文件ID
         */
        async delFile(fileId) {
            try {
                await this.$confirm(
                    "确认删除该文件?",
                    "警告",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: 'warning'
                    }
                );

                kbStoreHelper.delFile(this.activeRepo.repoId, fileId);

                this.$notify({
                    title: "成功",
                    message: '文件删除成功',
                    type: 'success'
                });
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('文件删除失败:', error);
                    this.$notify({
                        title: "错误",
                        message: '文件删除失败',
                        type: 'error'
                    });
                }
            }
        },

        /**
         * 格式化文件大小
         * @param {number} bytes 文件大小(字节)
         * @returns {string} 格式化后的文件大小
         */
        formatFileSize(bytes) {
            if (!bytes) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },

        // 添加新方法用于分割内容
        splitContentIntoChunks(content, chunkSize) {
            const chunks = [];
            let currentChunk = '';
            const sentences = content.split(/[。！？.!?]/); // 按句子分割

            for (const sentence of sentences) {
                if ((currentChunk + sentence).length > chunkSize) {
                    if (currentChunk) {
                        chunks.push(currentChunk.trim());
                    }
                    currentChunk = sentence;
                } else {
                    currentChunk += sentence;
                }
            }

            if (currentChunk) {
                chunks.push(currentChunk.trim());
            }

            return chunks;
        },

        /**
         * 切换显示/隐藏文件的chunks
         * @param {File} file 文件对象
         */
        toggleChunks(file) {
            file.showChunks = !file.showChunks;
        },

        /**
         * 切换chunk内容的显示状态
         * @param {string} fileId 文件ID
         * @param {number} index 分段索引
         */
        toggleChunkContent(fileId, index) {
            const key = `${fileId}-${index}`;
            this.expandedChunks[key] = !this.expandedChunks[key];
        },

        /**
         * 判断chunk是否展开
         * @param {string} fileId 文件ID
         * @param {number} chunkIndex chunk索引
         * @returns {boolean} 是否展开
         */
        isChunkExpanded(fileId, chunkIndex) {
            const key = `${fileId}-${chunkIndex}`;
            return this.expandedChunks[key];
        }
    },
};
</script>

<style lang="scss" scoped>
/**
 * 知识库容器
 */
.kb-container {
    display: flex;
    flex-direction: column;
    padding: 20px;
    animation: slideIn 0.3s ease-in-out;
}

/**
 * 表单Label颜色
 */
:deep(.el-form-item__label) {
    color: var(--common-color);
}

/**
 * 知识库卡片
 */
.kb-card {
    display: flex;
    flex-direction: column;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    height: 130px;
    justify-content: space-between;
    background-color: var(--standard-page-bg-color);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    position: relative;
    overflow: hidden;

    &:hover {
        transform: translateY(-5px);

        &::after {
            transform: scaleX(1);
        }
    }

    /* 卡片内部头部 */
    >.kb-card-header {
        margin-bottom: 15px;

        /* 卡片标题行,包含标题和操作按钮 */
        >.kb-card-title-row {
            display: flex;
            justify-content: space-between;
            align-items: center;

            >.kb-card-title {
                font-weight: 600;
                font-size: 18px;
                color: var(--page-mcp-header-text);
            }

            /* 卡片操作按钮容器 */
            >.kb-card-actions {
                display: flex;
                gap: 16px;

                .action-icon {
                    cursor: pointer;
                    padding: 8px;
                    opacity: 0.7;
                    transition: all 0.2s;
                    border-radius: 4px;

                    &:hover {
                        opacity: 1;
                        background-color: var(--page-mcp-server-hover-bg);
                        transform: scale(1.1);
                    }

                    &.delete:hover {
                        color: #F56C6C;
                    }
                }
            }
        }
    }

    /* 卡片描述文本 */
    .kb-card-description {
        font-size: 14px;
        line-height: 1.5;
        color: var(--page-mcp-text-color);
        margin-bottom: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    /* 卡片底部信息 */
    .kb-card-footer {
        font-size: 12px;
        color: var(--answer-stats-color);
        margin-top: auto;

        /* 创建时间 */
        >.create-time {
            font-style: italic;
            display: flex;
            align-items: center;
        }
    }
}

/**
 * 创建知识库卡片
 */
.create-kb-card {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed var(--page-mcp-sidebar-border);
    background: transparent !important;
    box-shadow: none !important;

    &:hover {
        border-color: var(--el-color-primary);
        background: transparent;
        transform: translateY(-5px);
    }

    >.create-kb-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: var(--page-mcp-text-color);
        opacity: 0.7;
        transition: all 0.3s;

        >.create-text {
            margin-top: 12px;
            font-size: 16px;
            font-weight: 500;
        }
    }
}

.file-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 5px;
    border-radius: 8px;
    margin: 5px 0;
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

/* 卡片样式 */
.file-card {
    display: flex;
    padding: 16px;
    border-radius: 8px;
    background-color: var(--page-mcp-sidebar-bg);
    box-shadow: 0 2px 8px 0 var(--page-mcp-sidebar-shadow);
    transition: all 0.3s ease;

    /* 文件图标样式 */
    >.file-icon {
        width: 40px;
        height: 40px;
        object-fit: cover;
        margin-right: 16px;
        border-radius: 5px;
    }

    /* 文件详情样式 */
    >.file-details {
        flex: 1;

        >.file-title {
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 16px;
            color: var(--page-mcp-header-text);
            font-size: 16px;

            .el-button {
                font-size: 14px;
                padding: 8px;
            }

            .delete-btn {
                background: none;
                border: none;
                color: #909399;
                cursor: pointer;
                font-size: 18px;
                padding: 6px;
                margin-left: auto;
                border-radius: 4px;
                transition: all 0.2s;

                &:hover {
                    color: #F56C6C;
                    background-color: rgba(245, 108, 108, 0.1);
                }
            }
        }

        >.file-info {
            display: flex;
            gap: 20px;
            color: var(--answer-stats-color);
            font-size: 12px;
            margin-bottom: 10px;

            .upload-time,
            .file-size {
                white-space: nowrap;
            }
        }
    }
}

.upload-card {
    padding: 24px;
    border-radius: 8px;
    background-color: var(--page-mcp-sidebar-bg);
    box-shadow: 0 2px 8px 0 var(--page-mcp-sidebar-shadow);
    transition: all 0.3s ease;
}

:deep(.el-upload-dragger) {
    width: 100%;
    height: 180px;
    padding: 20px;
    background: none;
    border: 2px dashed var(--page-mcp-sidebar-border);
    transition: all 0.3s;

    &:hover {
        border-color: var(--el-color-primary);
        transform: translateY(-5px);
    }

    .el-icon--upload {
        font-size: 48px;
        color: var(--el-color-primary);
        margin-bottom: 16px;
    }

    .el-upload__text {
        font-size: 16px;
        color: var(--page-mcp-text-color);
    }
}

.el-upload__tip {
    text-align: center;
    margin-top: 12px;
    color: var(--answer-stats-color);
}

.upload-progress-text {
    margin-top: 16px;
    color: var(--page-mcp-text-color);
    text-align: center;
    font-size: 14px;
}

:deep(.el-progress) {
    margin: 20px auto;
}

.chunks-preview {
    margin-top: 20px;

    .chunks-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
        gap: 12px;
    }

    .chunk-square {
        aspect-ratio: 1;
        border-radius: 8px;
        cursor: pointer;
        border: 1px solid var(--page-mcp-sidebar-border);
        background-color: var(--standard-page-bg-color);
        color: var(--page-mcp-text-color);
        position: relative;
        overflow: hidden;

        &:hover {
            border-color: var(--el-color-primary);
        }

        &.expanded {
            aspect-ratio: auto;
            grid-column: 1 / -1;
            height: auto;
            min-height: 250px;
            border-width: 2px;
            border-color: var(--el-color-primary);
        }

        .chunk-square-content {
            padding: 12px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
        }

        .chunk-number {
            text-align: center;
            font-size: 18px;
            font-weight: 600;
            color: var(--page-mcp-header-text);
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        .chunk-expanded-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid var(--page-mcp-sidebar-border);

            span:first-child {
                font-weight: 600;
                font-size: 16px;
                color: var(--page-mcp-header-text);
            }
        }

        .chunk-length {
            color: var(--answer-stats-color);
            font-size: 12px;
            padding: 4px 8px;
            background-color: rgba(var(--el-color-primary-rgb), 0.1);
            border-radius: 12px;
        }

        .chunk-expanded-content {
            flex: 1;
            line-height: 1.6;
            color: var(--page-mcp-text-color);
            white-space: pre-wrap;
            word-break: break-word;
            font-size: 14px;
        }
    }
}

/* 添加更多动画效果 */
@keyframes pulse {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.05);
    }

    100% {
        transform: scale(1);
    }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 添加响应式设计 */
@media screen and (max-width: 768px) {
    .kb-container {
        padding: 10px;
    }

    .kb-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;

        .kb-stats {
            width: 100%;
            justify-content: space-between;
        }
    }

    .kb-card {
        height: auto;
        min-height: 130px;
    }

    .file-card {
        flex-direction: column;

        .file-icon {
            width: 32px;
            height: 32px;
            margin-right: 0;
            margin-bottom: 10px;
        }

        .file-title {
            flex-wrap: wrap;
            gap: 10px;
        }

        .file-info {
            flex-direction: column;
            gap: 5px;
        }
    }

    .chunks-grid {
        grid-template-columns: repeat(auto-fill, minmax(50px, 1fr)) !important;
    }

    .chunk-square.expanded {
        min-height: 200px;
    }
}

/* 优化弹窗样式 */
:deep(.el-dialog) {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    animation: slideUp 0.3s ease-out;

    .el-dialog__header {
        padding: 20px;
        margin: 0;
        border-bottom: 1px solid var(--page-mcp-sidebar-border);
        background-color: var(--page-mcp-sidebar-bg);
    }

    .el-dialog__title {
        font-weight: 600;
        font-size: 18px;
        color: var(--page-mcp-header-text);
    }

    .el-dialog__body {
        padding: 24px;
        background-color: var(--standard-page-bg-color);
    }

    .el-dialog__footer {
        padding: 16px 24px;
        border-top: 1px solid var(--page-mcp-sidebar-border);
        background-color: var(--page-mcp-sidebar-bg);
    }
}

/* 优化按钮样式 */
:deep(.el-button) {
    border-radius: 6px;
    font-weight: 500;
    transition: all 0.3s;

    &:hover {
        transform: translateY(-2px);
    }

    &.is-disabled:hover {
        transform: none;
        box-shadow: none;
    }
}

/* 优化表单样式 */
:deep(.el-form-item) {
    margin-bottom: 24px;
    transition: all 0.2s ease;

    &:hover {
        transform: translateX(3px);
    }

    .el-input__wrapper,
    .el-textarea__wrapper {
        box-shadow: 0 0 0 1px var(--page-mcp-sidebar-border) inset;
        transition: all 0.3s;

        &:hover,
        &.is-focus {
            box-shadow: 0 0 0 1px var(--el-color-primary) inset;
        }
    }
}

/* 优化上传进度样式 */
:deep(.el-progress-circle) {
    animation: pulse 2s infinite;
}
</style>
