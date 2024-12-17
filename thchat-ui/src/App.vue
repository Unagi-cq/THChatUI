<template>
    <router-view/>
</template>

<script>
import { ref, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import '@/util/resize' // 引入 ResizeObserver 设置

export default {
    setup() {
        const store = useStore()
        const theme = ref(store.state.setting.theme)

        // 监听主题变化
        watch(() => store.state.setting.theme, (newTheme) => {
            theme.value = newTheme
            document.body.className = `${newTheme}-theme`
        })

        // 挂载时设置初始主题
        onMounted(() => {
            document.body.className = `${theme.value}-theme`
        })

        return {}
    }
}
</script>