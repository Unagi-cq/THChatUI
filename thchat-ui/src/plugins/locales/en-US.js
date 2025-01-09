export default {
  Common: {
    warn: "Warning",
    confirm: "Confirm",
    cancel: "Cancel",
    success: "Success",
    failed: "Failed",
    is_true: "Yes",
    is_false: "No",
    deleteSuccess: "Deleted successfully",
    confirmDelete: "Are you sure you want to delete?",
  },
  Setting: {
    tabs: {
      model: 'Model',
      general: 'General',
      key: 'API Key',
      knowledge: 'Knowledge Base'
    },
    model: {
      platform: 'Platform',
      textModel: 'LLM',
      visualInterpretationModel: 'VIM',
      imageGenerationModel: 'IGM'
    },
    general: {
      theme: 'Theme',
      themeOptions: {
        glass: 'Glass',
        dark: 'Dark',
        light: 'Light'
      },
      language: 'Language',
      multiRound: 'Multi-round Chat',
      chatStats: 'Chat Statistics',
      background: 'Background',
      clearCache: 'Clear Local Cache',
      clearCacheConfirm: 'Are you sure to clear all local cache? This will remove all chat history.',
      clearCacheSuccess: 'Local cache cleared'
    },
    key: {
      xunfeiTip: 'Xunfei platform key is built-in and ready to use',
      localTip: 'Local model does not require API Key',
      placeholder: 'Please enter {platform} API Key'
    },
    upload: {
      sizeLimit: 'Upload image size cannot exceed 3MB!',
      failed: 'Upload failed!'
    },
    knowledge: {
      chunkSize: 'Chunk Size',
      chunkSizeTip: 'Document chunk size (characters)',
      recall: 'Recall Count',
      recallTip: 'Number of relevant passages returned per query',
      enable: "Enable",
      select: "Select Repo"
    }
  },
  AppAside: {
    chat_header_title: 'Chat',
    tool_kb_name: 'Library',
    tool_setting_name: 'Setting',
    tool_agent_name: 'Agent',
    tool_about_name: 'About'
  },
  AppFooter: {
    repository: "Repo",
    docs: "Doc"
  },
  AppHeader: {
    platform: "Platform",
    model: "Model",
    chatMode: "Chat Mode",
    multiRound: "Multi-round",
    singleRound: "Single-round",
    statistics: "Statistics",
    show: "Show",
    hide: "Hide",
    modelType: "Model Type",
    visionModel: "Vision Model",
    languageModel: "Language Model",
    canWebSearch: "Web Search Supported"
  },
  ChatCard: {
    user_name: "User",
    copyMarkdownTooltip: "Copy Markdown",
    copyPlainTextTooltip: "Copy Plain Text",
    deleteConversationTooltip: "Delete Conversation",
    characterCount: "Character Count: {count} characters",
    notifications: {
      codeCopySuccess: "Code copied successfully!",
      markdownCopySuccess: "Markdown copied successfully!",
      markdownCopyFailed: "Copy failed!",
      plainTextCopySuccess: "Plain text copied successfully!",
      plainTextCopyFailed: "Copy failed!"
    }
  },
  SendBox: {
    placeholder: "Enter your question or request, press '↑' to quickly copy the question",
    uploadLimit: {
      error: "You can only upload up to {limit} files!"
    },
    uploadType: {
      error: "Only image files can be uploaded!"
    },
    uploadSize: {
      error: "Image size cannot exceed {size}MB!"
    },
    errors: {
      apiKey: "Please check if the API KEY is filled in or expired",
      connection: "Please check if the network or interface is enabled",
      interface: "Please check if the interface is working properly",
      internalError: "Please check if there are any internal errors or exceptions",
      system: "System error: {error}"
    },
    notifications: {
      remoteFailed: "Remote call failed!",
      connectionFailed: "Unable to connect to local interface!",
      interfaceError: "Local interface error!",
      uploadFailed: "Upload failed"
    },
    webSearch: "Web Search"
  }
}
