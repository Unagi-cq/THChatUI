<template>
    <el-row :gutter="24" justify="center">
        <span class="copyright">{{ new Date().getFullYear() }} © THChatUI made by HCQ.
            <el-link href="https://github.com/Unagi-cq/THChatUI" target="_blank">代码仓库</el-link>
            <el-link href="https://unagi-cq.github.io/THChatUI/#/docs" target="_blank">系统文档</el-link>
        </span>
    </el-row>
</template>

<script>
export default {
    name: 'AppFooter',
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
