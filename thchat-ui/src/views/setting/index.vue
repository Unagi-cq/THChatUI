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

                            <el-form-item label="回答统计" prop="chat_detail">
                                <el-switch v-model="chat_detail" />
                            </el-form-item>

                            <el-form-item>
                                <el-button class="mt-2" type="warning">清空本地缓存</el-button>
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
        // 模型名称和版本 拼接值 以能够显示在select中
        model_version: {
            get() {
                return this.$store.state.setting.model_config.version
            }
        }
    },
    methods: {
        onChangeModel(e) {
            // 获取选中项的 id
            const model_config = this.model_list[this.platform].list.find(option => option.version === e);
            this.$store.dispatch('changeSetting', {
                key: 'model_config',
                value: model_config
            })
        },
        onBack() {
            // 返回首页
            this.$router.push('/');
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
</style>