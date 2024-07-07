<template>
    <router-view/>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
    setup() {
        const store = useStore();
        const theme = ref(store.state.setting.theme);

        // 挂载时设置初始主题
        onMounted(() => {
            document.body.className = theme.value + '-theme';
        });

        return {

        };
    }
}

const debounce = (fn, delay) => {
    let timer
    return (...args) => {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn(...args)
        }, delay)
    }
}

// 窗口防抖
const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver{
    constructor(callback) {
        callback = debounce(callback, 200);
        super(callback);
    }
}
</script>