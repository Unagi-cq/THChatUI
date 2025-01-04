/**
 * 前处理(入参)规则处理
 * @param model_version 模型版本
 * @param prompt 用户输入
 * @param history 历史记录
 * @param pre_method 前处理组key
 * @param files 上传的文件
 * @param is_search 是否开启web搜索
 */
function preProcess(model_version, prompt, history, pre_method, files, is_search) {
    let body = {};
    console.log(is_search);
    switch (pre_method) {
        // 阿里平台的文本输入格式
        case "text_ali":
            body = {
                model: model_version,
                input: {
                    messages: buildLlmMessage(prompt, history)
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
        // 百度平台的文本输入格式
        case "text_baidu":
            body = {
                model: model_version,
                messages: buildLlmMessage(prompt, history),
                stream: true
            }
            if (is_search) {
                body.web_search = {
                    enable: true
                };
            }
            break;
        // 讯飞平台的文本输入格式
        case "text_xunfei":
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
                        text: buildLlmMessage(prompt, history)
                    },
                },
            }
            break;
        // 智谱AI和月之暗面的文本输入格式
        case "text_moonshot_zhipu":
            body = {
                model: model_version,
                messages: buildLlmMessage(prompt, history),
                stream: true
            }
            break;
        // 阿里平台的图片输入格式
        case "img_ali":
            body = {
                model: model_version,
                input: {
                    messages: buildAliVLMessage(prompt, history, files[0])
                },
                parameters: {
                    result_format: "message",
                    incremental_output: true
                }
            }
            break;
        // 智谱AI平台的图片输入格式
        case "img_zhipu":
            body = {
                model: model_version,
                messages: buildZhipuVLMessage(prompt, history, files[0]),
                stream: true
            }
            break;
        // 智谱AI平台的图片生成模型输入格式
        case "igm_zhipu":
            body = {
                model: model_version,
                prompt: prompt
            }
            break;
    }
    return body;
}

/**
 * 构建LLM消息
 * @param prompt 用户输入
 * @param history 历史记录
 * @returns {*[]}
 */
