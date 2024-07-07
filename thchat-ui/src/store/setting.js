import cache from '@/util/cache'

import userAvatar from "@/assets/images/user.png";
import qwenAvatar from "@/assets/images/qwen.jpg";
import baichuanAvatar from "@/assets/images/baichuan.png";
import zhipuAvatar from "@/assets/images/zhipu.png";
import xunfeiAvatar from "@/assets/images/xunfei.svg";
import defaultAvatar from "@/assets/images/logo.png";
import bg from "@/assets/images/bg.jpg";

const settingStorage = JSON.parse(localStorage.getItem('settingStorage')) || ''

/**
 * defaultSettings 是项目初次运行时的默认配置
 * 想让项目结构精简一点 所以没有单独写成一个配置文件
 */
const defaultSettings = {
    "baseAvatar": {
        "user": userAvatar,
        "qwen": qwenAvatar,
        "baichuan": baichuanAvatar,
        "zhipu": zhipuAvatar,
        "xunfei": xunfeiAvatar,
        "default": defaultAvatar
    },
    "theme": 'glass',
    "bg": bg,
    "chat_detail": true,
    "method": 'remote',
    "region": 'Xunfei_Spark',
    "api_key": '...',
    "model_name": 'xunfei',
    "model_version": 'spark lite',
    "memory": true,
    "pre_group": 1,
    "post_group": 1,
    "chat_type": 'chat'
}

const setting = {
    state: {
        // 头像列表
        baseAvatar: defaultSettings.baseAvatar,
        // 系统主题
        theme: settingStorage.theme === undefined ? defaultSettings.theme : settingStorage.theme,
        // 聊天统计
        chat_detail: settingStorage.chat_detail === undefined ? defaultSettings.chat_detail : settingStorage.chat_detail,
        // 背景图片
        bg: settingStorage.bg === undefined ? defaultSettings.bg : settingStorage.bg,
        // 调用方式
        method: settingStorage.method === undefined ? defaultSettings.method : settingStorage.method,
        // 平台
        region: settingStorage.region === undefined ? defaultSettings.region : settingStorage.region,
        // api_key
        api_key: settingStorage.api_key === undefined ? defaultSettings.api_key : settingStorage.api_key,
        // 模型名称
        model_name: settingStorage.model_name === undefined ? defaultSettings.model_name : settingStorage.model_name,
        // 模型版本名称
        model_version: settingStorage.model_version === undefined ? defaultSettings.model_version : settingStorage.model_version,
        // 是否多轮对话
        memory: settingStorage.memory === undefined ? defaultSettings.memory : settingStorage.memory,
        // 前处理组索引
        pre_group: settingStorage.pre_group === undefined ? defaultSettings.pre_group : settingStorage.pre_group,
        // 后处理组索引
        post_group: settingStorage.post_group === undefined ? defaultSettings.post_group : settingStorage.post_group,
        // 聊天类型
        chat_type: settingStorage.chat_type === undefined ? defaultSettings.chat_type : settingStorage.chat_type
    },

    mutations: {
        CHANGE_SETTING: (state, { key, value }) => {
            if (state.hasOwnProperty(key)) {
                state[key] = value;
                settingStorage[key] = value;
                cache.local.setJSON('settingStorage', settingStorage);
            }
        }
    },

    actions: {
        changeSetting({ commit }, data) {
            commit('CHANGE_SETTING', data)
        }
    }
}

delete defaultSettings.baseAvatar

if (settingStorage === '') {
    cache.local.setJSON('settingStorage', defaultSettings)
}

export default setting
