[[toc]]

## API KEY说明
如果你只想为你的API KEY提供一个友好对话的界面，那么仅仅需要去相应的平台申请KEY，然后在[THChatUI国内加速体验地址](http://localchatui.wuxitianyouqi.com/#/)的设置页面填写对应平台的API KEY即可快速使用。
> 【注】目前大部分平台初次注册都会送百万至千万个token的免费额度，多换几个号可以薅很久羊毛。

[申请阿里云平台API KEY](https://dashscope.console.aliyun.com/apiKey)
[申请百度千帆平台API KEY](https://cloud.baidu.com/product/ai/wenxin)
[申请月之暗面平台API KEY](https://platform.moonshot.cn/console/api-keys)
[申请智谱平台API KEY](https://open.bigmodel.cn/usercenter/apikeys)
[申请火山方舟平台API KEY](https://console.volcengine.com/ark/region:ark+cn-beijing/apiKey)
[申请硅基流动平台API KEY](https://cloud.siliconflow.cn/account/ak)

对于OpenAI式的API KEY，通常我们并不是仅仅指OpenAI这家公司的ChatGPT的API KEY，而是指提供了OpenAI接口规范的所有服务商的URL、KEY、Model这三个参数。

几乎所有的厂商都支持OpenAI的API规范，因此你也可以去各大平台查看它们提供的参数，例如[Kimi](https://platform.moonshot.cn/docs/guide/migrating-from-openai-to-kimi#%E5%85%B3%E4%BA%8E-api-%E5%85%BC%E5%AE%B9%E6%80%A7)。

> 【注】对于目前本项目没有集成的平台，你可以用OpenAI的API规范很容易的接入它们。

## 使用说明

如果你需要在本地部署THChatUI，请参考"快速开发"栏目。

### 设置 - 模型

这里可以设置你想要使用的模型，默认是科大讯飞的Spark lite模型。

首先确保对应平台的API KEY已经填入，然后选择平台，再选择模型。

模型名称后方带有`Web`的表示支持联网搜索。

> 【注】如果模型名称后方带有`Web`，则表示支持联网搜索，但是需要你手动开启。免费模型虽然不要钱，但是需要先去申请API KEY才能使用。

### 设置 - 通用

历史对话轮数表示在聊天过程中你想要模型能够记住多少轮对话记录。轮数越多，模型能够记住的对话越多，但是也会消耗更多的token。

### 设置 - API KEY

在"设置"页面的"API KEY"栏目中，你可以为不同的平台分别填写对应的API KEY。每个平台的API KEY获取方式略有不同，具体可参考上文的申请链接。填写API KEY后，点击"设置"按钮即可保存。

- 若你需要切换不同平台的模型，只需在此处填写或更换对应平台的API KEY，无需重复注册账号。
- 支持多平台并行配置，填写多个API KEY后，可以在模型选择时自由切换。
- 某些平台（如Azure等）可能还需要额外填写Endpoint、Region等参数，请根据界面提示补充完整。

> 【提示】API KEY属于敏感信息，请妥善保管，避免泄露。建议不要在公共设备上保存API KEY。

你可以随时在"API KEY"设置页面对已保存的KEY进行修改或删除，确保你的账户安全和使用灵活性。

### 设置 - 知识库

知识库的上传、拆分、召回、存储都是基于浏览器实现的，也就是消耗的是本机CPU资源。

知识库目前支持PDF、TXT、DOCX、DOC格式文件的导入，上传文件后，会自动解析文件内容，然后按照chunk_size的值进行分割，分割后的内容会存储在浏览器数据库中。

你可以设置chunk_size的值，表示一个分片的最长字符数。还可以设置召回的chunk数量，表示在聊天过程中模型能够从多少个chunk中召回信息。

这同样也是有利有弊的，召回的chunk越多，模型能够记住的信息越多，但是也会消耗更多的token。

> 【注】使用知识库时，需要在"设置"——"知识库"中开启"启用"，然后选择你需要挂载的知识库名称。

#### 知识库 - 查看

你可以点击"知识库"右上方的"查看"按钮，查看知识库内含有多少个chunk，以及每个chunk的详细内容。

<img src="https://raw.githubusercontent.com/Unagi-cq/THChatUI/refs/heads/main/doc_img/kb_chunk.png" alt="chunk_example" align="middle" width="400" />

### 设置 - 联网搜索

在"设置"页面的"联网搜索"栏目中，你可以配置和启用第三方搜索服务（如TavilySearch），以便在对话过程中获取最新的互联网信息。具体操作如下：

1. **启用联网搜索**  
   首先，切换"启用"开关，激活联网搜索功能。只有启用后，相关模型才会在回答时调用互联网搜索结果。

2. **填写API Key**  
   目前支持Tavily等主流搜索API。你需要在"Tavily API Key"输入框中填写你在[Tavily官网](https://www.tavily.com/)申请到的API Key。填写后，系统会自动保存并在联网搜索时使用该Key。

3. **使用说明**  
   - 启用联网搜索后，支持Web的模型会在回答问题时自动检索互联网最新信息，提升答案的时效性和准确性。
   - 你可以随时关闭联网搜索，模型将仅依赖本地知识和历史对话进行回答。
   - Tavily等API通常有每月1000次免费额度，超出后需自行充值。

4. **安全提示**  
   API Key属于敏感信息，请勿泄露给他人。建议在个人设备上使用，并定期更换Key以保障安全。

> 【注】不同模型对联网搜索的支持情况可能不同，具体以模型选择界面标注为准。

### 设置 - 动漫人物

在"设置"页面的"动漫人物"栏目中，你可以自行选择看板娘的模型。

## 缓存与存储

在"设置"——"清除缓存"中，你可以清除浏览器缓存，包括聊天记录、知识库、设置等。

也可以在开发者模式的"应用"中，在`本地存储空间`和`IndexedDB`中查看存储的数据详情。