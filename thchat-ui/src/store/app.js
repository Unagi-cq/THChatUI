/**
 * @fileoverview Vuex应用状态管理模块
 * 该模块管理整个应用的核心状态，包括：
 * - 活动会话状态
 * - 标签页管理
 * - 聊天记录
 * - 知识库存储
 * 并通过 IndexDB 实现状态持久化
 */
import indexDBUtil from '@/util/indexdb'
import { Tab } from '@/schema/tab'
import { Chat } from '@/schema/chat'
import { Kb } from '@/schema/kb'

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
        kb: new Kb({list: []})
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
        SET_KB: (state, kb) => {
            state.kb = kb instanceof Kb ? kb : new Kb(kb)
            indexDBUtil.set('kbStorage', 'value', state.kb)
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
                const kbData = await indexDBUtil.get('kbStorage', 'value') || {list: []}

                commit('SET_ACTIVE', active)
                commit('SET_TAB', tabData)
                commit('SET_CHAT', chatData)
                commit('SET_KB', kbData)
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
        setKb({commit}, kb) {
            commit('SET_KB', kb)
        },
        clearAll({commit}) {
            const active = ''
            const tabData = {list: []}
            const chatData = {list: []}
            const kbData = {list: []}

            commit('SET_ACTIVE', active)
            commit('SET_TAB', tabData)
            commit('SET_CHAT', chatData)
            commit('SET_KB', kbData)
        }
    },

    getters: {
        active: state => state.active,
        tab: state => state.tab,
        chat: state => state.chat,
        kb: state => state.kb,
        ready: state => state.ready
    }
}

export default app
