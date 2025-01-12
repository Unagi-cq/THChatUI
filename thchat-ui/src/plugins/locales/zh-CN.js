export default {
  Common: {
    warn: "警告",
    confirm: "确定",
    cancel: "取消",
    success: "成功",
    failed: "失败",
    is_true: "是",
    is_false: "否",
    confirmDelete: "确认要删除吗？",
    deleteSuccess: "删除成功"
  },
  Setting: {
    tabs: {
      model: "模型",
      general: "通用",
      key: "API Key",
      knowledge: "知识库",
      web_search: "联网搜索"
    },
    model: {
      platform: "平台",
      textModel: "文本生成模型",
      visualInterpretationModel: "图片理解模型",
      imageGenerationModel: "图片生成模型"
    },
    general: {
      theme: "系统主题",
      themeOptions: {
        glass: "毛玻璃",
        dark: "暗色",
        light: "亮色"
      },
      language: "语言",
      multiRound: "多轮对话",
      memoryLimit: "历史对话轮数",
      chatStats: "回答统计",
      background: "背景图片",
      clearCache: "清空本地缓存",
      clearCacheConfirm: "确定要清空所有本地缓存吗？这将会清除所有聊天记录。",
      clearCacheSuccess: "本地缓存已清空"
    },
    key: {
      xunfeiTip: "讯飞平台已经在代码里内置了key 可直接调用",
      localTip: "本地模型无需配置API Key",
      placeholder: "请输入{platform}的API Key",
      openaiDivider: "OpenAI式接口请求配置"
    },
    upload: {
      sizeLimit: "上传图片大小不能超过 3MB!",
      failed: "上传失败!"
    },
    knowledge: {
      enable: "启用",
      select: "选择知识库",
      chunkSize: "分块大小",
      chunkSizeTip: "文档分块大小（字符数）",
      recall: "召回数量",
      recallTip: "单次查询返回的相关文段数量",
      localDivider: "以下配置在平台选择本地调用时无效"
    },
    web_search: {
      enable: "启用"
    }
  },
  AppAside: {
    chat_header_title: '对话',
    tool_kb_name: '知识库',
    tool_setting_name: '设置',
    tool_docs_name: '文档',
    tool_about_name: '关于'
  },
  AppFooter: {
    repository: "代码仓库",
    docs: "系统文档"
  },
  AppHeader: {
    platform: "平台",
    model: "模型",
    chatMode: "对话模式",
    multiRound: "多轮对话",
    singleRound: "单轮对话",
    statistics: "回答统计",
    show: "开启",
    hide: "隐藏",
    modelType: "模型类型",
    visionModel: "视觉模型",
    languageModel: "语言模型",
    canWebSearch: "支持联网搜索"
  },
  ChatCard: {
    user_name: "用户",
    copyMarkdownTooltip: "复制 Markdown",
    copyPlainTextTooltip: "复制纯文本",
    deleteConversationTooltip: "删除对话",
    characterCount: "字数统计: {count} 字符",
    notifications: {
      codeCopySuccess: "代码复制成功！",
      markdownCopySuccess: "Markdown复制成功！",
      markdownCopyFailed: "复制失败！",
      plainTextCopySuccess: "纯文本复制成功！",
      plainTextCopyFailed: "复制失败！"
    },
    knowledge_base: "以下是知识库检索到的内容：",
    relevance_score: "相关性分数: {score}%"
  },
  SendBox: {
    placeholder: "请输入你的问题或需求，按'↑'可快捷复制问题",
    uploadLimit: {
      error: "最多只能上传{limit}个文件!"
    },
    uploadType: {
      error: "只能上传图片文件!"
    },
    uploadSize: {
      error: "图片大小不能超过 {size}MB!"
    },
    errors: {
      apiKey: "请检查API KEY是否填写或过期",
      connection: "请检测网络或接口是否开启",
      interface: "请检测接口是否正常",
      internalError: "请检测接口内部是否发生错误或异常",
      system: "系统错误：{error}"
    },
    notifications: {
      remoteFailed: "远程调用失败!",
      connectionFailed: "无法连接本地接口!",
      interfaceError: "本地接口错误!",
      uploadFailed: "上传失败"
    },
    webSearch: "联网搜索"
  },
  AppMain: {
    title: "LLM的轻量级Web会话管理方案",
    welcome: "嗨喽~朋友！🤖 欢迎使用THChatUI。",
    viewDocs: "查看文档"
  },
  Kb: {
    header: "知识库",
    createRepo: {
      title: "创建知识库",
      name: "知识库名称",
      nameRequired: "请输入知识库名称",
      description: "知识库描述",
      descriptionRequired: "请输入知识库描述"
    },
    repoDetail: {
      title: "知识库详情",
      fileList: "文件列表",
      uploadTip: "将文件拖拽至此处 或 点击上传",
      uploadLimitTip: "目前仅支持5MB以内的PDF/DOC/DOCX/TXT文件上传，请确保文件格式正确",
      preparing: "准备上传...",
      processing: "正在处理文件...",
      uploadComplete: "上传完成！",
      uploadFailed: "上传失败",
      noContent: "未识别到文件内容",
      deleteFile: {
        confirm: "确认删除该文件?",
        success: "文件删除成功",
        failed: "文件删除失败"
      },
      section: "分段",
      characters: "字符",
      showChunks: "查看分段",
      hideChunks: "收起分段",
      uploadTime: "上传时间",
      fileSize: "文件大小",
      createTime: "创建时间"
    },
    stats: {
      totalFiles: "总文件数",
      totalChunks: "总分段数"
    }
  }
}
