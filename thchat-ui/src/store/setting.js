import cache from '@/util/cache'
import { model_list } from '@/util/config'
import bg from '@/assets/images/bg2.jpg'

// 从 IndexDB 获取设置
const getSettingStorage = async () => {
  const settings = await cache.local.get('settingStorage', 'value')
  return settings || ''
}

/**
 * defaultSettings 是项目初次运行时的默认配置
 * 想让项目结构精简一点 所以没有单独写成一个配置文件
 */

const apiKeyMap = Object.fromEntries(
    Object.entries(model_list).map(([key, value]) => [key, value.api_key || ''])
);

const defaultSettings = {
    /******************************** 系统设置弹窗对应的参数 ********************************/
    // 系统主题
    "theme": 'glass',
    // 背景图片
    "bg": bg,
    // 系统语言
    "locale": 'zh-CN',
    // 是否显示回答统计
    "chat_detail": true,
    // api_key 从配置文件中初始化
    "api_key_map": apiKeyMap,
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
        // 模型版本
        version: "spark lite", 
        // 前处理组索引
        pre_method: "xunfei", 
        // 后处理组索引
        post_method: "add"
    },
    // 聊天类型
    "chat_type": 'chat',
    /******************************** 系统默认参数 ********************************/
    // 单次上传的文件数量
    "upload_limit": 1,
    // 可上传的文件类型
    "upload_type": "image/",
    // 限制文件大小 2MB
    "upload_size": 2
}

// 初始化 store
const setting = {
  state: defaultSettings, // 先用默认值初始化

  mutations: {
    CHANGE_SETTING: (state, { key, value }) => {
      if (state.hasOwnProperty(key)) {
        state[key] = value;
        cache.local.set('settingStorage', 'value', state);
      }
    }
  },

  actions: {
    // 初始化状态
    async initializeSettings({ commit, state }) {
      const settings = await getSettingStorage()
      if (settings) {
        Object.keys(defaultSettings).forEach(key => {
          commit('CHANGE_SETTING', {
            key,
            value: settings[key] ?? defaultSettings[key]
          })
        })
      }
    },
    
    changeSetting({ commit }, data) {
      commit('CHANGE_SETTING', data)
    }
  }
}

export default setting
