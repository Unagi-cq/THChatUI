/**
 * 前处理（入参）规则处理
 * @param model_version 模型版本
 * @param prompt 用户输入
 * @param history 历史记录
 * @param groupIndex
 */
function preProcess(model_version, prompt, history, groupIndex) {
    let body = {};

    if (groupIndex === 0) {
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
    } else if (groupIndex === 1) {
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
    } else if (groupIndex === 2) {
        body = {
            model: model_version,
            messages: getParams(prompt, history),
            stream: true
        }
    }

    return body;
}

/**
 * 后处理（出参）规则处理
 * @param e 接口传递数据
 * @param groupIndex 后处理组索引
 */
function postProcess(e, groupIndex) {
    if (groupIndex === 0) {
        return JSON.parse(e.data).output.choices[0].message.content;
    } else if (groupIndex === 1) {
        return e;
    } else if (groupIndex === 2) {
        return JSON.parse(e.data).choices[0].delta.content;
    }
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
    const array = [
        {
            "role": "system",
            "content": "You are a helpful assistant."
        }
    ];
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

module.exports = {
    /**
     * 可选模型组 项目的设置页面中模型的可选项在此处定义 并配置好前处理和后处理规则
     * @param {string} label 设置页面模型名称
     * @param {string} value 设置页面模型值
     * @param {number} pre_group 该模型预处理组 拼接指定形式request body
     * @param {number} post_group 该模型后处理组 解析不同格式的response body
     */
    model_list: {
        "Ali_DashScope" : [
            {label: "通义千问（qwen-turbo）", value: "qwen;qwen-turbo", pre_group: 0, post_group: 0},
            {label: "通义千问（qwen-plus）", value: "qwen;qwen-plus", pre_group: 0, post_group: 0},
            {label: "通义千问（qwen-max）", value: "qwen;qwen-max", pre_group: 0, post_group: 0},
            {label: "通义千问（qwen-max-0428）", value: "qwen;qwen-max-0428", pre_group: 0, post_group: 0},
            {label: "通义千问（qwen-max-0403）", value: "qwen;qwen-max-0403", pre_group: 0, post_group: 0},
            {label: "通义千问（qwen-max-0107）", value: "qwen;qwen-max-0107", pre_group: 0, post_group: 0},
            {label: "通义千问（qwen-max-longcontext）", value: "qwen;qwen-max-longcontext", pre_group: 0, post_group: 0},
            {label: "百川（baichuan-7b-v1）", value: "baichuan;baichuan-7b-v1", pre_group: 0, post_group: 0},
            {label: "百川（baichuan2-7b-chat-v1）", value: "baichuan;baichuan2-7b-chat-v1", pre_group: 0, post_group: 0},
            // {label: "LlaMa（llama2-7b-chat-v2）", value: "llama;llama2-7b-chat-v2", pre_group: 0, post_group: 0},
            // {label: "LlaMa（llama2-13b-chat-v2）", value: "llama;llama2-13b-chat-v2", pre_group: 0, post_group: 0},
            {label: "ChatGLM(chatglm3-6b)", value: "zhipu;chatglm3-6b", pre_group: 0, post_group: 0},
        ],
        "Xunfei_Spark": [
            {label: "讯飞星火（Spark Lite）", value: "xunfei;spark lite", pre_group: 1, post_group: 1}
        ],
        "Zhipu_BigModel": [
            {label: "智谱（glm-4）", value: "zhipu;glm-4", pre_group: 2, post_group: 2},
            {label: "智谱（glm-3-turbo）", value: "zhipu;glm-3-turbo", pre_group: 2, post_group: 2},
        ]
    },
    preProcess: preProcess,
    postProcess: postProcess
}
/**
 * 前处理（入参）规则
 * === 第0组 阿里云
 * {
 *     "model": "qwen-turbo",
 *     "input":{
 *         "messages":[
 *             {
 *                 "role": "system",
 *                 "content": "You are a helpful assistant."
 *             },
 *             {
 *                 "role": "user",
 *                 "content": "'"$user_content"'"
 *             }
 *         ]
 *     },
 *     "parameters": {
 *         "result_format": "message",
 *         "incremental_output": true
 *     }
 * }
 *
 * === 第1组 讯飞
 * {
 *         "header": {
 *             "app_id": "12345",
 *             "uid": "12345"
 *         },
 *         "parameter": {
 *             "chat": {
 *                 "domain": "generalv3.5",
 *                 "temperature": 0.5,
 *                 "max_tokens": 1024,
 *             }
 *         },
 *         "payload": {
 *             "message": {
 *                 # 如果想获取结合上下文的回答，需要开发者每次将历史问答信息一起传给服务端，如下示例
 *                 # 注意：text里面的所有content内容加一起的tokens需要控制在8192以内，开发者如有较长对话需求，需要适当裁剪历史信息
 *                 "text": [
 *                     {"role":"system","content":"你现在扮演李白，你豪情万丈，狂放不羁；接下来请用李白的口吻和用户对话。"} #设置对话背景或者模型角色
 *                     {"role": "user", "content": "你是谁"} # 用户的历史问题
 *                     {"role": "assistant", "content": "....."}  # AI的历史回答结果
 *                     # ....... 省略的历史对话
 *                     {"role": "user", "content": "你会做什么"}  # 最新的一条问题，如无需上下文，可只传最新一条问题
 *                 ]
 *         }
 *     }
 * }
 *
 * === 第2组 智谱
 * {
 *     "model": "glm-4",
 *     "messages": [
 *         {
 *             "role": "user",
 *             "content": "你好"
 *         }
 *     ]
 * }
 */


/**
 * 后处理（出参）规则
 * === 第0组 阿里云
 * {
 *     "output": {
 *         "choices": [
 *             {
 *                 "finish_reason": "stop",
 *                 "message": {
 *                     "role": "assistant",
 *                     "content": "模型的回复"
 *                 }
 *             }
 *         ]
 *     },
 *     "usage": {
 *         "total_tokens": 97,
 *         "output_tokens": 73,
 *         "input_tokens": 24
 *     },
 *     "request_id": "0105f672-d7b4-9172-9d03-51c669ec830a"
 * }
 *
 * === 第1组 讯飞
 * "模型的回复"
 *
 * === 第2组 智谱
 * {
 *   "created": 1703487403,
 *   "id": "8239375684858666781",
 *   "model": "glm-4",
 *   "request_id": "8239375684858666781",
 *   "choices": [
 *       {
 *           "finish_reason": "stop",
 *           "index": 0,
 *           "message": {
 *               "content": "模型的回复",
 *               "role": "assistant"
 *           }
 *       }
 *   ],
 *   "usage": {
 *       "completion_tokens": 217,
 *       "prompt_tokens": 31,
 *       "total_tokens": 248
 *   }
 * }
 */