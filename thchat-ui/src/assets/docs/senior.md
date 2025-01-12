[[toc]]

## 二次开发

请参考：[THChatUI V2 代码视频讲解教程](https://www.bilibili.com/video/BV1xTcVezEKP/)

## 数据schema

THChatUI运行时，数据存储在两个地方：
1. 浏览器缓存`LocalStorage`
2. 浏览器数据库`IndexedDB`

数据拆分成两个地方存储，`LocalStorage`存储的是用户设置，是可以被清空的，`IndexedDB`存储的是用户对话数据，一般来说是需要持久化存储的。因此，将需要存储的数据存在了`IndexedDB`中。并且还做了面向对象的封装，方便大家接入自己的数据库，详见`thchat-ui/src/schema/`。

### 浏览器缓存
以下是THChatUI运行时存储在浏览器缓存`LocalStorage`的数据结构示例：
```json
{
    "settingStorage": {
        // 系统主题
        theme: 'light',
        // 背景图片
        bg: bg,
        // 是否显示回答统计
        chat_detail: true,
        // api_key
        api_key_map: {
            Ali_DashScope: "",
            Baidu_QianFan: "",
            Moonshot_AI: "",
            Xunfei_Spark: "",
            Zhipu_BigModel: "",
            OpenAI: {
                endpoint: "",
                api_key: "",
                model_name: ""
            },
            Local: ""
        },
        // 平台
        platform: 'Xunfei_Spark',
        // 是否多轮对话
        memory: true,
        // 历史对话轮数限制
        memory_limit: 3,
        // 模型配置
        model_config: {
            // 模型类型
            type: "llm",
            // 模型名称
            name: "Spark Lite 🆓",
            // 模型系列
            series: "xunfei",
            // 模型版本
            version: "spark lite",
            // 前处理组索引
            pre_method: "text_xunfei",
            // 后处理组索引
            post_method: "add"
        },
        // 输入框单次上传的文件数量
        upload_limit: 1,
        // 输入框可上传的文件类型 暂未接入其他多模态模型 所以只填图片
        upload_type: "image/",
        // 输入框限制文件大小 2MB
        upload_size: 2,
        // 一个chunk的最长字符数
        chunk_size: 500,
        // 限制文件大小 5MB
        kb_file_size: 5,
        // 召回数量
        recall_count: 3,
        // 选中的知识库
        selected_repoId: '',
        // 知识库启用状态
        kb_enabled: false,
        // 是否启用联网搜索
        web_search_enabled: false
    }
}
```

### 浏览器数据库 - 激活状态
```
# 表 active
# 值 
1715599712260
```

### 浏览器数据库 - 对话数据
```
# 表 chatStorage
# 值
{
    "list": [
        {
            "sessionId": 1736680973076,
            "data": [
                {
                    "qaId": 1736680973076,
                    "query": "你好",
                    "answer": "你好！很高兴为你提供帮助。",
                    "files": [],
                    "responseTime": 1736680973594,
                    "finishTime": 1736680973694,
                    "series": "qwen",
                    "modelName": "qwen-turbo",
                    "modelType": "llm"
                }
            ]
        }
    ]
}
```

### 浏览器数据库 - 知识库数据
```
# 表 kbStorage
# 值
{
    "statistics": {
        "totalRepositories": 1,
        "totalFiles": 1,
        "totalChunks": 1
    },
    "list": [
        {
            "repoId": 1736657169289,
            "name": "论文笔记",
            "createTime": "2025/1/12 12:46:09",
            "description": "啦啦啦",
            "list": [
                {
                    "fileId": 1736668174700,
                    "name": "孔乙己 .pdf",
                    "createTime": "2025/1/12 15:49:34",
                    "fileType": "pdf",
                    "url": "",
                    "size": 206752,
                    "showChunks": false,
                    "list": [
                        {
                            "chunkId": 1736668174700,
                            "content": "鲁迅   孔乙己   原文   鲁镇的酒店的...",
                            "contentLength": 490,
                            "words": [
                                "鲁迅",
                                "孔乙",
                                "己",
                                "原文",
                                "鲁镇",
                                "的",
                                "酒店",
                                "的",
                                ...
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}
```

### 浏览器数据库 - 会话标题数据
```
# 表 tabStorage
# 值
{
    "list": [
        {
            "title": "你好",
            "uuid": 1736680973076
        }
    ]
}
```
