<template>
    <div>
        <!-- 知识库列表 -->
        <el-row :gutter="24" justify="center" style="margin-left: 0;margin-right: 0;">
            <el-col :md="22" :sm="22" :xs="22">
                <div class="kb-header">
                    <h4>{{ $t('Kb.header') }}</h4>
                    <div class="kb-stats">
                        <span>{{ $t('Kb.stats.totalFiles') }}: {{ totalFiles }}</span>
                        <span>{{ $t('Kb.stats.totalChunks') }}: {{ totalChunks }}</span>
                    </div>
                </div>

                <!-- 知识库卡片列表 -->
                <el-row :gutter="24">
                    <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
                        <div class="kb-card dashed-border create-kb-card" @click="createRepoDialogVisible = true">
                            <div class="create-kb-content">
                                <el-icon :size="40">
                                    <Plus />
                                </el-icon>
                                <span class="create-text">{{ this.$t('Kb.createRepo.title') }}</span>
                            </div>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6" v-for="repo in repos" :key="repo.repoId">
                        <div class="kb-card dashed-border">
                            <div class="kb-card-header">
                                <div class="kb-card-title-row">
                                    <span class="kb-card-title">{{ repo.name }}</span>
                                    <div class="kb-card-actions">
                                        <el-tooltip content="管理" placement="top">
                                            <svg class="action-icon" @click="openRepo(repo)"
                                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16"
                                                height="16" fill="none">
                                                <path
                                                    d="M15.5 12C15.5 13.933 13.933 15.5 12 15.5C10.067 15.5 8.5 13.933 8.5 12C8.5 10.067 10.067 8.5 12 8.5C13.933 8.5 15.5 10.067 15.5 12Z"
                                                    stroke="currentColor" stroke-width="1.5" />
                                                <path
                                                    d="M21.011 14.0965C21.5329 13.9558 21.7939 13.8854 21.8969 13.7508C22 13.6163 22 13.3998 22 12.9669V11.0332C22 10.6003 22 10.3838 21.8969 10.2493C21.7938 10.1147 21.5329 10.0443 21.011 9.90358C19.0606 9.37759 17.8399 7.33851 18.3433 5.40087C18.4817 4.86799 18.5509 4.60156 18.4848 4.44529C18.4187 4.28902 18.2291 4.18134 17.8497 3.96596L16.125 2.98673C15.7528 2.77539 15.5667 2.66972 15.3997 2.69222C15.2326 2.71472 15.0442 2.90273 14.6672 3.27873C13.208 4.73448 10.7936 4.73442 9.33434 3.27864C8.95743 2.90263 8.76898 2.71463 8.60193 2.69212C8.43489 2.66962 8.24877 2.77529 7.87653 2.98663L6.15184 3.96587C5.77253 4.18123 5.58287 4.28891 5.51678 4.44515C5.45068 4.6014 5.51987 4.86787 5.65825 5.4008C6.16137 7.3385 4.93972 9.37763 2.98902 9.9036C2.46712 10.0443 2.20617 10.1147 2.10308 10.2492C2 10.3838 2 10.6003 2 11.0332V12.9669C2 13.3998 2 13.6163 2.10308 13.7508C2.20615 13.8854 2.46711 13.9558 2.98902 14.0965C4.9394 14.6225 6.16008 16.6616 5.65672 18.5992C5.51829 19.1321 5.44907 19.3985 5.51516 19.5548C5.58126 19.7111 5.77092 19.8188 6.15025 20.0341L7.87495 21.0134C8.24721 21.2247 8.43334 21.3304 8.6004 21.3079C8.76746 21.2854 8.95588 21.0973 9.33271 20.7213C10.7927 19.2644 13.2088 19.2643 14.6689 20.7212C15.0457 21.0973 15.2341 21.2853 15.4012 21.3078C15.5682 21.3303 15.7544 21.2246 16.1266 21.0133L17.8513 20.034C18.2307 19.8187 18.4204 19.711 18.4864 19.5547C18.5525 19.3984 18.4833 19.132 18.3448 18.5991C17.8412 16.6616 19.0609 14.6226 21.011 14.0965Z"
                                                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                            </svg>
                                        </el-tooltip>

                                        <el-tooltip content="删除" placement="top">
                                            <svg class="action-icon delete" @click="deleteRepo(repo.repoId)"
                                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16"
                                                height="16" fill="none">
                                                <path
                                                    d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5"
                                                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                                <path
                                                    d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5"
                                                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                                <path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-width="1.5"
                                                    stroke-linecap="round" />
                                                <path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-width="1.5"
                                                    stroke-linecap="round" />
                                            </svg>
                                        </el-tooltip>
                                    </div>
                                </div>
                            </div>
                            <p class="kb-card-description">{{ repo.description }}</p>
                            <div class="kb-card-footer">
                                <span class="create-time">{{ this.$t('Kb.repoDetail.createTime') }}: {{ repo.createTime }}</span>
                            </div>
                        </div>
                    </el-col>
                </el-row>

            </el-col>
        </el-row>

        <!-- 自定义弹窗 -->
        <CustomDialog v-model="createRepoDialogVisible" :title="$t('Kb.createRepo.title')">
            <el-form :model="newKbForm" label-width="100px" :rules="rules" ref="newKbForm">
                <el-form-item :label="$t('Kb.createRepo.name')" prop="name">
                    <el-input v-model="newKbForm.name" maxlength="10" show-word-limit />
                </el-form-item>
                <el-form-item :label="$t('Kb.createRepo.description')" prop="description">
                    <el-input type="textarea" v-model="newKbForm.description" />
                </el-form-item>
            </el-form>
            <div style="text-align: right; margin-top: 20px;">
                <el-button type="primary" @click="createRepo">{{ this.$t('Common.confirm') }}</el-button>
                <el-button @click="createRepoDialogVisible = false">{{ this.$t('Common.cancel') }}</el-button>
            </div>
        </CustomDialog>

        <!-- 知识库的文件列表弹窗 -->
        <CustomDialog v-model="repoDialogVisible" :title="`${activeRepo?.name || ''} - ${this.$t('Kb.repoDetail.fileList')}`">
            <div class="file-container">
                <!-- 文件展示部分 -->
                <div class="file-card" v-for="x in files">
                    <img src="@/assets/images/file.svg" alt="File Icon" class="file-icon" />
                    <div class="file-details">
                        <div class="file-title">
                            {{ x.name }}
                            <el-button type="text" size="small" @click="toggleChunks(x)">
                                {{ x.showChunks ? this.$t('Kb.repoDetail.hideChunks') : this.$t('Kb.repoDetail.showChunks') }}
                            </el-button>
                            <button class="delete-btn" @click="delFile(x.fileId)">&#x2715;</button>
                        </div>
                        <div class="file-info">
                            <span class="upload-time">{{ this.$t('Kb.repoDetail.uploadTime') }}: {{ x.createTime }}</span>
                            <span class="file-size">{{ this.$t('Kb.repoDetail.fileSize') }}: {{ formatFileSize(x.size) }}</span>
                        </div>
                        <!-- chunks预览部分 -->
                        <div v-if="x.showChunks" class="chunks-preview">
                            <div class="chunks-grid">
                                <div v-for="(chunk, index) in x.list" 
                                     :key="index" 
                                     class="chunk-square"
                                     @click="toggleChunkContent(x.fileId, index)"
                                     :class="{ 'expanded': isChunkExpanded(x.fileId, index) }">
                                    <div class="chunk-square-content">
                                        <template v-if="!isChunkExpanded(x.fileId, index)">
                                            <div class="chunk-number">{{ index + 1 }}</div>
                                        </template>
                                        <template v-else>
                                            <div class="chunk-expanded-header">
                                                <span>{{ $t('Kb.repoDetail.section') }} {{ index + 1 }}</span>
                                                <span class="chunk-length">{{ chunk.content.length }} {{ $t('Kb.repoDetail.characters') }}</span>
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
                <div class="upload-card" style="border-bottom: none;">
                    <el-upload class="upload-button" drag :auto-upload="true" :http-request="handleLocalUpload" multiple
                        :before-upload="beforeUpload" :show-file-list="false" accept=".pdf,.doc,.docx,.txt">
                        <template v-if="!isUploading">
                            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                            <div class="el-upload__text">
                                {{ $t('Kb.repoDetail.uploadTip') }}
                            </div>
                        </template>
                        <template v-else>
                            <el-progress type="circle" :percentage="uploadProgress"
                                :status="uploadProgress === 100 ? 'success' : ''" />
                            <div class="upload-progress-text">{{ uploadStatusText }}</div>
                        </template>
                        <template #tip>
                            <div class="el-upload__tip">
                                {{ $t('Kb.repoDetail.uploadLimitTip') }}
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
                    { required: true, message: this.$t('Kb.createRepo.nameRequired'), trigger: 'blur' }
                ],
                description: [
                    { required: true, message: this.$t('Kb.createRepo.descriptionRequired'), trigger: 'blur' }
                ]
            },
            // 知识库详情弹窗是否显示
            repoDialogVisible: false,
            uploadProgress: 0, // 添加上传进度状态
            isUploading: false, // 添加上传状态标志
            uploadStatusText: '',
            progressTimer: null, // 添加计时器变量
            fileChunksVisibility: {}, // 新增：用于存储每个文件的 chunks 显示状态
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
            this.$confirm(this.$t('Common.confirmDelete'), this.$t('Common.warn'), {
                confirmButtonText: this.$t('Common.confirm'),
                cancelButtonText: this.$t('Common.cancel'),
                type: 'warning'
            }).then(() => {
                kbStoreHelper.delRepo(repoId);
                this.$notify({
                    title: this.$t('Common.success'),
                    message: this.$t('Common.deleteSuccess'),
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
                    title: this.$t('Common.error'),
                    message: this.$t('Common.failed'),
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
            this.uploadStatusText = this.$t('Kb.repoDetail.preparing');

            try {
                // 模拟文件读取进度，使用衰减增长
                const simulateProgress = setInterval(() => {
                    if (this.uploadProgress < 90) {
                        // 计算剩余进度空间
                        const remainingProgress = 90 - this.uploadProgress;
                        // 使用衰减因子，随着进度增加而减少增量
                        const increment = Math.max(1, Math.floor(remainingProgress * 0.2));
                        this.uploadProgress += increment;
                        this.uploadStatusText = this.$t('Kb.repoDetail.processing');
                    }
                }, 1000);

                // 读取文件内容
                const content = await this.readFileContent(file);

                // 检查内容是否为空
                if (!content || content.trim() === '') {
                    this.$notify({
                        title: this.$t('Common.warn'),
                        message: this.$t('Kb.repoDetail.noContent'),
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
                this.uploadStatusText = this.$t('Kb.repoDetail.uploadComplete');

                // 显示成功通知
                this.$notify({
                    title: this.$t('Common.success'),
                    message: this.$t('Kb.repoDetail.uploadComplete'),
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
                this.uploadStatusText = this.$t('Kb.repoDetail.uploadFailed');

                this.$notify({
                    title: this.$t('Common.error'),
                    message: this.$t('Kb.repoDetail.uploadFailed'),
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
                        pdf.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdf.version}/pdf.worker.min.js`;

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
                    this.$t('Kb.repoDetail.deleteFile.confirm'), 
                    this.$t('Common.warn'),
                    {
                        confirmButtonText: this.$t('Common.confirm'),
                        cancelButtonText: this.$t('Common.cancel'),
                        type: 'warning'
                    }
                );

                kbStoreHelper.delFile(this.activeRepo.repoId, fileId);

                this.$notify({
                    title: this.$t('Common.success'),
                    message: this.$t('Kb.repoDetail.deleteFile.success'),
                    type: 'success'
                });
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('文件删除失败:', error);
                    this.$notify({
                        title: this.$t('Common.error'),
                        message: this.$t('Kb.repoDetail.deleteFile.failed'),
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
 * 通用的hover和active效果定义
 */
@mixin hover-active-effect {

    &.active,
    &:hover {
        background: var(--aside-active-hover-bg);
        border-radius: 5px;
    }
}

/**
 * 表单Label颜色
 */
:deep(.el-form-item__label) {
    color: var(--common-color);
}

/**
 * 页面头部标题
 */
.kb-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: PingFang SC;
    font-size: 28px;
    line-height: 28px;
    margin-bottom: 20px;

    .kb-stats {
        display: flex;
        gap: 20px;
        font-size: 14px;
        color: var(--answer-stats-color);
    }
}

/**
 * 知识库卡片
 */
.kb-card {
    display: flex;
    flex-direction: column;
    width: 90%;
    padding: 5px 18px;
    border-radius: 8px;
    margin: 5px 0 5px 0;
    height: 120px;
    justify-content: space-between;
    border: 2px solid var(--app-small-border-color);
    box-shadow: none;
    transition: all 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        border-color: var(--el-color-primary-light-5);
    }

    /* 卡片内部头部 */
    >.kb-card-header {
        font-weight: bold;
        margin-bottom: 10px;

        /* 卡片标题行,包含标题和操作按钮 */
        >.kb-card-title-row {
            display: flex;
            justify-content: space-between;
            align-items: center;

            /* 卡片操作按钮容器 */
            >.kb-card-actions {
                display: flex;
                gap: 12px;

                .action-icon {
                    cursor: pointer;
                    font-size: 16px;
                    padding: 4px;
                    opacity: 0.7;
                    transition: all 0.2s;

                    &:hover {
                        opacity: 1;
                        background: none;
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
        font-size: 12px;
        line-height: 1.5;
        color: #666;
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
        color: #999;

        /* 创建时间 */
        >.create-time {
            font-style: italic;
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
    transition: all 0.3s;
    border: 2px dashed var(--app-small-border-color);
    background: transparent;

    &:hover {
        border-color: var(--el-color-primary);
        background: transparent;
        
        .create-kb-content {
            color: var(--el-color-primary);
        }
    }

    >.create-kb-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #909399;

        >.create-text {
            margin-top: 10px;
            font-size: 14px;
        }
    }
}

.file-container {
    display: flex;
    flex-direction: column;
    padding: 5px;
    border-radius: 8px;
    margin: 5px 0 5px 0;

    /* 卡片样式 */
    >.file-card,
    .upload-card {
        display: flex;

        justify-content: space-between;
        padding: 10px;
        border-bottom: 1px dashed grey;

        /* 文件图标样式 */
        >.file-icon {
            width: 40px;
            height: 40px;
            object-fit: cover;
            margin-right: 10px;
            border-radius: 5px;
        }

        /* 文件详情样式 */
        >.file-details {
            flex: 1;

            >.file-title {
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 5px;
                display: flex;
                align-items: center;
                gap: 10px;
                color: var(--common-color);
                
                .delete-btn {
                    background: none;
                    border: none;
                    color: #f00;
                    cursor: pointer;
                    font-size: 18px;
                    padding: 0;
                    margin-left: auto;
                }
            }

            >.file-info {
                display: flex;
                gap: 15px;
                font-size: 12px;
                color: var(--answer-stats-color);

                .upload-time,
                .file-size {
                    white-space: nowrap;
                }
            }
        }

        /* 拖拽上传按钮 */
        >.upload-button {
            width: 100%;
        }
    }
}

:deep(.el-upload-dragger) {
    padding: 0;
    background: none;
}

.el-upload__tip {
    text-align: center;
}

:deep(.el-page-header__content),
:deep(.el-page-header__back) {
    color: var(--common-color);
}

.upload-progress-text {
    margin-top: 10px;
    color: #909399;
    font-size: 14px;
    text-align: center;
}

:deep(.el-progress) {
    margin: 10px auto;
}

.chunks-preview {
    font-size: 12px;
    margin-top: 10px;
    
    .chunks-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
        gap: 8px;
    }
    
    .chunk-square {
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
        border: 1px solid var(--app-small-border-color);
        background: transparent;
        color: var(--answer-stats-color);

        &:hover {
            border-color: var(--el-color-primary-light-5);
        }
        
        &.expanded {
            aspect-ratio: auto;
            grid-column: 1 / -1;
            height: auto;
            min-height: 250px;
            border-width: 2px;
        }
        
        .chunk-square-content {
            padding: 8px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        
        .chunk-number {
            text-align: center;
        }
        
        .chunk-length {
            color: var(--answer-stats-color);
            margin-top: 8px;
        }
        
        .chunk-expanded-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            font-weight: bold;
        }
        
        .chunk-expanded-content {
            flex: 1;
            line-height: 1.6;
            color: var(--answer-stats-color);
            white-space: pre-wrap;
            word-break: break-word;
        }
    }
}
</style>
