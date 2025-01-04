import { warn } from "vue";

export default {
  Common: {
    warn: "警告",
    confirm: "確定",
    cancel: "取消",
    success: "成功",
    failed: "失敗"
  },
  Setting: {
    tabs: {
      model: "模型",
      general: "通用",
      key: "API密鑰"
    },
    model: {
      platform: "平台",
      textModel: "文字生成模型",
      imageModel: "圖片理解模型"
    },
    general: {
      theme: "系統主題",
      themeOptions: {
        glass: "磨砂玻璃",
        dark: "暗色",
        light: "亮色"
      },
      language: "語言",
      multiRound: "多輪對話",
      chatStats: "回答統計",
      background: "背景圖片",
      clearCache: "清空本地緩存",
      clearCacheConfirm: "確定要清空所有本地緩存嗎？這將會清除所有聊天記錄。",
      clearCacheSuccess: "本地緩存已清空"
    },
    key: {
      xunfeiTip: "訊飛平台已經在代碼裏內置了key 可直接調用",
      localTip: "本地模型無需配置API Key",
      placeholder: "請輸入{platform}的API Key"
    },
    upload: {
      sizeLimit: "上傳圖片大小不能超過 3MB!",
      failed: "上傳失敗!"
    }
  },
  AppAside: {
    chat_header_title: '對話',
    tool_kb_name: '知識庫',
    tool_setting_name: '設置',
    tool_agent_name: '智能體',
    tool_about_name: '關於'
  },
  AppFooter: {
    repository: "代碼倉庫",
    docs: "系統文檔"
  },
  AppHeader: {
    platform: "平台",
    model: "模型",
    chatMode: "對話模式",
    multiRound: "多輪對話",
    singleRound: "單輪對話",
    statistics: "回答統計",
    show: "開啟",
    hide: "隱藏",
    modelType: "模型類型",
    visionModel: "視覺模型",
    languageModel: "語言模型"
  },
  ChatCard: {
    user_name: "用戶",
    copyMarkdownTooltip: "複製 Markdown",
    copyPlainTextTooltip: "複製純文本",
    deleteConversationTooltip: "刪除對話",
    characterCount: "字數統計: {count} 字符",
    notifications: {
      codeCopySuccess: "代碼複製成功！",
      markdownCopySuccess: "Markdown複製成功！",
      markdownCopyFailed: "複製失敗！",
      plainTextCopySuccess: "純文本複製成功！",
      plainTextCopyFailed: "複製失敗！"
    }
  },
  SendBox: {
    placeholder: "請輸入你的問題或需求，按'↑'可快捷複製問題",
    uploadLimit: {
      error: "最多只能上傳{limit}個文件!"
    },
    uploadType: {
      error: "只能上傳圖片文件!"
    },
    uploadSize: {
      error: "圖片大小不能超過 {size}MB!"
    },
    errors: {
      apiKey: "請檢查API KEY是否填寫或過期",
      connection: "請檢測網絡或接口是否開啟",
      interface: "請檢測接口是否正常",
      internalError: "請檢測接口內部是否發生錯誤或異常",
      system: "系統錯誤：{error}"
    },
    notifications: {
      remoteFailed: "遠程調用失敗!",
      connectionFailed: "無法連接本地接口!",
      interfaceError: "本地接口錯誤!",
      uploadFailed: "上傳失敗"
    },
    webSearch: "聯網搜索"
  }
}
