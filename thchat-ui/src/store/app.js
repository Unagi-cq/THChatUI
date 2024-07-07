import cache from '@/util/cache'

/**
 * Store存放整个Vue项目的状态数据 全局公用
 * 并且引入浏览器缓存进行持久化
 * */
const app = {
    state: {
        // 当前处于激活状态的会话uuid
        active: Number(cache.local.get('active')) || '',
        // 所有会话列表
        tabs: (cache.local.get('tabStorage') && cache.local.getJSON('tabStorage')['tabs']) || [],
        // 所有会话的聊天记录
        chats: (cache.local.get('chatStorage') && cache.local.getJSON('chatStorage')['chats']) || [],
        // 所有的上传文件
        files: (cache.local.get('fileStorage') && cache.local.getJSON('fileStorage')['files']) || []
    },

    mutations: {
        SET_ACTIVE: (state, active) => {
            state.active = active
            cache.local.set('active', active)
        },
        SET_TABS: (state, tabs) => {
            state.tabs = tabs
            cache.local.setJSON('tabStorage', {"tabs": tabs})
        },
        SET_CHATS: (state, chats) => {
            state.chats = chats
            cache.local.setJSON('chatStorage', {"chats": chats})
        },
        SET_FILES: (state, files) => {
            state.files = files
            cache.local.setJSON('fileStorage', {"files": files})
        }
    },

    actions: {
        setActive({commit}, active) {
            commit('SET_ACTIVE', active)
        },
        setTabs({commit}, tabs) {
            commit('SET_TABS', tabs)
        },
        setChats({commit}, chats) {
            commit('SET_CHATS', chats)
        },
        setFiles({commit}, files) {
            commit('SET_FILES', files)
        }
    },

    getters: {
        active: state => state.active,
        history: state => state.tabs,
        chat: state => state.chats,
        file: state => state.files
    }
}

export default app
