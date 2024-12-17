import { fetchEventSource } from "@microsoft/fetch-event-source"
// 引入 store
import store from '../store';

// 本地接口设置了3种模式，根据store中的chat_type来选择 ['chat','search','rag']
const URL = '/local/' + store.state.setting.chat_type + '/stream';

/**
 * 本地接口
 * @param model_version 模型名
 * @param prompt 用户输入的问题
 * @param history 历史对话消息 在SendBox中限制最多三轮
 * @param controller 控制请求的取消
 * @param onopen 连接成功时的回调函数
 * @param onmessage 接收到消息时的回调函数
 * @param onclose 连接关闭时的回调函数
 * @param onerror 处理错误时的回调函数
 * @returns {Promise<void>}
 */
export async function local({prompt, history, files, controller, onopen, onmessage, onclose, onerror}) {
    const response = await fetchEventSource(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept':'text/event-stream',
            'X-DashScope-SSE': 'enable'
        },
        body: getParams(prompt, history, files),
        signal: controller.signal,
        // 连接成功时的处理
        onopen,
        // 接收到消息时的处理
        onmessage,
        // 连接关闭时的处理
        onclose,
        // 处理错误
        onerror,
        // 切换页面时正常传输数据
        openWhenHidden: true
    })
}

/**
 * 拼接请求参数
 * @param prompt 用户输入的问题
 * @param history 历史对话消息 在SendBox中限制最多三轮
 * @param files 上传的文件数据
 * @returns {string}
 */
function getParams(prompt, history, files) {
    let inputs = {
        prompt: prompt,
        history: getHistory(history),
        files: files
    }

    return JSON.stringify({
        input: inputs
    });
}

/**
 * 拼接历史对话
 * @param history
 * @returns {*[]}
 */
function getHistory(history) {
    const array = [];
    for (let i = 0; i < history.length; i++) {
        const chat = history[i];
        array.push({
            user: chat.query,
            assistant: chat.answer,
        });
    }

    return array;
}