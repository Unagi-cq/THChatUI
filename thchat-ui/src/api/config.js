module.exports = {
    /**
     * 模型列表
     */
    model_list: {
        "Ali_DashScope": {
            platform_name: "阿里云百炼",
            avatar: "alibabacloud",
            list: [
                { type: "llm", series: "qwen", version: "qwen-turbo-latest", can_web_search: true },
                { type: "llm", series: "qwen", version: "qwen-plus-latest", can_web_search: true },
                { type: "llm", series: "qwen", version: "qwen-max-latest", can_web_search: true },
                { type: "llm", series: "qwen", version: "qwen-math-turbo-latest" },
                { type: "llm", series: "qwen", version: "qwen-coder-plus-latest" },
                { type: "llm", series: "qwen", version: "qwq-plus-latest" },
                { type: "llm", series: "deepseek", version: "deepseek-r1" },
                { type: "vim", series: "qwen", version: "qvq-max-latest" },
                { type: "vim", series: "qwen", version: "qwen-vl-max-latest" },
                { type: "vim", series: "qwen", version: "qwen-vl-plus-latest" },
                { type: "vim", series: "qwen", version: "qwen-vl-ocr-latest" },
            ],
            api_key_config: {
                api_key: "",
                apply_url: "https://bailian.console.aliyun.com/?tab=app#/api-key"
            },
            model_config: {
                form_items: [
                    { label: "模型类型", key: "type", options: ["llm", "vim"] },
                    { label: "模型调用名称", key: "version" },
                    { label: "Web搜索能力", key: "can_web_search", tooltip: "是否拥有内置联网搜索能力，可以通过尝试询问当日新闻来判断" }
                ],
                rules: {
                    type: [{ required: true, message: '请选择模型类型' }],
                    version: [{ required: true, message: '请输入模型调用名称，模型的官方调用名称' }],
                    can_web_search: [{ required: false, message: '请选择模型是否拥有内置联网搜索能力' }]
                }
            }
        },
        "Azure":
        {
            platform_name: "Azure",
            avatar: "azure",
            list: [],
            model_config: {
                form_items: [
                    { label: "模型类型", key: "type", options: ["llm"] },
                    { label: "模型调用名称", key: "version" },
                    { label: "模型调用地址", key: "endpoint" },
                    { label: "API-KEY", key: "api_key" }
                ],
                rules: {
                    type: [{ required: true, message: '请选择模型类型' }],
                    version: [{ required: true, message: '请输入模型调用名称，模型的官方调用名称' }],
                    endpoint: [{ required: true, message: '请输入模型调用地址' }],
                    api_key: [{ required: true, message: '请输入API-KEY' }],
                }
            }
        },
        "Baidu_QianFan":
        {
            platform_name: "百度千帆",
            avatar: "baiducloud",
            list: [
                { type: "llm", series: "baiducloud", version: "ernie-4.5-turbo-128k", can_web_search: true },
                { type: "llm", series: "baiducloud", version: "ernie-4.5-turbo-32k", can_web_search: true },
                { type: "llm", series: "baiducloud", version: "deepseek-r1" },
                { type: "vim", series: "baiducloud", version: "ernie-4.5-turbo-vl-32k" },
            ],
            api_key_config: {
                api_key: "",
                apply_url: "https://console.bce.baidu.com/iam/#/iam/apikey/list"
            },
            model_config: {
                form_items: [
                    { label: "模型类型", key: "type", options: ["llm", "vim"] },
                    { label: "模型调用名称", key: "version" },
                    { label: "Web搜索能力", key: "can_web_search", tooltip: "是否拥有内置联网搜索能力，可以通过尝试询问当日新闻来判断" }
                ],
                rules: {
                    type: [{ required: true, message: '请选择模型类型' }],
                    version: [{ required: true, message: '请输入模型调用名称，模型的官方调用名称' }],
                    can_web_search: [{ required: false, message: '请选择模型是否拥有内置联网搜索能力' }]
                }
            }
        },
        "Dify": {
            platform_name: "Dify",
            avatar: "dify",
            list: [],
            model_config: {
                form_items: [
                    { label: "模型类型", key: "type", options: ["llm"] },
                    { label: "API-KEY", key: "api_key" },
                    { label: "Base-URL", key: "base_url" },
                    { label: "应用名称", key: "version" , tooltip: "自己起一个名字，方便在THChatUI平台展示"}
                ],
                rules: {
                    type: [{ required: true, message: '请选择模型类型' }],
                    api_key: [{ required: true, message: '请输入API-KEY' }],
                    base_url: [{ required: true, message: '请输入Base-URL' }]
                },
                meto: "目前只支持Dify平台【聊天助手】【Agent】【Chatflow】三个模式的引入，即仅支持/chat-messages接口，不支持【工作流】。"
            }
        },
        "Google_AI": {
            platform_name: "谷歌AI",
            avatar: "google",
            list: [
                { type: "llm", series: "gemini", version: "gemini-2.5-pro-preview-03-25" },
                { type: "llm", series: "gemini", version: "gemini-2.0-flash" },
                { type: "llm", series: "gemini", version: "gemini-1.5-flash" },
                { type: "llm", series: "gemini", version: "gemini-1.5-pro" },
                { type: "vim", series: "gemini", version: "gemini-2.5-pro-preview-03-25" },
                { type: "vim", series: "gemini", version: "gemini-2.0-flash" },
                { type: "vim", series: "gemini", version: "gemini-1.5-flash" },
                { type: "vim", series: "gemini", version: "gemini-1.5-pro" },
            ],
            api_key_config: {
                api_key: "",
                apply_url: "https://aistudio.google.com/app/apikey"
            },
            model_config: {
                form_items: [
                    { label: "模型类型", key: "type", options: ["llm", "vim"] },
                    { label: "模型调用名称", key: "version" }
                ],
                rules: {
                    type: [{ required: true, message: '请选择模型类型' }],
                    version: [{ required: true, message: '请输入模型调用名称，模型的官方调用名称' }]
                }
            }
        },
        "Moonshot_AI":
        {
            platform_name: "月之暗面",
            avatar: "moonshot",
            list: [
                { type: "llm", series: "moonshot", version: "moonshot-v1-8k" },
                { type: "llm", series: "moonshot", version: "moonshot-v1-32k" },
                { type: "llm", series: "moonshot", version: "moonshot-v1-128k" }
            ],
            api_key_config: {
                api_key: "",
                apply_url: "https://platform.moonshot.cn/console/api-keys"
            },
            model_config: {
                form_items: [
                    { label: "模型类型", key: "type", options: ["llm"] },
                    { label: "模型调用名称", key: "version" },
                ],
                rules: {
                    type: [{ required: true, message: '请选择模型类型' }],
                    version: [{ required: true, message: '请输入模型调用名称，模型的官方调用名称' }],
                }
            }
        },
        "SiliconFlow":
        {
            platform_name: "硅基流动",
            avatar: "siliconflow",
            list: [
                { type: "llm", series: "deepseek", version: "deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B" },
                { type: "llm", series: "qwen", version: "Qwen/Qwen2-7B-Instruct" }
            ],
            api_key_config: {
                api_key: "",
                apply_url: "https://cloud.siliconflow.cn/account/ak"
            },
            model_config: {
                form_items: [
                    { label: "模型类型", key: "type", options: ["llm"] },
                    { label: "模型调用名称", key: "version" },
                ],
                rules: {
                    type: [{ required: true, message: '请选择模型类型' }],
                    version: [{ required: true, message: '请输入模型调用名称，模型的官方调用名称' }],
                }
            }
        },
        "TT_Volcengine":
        {
            platform_name: "火山方舟",
            avatar: "volcengine",
            list: [
                { type: "llm", series: "volcengine", version: "doubao-1-5-pro-32k-250115" },
                { type: "llm", series: "volcengine", version: "deepseek-v3-250324" },
                { type: "llm", series: "volcengine", version: "doubao-1-5-lite-32k-250115" },
                { type: "llm", series: "volcengine", version: "doubao-1-5-thinking-pro-250415" },
                { type: "llm", series: "volcengine", version: "deepseek-r1-250120" },
                { type: "vim", series: "volcengine", version: "doubao-1.5-vision-pro-250328" }
            ],
            api_key_config: {
                api_key: "",
                apply_url: "https://console.volcengine.com/ark/region:ark+cn-beijing/apiKey"
            },
            model_config: {
                form_items: [
                    { label: "模型类型", key: "type", options: ["llm", "vim"] },
                    { label: "模型调用名称", key: "version" },
                ],
                rules: {
                    type: [{ required: true, message: '请选择模型类型' }],
                    version: [{ required: true, message: '请输入模型调用名称，模型的官方调用名称' }],
                }
            }
        },
        "Xunfei_Spark":
        {
            platform_name: "讯飞星火",
            avatar: "spark",
            list: [
                { type: "llm", series: "spark", version: "spark lite" }
            ]
        },
        "Zhipu_BigModel":
        {
            platform_name: "智谱AI",
            avatar: "zhipu",
            list: [
                { type: "llm", series: "zhipu", version: "glm-4-flash" },
                { type: "llm", series: "zhipu", version: "glm-4-0520" },
                { type: "llm", series: "zhipu", version: "glm-4-air" },
                { type: "llm", series: "zhipu", version: "glm-4-plus" },
                { type: "llm", series: "zhipu", version: "glm-4-long" },
                { type: "llm", series: "zhipu", version: "glm-4-flashx" },
                { type: "llm", series: "zhipu", version: "glm-4-airx" },
                { type: "llm", series: "zhipu", version: "glm-4" },
                { type: "vim", series: "zhipu", version: "glm-4v" },
                { type: "igm", series: "zhipu", version: "cogview-3-flash" },
                { type: "igm", series: "zhipu", version: "cogview-3" },
                { type: "igm", series: "zhipu", version: "cogview-3-plus" },
            ],
            api_key_config: {
                api_key: "",
                apply_url: "https://open.bigmodel.cn/usercenter/proj-mgmt/apikeys"
            },
            model_config: {
                form_items: [
                    { label: "模型类型", key: "type", options: ["llm", "vim", "igm"] },
                    { label: "模型调用名称", key: "version" },
                ],
                rules: {
                    type: [{ required: true, message: '请选择模型类型' }],
                    version: [{ required: true, message: '请输入模型调用名称，模型的官方调用名称' }],
                }
            }
        },
        "Local":
        {
            platform_name: "本地调用",
            avatar: "local",
            list: [
                { type: "llm", series: "local", version: "llm_local", can_web_search: true },
                { type: "vim", series: "local", version: "vim_local" },
                { type: "igm", series: "local", version: "igm_local" },
            ]
        }
    }
}