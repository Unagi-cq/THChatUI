<template>
    <div class="api-key-form">
        <el-form :model="formData" label-width="120px">
            <el-form-item v-for="(value, key) in filteredFormData" :key="key" :label="formatLabel(key)" label-position="left">
                <el-input v-if="key === 'api_key'" v-model="formData[key]" :type="showKey ? 'text' : 'password'">
                    <template #suffix>
                        <el-icon class="cursor-pointer" @click="showKey = !showKey">
                            <View v-if="!showKey" />
                            <Hide v-else />
                        </el-icon>
                    </template>
                </el-input>
                <el-input v-else v-model="formData[key]" />
            </el-form-item>

            <div class="dialog-footer">
                <div class="apply-url-tip" v-if="formData.apply_url">
                    <el-link type="primary" :href="formData.apply_url" target="_blank">
                        <SvgIcon icon-class="share" />
                        申请平台的API Key
                    </el-link>
                </div>
                <div class="button-group">
                    <el-button @click="$emit('close')">取消</el-button>
                    <el-button type="primary" @click="handleSubmit">
                        确认
                    </el-button>
                </div>
            </div>
        </el-form>
    </div>
</template>

<script>
import { View, Hide } from '@element-plus/icons-vue'

export default {
    name: 'ApiKeyCard',
    components: {
        View,
        Hide
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
            showKey: false
        }
    },
    computed: {
        filteredFormData() {
            const result = {};
            for (const key in this.formData) {
                if (key !== 'apply_url') {
                    result[key] = this.formData[key];
                }
            }
            return result;
        }
    },
    watch: {
        initialData: {
            handler(newVal) {
                this.formData = { ...newVal }
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        formatLabel(key) {
            return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        },
        handleSubmit() {
            const apiKeyConfig = { ...this.formData };
            delete apiKeyConfig.apply_url;

            this.$emit('submit', {
                api_key_config: apiKeyConfig,
                platform: this.platform
            })
            this.$emit('close')
        }
    }
}
</script>

<style lang="scss">
.api-key-form {
    padding: 20px;
}

.dialog-footer {
    display: flex;
    flex-direction: column;
    margin-top: 24px;

    .apply-url-tip {
        margin-bottom: 16px;
        font-size: 14px;
    }

    .button-group {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
    }
}

.cursor-pointer {
    cursor: pointer;
}
</style>