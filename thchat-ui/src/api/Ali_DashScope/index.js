/**
 * @fileoverview 阿里云平台的HTTP调用。
 * 接口采用SSE请求方式，直接调会跨域，需要配代理，部署在服务器上之后也需要配置代理，详情可以参考本项目的文档
 */
import { fetchEventSource } from "@microsoft/fetch-event-source";
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
    const { version, type, can_web_search } = model_config;
    const api_key = setting.model_list[setting.platform].api_key_config.api_key;

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
        body: JSON.stringify(preProcess(version, prompt, history, type, files, is_search)),
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
                input: {
                    messages: buildLLMMessage(prompt, history)
                },
                parameters: {
                    result_format: "message",
                    incremental_output: true
                }
            }
            if (is_search) {
                body.parameters.enable_search = true;
            }
            break;
        // 图片输入格式
        case "vim":
            body = {
                model: model_version,
                input: {
                    messages: buildVIMMessage(prompt, history, files)
                },
                parameters: {
                    result_format: "message",
                    incremental_output: true
                }
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
 * 构建多模态消息
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
                "content": chat.files && chat.files[0] && chat.files[0].base64 ? 
                    [{"image": chat.files[0].base64}, { "text": chat.query }] :
                    [{ "text": chat.query }]
            });
            array.push({
                "role": "assistant",
                "content": [{ "text": chat.answer }]
            });
        }
        return array;
    }
    let arr = getHistory(history);
    let content = [];

    if (files && files.length > 0 && files[0].base64) {
        content.push({
            "image": files[0].base64
        });
    }

    content.push({
        "text": prompt
    });

    arr.push({
        "role": "user",
        "content": content
    });

    return arr;
}

export function postProcess(event) {
    var data = JSON.parse(event.data).output.choices[0];

    if (data.finish_reason === "stop") {
        return { usage: data.usage };
    }

    data = data.message;

    if (data.reasoning_content) {
        return { reasoning_content: data.reasoning_content };
    } else {
        if (typeof data.content === 'string') {
            return { content: data.content };
        } else {
            return { content: data.content[0].text };
        }
    }
}
