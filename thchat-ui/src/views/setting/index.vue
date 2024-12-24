<template>
    <el-row :gutter="24" justify="center">
        <el-col :md="18" :sm="24" :xs="24">
            <div class="title-container dashed-border">
                <el-page-header @back="onBack" title="关闭" content="系统设置" :icon="CloseBold"></el-page-header>

                <el-tabs tab-position="left" style="margin-top: 20px;" class="demo-tabs">
                    <el-tab-pane label="模型">
                        <el-form  label-width="100" label-position="left">

                            <el-form-item label="平台">
                                <el-select v-model="platform" placeholder="选择平台">
                                    <el-option :label="x.platform_name" :value="y" v-for="(x, y) in model_list"/>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="API Key" v-if="platform !== 'Local'">
                                <el-input v-model="api_key" />
                            </el-form-item>

                            <el-form-item label="模型">
                                <el-select v-model="model_version" placeholder="选择模型" @change="onChangeModel">
                                    <el-option :label="x.name" :value="x.version" :data-id="x.pre_group" v-for="x in model_list[platform].list"/>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="多轮对话" prop="memory">
                                <el-switch v-model="memory" />
                            </el-form-item>

                        </el-form>
                    </el-tab-pane>

                    <el-tab-pane label="通用" >

                        <el-form label-width="100" label-position="left">
                            <el-form-item label="系统主题">
                                <el-segmented v-model="theme" :options="[{label:'毛玻璃',value:'glass'},{label:'暗色',value:'dark'},{label:'亮色',value:'light'}]" >
                                    <template #default="{ item }">
                                        <div class="flex flex-col items-center">
                                            <div>{{ item.label }}</div>
                                        </div>
                                    </template>
                                </el-segmented>
                            </el-form-item>

                            <el-form-item label="背景图片" v-if="theme === 'glass'">
                                <div class="bg-preview-container">
                                    <el-upload
                                        class="avatar-uploader"
                                        action=""
                                        :show-file-list="false"
                                        :auto-upload="false"
                                        accept="image/*"
                                        :on-change="handleBgChange">
                                        <img v-if="currentBg" :src="currentBg" class="preview-img">
                                        <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
                                    </el-upload>
                                </div>
                            </el-form-item>

                            <el-form-item label="回答统计" prop="chat_detail">
                                <el-switch v-model="chat_detail" />
                            </el-form-item>

                            <el-form-item>
                                <el-button class="mt-2" type="warning" @click="clearLocalStorage">清空本地缓存</el-button>
                                <el-button class="mt-2" type="danger" @click="resetBg" v-if="theme === 'glass'">重置背景</el-button>
                            </el-form-item>
                        </el-form>

                    </el-tab-pane>

                </el-tabs>
            </div>
        </el-col>
    </el-row>




</template>

<script>
import {model_list} from "@/util/config";
import {CloseBold} from "@element-plus/icons-vue";
import bg from '@/assets/images/bg.jpg'

export default {
    name: 'Setting',
    data() {
        return {
            model_list: model_list,
        };
    },
    computed: {
        CloseBold() {
            return CloseBold
        },
        // 系统主题
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
        // 调用平台
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
                this.onChangeModel(this.model_list[val].list[0].version)
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
        // 是否多轮对话
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
        // 是否显示回答统计
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
        // 模型版本 以便显示在select中
        model_version() {
            return this.$store.state.setting.model_config.version
        },
        // 当前设置的背景图片（保存在缓存内）
        currentBg() {
            return this.$store.state.setting.bg;
        }
    },
    methods: {
        /**
         * 模型版本改变时 更新模型配置
         * @param e el-option传入的值
         */
        onChangeModel(e) {
            // 获取选中模型的整体配置
            const model_config = this.model_list[this.platform].list.find(option => option.version === e);
            this.$store.dispatch('changeSetting', {
                key: 'model_config',
                value: model_config
            })
        },
        /**
         * 返回首页
         */
        onBack() {
            this.$router.push('/');
        },
        /**
         * 背景图片上传
         * @descripe 浏览器缓存空间有限 限制保存的图片最大只能为1M 未来考虑使用IndexedDB存储
         */
        handleBgChange(file) {
            // 添加文件大小限制检查 (1MB = 1024 * 1024 bytes)
            const isLt1M = file.raw.size / 1024 / 1024 < 1;
            
            if (!isLt1M) {
                this.$notify({
                    title: '上传失败!',
                    message: '上传图片大小不能超过 1MB!',
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
         * 重置背景
         */
        resetBg() {
            this.$store.dispatch('changeSetting', {
                key: 'bg',
                value: bg
            })
        },
        /**
         * 清空本地缓存
         */
         clearLocalStorage() {
            this.$confirm('确定要清空所有本地缓存吗？这将会清除所有设置和聊天记录。', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                localStorage.clear();
                this.$notify({
                    title: '成功',
                    message: '本地缓存已清空，页面将在3秒后刷新',
                    type: 'success'
                });
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }).catch(() => {});
        }
    }
}
</script>

<style scoped>
.demo-tabs {
    padding-right: 10px;
}

.title-container{
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    -moz-box-orient: vertical;
    -moz-box-direction: normal;
    flex-direction: column;
    gap: 4px;
    width: 100%;
    margin: 2vh 0;
    text-align: center;
    border-radius: 10px;
    padding: 10px 0 0 0;

    > .el-page-header{
        margin-left: 20px;
    }
}

:deep(.el-page-header__content) {
    color: var(--common-color);
}

:deep(.el-tabs__item)[aria-selected="false"] {
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
    z-index: 2;  /* 确保图标在遮罩层上方 */
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

</style>