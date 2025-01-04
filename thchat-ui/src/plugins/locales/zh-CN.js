import { warn } from "vue";

export default {
  Common: {
    warn: "警告",
    confirm: "确定",
    cancel: "取消",
    success: "成功",
    failed: "失败",
    is_true: "是",
    is_false: "否"
  },
  Setting: {
    tabs: {
      model: "模型",
      general: "通用",
      key: "API密钥"
    },
    model: {
      platform: "平台",
      textModel: "文本生成模型",
      imageModel: "图片理解模型"
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
      chatStats: "回答统计",
      background: "背景图片",
      clearCache: "清空本地缓存",
      clearCacheConfirm: "确定要清空所有本地缓存吗？这将会清除所有聊天记录。",
      clearCacheSuccess: "本地缓存已清空"
    },
    key: {
      xunfeiTip: "讯飞平台已经在代码里内置了key 可直接调用",
      localTip: "本地模型无需配置API Key",
      placeholder: "请输入{platform}的API Key"
    },
    upload: {
      sizeLimit: "上传图片大小不能超过 3MB!",
      failed: "上传失败!"
    }
  },
  AppAside: {
    chat_header_title: '对话',
    tool_kb_name: '知识库',
    tool_setting_name: '设置',
    tool_agent_name: '智能体',
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
    }
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
  }
}
