<template>
    <div class="add-model-form">
        <div class="meto-tip" v-if="meto">{{ meto }}</div>
        <el-form :model="formData" :rules="rules" ref="modelForm" label-width="120px" label-position="left">
            <el-form-item v-for="item in formItems" :key="item.key" :prop="item.key">
                <template #label>
                    {{ item.label }}
                    <el-tooltip v-if="item.tooltip" :content="item.tooltip" effect="dark" placement="top">
                        <el-icon class="tips-icon">
                            <QuestionFilled />
                        </el-icon>
                    </el-tooltip>
                </template>

                <el-input v-if="!isSpecialField(item.key)" v-model="formData[item.key]"
                    :placeholder="`请输入${item.label}`" />

                <el-select v-else-if="item.key === 'type'" v-model="formData[item.key]"
                    :placeholder="`请选择${item.label}`">
                    <el-option v-if="item.options" v-for="option in item.options" :key="option" :label="option"
                        :value="option" />
                </el-select>

                <el-switch v-else-if="item.key === 'can_web_search'" v-model="formData[item.key]" />
            </el-form-item>

            <div class="dialog-footer">
                <div class="button-group">
                    <el-button @click="$emit('close')">取消</el-button>
                    <el-button type="primary" @click="submitForm">
                        确认
                    </el-button>
                </div>
            </div>
        </el-form>
    </div>
</template>

<script>
import { QuestionFilled } from '@element-plus/icons-vue'

export default {
    name: 'ModelConfigCard',
    components: {
        QuestionFilled
    },
    props: {
        platform: {
            type: String,
            required: true
        },
        initialData: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            formData: {},
            formItems: [],
            rules: {},
            meto: ""
        }
    },
    watch: {
        initialData: {
            handler(newVal) {
                // 获取平台的模型配置
                const platformConfig = this.$store.state.setting.model_list[this.platform]
                if (platformConfig && platformConfig.model_config) {
                    // 设置表单项
                    this.formItems = platformConfig.model_config.form_items || []
                    // 设置验证规则
                    this.rules = platformConfig.model_config.rules || {}
                    // 初始化表单数据
                    this.formData = { "series": platformConfig.avatar }
                    this.meto = platformConfig.model_config.meto
                }
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        isSpecialField(key) {
            return ['type', 'can_web_search'].includes(key)
        },
        submitForm() {
            this.$refs.modelForm.validate((valid) => {
                if (valid) {
                    this.$emit('submit', {
                        new_model_config: this.formData,
                        platform: this.platform
                    });
                    this.$emit('close');
                } else {
                    this.$notify({
                        title: "错误",
                        message: "请正确填写表单",
                        type: 'error'
                    });
                    return false;
                }
            });
        }
    }
}
</script>

<style lang="scss">
.add-model-form {
    padding: 20px;

    .tips-icon {
        margin-left: 4px;
        font-size: 16px;
        color: #909399;
        cursor: pointer;
    }
}

.meto-tip {
    background: #f4f8fb;
    color: #409eff;
    border-left: 4px solid #409eff;
    border-radius: 6px;
    padding: 10px 16px;
    margin-bottom: 18px;
    font-size: 12px;
    line-height: 1.6;
    word-break: break-all;
    box-shadow: 0 2px 8px rgba(64,158,255,0.06);
    transition: background 0.3s;
}

.dialog-footer {
    display: flex;
    flex-direction: column;
    margin-top: 24px;

    .button-group {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
    }
}
</style>