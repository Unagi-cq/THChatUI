import cache from '@/util/cache'
import bg from '@/assets/images/bg.jpg'

const settingStorage = JSON.parse(localStorage.getItem('settingStorage')) || ''

/**
 * defaultSettings 是项目初次运行时的默认配置
 * 想让项目结构精简一点 所以没有单独写成一个配置文件
 */
const defaultSettings = {
    // 系统主题
    "theme": 'glass',
    // 背景图片
    "bg": bg,
    // 是否显示回答统计
    "chat_detail": true,
    // api_key
    "api_key": '',
    // 平台
    "platform": 'Xunfei_Spark',
    // 是否多轮对话
    "memory": true,
    // 模型配置
    "model_config": { 
        // 模型类型
        type: "llm", 
        // 模型名称
        name: "讯飞星火（Spark Lite）", 
        // 模型系列
        series: "xunfei", 
        // 模型头像
        avatar: "@/assets/images/xunfei.png", 
        // 模型版本
        version: "spark lite", 
        // 前处理组索引
        pre_method: "xunfei", 
        // 后处理组索引
        post_method: "add"
    },
    // 聊天类型
    "chat_type": 'chat'
}

const setting = {
    state: Object.keys(defaultSettings).reduce((acc, key) => {
        acc[key] = settingStorage?.[key] ?? defaultSettings[key];
        return acc;
    }, {}),

    mutations: {
        CHANGE_SETTING: (state, { key, value }) => {
            if (state.hasOwnProperty(key)) {
                state[key] = value;
                cache.local.setJSON('settingStorage', state);
            }
        }
    },

    actions: {
        changeSetting({ commit }, data) {
            commit('CHANGE_SETTING', data)
        }
    }
}

if (!settingStorage) {
    cache.local.setJSON('settingStorage', defaultSettings)
}

export default setting
