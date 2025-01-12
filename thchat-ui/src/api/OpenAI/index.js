/**
 * @fileoverview OpenAI平台的HTTP调用。
 * 接口采用SSE请求方式，不需要跨域配置
 */
const OpenAI = require('openai')
import {preProcess} from "@/util/config"
import store from '../../store';

/**
 * 调用OpenAI平台的接口
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
    const { pre_method } = model_config;
    const { endpoint, api_key, model_name } = setting.api_key_map['OpenAI'];

    const openai = new OpenAI({
        apiKey: api_key,
        baseURL: endpoint,
        temperature: 0,
        dangerouslyAllowBrowser: true
    });

    try {
        const stream = await openai.chat.completions.create({
            ...preProcess(model_name, prompt, history, pre_method, files, false),
            stream: true,
        });

        onopen?.();

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            onmessage?.(content);
        }

        onclose?.();
    } catch (error) {
        onerror?.(error);
        throw error;
    }
}
