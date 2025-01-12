import { fetchEventSource } from "@microsoft/fetch-event-source"
import { preProcess } from "@/util/config"
import store from '../../store';

// 定义不同类型模型的请求地址
const API_URLS = {
    llm: "/local/chat/stream",
    vim: "/local/vim/stream",
    igm: "/local/igm/generate"
};

/**
 * 本地接口
 * @param prompt 用户输入的问题
 * @param history 历史对话消息 在SendBox中限制最多三轮
 * @param controller 控制请求的取消
 * @param onopen 连接成功时的回调函数
 * @param onmessage 接收到消息时的回调函数
 * @param onclose 连接关闭时的回调函数
 * @param onerror 处理错误时的回调函数
 * @returns {Promise<void>}
 */
export async function fetchAPI({prompt, history, files, controller, onopen, onmessage, onclose, onerror}) {
    const { setting } = store.state;
    const { model_config, web_search_enabled } = setting;
    const { version, pre_method, type, can_web_search } = model_config;

    const url = API_URLS[type] || API_URLS.llm;
    const is_search = (can_web_search !== undefined && can_web_search) && web_search_enabled;

    // 如果是图片生成接口，使用普通的fetch请求
    if (type === 'igm') {
        onopen({ status: 200 });
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
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

    const response = await fetchEventSource(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept':'text/event-stream'
        },
        body: JSON.stringify(preProcess(version, prompt, history, pre_method, files, is_search)),
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