[[toc]]

## API KEY说明
如果你只想为你的API KEY提供一个友好对话的界面，那么仅仅需要去相应的平台申请KEY，然后在[THChatUI国内加速体验地址](http://localchatui.wuxitianyouqi.com/#/)的设置页面填写对应平台的API KEY即可快速使用。
> 【注】目前大部分平台初次注册都会送百万至千万个token的免费额度，多换几个号可以薅很久羊毛。

[申请阿里云平台API KEY](https://dashscope.console.aliyun.com/apiKey)
[申请百度千帆平台API KEY](https://cloud.baidu.com/product/ai/wenxin)
[申请月之暗面平台API KEY](https://platform.moonshot.cn/console/api-keys)
[申请智谱平台API KEY](https://open.bigmodel.cn/usercenter/apikeys)
[申请火山方舟平台API KEY](https://console.volcengine.com/ark/region:ark+cn-beijing/apiKey)
[申请移动云平台API KEY](https://ecloud.10086.cn/portal/act/AI)

对于OpenAI式的API KEY，通常我们并不是仅仅指OpenAI这家公司的ChatGPT的API KEY，而是指提供了OpenAI接口规范的所有服务商的URL、KEY、Model这三个参数。

几乎所有的厂商都支持OpenAI的API规范，因此你也可以去各大平台查看它们提供的参数，例如[Kimi](https://platform.moonshot.cn/docs/guide/migrating-from-openai-to-kimi#%E5%85%B3%E4%BA%8E-api-%E5%85%BC%E5%AE%B9%E6%80%A7)。

> 【注】对于目前本项目没有集成的平台，你可以用OpenAI的API规范很容易的接入它们。

### 火山方舟使用deepseek的特别说明

除了要在设置 - API Key中填写火山方舟平台的API KEY，还需要在设置 - 模型 - 火山方舟平台中填写deepseek模型的接入点id。

接入点需要在火山方舟平台[https://console.volcengine.com/ark/region:ark+cn-beijing/endpoint](https://console.volcengine.com/ark/region:ark+cn-beijing/endpoint)开通。

### 移动云平台使用模型的特别说明

除了要申请API KEY，还要去移动云官网申请Endpoint，修改`thchat-ui\src\api\Yidong_CMECloud\index.js`里面的代理路径。

这是由于移动云的模型名称默认是`default`，真正的信息全都集成在endpoint里面了。在未来的ThChtUI版本迭代中，会重构API KEY管理模块。

## 使用说明

如果你需要在本地部署THChatUI，请参考“快速开发”栏目。

### 设置 - 模型

这里可以设置你想要使用的模型，默认是科大讯飞的Spark lite模型。

首先确保对应平台的API KEY已经填入，然后选择平台，再选择模型。

模型名称后方带有🆓的表示免费模型，可以免费使用；带有`Web`的表示支持联网搜索。

> 【注】如果模型名称后方带有`Web`，则表示支持联网搜索，但是需要你手动开启。免费模型虽然不要钱，但是需要先去申请API KEY才能使用。

### 设置 - 通用

历史对话轮数表示在聊天过程中你想要模型能够记住多少轮对话记录。轮数越多，模型能够记住的对话越多，但是也会消耗更多的token。

### 设置 - 知识库

知识库的上传、拆分、召回、存储都是基于浏览器实现的，也就是消耗的是本机CPU资源。

知识库目前支持PDF、TXT、DOCX、DOC格式文件的导入，上传文件后，会自动解析文件内容，然后按照chunk_size的值进行分割，分割后的内容会存储在浏览器数据库中。

你可以设置chunk_size的值，表示一个分片的最长字符数。还可以设置召回的chunk数量，表示在聊天过程中模型能够从多少个chunk中召回信息。

这同样也是有利有弊的，召回的chunk越多，模型能够记住的信息越多，但是也会消耗更多的token。

> 【注】使用知识库时，需要在“设置”——“知识库”中开启“启用”，然后选择你需要挂载的知识库名称。

### 知识库 - 查看

你可以点击“知识库”右上方的“查看”按钮，查看知识库内含有多少个chunk，以及每个chunk的详细内容。

<img src="https://i.miji.bid/2025/01/12/0b7ca59a9af982b4ae3f71554ccddd7d.png" alt="chunk_example" align="middle" width="400" />

## 缓存与存储

在“设置”——“清除缓存”中，你可以清除浏览器缓存，包括聊天记录、知识库、设置等。

也可以在开发者模式的“应用”中，在`本地存储空间`和`IndexedDB`中查看存储的数据详情。