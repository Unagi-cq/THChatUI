/**
 * @description 阿里云平台的接口采用SSE请求方式，直接调会跨域，需要配代理，部署在服务器上之后也需要配置代理，详情可以参考本项目的文档
 */
import {fetchEventSource} from "@microsoft/fetch-event-source";
import {preProcess} from "@/util/config"
// 引入 store
import store from '../../store';

// 阿里云平台的接口地址 在项目内部设置了跨域 所以拼接了字符串"/ali/remote" 对应项目里面的代理配置 vue.config.js
const LLM_URL = "/ali/remote/api/v1/services/aigc/text-generation/generation";
const VL_URL = "/ali/remote/api/v1/services/aigc/multimodal-generation/generation";


/**
 * 调用阿里云平台的接口
 * @param prompt 用户输入的问题
 * @param history 历史对话消息 在SendBox中限制最多三轮
 * @param controller 控制请求的取消
 * @param onopen 连接成功时的回调函数
 * @param onmessage 接收到消息时的回调函数
 * @param onclose 连接关闭时的回调函数
 * @param onerror 处理错误时的回调函数
 * @returns {Promise<void>}
 */
export async function fenchStream({prompt, history, files, controller, onopen, onmessage, onclose, onerror}) {
    let model_version = store.state.setting.model_config.version;
    let pre_method = store.state.setting.model_config.pre_method;
    let api_key = store.state.setting.api_key_map[store.state.setting.platform];
    let url = store.state.setting.model_config.type === 'llm' ? LLM_URL : VL_URL;
    let is_search = store.state.setting.model_config.can_web_search && store.state.setting.chat_type === 'web';

    const response = await fetchEventSource(url, {
        method: "POST",
        headers: {
            // 阿里云平台的Key 需要去阿里云平台申请
            "Authorization": `Bearer ${api_key}`,
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
            'X-DashScope-SSE': 'enable'
        },
        body: JSON.stringify(preProcess(model_version, prompt, history, pre_method, files, is_search)),
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
    });
}

