<template>
    <el-row :gutter="24" justify="center">
        <el-col :md="18" :sm="24" :xs="24">
            <div class="title-container dashed-border theme-bg">
                <el-page-header @back="onBack" title="关闭" content="系统设置" :icon="CloseBold"></el-page-header>

                <el-tabs tab-position="left" style="margin-top: 20px;" class="demo-tabs">
                    <el-tab-pane label="模型">
                        <el-form  label-width="100" label-position="left">

                            <el-form-item label="模型调用">
                                <el-select v-model="method" placeholder="选择模型调用的方式/途径">
                                    <el-option label="本地模型" value="local" />
                                    <el-option label="第三方平台" value="remote" />
                                </el-select>
                            </el-form-item>

                            <el-form-item label="平台" v-if="method === 'remote'">
                                <el-select v-model="region" placeholder="选择第三方平台">
                                    <el-option label="阿里云灵积" value="Ali_DashScope" />
                                    <el-option label="讯飞星火" value="Xunfei_Spark" />
                                    <el-option label="智谱AI" value="Zhipu_BigModel" />
                                    <el-option label="百度千帆" value="Baidu_QianFan" />
                                </el-select>
                            </el-form-item>

                            <el-form-item label="API Key" v-if="method === 'remote'">
                                <el-input v-model="api_key" />
                            </el-form-item>

                            <el-form-item label="模型" v-if="method === 'remote'">
                                <el-select v-model="model_name_model_version" placeholder="选择模型" @change="onChangeModel">
                                    <!-- 这里可选的模型列表model_list写在util/rule.js中 -->
                                    <el-option :label="x.label" :value="x.value" :data-id="x.pre_group" v-for="x in model_list[region]"/>
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
import {model_list} from "@/util/rule"
import {CloseBold} from "@element-plus/icons-vue";

export default {
    name: 'Setting',
    data() {
        return {
            // 可选的模型列表model_list写在util/rule.js中
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
        // 调用方法 local 本地 remote 远程
        method: {
            get() {
                return this.$store.state.setting.method;
            },
            set(val) {
                this.$store.dispatch('changeSetting', {
                    key: 'method',
                    value: val
                })
            }
        },
        // 调用平台
        region: {
            get() {
                return this.$store.state.setting.region;
            },
            set(val) {
                this.$store.dispatch('changeSetting', {
                    key: 'region',
                    value: val
                })
                // api平台更换时 把默认模型设置为平台内的第一个
                this.onChangeModel(this.model_list[val][0].value)
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
        model_name_model_version: {
            get() {
                return this.$store.state.setting.model_name + ';' + this.$store.state.setting.model_version
            }
        }
    },
    methods: {
        onChangeModel(e) {
            // 获取选中项的 id
            const model = this.model_list[this.region].find(option => option.value === e);
            this.$store.dispatch('changeSetting', {
                key: 'pre_group',
                value: model.pre_group
            })
            this.$store.dispatch('changeSetting', {
                key: 'post_group',
                value: model.post_group
            })
            // 使用分号 ; 分割字符串
            let parts = e.split(';');
            this.$store.dispatch('changeSetting', {
                key: 'model_name',
                value: parts[0]
            })
            this.$store.dispatch('changeSetting', {
                key: 'model_version',
                value: parts[1]
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
    color: var(--chat-card-font-color);
}

:deep(.el-tabs__item)[aria-selected="false"] {
    color: var(--chat-card-font-color);
}
</style>