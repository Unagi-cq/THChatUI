/**
 * @fileoverview 系统设置状态管理模块
 * 该模块负责管理和持久化系统的全局设置，包括主题、API密钥、模型配置等
 * 使用 Vuex 进行状态管理，并通过 localStorage 实现数据持久化
 */
import cache from '@/util/cache';
import bg from '@/assets/images/bg2.jpg'

const settingStorage = JSON.parse(localStorage.getItem('settingStorage')) || ''

/**
 * defaultSettings 是项目初次运行时的默认配置
 * 想让项目结构精简一点 所以没有单独写成一个配置文件
 */
const defaultSettings = {
    /******************************** 系统设置弹窗对应的参数 ********************************/
    // 系统主题
    theme: 'light',
    // 背景图片
    bg: bg,
    // 是否显示回答统计
    chat_detail: true,
    // api_key
    api_key_map: {
        Ali_DashScope: "",
        Baidu_QianFan: "",
        Moonshot_AI: "",
        Xunfei_Spark: "",
        Zhipu_BigModel: "",
        TT_Volcengine: "",
        Yidong_CMECloud: "",
        OpenAI: {
            endpoint: "",
            api_key: "",
            model_name: ""
        },
        Local: ""
    },
    // 平台
    platform: 'Xunfei_Spark',
    // 是否多轮对话
    memory: true,
    // 历史对话轮数限制
    memory_limit: 3,
    // 模型配置
    model_config: {
        // 模型类型
        type: "llm",
        // 模型名称
        name: "Spark Lite 🆓",
        // 模型系列
        series: "xunfei",
        // 模型版本
        version: "spark lite",
        // 前处理组索引
        pre_method: "text_xunfei",
        // 后处理组索引
        post_method: "add"
    },
    /******************************** 系统默认参数 ********************************/
    // 输入框单次上传的文件数量
    upload_limit: 1,
    // 输入框可上传的文件类型 暂未接入其他多模态模型 所以只填图片
    upload_type: "image/",
    // 输入框限制文件大小 2MB
    upload_size: 2,
    /******************************** 知识库参数 ********************************/
    // 一个chunk的最长字符数
    chunk_size: 500,
    // 限制文件大小 5MB
    kb_file_size: 5,
    // 召回数量
    recall_count: 3,
    // 选中的知识库
    selected_repoId: '',
    // 知识库启用状态
    kb_enabled: false,
    /******************************** 联网搜索参数 ********************************/
    // 是否启用联网搜索
    web_search_enabled: false,
    /******************************** 看板娘设置 ********************************/
    // 是否启用看板娘
    live2d_enabled: true,
    // 看板娘模型索引
    live2d_model_index: 0,
    // 看板娘模型
    live2d_model: "https://raw.githubusercontent.com/zenghongtu/live2d-model-assets/master/assets/moc/22.xmas.1/22.2017.newyear.model.json"
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
