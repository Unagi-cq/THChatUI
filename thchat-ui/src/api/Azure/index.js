/**
 * @fileoverview Azure平台的HTTP调用。
 * 接口采用SSE请求方式，不需要跨域配置
 */
const OpenAI = require('openai')
import store from '../../store';

/**
 * 调用Azure平台的接口
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
    const { type, endpoint, api_key, version } = model_config;

    const openai = new OpenAI({
        apiKey: api_key,
        baseURL: endpoint,
        temperature: 0,
        dangerouslyAllowBrowser: true
    });

    try {
        const stream = await openai.chat.completions.create({
            ...preProcess(version, prompt, history, type, files, false),
            stream: true,
        });

        onopen?.();

        for await (const chunk of stream) {
            const content = chunk || {};
            onmessage?.(content);
        }

        onclose?.();
    } catch (error) {
        onerror?.(error);
        throw error;
    }
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
                messages: buildLLMMessage(prompt, history)
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

export function postProcess(event) {
    if (event === '[DONE]') {
        return { content: '' };
    }

    const data = event.choices[0];

    if (data.finish_reason === "stop") {
        return { content: '' };
    }

    if (data.delta.reasoning_content) {
        return { reasoning_content: data.delta.reasoning_content };
    } else {
        return { content: data.delta.content };
    }
}
