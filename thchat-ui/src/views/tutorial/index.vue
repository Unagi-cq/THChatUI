<template>
    <div>
        <el-page-header @back="onBack" title="关闭" content="系统文档" :icon="CloseBold" style="margin-bottom: 15px;"></el-page-header>

        <el-row :gutter="24" justify="center">
            <el-col :md="18" :sm="24" :xs="24">
                    <div class="file-container dashed-border">
                        <v-md-preview :text="text" @copy-code-success="handleCopyCodeSuccess"></v-md-preview>
                    </div>
                </el-col>

            </el-row>

        </div>
</template>

<script>
import {CloseBold} from "@element-plus/icons-vue";

export default {
    name: "Tutorial",
    data() {
        return {
            text:
`
<h1 align="center">LLM的Web会话管理方案<span style="color: #2454ff;">THChatUI</span></h1>
<p align="center">
    嗨喽~朋友！🤖 欢迎使用THWebUI <span style="font-size: 10px;">v1.0.0</span>，一个基于Vue2/Vue3和Element Plus的Web对话方案。项目持续集成与升级中，敬请期待更多功能与优化。
</p>

[[toc]]

## THChatUI介绍
THChatUI是一个专为**数据敏感型个人/组织/公司**设计的**开源大模型对话WebUI**，可简便快捷的接入本地大模型，保护信息安全。本项目基于Apache 2.0协议开源。

THChatUI追求轻量化与高二开性，因此前端项目大部分代码基于Vue2的写法构建，通俗易懂。项目数据保存在浏览器缓存中，不需要额外的数据库负担。后端采用Python的Flask快速简单的提供4个接口示例，分别对应本地模型调用的三种对话模式与文件上传。

THChatUI界面如下：

![Description](https://img.chkaja.com/a1e39c489eec02ff.jpeg)

本项目支持三种对话模式：
1. 普通对话
2. 联网搜索对话（仅限本地模型请求模式）
3. 知识库对话（仅限本地模型请求模式）

本项目支持两种模型请求模式：
1. （开发者友好）本地模型请求：需要加载本地模型，并运行THChatUI提供的Python脚本。提供SSE、WS两种请求方式写法模板，支持HF平台所有对话大模型，可以完全保护隐私不被第三方获取。
2. （使用者友好）远程第三方请求：仅需要去第三方申请KEY填入“系统设置”——“API KEY”中。本项目永久开放讯飞星火Spark Lite模型调用，并支持阿里云灵积、智谱AI平台的大部分模型的远程调用。

### 在线体验与代码仓库
[THChatUI在线体验版](http://localchatui.wuxitianyouqi.com/#/)
> 【注1】THChatUI在线体验版只提供了讯飞星火Lite模型调用，阿里云灵积、智谱AI平台的模型调用需要去对应平台申请Key并填入设置中，Key只会保存在本地浏览器缓存中，绝对安全。

[THChatUI代码仓库](https://github.com/Unagi-cq/THChatUI)
> 【注2】代码仓提供了前端项目和后端接口示例。

[THChatUI代码视频讲解教程](https://www.bilibili.com/video/BV1tb421n7Li/)
[个人博客](https://blog.csdn.net/qq_43592352?type=blog)
公众号

![Description](https://img.chkaja.com/a83d585b1ba85fb9.png)

### 功能说明
THChatUI拥有常见的大模型聊天UI的基本功能。主要功能有：

1. 对话管理
2. 知识库文件管理
3. 多轮对话
4. 系统主题切换
5. 支持手机版
6. 三种对话模式
7. 两种模型请求模式

## 使用文档
如果你只想为你的API KEY提供一个友好对话的界面，那么仅仅需要去阿里云平台或智谱平台申请KEY，然后在[THChatUI在线体验版](http://localchatui.wuxitianyouqi.com/#/)的设置页面填写对应平台的API KEY即可快速使用。
> 【注3】目前大部分平台初次注册都会送百万至千万个token的免费额度，多换几个号可以薅很久羊毛。

[申请阿里云平台API KEY](https://dashscope.console.aliyun.com/apiKey)
[申请智谱平台API KEY](https://open.bigmodel.cn/usercenter/apikeys)

## 开发文档
THChatUI不仅提供了为开发者提供了前端项目，还提供了基于Python的Flask库启动的4个接口示例。

### 安装
在安装项目前，请先移步[node中文官网](https://nodejs.cn/download/)安装node.js环境，理论上v14以上版本皆可，建议安装最新版，截至目前，node已经更新至v20.12.2。

查看node是否安装成功：

\`\`\`bash
node -v
\`\`\`

下载并运行：

\`\`\`bash
# 下载到本地
git clone https://github.com/Unagi-cq/THChatUI
# 进入web ui目录
cd ./thchat-ui
# 安装npm依赖
npm install
# 本地运行
npm run serve
\`\`\`

访问：

\`\`\`bash
http://localhost:8080/
\`\`\`

项目项目启动后，会默认提供科大讯飞的Spark lite模型。如果需要使用阿里云平台或智谱AI平台的模型服务需要去对应平台申请API KEY，填入“系统设置”——“API KEY”中。

对于开发人员，强烈建议使用本地接口调用的模式。参考仓库根目录下的**thchat-serve**文件夹：

\`\`\`bash
thchat-serve
├─chat
│      1_simple_local_chat.py
│      2_langchain_local_chat.py
│      3_langchain_SparkLLM_chat.py
│      4_langchain_TongyiQwen_chat.py
│      5_langchain_ZHIPUAI_chat.py
├─rag
│      1_simple_local_rag.py
│      4_langchain_TongyiQwen_rag.py
├─search
│      1_simple_local_search.py
│      3_langchain_SparkLLM_search.py
└─upload
    │  main.py
    └─uploads
\`\`\`

后端接口提供了四种请求示例，分别是普通聊天（chat）、知识库检索（rag）、联网搜索（search）和文件上传（upload）。

每一种请求方式都提供了最简洁的实现方式（文件名含_simple_）和基于langchain的实现方式（文件名含_langchain_）。
每一种请求方式都提供了加载本地模型的写法示例（安全、免费、要显卡）与用KEY请求第三方远程模型的写法示例（安全未知、收费、无须显卡资源）。

后端文件的运行需要python3.8环境，其他库最新版即可。启动接口可以运行：
\`\`\`bash
# 进入web serve目录
cd ./thchat-serve
# 启动某个接口
python ./chat/1_simple_local_chat.py
\`\`\`

> 【注4】如果项目启动失败，请检查前端项目端口8080和后端服务端口5000是否被占用。

### 打包部署
前端项目打包：

\`\`\`bash
npm run bulid
\`\`\`

打包成功会生成dist文件夹，把dist文件夹里面的内容上传到服务器即可。

除此之外，阿里云的请求是需要配置代理的，还需要给站点的服务器添加如下配置：

\`\`\`bash
location ^~ /ali/remote/
{
    proxy_pass https://dashscope.aliyuncs.com/;
    proxy_ssl_server_name on;
    proxy_set_header Host dashscope.aliyuncs.com;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header REMOTE-HOST $remote_addr;
    proxy_set_header Upgrade $http_upgrade;
    proxy_http_version 1.1;
    # proxy_hide_header Upgrade;

    add_header X-Cache $upstream_cache_status;
    #Set Nginx Cache

    set $static_file8WLuNoD1 0;
    if ( $uri ~* "\\.(gif|png|jpg|css|js|woff|woff2)$" )
    {
        set $static_file8WLuNoD1 1;
        expires 1m;
    }
    if ( $static_file8WLuNoD1 = 0 )
    {
        add_header Cache-Control no-cache;
    }
}
\`\`\`

> 【注5】 本地运行调试时不需要额外配置。/ali/remote/是和前端项目的vue.config.js文件里的代理前缀对应的。

后端接口部署就很简单了，配置好python3.8环境，安装好包，直接运行就行。

### 数据schema
以下是THChatUI运行时存储在浏览器缓存中的数据结构示例：
\`\`\`bash
{
    "active": 1715599712260,
    "chatStorage" : {
        "chats": [
            {
                "uuid": 1715599712260,
                "data": [
                    {
                        "sessionId":1715599712260,
                        "model_name": "qwen",
                        "query": "我叫amy",
                        "responseTime": "2024/5/9 23:36:54",
                        "answer": "你好，我是千问，请问有什么可以帮助你的吗？",
                        "finishTime": "2024/5/9 23:36:54"
                    },
                    ...
                ]
            },
        ],
    },
    "tabStorage" : {
        "tabs": [
            {"title": "vue3 js写法 渲染完成的回调函数","uuid": 1715599712270},
            ...
        ]
    },
    "fileStorage" : {
        "files": [
            {"title": "参考示例文件.pdf","uuid": 1715599712270,"file_type":"pdf","url":"..."},
            ...
        ]
    },
    "settingStorage": {
      "theme": "light",
      "bg": "...",
      "chat_detail": true,
      "method": "remote",
      "region": "Ali_DashScope",
      "api_key": "...",
      "model_name": "qwen",
      "model_version": "qwen-turbo",
      "memory": false,
      "pre_group": 0,
      "post_group": 0,
      "chat_type": "chat"
    }
}
\`\`\`

### 项目目录与代码实现
请参考：[THChatUI代码视频讲解教程](https://www.bilibili.com/video/BV1tb421n7Li/)
`
        };
    },
    computed: {
        CloseBold() {
            return CloseBold
        }
    },
    methods: {
        onBack() {
            // 返回首页
            this.$router.push('/');
        },
        // 复制代码成功
        handleCopyCodeSuccess(code) {
            this.$notify({
                title: '复制成功！',
                type: 'success',
            });
        },
    }
};
</script>

<style scoped>
.file-container {
    display: flex;
    flex-direction: column;
    padding: 5px;
    border-radius: 8px;
    margin: 5px 0 5px 0;
}

:deep(.el-page-header__content), :deep(.el-page-header__back) {
    color: var(--common-color);
}

:deep(.v-md-editor-preview) {
    width: 100%;
}

:deep(.vuepress-markdown-body:not(.custom)) {
    padding: 0.4rem 0.8rem;
}

@media (max-width: 419px) {
    :deep(.vuepress-markdown-body div[class*=v-md-pre-wrapper-]) {
        margin: 0;
    }
}

:deep(.vuepress-markdown-body blockquote) {
    font-size: 12px;
}

:deep(.vuepress-markdown-body) {
    font-size: 12px;
    color: var(--common-color);
    background: none;
    word-wrap: break-word;
    margin: 0;
}
</style>
