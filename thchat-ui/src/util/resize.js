/**
 * 防抖函数
 * @param {Function} fn 需要防抖的函数
 * @param {number} delay 延迟时间(ms)
 */
export const debounce = (fn, delay) => {
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

// 创建防抖版本的 ResizeObserver
const _ResizeObserver = window.ResizeObserver
export class DebouncedResizeObserver extends _ResizeObserver {
    constructor(callback) {
        callback = debounce(callback, 200)
        super(callback)
    }
}

// 替换全局 ResizeObserver
window.ResizeObserver = DebouncedResizeObserver 