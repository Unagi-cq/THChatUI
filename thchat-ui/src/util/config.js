/**
 * @fileoverview 聊天应用的配置文件
 * 包含模型配置、消息预处理和后处理的相关功能
 * 支持多个AI平台的接入，包括阿里云、百度、讯飞、智谱AI等
 */

/**
 * 前处理(入参)规则处理
 * @param {string} model_version - 模型版本标识
 * @param {string} prompt - 用户当前的输入内容
 * @param {Array} history - 历史对话记录数组
 * @param {string} pre_method - 预处理方法标识
 * @param {Array} files - 上传的文件数组，主要用于图像处理
 * @param {boolean} is_search - 是否启用网络搜索功能
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
        // 本地接口 文本输入格式
        case "local": 
            body = {
                input: {
                    prompt: prompt,
                    history: getLocalHistory(history),
                    files: files
                }
            };
            break;
        // 阿里平台的图片输入格式
        case "img_ali":
            body = {
                model: model_version,
                input: {
                    messages: buildAliVLMessage(prompt, history, files)
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
                messages: buildZhipuVLMessage(prompt, history, files),
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
 * 构建LLM文本对话消息
 * @param {string} prompt - 用户当前的输入内容
 * @param {Array} history - 历史对话记录数组
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
 * 构建智谱AI平台的多模态消息
 * @param {string} prompt - 用户当前的输入内容
 * @param {Array} history - 历史对话记录数组
 * @param {Array} files - 上传的文件数组，主要包含图片的base64数据
 */
function buildZhipuVLMessage(prompt, history, files) {
    function getHistory(history) {
        const array = [];
        // 排除最后一条 history，因为是本次刚发的消息
        for (let i = 0; i < history.length - 1; i++) {
            const chat = history[i];
            array.push({
                "role": "user",
                "content": [{ "type": "text", "text": chat.query }]
            });
            array.push({
                "role": "assistant",
                "content": [{ "type": "text", "text": chat.answer }]
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
 * 构建阿里云平台的多模态消息
 * @param {string} prompt - 用户当前的输入内容
 * @param {Array} history - 历史对话记录数组
 * @param {Array} files - 上传的文件数组，主要包含图片的base64数据
 */
function buildAliVLMessage(prompt, history, files) {
    function getHistory(history) {
        const array = [];
        // 排除最后一条 history，因为是本次刚发的消息
        for (let i = 0; i < history.length - 1; i++) {
            const chat = history[i];
            array.push({
                "role": "user",
                "content": [{ "text": chat.query }]
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

/**
 * 本地接口 拼接历史对话
 * @param history
 * @returns {*[]}
 */
function getLocalHistory(history) {
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

/**
 * 后处理(出参)规则处理
 * @param {Object} e - API返回的原始数据
 * @param {string} post_method - 后处理方法标识
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
        case "llm_local":
            if (e.event !== 'data') return '';
            // 解析chunk里面的data参数
            const data = JSON.parse(e.data);
            try {
                return data.data.content;
            } catch (e) {
                console.error(e)
            }
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
            ]
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
            ]
        },
        "Moonshot_AI":
        {
            platform_name: "月之暗面",
            list: [
                { type: "llm", name: "moonshot-v1-8k", series: "moonshot", version: "moonshot-v1-8k", pre_method: "text_moonshot_zhipu", post_method: "delta" },
                { type: "llm", name: "moonshot-v1-32k", series: "moonshot", version: "moonshot-v1-32k", pre_method: "text_moonshot_zhipu", post_method: "delta" },
                { type: "llm", name: "moonshot-v1-128k", series: "moonshot", version: "moonshot-v1-128k", pre_method: "text_moonshot_zhipu", post_method: "delta" }
            ]
        },
        "Xunfei_Spark":
        {
            platform_name: "讯飞星火",
            list: [
                { type: "llm", name: "Spark Lite 🆓", series: "xunfei", version: "spark lite", pre_method: "text_xunfei", post_method: "add" }
            ]
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
            ]
        },
        "OpenAI":
        {
            platform_name: "OpenAI",
            list: [
                { type: "llm", name: "llm", series: "default", version: "llm_default", pre_method: "text_moonshot_zhipu", post_method: "add" }
            ]
        },
        "Local":
        {
            platform_name: "本地调用",
            list: [
                { type: "llm", name: "对话模型", series: "local", version: "llm_local", pre_method: "local", post_method: "llm_local", can_web_search: true },
                { type: "vim", name: "图片理解模型", series: "local", version: "vim_local", pre_method: "local", post_method: "llm_local" },
                { type: "igm", name: "图片生成模型", series: "local", version: "igm_local", pre_method: "local", post_method: "igm_zhipu" },
            ]
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