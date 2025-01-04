/**
 * @fileoverview 月之暗面平台的HTTP调用。
 * 接口采用SSE请求方式，不需要跨域配置
 */
import {fetchEventSource} from "@microsoft/fetch-event-source";
import {preProcess} from "@/util/config"
import store from '../../store';

// 定义不同类型模型的请求地址
const API_URLS = {
    llm: "https://api.moonshot.cn/v1/chat/completions",
    vim: "", // 预留视觉模型接口
    igm: "" // 预留图生成模型接口
};

/**
 * 调用月之暗面平台的接口
 * @param {string} prompt - 用户输入的问题
 * @param {Array} history - 历史对话消息
 * @param {Array} files - 文件列表
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
    const { model_config } = setting;
    const { version, pre_method, type } = model_config;
    const api_key = setting.api_key_map[setting.platform];

    const url = API_URLS[type] || API_URLS.llm;
    const is_search = false;  // kimi联网搜索使用的是工具调用 js实现起来不太优美 暂时先不实现

    const requestConfig = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${api_key}`,
            'Content-Type': 'application/json'
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