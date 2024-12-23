/**
 * 前处理（入参）规则处理
 * @param model_version 模型版本
 * @param prompt 用户输入
 * @param history 历史记录
 * @param pre_method 前处理组key
 */
function preProcess(model_version, prompt, history, pre_method) {
    let body = {};
    switch (pre_method) {
        case "base":
            body = {
                model: model_version,
                input: {
                    messages: getParams(prompt, history)
                },
                parameters: {
                    result_format: "message",
                    incremental_output: true
                }
            }
            break;
        case "xunfei":
            body = {
                parameter: {
                    chat: {
                        domain: "general",
                        temperature: 0.5,
                        max_tokens: 1024,
                    },
                },
                payload: {
                    message: {
                        text: getParams(prompt, history)
                    },
                },
            }
            break;
        case "simple":
            body = {
                model: model_version,
                messages: getParams(prompt, history),
                stream: true
            }
            break;
    }
    return body;
}

function getParams(prompt, history) {
    let arr = getHistory(history)
    arr.push({
        "role": "user",
        "content": prompt
    })
    return arr;
}

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

/**
 * 后处理（出参）规则处理
 * @param e 接口传递数据
 * @param post_method 后处理组索引
 */
function postProcess(e, post_method) {
    switch (post_method) {
        case "base":
            return JSON.parse(e.data).output.choices[0].message.content;
        case "add":
            return e;
        case "delta":
            return JSON.parse(e.data).choices[0].delta.content;
        case "baidu":
            return JSON.parse(e.data).result;
        default:
            console.warn(`未知的后处理方法: ${post_method}`);
            return e;
    }
}

module.exports = {
    /**
     * 模型列表
     */
    model_list: {
        "Ali_DashScope" : {
            platform_name: "阿里云百炼",
            list: [
                { type: "llm", name: "通义千问（qwen-turbo）", series: "qwen", version: "qwen-turbo", pre_method: "base", post_method: "base"},
                { type: "llm", name: "通义千问（qwen-plus）", series: "qwen", version: "qwen-plus", pre_method: "base", post_method: "base"},
                { type: "llm", name: "通义千问（qwen-max）", series: "qwen", version: "qwen-max", pre_method: "base", post_method: "base"},
                { type: "llm", name: "通义千问（qwen-max-0428）", series: "qwen", version: "qwen-max-0428", pre_method: "base", post_method: "base"},
                { type: "llm", name: "通义千问（qwen-max-0403）", series: "qwen", version: "qwen-max-0403", pre_method: "base", post_method: "base"},
                { type: "llm", name: "通义千问（qwen-max-0107）", series: "qwen", version: "qwen-max-0107", pre_method: "base", post_method: "base"},
                { type: "llm", name: "通义千问（qwen-max-longcontext）", series: "qwen", version: "qwen-max-longcontext", pre_method: "base", post_method: "base"},
                { type: "llm", name: "百川（baichuan-7b-v1）", series: "baichuan", version: "baichuan-7b-v1", pre_method: "base", post_method: "base"},
                { type: "llm", name: "百川（baichuan2-7b-chat-v1）", series: "baichuan", version: "baichuan2-7b-chat-v1", pre_method: "base", post_method: "base"},
                { type: "llm", name: "智谱（chatglm3-6b）", series: "zhipu", version: "chatglm3-6b", pre_method: "base", post_method: "base"}
            ],
            description: "通义千问系列模型，支持流式输出"
        },
        "Xunfei_Spark":
        {
            platform_name: "讯飞星火",
            list: [
                { type: "llm", name: "【⭐免费】讯飞星火（Spark Lite）", series: "xunfei", version: "spark lite", pre_method: "xunfei", post_method: "add"}
            ]
        },
        "Zhipu_BigModel":
        {
            platform_name: "智谱AI",
            list: [
                { type: "llm", name: "【⭐免费】智谱（glm-4-flash）", series: "zhipu", version: "glm-4-flash", pre_method: "simple", post_method: "delta"},
                { type: "llm", name: "智谱（glm-4-0520）", series: "zhipu", version: "glm-4-0520", pre_method: "simple", post_method: "delta"},
                { type: "llm", name: "智谱（glm-4-air）", series: "zhipu", version: "glm-4-air", pre_method: "simple", post_method: "delta"},
                { type: "llm", name: "智谱（glm-4-plus）", series: "zhipu", version: "glm-4-plus", pre_method: "simple", post_method: "delta"},
                { type: "llm", name: "智谱（glm-4-long）", series: "zhipu", version: "glm-4-long", pre_method: "simple", post_method: "delta"},
                { type: "llm", name: "智谱（glm-4-flashx）", series: "zhipu", version: "glm-4-flashx", pre_method: "simple", post_method: "delta"},
                { type: "llm", name: "智谱（glm-4-airx）", series: "zhipu", version: "glm-4-airx", pre_method: "simple", post_method: "delta"},
                { type: "llm", name: "智谱（glm-4）", series: "zhipu", version: "glm-4", pre_method: "simple", post_method: "delta"},
            ]
        },
        "Baidu_QianFan":
        {
            platform_name: "百度千帆",
            list: [
                { type: "llm", name: "文心（ernie-speed-128k）", series: "wenxin", version: "ernie-speed-128k", pre_method: "simple", post_method: "baidu"},
                { type: "llm", name: "文心（ernie-tiny-8k）", series: "wenxin", version: "ernie-tiny-8k", pre_method: "simple", post_method: "baidu"},
                { type: "llm", name: "文心（ernie-lite-8k）", series: "wenxin", version: "ernie-lite-8k", pre_method: "simple", post_method: "baidu"},
                { type: "llm", name: "零一万物（Yi-34B-Chat）", series: "yi", version: "yi_34b_chat", pre_method: "simple", post_method: "baidu"}
            ]
        },
        "Local":
        {
            platform_name: "本地模型调用",
            list: [
                { type: "llm", name: "本地模型", series: "local", version: "local", pre_method: "base", post_method: "base"}
            ]
        }
    },
    /**
     * 前处理（入参）规则处理
     */
    preProcess: preProcess,
    /**
     * 后处理（出参）规则处理
     */
    postProcess: postProcess
}