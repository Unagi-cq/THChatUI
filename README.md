<h1 align="center">LM的Web会话管理方案<span style="color: #2454ff;">THChatUI</span><span style="font-size: 10px;">v2</span></h1>

[![GitHub](https://img.shields.io/badge/Demo-%F0%9F%9A%80%20GitHub-blue)](https://unagi-cq.github.io/THChatUI/#/) [![China](https://img.shields.io/badge/Demo-%F0%9F%9A%80%20China-red)](http://localchatui.wuxitianyouqi.com/#/) [![Docs](https://img.shields.io/badge/Document-%F0%9F%9A%80%20GitHub-blue)](https://unagi-cq.github.io/THChatUI/#/docs)


<p align="center">
    嗨喽~朋友！🤖 欢迎使用THWebUI ，一个基于Vue2/Vue3和Element Plus的Web对话方案。项目持续集成与升级中，敬请期待更多功能与优化。
</p>

## THChatUI介绍
THChatUI V2 是一个专为**数据敏感型个人/组织/公司**设计的**开源大模型对话WebUI**，基于Vue和Element Plus开发，可简便快捷的接入本地大模型，保护信息安全。本项目基于Apache 2.0协议开源。

前端采用Vue更适合中国宝宝体质~

后端采用Python的Flask快速启动接口，项目提供了若干个调用示例(并不是必须的)。

不需额外数据库，数据存浏览器**IndexedDB**中。

## 功能介绍

### 接口请求模式
本项目支持**自定义模型接口**和**第三方HTTP请求**两种模式：
1. （开发者友好）**自定义模型接口**：需要加载本地模型，并运行THChatUI提供的Python脚本。提供SSE、WS两种请求方式写法模板，支持HF平台所有对话大模型，可以完全保护隐私不被第三方获取。我们已经在`/thchat-server`目录下提供了若干个示例，可以参考。
2. （使用者友好）**第三方HTTP请求**：仅需要去第三方申请KEY填入“设置”——“API KEY”中。本项目永久开放讯飞星火Spark Lite模型作为本仓库平台体验用。

### 功能
本项目支持的功能有：
- 会话管理：支持会话创建、删除、编辑
- 知识库管理：支持文件管理、文件上传、文件分片、文本召回、知识库问答(RAG)
- 多轮对话：支持多轮对话、对话轮数配置
- 联网搜索：支持联网搜索
- 多平台集成，支持以下平台模型的调用：
    - 阿里云百炼
    - 百度千帆
    - 月之暗面
    - 讯飞星火
    - 智谱AI
    - OpenAI(包括类OpenAI式服务)
- 系统主题切换：支持浅色、深色、毛玻璃三种主题，支持自定义背景图片
- 响应式设计：支持PC、移动端
- 多模态：
    - 支持普通对话、联网搜索对话、知识库对话
    - 支持图片输入模型
    - 支持图片绘制模型
- 国际化：支持简中、英文
- APIKEY管理：支持APIKEY的添加、删除、编辑

### 设计特性
本项目具有以下特性：
- 专注于轻量化设计，纯前端项目，开箱即用，不需要繁琐的配置
- 完全基于Vue和Element Plus开发
- 不需要额外数据库，数据存浏览器IndexedDB中
- 为开发者提供了丰富的接口示例，支持本地模型请求模式和第三方HTTP请求模式
- 项目内部提供了丰富的配置项，持久化层采用面向对象设计，方便开发者进行二次开发，接入db存储接口

## 界面展示

PC端界面如下：

<img src="https://i.miji.bid/2025/01/12/1bb5f241e49587fd1129dfa81f596939.png" alt="THChatUI" align="middle" width="800" />

移动端界面如下：

<img src="https://i.miji.bid/2025/01/12/a4ebf4e86a9dfd410aa8432639414ac7.png" alt="THChatUI" align="middle" height="400" />


### 在线体验与代码仓库

[THChatUI国内加速体验地址](http://localchatui.wuxitianyouqi.com/#/)
[THChatUI永久体验地址](https://unagi-cq.github.io/THChatUI/#/)
> 【注】THChatUI在线体验版只提供了讯飞星火Lite模型调用，阿里云灵积、智谱AI平台、百度千帆、月之暗面、OpenAI的模型调用需要去对应平台申请Key并填入设置中，Key只会保存在本地浏览器缓存中，绝对安全。

[THChatUI代码仓库](https://github.com/Unagi-cq/THChatUI)
> 【注】代码仓提供了前端项目和后端接口示例。

[THChatUI代码视频讲解教程](https://www.bilibili.com/video/BV1xTcVezEKP/)
[个人博客](https://blog.csdn.net/qq_43592352?type=blog)

公众号

![Description](https://img.chkaja.com/a83d585b1ba85fb9.png)

## 快速开发

THChatUI不仅提供了为开发者提供了前端项目，还提供了基于Python的Flask库启动的12个接口示例。

这些接口提供了最简洁的实现方式（文件名含_simple_）与基于langchain的实现方式（文件名含_langchain_），并且分别提供了普通聊天、知识库检索、联网搜索、多模态输入和图片生成5种类型的接口示例。


### 安装
在安装项目前，请先移步[node中文官网](https://nodejs.cn/download/)安装node.js环境，理论上v14以上版本皆可，建议安装最新版，截至目前，node已经更新至v20.12.2。

查看node是否安装成功：

```bash
node -v
```

下载并运行：

```bash
# 下载到本地
git clone https://github.com/Unagi-cq/THChatUI
# 进入web ui目录
cd ./thchat-ui
# 安装npm依赖
npm install
# 本地运行
npm run serve
```

访问：

```bash
http://localhost:8080/
```

项目项目启动后，使用教程请参考“使用教程”栏目。

对于开发人员，强烈建议使用本地接口调用的模式。参考仓库根目录下的**thchat-serve**文件夹：

```bash
thchat-serve
├─igm
│      5_zhipuai_ZHIPUAI_igm.py
├─llm
│  ├─chat
│  │      1_simple_local_chat.py
│  │      2_langchain_local_chat.py
│  │      3_langchain_SparkLLM_chat.py
│  │      4_langchain_TongyiQwen_chat.py
│  │      5_langchain_ZHIPUAI_chat.py
│  ├─rag
│  │      1_simple_local_rag.py
│  │      4_langchain_TongyiQwen_rag.py
│  │      rag_example.pdf
│  └─search
│          1_simple_local_search.py
│          3_langchain_SparkLLM_search.py
│          5_langchain_ZHIPUAI_search.py
└─vim
        5_langchain_ZHIPUAI_vim.py
```

后端接口提供了三大类请求示例，分别是对话（llm）、多模态输入（igm）、图片生成（vim）。

在对话（llm）中，提供了普通聊天（chat）、知识库检索（rag）、联网搜索（search）示例。

每一种请求方式都提供了最简洁的实现方式（文件名含_simple_）和基于langchain的实现方式（文件名含_langchain_）。
每一种请求方式都提供了加载本地模型的写法示例（安全、免费、要显卡）与用KEY请求第三方远程模型的写法示例（安全未知、收费、无须显卡资源）。

后端文件的运行需要python3.10环境。先创建conda镜像，可以执行：

```bash
# 进入web serve目录
cd ./thchat-serve
# 创建conda镜像
conda_env.sh
# 激活conda镜像
conda activate thchat
```

启动接口可以运行：
```bash
# 启动某个接口
python ./llm/chat/1_simple_local_chat.py
```

> 【注】如果项目启动失败，请检查前端项目端口8080和后端服务端口5000是否被占用。

### 打包部署
前端项目打包：

```bash
npm run bulid
```

打包成功会生成dist文件夹，把dist文件夹里面的内容上传到服务器即可。

除此之外，阿里云平台和百度千帆的请求是需要配置代理的，还需要给站点的服务器添加如下nginx代理配置：

```bash
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
        if ( $uri ~* "\.(gif|png|jpg|css|js|woff|woff2)$" )
        {
            set $static_file8WLuNoD1 1;
            expires 1m;
        }
        if ( $static_file8WLuNoD1 = 0 )
        {
            add_header Cache-Control no-cache;
        }
    }
    
    location ^~ /baidu/remote/
    {
        proxy_pass https://aip.baidubce.com/;
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
        if ( $uri ~* "\.(gif|png|jpg|css|js|woff|woff2)$" )
        {
            set $static_file8WLuNoD1 1;
            expires 1m;
        }
        if ( $static_file8WLuNoD1 = 0 )
        {
            add_header Cache-Control no-cache;
        }
    }
```

> 【注】 本地运行调试时不需要额外配置。`/ali/remote/` `/baidu/remote/` 是和前端项目的vue.config.js文件里的代理前缀对应的。

后端接口部署就很简单了，配置好python3.10环境，安装好包，直接运行就行。

### 项目目录与代码实现
请参考：[THChatUI V2 代码视频讲解教程](https://www.bilibili.com/video/BV1xTcVezEKP/)