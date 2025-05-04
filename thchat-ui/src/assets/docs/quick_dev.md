[[toc]]

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

除此之外，阿里云平台的请求是需要配置代理的，还需要给站点的服务器添加如下nginx代理配置：

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
```

> 【注】 本地运行调试时不需要额外配置。`/ali/remote/` 是和前端项目的vue.config.js文件里的代理前缀对应的。

后端接口部署就很简单了，配置好python3.10环境，安装好包，直接运行就行。

### 项目目录与代码实现
请参考：[THChatUI V2 代码视频讲解教程](https://www.bilibili.com/video/BV1xTcVezEKP/)