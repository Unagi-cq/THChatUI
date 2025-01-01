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
        active: Number(cache.local.get('active')) || '',
        // 所有标签页
        tab: new Tab((cache.local.get('tabStorage') && cache.local.getJSON('tabStorage')) || {list: []}),
        // 所有会话的聊天记录
        chat: new Chat((cache.local.get('chatStorage') && cache.local.getJSON('chatStorage')) || {list: []}),
        // 所有的上传文件
        files: (cache.local.get('fileStorage') && cache.local.getJSON('fileStorage')['files']) || []
    },

    mutations: {
        SET_ACTIVE: (state, active) => {
            state.active = active
            cache.local.set('active', active)
        },
        SET_TAB: (state, ins) => {
            state.tab = ins instanceof Tab ? ins : new Tab(ins);
            cache.local.setJSON('tabStorage', state.tab.toJSON())
        },
        SET_CHAT: (state, ins) => {
            state.chat = ins instanceof Chat ? ins : new Chat(ins);
            cache.local.setJSON('chatStorage', state.chat.toJSON())
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
        setTab({commit}, ins) {
            commit('SET_TAB', ins)
        },
        setChat({commit}, ins) {
            commit('SET_CHAT', ins)
        },
        setFiles({commit}, files) {
            commit('SET_FILES', files)
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
