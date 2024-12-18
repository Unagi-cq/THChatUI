<template>
    <el-row :gutter="24" justify="center">
        <el-col :md="18" :sm="24" :xs="24" >
            <SendBox v-if="isHidden"/>
        </el-col>
    </el-row>

    <span class="copyright">{{ new Date().getFullYear() }} © THChatUI made by HCQ.
        <el-link href="https://github.com/Unagi-cq/THChatUI" target="_blank">代码仓库</el-link>
        <el-link href="javascript:void(0)" @click="goTo('/tutorial')">系统文档</el-link>
    </span>
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
.copyright, :deep(.el-link__inner) {
    margin-top: 6px;
    font-size: 12px;
}

.el-link {
    vertical-align: inherit;
}
</style>

