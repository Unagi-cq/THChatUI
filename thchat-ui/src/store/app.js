/**
 * @fileoverview Vuex应用状态管理模块
 * 该模块管理整个应用的核心状态，包括：
 * - 活动会话状态
 * - 标签页管理
 * - 聊天记录
 * - 文件存储
 * 并通过 IndexDB 实现状态持久化
 */
import indexDBUtil from '@/util/indexdb'
import { Tab } from '@/schema/tab'
import { Chat } from '@/schema/chat'

/**
 * Store存放整个Vue项目的状态数据 全局公用
 * 并且引入浏览器缓存进行持久化
 * */
const app = {
    state: {
        // 数据加载状态
        ready: false,
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
            indexDBUtil.set('active', 'value', active)
        },
        SET_TAB: (state, ins) => {
            state.tab = ins instanceof Tab ? ins : new Tab(ins);
            indexDBUtil.set('tabStorage', 'value', state.tab)
        },
        SET_CHAT: (state, ins) => {
            state.chat = ins instanceof Chat ? ins : new Chat(ins);
            indexDBUtil.set('chatStorage', 'value', state.chat)
        },
        SET_FILES: (state, files) => {
            state.files = files
            indexDBUtil.set('fileStorage', 'value', {files: files})
        },
        SET_READY: (state, ready) => {
            state.ready = ready
        }
    },

    actions: {
        async initializeState({commit}) {
            try {
                const active = await indexDBUtil.get('active', 'value') || ''
                const tabData = await indexDBUtil.get('tabStorage', 'value') || {list: []}
                const chatData = await indexDBUtil.get('chatStorage', 'value') || {list: []}
                const fileData = (await indexDBUtil.get('fileStorage', 'value') || {files: []})

                commit('SET_ACTIVE', active)
                commit('SET_TAB', tabData)
                commit('SET_CHAT', chatData)
                commit('SET_FILES', fileData.files)
                commit('SET_READY', true)
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
        file: state => state.files,
        ready: state => state.ready
    }
}

export default app
