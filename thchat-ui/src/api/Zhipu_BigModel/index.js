/**
 * @description 智谱AI平台的接口采用SSE请求方式
 */
import {fetchEventSource} from "@microsoft/fetch-event-source";
import {preProcess} from "@/util/rule"
// 引入 store
import store from '../../store';
// 智谱AI平台的接口地址
const URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";

/**
 * 调用智谱AI平台的接口
 * @param model_version 模型名
 * @param prompt 用户输入的问题
 * @param history 历史对话消息 在SendBox中限制最多三轮
 * @param groupIndex 前处理组的索引 由于不同厂商的接口参数不同，需要根据厂商的接口文档来确定传参的结构
 * @param controller 控制请求的取消
 * @param onopen 连接成功时的回调函数
 * @param onmessage 接收到消息时的回调函数
 * @param onclose 连接关闭时的回调函数
 * @param onerror 处理错误时的回调函数
 * @returns {Promise<void>}
 */
export async function remote({model_version, prompt, history, groupIndex, controller, onopen, onmessage, onclose, onerror}) {
    const response = await fetchEventSource(URL, {
        method: "POST",
        headers: {
            // 智谱AI平台的接口密钥
            "Authorization": `Bearer ${store.state.setting.api_key}`,
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
            'X-DashScope-SSE': 'enable'
        },
        body: JSON.stringify(preProcess(model_version, prompt, history, groupIndex)),
        signal: controller.signal,
        // 连接成功时的处理
        onopen,
        // 接收到消息时的处理
        onmessage,
        // 连接关闭时的处理
        onclose,
        // 处理错误
        onerror
    });
}