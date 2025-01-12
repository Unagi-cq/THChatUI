<template>
    <el-row :gutter="24" justify="center">
        <el-col :md="18" :sm="24" :xs="24" style="padding-left: 0;padding-right: 0;">
            <SendBox v-if="isHidden" />
        </el-col>

        <span class="copyright">{{ new Date().getFullYear() }} © THChatUI made by HCQ.
            <el-link href="https://github.com/Unagi-cq/THChatUI" target="_blank">{{ $t('AppFooter.repository')
                }}</el-link>
            <el-link href="https://unagi-cq.github.io/THChatUI/#/docs" target="_blank">{{ $t('AppFooter.docs') }}</el-link>
        </span>
    </el-row>
</template>

<script>
export default {
    name: 'AppFooter',
    computed: {
        isHidden() {
            return this.$router.currentRoute.value.name === 'index';
        }
    },
    methods: {
        /**
         * 跳转页面函数
         * @param path
         */
        goTo(path) {
            this.$router.push(path)
        },
    }
}
</script>

<style scoped>
.el-row {
    margin-top: 32px;
}

.copyright {
    position: fixed;
    bottom: 2px;
    font-size: 12px;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}

:deep(.el-link__inner) {
    font-size: 12px;
}

.el-link {
    vertical-align: inherit;
    margin-right: 8px;
}
</style>
