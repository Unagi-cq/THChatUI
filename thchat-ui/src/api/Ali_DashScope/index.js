/**
 * @fileoverview 阿里云平台的HTTP调用。
 * 接口采用SSE请求方式，直接调会跨域，需要配代理，部署在服务器上之后也需要配置代理，详情可以参考本项目的文档
 */
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { preProcess } from "@/util/config"
import store from '../../store';

// 阿里云平台的接口地址 在项目内部设置了跨域 所以拼接了字符串"/ali/remote" 对应项目里面的代理配置 vue.config.js
const API_URLS = {
    llm: "/ali/remote/api/v1/services/aigc/text-generation/generation",
    vim: "/ali/remote/api/v1/services/aigc/multimodal-generation/generation",
    igm: "" // 预留阿里平台的绘图模型
};

/**
 * 调用阿里云平台的接口
 * @param {string} prompt - 用户输入的问题
 * @param {Array} history - 历史对话消息
 * @param {Array} files - 文件列表 图片
 * @param {AbortController} controller - 控制请求的取消
 * @param {Function} onopen - 连接成功回调
 * @param {Function} onmessage - 接收消息回调
 * @param {Function} onclose - 连接关闭回调
 * @param {Function} onerror - 错误处理回调
 */
export async function fetchAPI({
    prompt,
    history,
    files,
    controller,
    onopen,
    onmessage,
    onclose,
    onerror
}) {
    const { setting } = store.state;
    const { model_config, web_search_enabled } = setting;
    const { version, pre_method, type, can_web_search } = model_config;
    const api_key = setting.api_key_map[setting.platform];

    const url = API_URLS[type] || API_URLS.llm;
    const is_search = (can_web_search !== undefined && can_web_search) && web_search_enabled;

    const requestConfig = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${api_key}`,
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
            'X-DashScope-SSE': 'enable'
        },
        body: JSON.stringify(preProcess(version, prompt, history, pre_method, files, is_search)),
        signal: controller.signal,
        onopen,
        onmessage,
        onclose,
        onerror,
        openWhenHidden: true
    };

    return await fetchEventSource(url, requestConfig);
}

