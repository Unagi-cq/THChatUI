/**
 * @fileoverview 智谱AI平台的HTTP调用。
 * 语言模型和图片理解接口采用SSE请求方式，不需要跨域配置
 * 图片生成模型采用普通的fetch请求
 */
import {fetchEventSource} from "@microsoft/fetch-event-source";
import {preProcess} from "@/util/config"
import store from '../../store';

// 定义不同类型模型的请求地址
const API_URLS = {
    llm: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
    vim: "https://open.bigmodel.cn/api/paas/v4/chat/completions", // 图片理解模型接口
    igm: "https://open.bigmodel.cn/api/paas/v4/images/generations" // 图生成模型接口
};

/**
 * 调用智谱AI平台的接口
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

    // 如果是图片生成接口，使用普通的fetch请求
    if (type === 'igm') {
        onopen({ status: 200 });
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${api_key}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(preProcess(version, prompt, history, pre_method, files, false)),
            });
            const data = await response.json();
            onmessage(data);
            onclose();
            return;
        } catch (error) {
            onerror(error);
            return;
        }
    }

    // 对于LLM和VIM接口使用SSE
    const requestConfig = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${api_key}`,
            'Content-Type': 'application/json'
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