/**
 * @fileoverview 移动云平台的HTTP调用。
 * 接口采用SSE请求方式，直接调会跨域，需要配代理，部署在服务器上之后也需要配置代理，详情可以参考本项目的文档
 */
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { preProcess } from "@/util/config"
import store from '../../store';

// 移动云平台的接口地址
const API_URLS = {
    llm: "/yidong/remote/inference-api/exp-api/inf-1337014908971847680/v1/chat/completions", // 暂时需要手动修改此时 未来会重构API KEY管理模块
    vim: "", // 预留图片理解模型接口
    igm: "" // 预留图生成模型接口
};

/**
 * 调用移动云平台的接口
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

    const requestConfig = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${api_key}`,
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream'
        },
        body: JSON.stringify(preProcess(version, prompt, history, pre_method, files, false)),
        signal: controller.signal,
        onopen,
        onmessage,
        onclose,
        onerror,
        openWhenHidden: true
    };

    return await fetchEventSource(url, requestConfig);
} 