function buildLlmMessage(prompt, history) {
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
 * @param prompt 用户输入
 * @param history 历史记录
 * @param files 上传的文件
 * @returns {*[]} 
 */
function buildZhipuVLMessage(prompt, history, files) {
    function getHistory(history) {
        const array = [];
        // 排除最后一条 history，因为是本次刚发的消息
        for (let i = 0; i < history.length - 1; i++) {
            const chat = history[i];
            array.push({
                "role": "user",
                "content": { "type": "text", "text": chat.query }
            });
            array.push({
                "role": "assistant",
                "content": { "type": "text", "text": chat.answer }
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

/**
 * 构建阿里云多模态消息
 * @param prompt 用户输入
 * @param history 历史记录
 * @param files 上传的文件
 * @returns {*[]} 
 */
function buildAliVLMessage(prompt, history, files) {
    function getHistory(history) {
        const array = [];
        // 排除最后一条 history，因为是本次刚发的消息
        for (let i = 0; i < history.length - 1; i++) {
            const chat = history[i];
            array.push({
                "role": "user",
                "content": { "text": chat.query }
            });
            array.push({
                "role": "assistant",
                "content": { "text": chat.answer }
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



/**
 * 后处理(出参)规则处理
 * @param e 接口传递数据
 * @param post_method 后处理组索引
 */
function postProcess(e, post_method) {
    switch (post_method) {
        case "base":
            return JSON.parse(e.data).output.choices[0].message.content;
        case "text":
            const content = JSON.parse(e.data).output.choices[0].message.content;
            return content && content.length > 0 ? content[0].text : '';
        case "add":
            return e;
        case "delta":
            return JSON.parse(e.data).choices[0].delta.content;
        case "baidu":
            return JSON.parse(e.data).result;
        case "local":
            return JSON.parse(e.data).data;
        case "igm_zhipu":
            return e.data[0].url;
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
        "Ali_DashScope": {
            platform_name: "阿里云百炼",
            list: [
                { type: "llm", name: "qwen-turbo", series: "qwen", version: "qwen-turbo-latest", pre_method: "text_ali", post_method: "base", can_web_search: true },
                { type: "llm", name: "qwen-plus", series: "qwen", version: "qwen-plus-latest", pre_method: "text_ali", post_method: "base", can_web_search: true },
                { type: "llm", name: "qwen-max", series: "qwen", version: "qwen-max-latest", pre_method: "text_ali", post_method: "base", can_web_search: true },
                { type: "llm", name: "qwen-math-turbo", series: "qwen", version: "qwen-math-turbo-latest", pre_method: "text_ali", post_method: "base" },
                { type: "llm", name: "qwen-coder-plus", series: "qwen", version: "qwen-coder-plus-latest", pre_method: "text_ali", post_method: "base" },
                { type: "vim", name: "qwen-vl-max", series: "qwen", version: "qwen-vl-max-latest", pre_method: "img_ali", post_method: "text" },
                { type: "vim", name: "qwen-vl-plus", series: "qwen", version: "qwen-vl-plus-latest", pre_method: "img_ali", post_method: "text" },
                { type: "vim", name: "qwen-vl-ocr", series: "qwen", version: "qwen-vl-ocr-latest", pre_method: "img_ali", post_method: "text" },
            ],
            api_key: "", // 不要在配置文件中填写api key
            description: "通义千问系列模型，支持流式输出"
        },
        "Baidu_QianFan":
        {
            platform_name: "百度千帆",
            list: [
                { type: "llm", name: "ernie-4.0-8k", series: "wenxin", version: "ernie-4.0-8k-latest", pre_method: "text_baidu", post_method: "baidu", can_web_search: true },
                { type: "llm", name: "ernie-speed-128k", series: "wenxin", version: "ernie-speed-128k", pre_method: "text_baidu", post_method: "baidu" },
                { type: "llm", name: "ernie-tiny-8k", series: "wenxin", version: "ernie-tiny-8k", pre_method: "text_baidu", post_method: "baidu" },
                { type: "llm", name: "ernie-lite-8k", series: "wenxin", version: "ernie-lite-8k", pre_method: "text_baidu", post_method: "baidu" },
                { type: "llm", name: "Yi-34B-Chat", series: "yi", version: "yi_34b_chat", pre_method: "text_baidu", post_method: "baidu" }
            ],
            api_key: "", // 不要在配置文件中填写api key
        },
        "Moonshot_AI":
        {
            platform_name: "月之暗面",
            list: [
                { type: "llm", name: "moonshot-v1-8k", series: "moonshot", version: "moonshot-v1-8k", pre_method: "text_moonshot_zhipu", post_method: "delta" },
                { type: "llm", name: "moonshot-v1-32k", series: "moonshot", version: "moonshot-v1-32k", pre_method: "text_moonshot_zhipu", post_method: "delta" },
                { type: "llm", name: "moonshot-v1-128k", series: "moonshot", version: "moonshot-v1-128k", pre_method: "text_moonshot_zhipu", post_method: "delta" }
            ],
            api_key: "", // 不要在配置文件中填写api key
        },
        "Xunfei_Spark":
        {
            platform_name: "讯飞星火",
            list: [
                { type: "llm", name: "Spark Lite 🆓", series: "xunfei", version: "spark lite", pre_method: "text_xunfei", post_method: "add" }
            ],
            api_key: "", // 不要在配置文件中填写api key
        },
        "Zhipu_BigModel":
        {
            platform_name: "智谱AI",
            list: [
                { type: "llm", name: "glm-4-flash 🆓", series: "zhipu", version: "glm-4-flash", pre_method: "text_moonshot_zhipu", post_method: "delta" },
                { type: "llm", name: "glm-4-0520", series: "zhipu", version: "glm-4-0520", pre_method: "text_moonshot_zhipu", post_method: "delta" },
                { type: "llm", name: "glm-4-air", series: "zhipu", version: "glm-4-air", pre_method: "text_moonshot_zhipu", post_method: "delta" },
                { type: "llm", name: "glm-4-plus", series: "zhipu", version: "glm-4-plus", pre_method: "text_moonshot_zhipu", post_method: "delta" },
                { type: "llm", name: "glm-4-long", series: "zhipu", version: "glm-4-long", pre_method: "text_moonshot_zhipu", post_method: "delta" },
                { type: "llm", name: "glm-4-flashx", series: "zhipu", version: "glm-4-flashx", pre_method: "text_moonshot_zhipu", post_method: "delta" },
                { type: "llm", name: "glm-4-airx", series: "zhipu", version: "glm-4-airx", pre_method: "text_moonshot_zhipu", post_method: "delta" },
                { type: "llm", name: "glm-4", series: "zhipu", version: "glm-4", pre_method: "text_moonshot_zhipu", post_method: "delta" },
                { type: "vim", name: "glm-4v", series: "zhipu", version: "glm-4v", pre_method: "img_zhipu", post_method: "delta" },
                { type: "igm", name: "cogview-3-flash 🆓", series: "zhipu", version: "cogview-3-flash", pre_method: "igm_zhipu", post_method: "igm_zhipu" },
                { type: "igm", name: "cogview-3", series: "zhipu", version: "cogview-3", pre_method: "igm_zhipu", post_method: "igm_zhipu" },
                { type: "igm", name: "cogview-3-plus", series: "zhipu", version: "cogview-3-plus", pre_method: "igm_zhipu", post_method: "igm_zhipu" },
            ],
            api_key: "", // 不要在配置文件中填写api key
        },
        "Local":
        {
            platform_name: "本地模型调用",
            list: [
                { type: "llm", name: "本地模型", series: "local", version: "local", post_method: "local", can_web_search: true }
            ],
            api_key: "", // 不要在配置文件中填写api key
            description: "为了更强的自定义性，本地模型调用时，多轮对话数据不在前端项目作预处理，而是在本地调用时的接口里处理；api_key依然预留传值写法。"
        }
    },
    /**
     * 前处理(入参)规则处理
     */
    preProcess: preProcess,
    /**
     * 后处理(出参)规则处理
     */
    postProcess: postProcess
}