import cache from '@/util/cache'
import { Tab } from '@/schema/tab'
import { Chat } from '@/schema/chat'

/**
 * Store存放整个Vue项目的状态数据 全局公用
 * 并且引入浏览器缓存进行持久化
 * */
const app = {
    state: {
        // 当前处于激活状态的会话uuid
        active: '',
        // 所有标签页
        tab: new Tab({list: []}),
        // 所有会话的聊天记录
        chat: new Chat({list: []}),
        // 所有的上传文件
        files: []
    },

    mutations: {
        SET_ACTIVE: (state, active) => {
            state.active = active
            cache.local.set('active', 'value', active)
        },
        SET_TAB: (state, ins) => {
            state.tab = ins instanceof Tab ? ins : new Tab(ins);
            cache.local.set('tabStorage', 'value', state.tab)
        },
        SET_CHAT: (state, ins) => {
            state.chat = ins instanceof Chat ? ins : new Chat(ins);
            cache.local.set('chatStorage', 'value', state.chat)
        },
        SET_FILES: (state, files) => {
            state.files = files
            cache.local.set('fileStorage', 'value', {files: files})
        }
    },

    actions: {
        async initializeState({commit}) {
            try {
                const active = await cache.local.get('active', 'value') || ''
                const tabData = await cache.local.get('tabStorage', 'value') || {list: []}
                const chatData = await cache.local.get('chatStorage', 'value') || {list: []}
                const fileData = (await cache.local.get('fileStorage', 'value') || {files: []})

                commit('SET_ACTIVE', active)
                commit('SET_TAB', tabData)
                commit('SET_CHAT', chatData)
                commit('SET_FILES', fileData.files)
            } catch (error) {
                console.error('初始化状态失败:', error)
            }
        },
        setActive({commit}, active) {
            commit('SET_ACTIVE', active)
        },
        setTab({commit}, ins) {
            commit('SET_TAB', ins)
        },
        setChat({commit}, ins) {
            commit('SET_CHAT', ins)
        },
        setFiles({commit}, files) {
            commit('SET_FILES', files)
        },
        clearAll({commit}) {
            const active = ''
            const tabData = {list: []}
            const chatData = {list: []}
            const fileData = {files: []}

            commit('SET_ACTIVE', active)
            commit('SET_TAB', tabData)
            commit('SET_CHAT', chatData)
            commit('SET_FILES', fileData.files)
        }
    },

    getters: {
        active: state => state.active,
        tab: state => state.tab,
        chat: state => state.chat,
        file: state => state.files
    }
}

export default app
