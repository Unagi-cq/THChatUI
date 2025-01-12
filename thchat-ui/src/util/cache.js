/**
 * @fileoverview 缓存工具类
 * 提供会话存储(sessionStorage)和本地存储(localStorage)的封装
 * 主要用于存储用户设置等小型数据
 * 大数据量(如会话记录、对话选项卡、知识库等)建议使用IndexedDB存储
 */

const sessionCache = {
    /**
     * 设置会话存储项
     * @param {string} key - 存储键名
     * @param {string} value - 存储的值
     */
    set (key, value) {
        if (!sessionStorage) {
            return
        }
        if (key != null && value != null) {
            sessionStorage.setItem(key, value)
        }
    },

    /**
     * 获取会话存储项
     * @param {string} key - 存储键名
     * @returns {string|null} 存储的值，不存在时返回null
     */
    get (key) {
        if (!sessionStorage) {
            return null
        }
        if (key == null) {
            return null
        }
        return sessionStorage.getItem(key)
    },

    /**
     * 存储JSON数据到会话存储
     * @param {string} key - 存储键名
     * @param {Object} jsonValue - 要存储的JSON对象
     */
    setJSON (key, jsonValue) {
        if (jsonValue != null) {
            this.set(key, JSON.stringify(jsonValue))
        }
    },

    /**
     * 从会话存储中获取JSON数据
     * @param {string} key - 存储键名
     * @returns {Object|undefined} 解析后的JSON对象，不存在时返回undefined
     */
    getJSON (key) {
        const value = this.get(key)
        if (value != null) {
            return JSON.parse(value)
        }
    },

    /**
     * 从会话存储中移除项
     * @param {string} key - 要移除的键名
     */
    remove (key) {
        sessionStorage.removeItem(key);
    }
}

const localCache = {
    /**
     * 设置本地存储项
     * @param {string} key - 存储键名
     * @param {string} value - 存储的值
     */
    set (key, value) {
        if (!localStorage) {
            return
        }
        if (key != null && value != null) {
            localStorage.setItem(key, value)
        }
    },

    /**
     * 获取本地存储项
     * @param {string} key - 存储键名
     * @returns {string|null} 存储的值，不存在时返回null
     */
    get (key) {
        if (!localStorage) {
            return null
        }
        if (key == null) {
            return null
        }
        return localStorage.getItem(key)
    },

    /**
     * 存储JSON数据到本地存储
     * @param {string} key - 存储键名
     * @param {Object} jsonValue - 要存储的JSON对象
     */
    setJSON (key, jsonValue) {
        if (jsonValue != null) {
            this.set(key, JSON.stringify(jsonValue))
        }
    },

    /**
     * 从本地存储中获取JSON数据
     * @param {string} key - 存储键名
     * @returns {Object|undefined} 解析后的JSON对象，不存在时返回undefined
     */
    getJSON (key) {
        const value = this.get(key)
        if (value != null) {
            return JSON.parse(value)
        }
    },

    /**
     * 从本地存储中移除项
     * @param {string} key - 要移除的键名
     */
    remove (key) {
        localStorage.removeItem(key);
    }
}

export default {
    /**
     * 会话级缓存
     */
    session: sessionCache,
    /**
     * 本地缓存
     */
    local: localCache
}
