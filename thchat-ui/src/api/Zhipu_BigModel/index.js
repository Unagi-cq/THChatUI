/**
 * @fileoverview 智谱AI平台的HTTP调用。
 * 语言模型和图片理解接口采用SSE请求方式，不需要跨域配置
 * 图片生成模型采用普通的fetch请求
 */
import { fetchEventSource } from "@microsoft/fetch-event-source";
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
    const { version, type } = model_config;
    const api_key = setting.model_list[setting.platform].api_key_config.api_key;

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
                body: JSON.stringify(preProcess(version, prompt, history, type, files, false)),
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
        body: JSON.stringify(preProcess(version, prompt, history, type, files, false)),
        signal: controller.signal,
        onopen,
        onmessage,
        onclose,
        onerror,
        openWhenHidden: true
    };

    return await fetchEventSource(url, requestConfig);
}

/**
 * 构建请求体
 * @param {string} model_version - 模型版本标识
 * @param {string} prompt - 用户当前的输入内容
 * @param {Array} history - 历史对话记录数组
 * @param {string} type - 模型类型标识
 * @param {Array} files - 上传的文件数组，主要包含图片的base64数据
 * @param {boolean} is_search - 是否启用网络搜索功能
 */
function preProcess(model_version, prompt, history, type, files, is_search) {
    let body = {};
    switch (type) {
        // 文本输入格式
        case "llm":
            body = {
                model: model_version,
                messages: buildLLMMessage(prompt, history),
                stream: true
            }
            break;
        // 图片输入格式
        case "vim":
            body = {
                model: model_version,
                messages: buildVIMMessage(prompt, history, files),
                stream: true
            }
            break;
        // 图片生成格式
        case "igm":
            body = {
                model: model_version,
                prompt: prompt
            }
            break;
    }
    return body;
}

/**
 * 构建LLM文本对话消息
 * @param {string} prompt - 用户当前的输入内容
 * @param {Array} history - 历史对话记录数组
 */
function buildLLMMessage(prompt, history) {
    function getHistory(history) {
        const array = [];
        // 排除最后一条 history，因为是本次刚发的消息
        for (let i = 0; i < history.length - 1; i++) {
            const chat = history[i];
            array.push({
                "role": "user",
                "content": chat.query
            });
            array.push({
                "role": "assistant",
                "content": chat.answer
            });
        }
        return array;
    }
    let arr = getHistory(history)
    arr.push({
        "role": "user",
        "content": prompt
    })
    return arr;
}

/**
 * 构建智谱AI平台的多模态消息
 * @param {string} prompt - 用户当前的输入内容
 * @param {Array} history - 历史对话记录数组
 * @param {Array} files - 上传的文件数组，主要包含图片的base64数据
 */
function buildVIMMessage(prompt, history, files) {
    function getHistory(history) {
        const array = [];
        // 排除最后一条 history，因为是本次刚发的消息
        for (let i = 0; i < history.length - 1; i++) {
            const chat = history[i];
            array.push({
                "role": "user",
                "content": [{ "type": "text", "text": chat.query }]
            });
            array.push({
                "role": "assistant",
                "content": [{ "type": "text", "text": chat.answer }]
            });
        }
        return array;
    }
    let arr = getHistory(history);
    let content = [];

    if (files && files.length > 0 && files[0].base64) {
        content.push({
            "type": "image_url",
            "image_url": {
                "url": files[0].base64
            }
        });
    }

    content.push({
        "type": "text",
        "text": prompt
    });

    arr.push({
        "role": "user",
        "content": content
    });

    return arr;
}

export function postProcess(event) {
    // fetch 图片链接返回
    if (event.data[0].url) {
        return { content: event.data[0].url }
    }

    // stream 流式返回
    if (event.data === '[DONE]') {
        return { content: '' };
    }

    const data = JSON.parse(event.data).choices[0];

    if (data.finish_reason === "stop") {
        return { content: '' };
    }

    if (data.delta.reasoning_content) {
        return { reasoning_content: data.delta.reasoning_content };
    } else {
        return { content: data.delta.content };
    }
}
