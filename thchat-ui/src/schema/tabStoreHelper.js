import store from '@/store'

export default {
    /**
     * 删除历史聊天选项卡
     * @param {string} uuid 要删除的选项卡uuid
     */
    del(uuid) {
        let tab = store.state.app.tab;
        tab.removeTab(uuid);
        store.dispatch('setTab', tab);
    },

    /**
     * 添加新的聊天选项卡
     * @param {string} title 选项卡标题
     * @param {string} uuid 选项卡uuid
     */
    add(title, uuid) {
        let tab = store.state.app.tab;
        tab.addTab(title, uuid);
        store.dispatch('setTab', tab);
    }
}
