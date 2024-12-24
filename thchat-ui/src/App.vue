<template>
    <router-view/>
</template>

<script>
import { ref, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import '@/util/resize'

export default {
    setup() {
        const store = useStore()
        const theme = ref(store.state.setting.theme)

        // 统一处理主题和背景的设置
        const updateTheme = (newTheme) => {
            document.body.className = `${newTheme}-theme`
        }

        const updateBackground = (newBg) => {
            if (newBg) {
                document.documentElement.style.setProperty('--custom-bg', `url(${newBg})`)
            }
        }

        // 监听主题和背景变化
        watch(() => store.state.setting.theme, updateTheme)
        watch(() => store.state.setting.bg, updateBackground)

        // 初始化设置
        onMounted(() => {
            updateTheme(theme.value)
            updateBackground(store.state.setting.bg)
        })

        return {}
    }
}
</script>