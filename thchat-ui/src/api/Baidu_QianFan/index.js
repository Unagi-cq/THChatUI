/**
 * @fileoverview 百度千帆平台的HTTP调用。
 * 接口采用SSE请求方式，直接调会跨域，需要配代理，部署在服务器上之后也需要配置代理，详情可以参考本项目的文档
 */
import {fetchEventSource} from "@microsoft/fetch-event-source";
import {preProcess} from "@/util/config"
import store from '../../store';

// 定义不同类型模型的请求地址
const API_URLS = {
    llm: "/baidu/remote/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/",
    vim: "", // 预留图片理解模型接口
    igm: "" // 预留绘图模型接口
};

/**
 * 调用百度千帆平台的接口
 * @param {string} prompt - 用户输入的问题
 * @param {Array} history - 历史对话消息，在SendBox中限制最多三轮
 * @param {Array} files - 上传的文件列表
 * @param {AbortController} controller - 控制请求的取消
 * @param {Function} onopen - 连接成功时的回调函数
 * @param {Function} onmessage - 接收到消息时的回调函数
 * @param {Function} onclose - 连接关闭时的回调函数
 * @param {Function} onerror - 处理错误时的回调函数
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
    const { version, pre_method, type, can_web_search } = model_config;
    const api_key = setting.api_key_map[setting.platform];

    const url = (API_URLS[type] || API_URLS.llm) + version + '?access_token=' + api_key;
    const is_search = (can_web_search !== undefined && can_web_search) && web_search_enabled;

    const requestConfig = {
        method: "POST",
        headers: {
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

