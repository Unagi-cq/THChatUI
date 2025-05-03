[[toc]]

## 简介

THChatUI V2.0.0是一个专为**数据敏感型个人/组织/公司**设计的**开源大模型对话WebUI**，基于Vue和Element Plus开发，可简便快捷的接入本地大模型，保护信息安全。本项目基于Apache 2.0协议开源。

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
    - 火山方舟(DeepSeek R1)
    - 移动云
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
> 【注】THChatUI在线体验版只提供了讯飞星火Lite模型调用，阿里云百炼、智谱AI平台、百度千帆、月之暗面、OpenAI的模型调用需要去对应平台申请Key并填入设置中，Key只会保存在本地浏览器缓存中，绝对安全。

[THChatUI代码仓库](https://github.com/Unagi-cq/THChatUI)
> 【注】代码仓提供了前端项目和后端接口示例。

[THChatUI代码视频讲解教程](https://www.bilibili.com/video/BV1xTcVezEKP/)
[个人博客](https://blog.csdn.net/qq_43592352?type=blog)