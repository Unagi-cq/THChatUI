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
      knowledge: 'Knowledge Base',
      web_search: 'Web Search'
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
      memoryLimit: 'History Chat Rounds',
      chatStats: 'Chat Statistics',
      background: 'Background',
      clearCache: 'Clear Local Cache',
      clearCacheConfirm: 'Are you sure to clear all local cache? This will remove all chat history.',
      clearCacheSuccess: 'Local cache cleared'
    },
    key: {
      xunfeiTip: 'Xunfei platform key is built-in and ready to use',
      localTip: 'Local model does not require API Key',
      placeholder: 'Please enter {platform} API Key',
      openaiDivider: "OpenAI-style Interface Configuration"
    },
    upload: {
      sizeLimit: 'Upload image size cannot exceed 3MB!',
      failed: 'Upload failed!'
    },
    knowledge: {
      enable: 'Enable',
      select: 'Select Repository',
      chunkSize: 'Chunk Size',
      chunkSizeTip: 'Document chunk size (characters)',
      recall: 'Recall Count',
      recallTip: 'Number of relevant passages returned per query',
      localDivider: "The following configurations are invalid when using local platform"
    },
    web_search: {
      enable: 'Enable'
    }
  },
  AppAside: {
    chat_header_title: 'Chat',
    tool_kb_name: 'Library',
    tool_setting_name: 'Setting',
    tool_docs_name: 'Docs',
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
    },
    knowledge_base: "The following is the content retrieved from the knowledge base:",
    relevance_score: "Relevance score: {score}%"
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
  },
  AppMain: {
    title: "A Lightweight Web Session Management Solution for LLM",
    welcome: "Hi friend! 🤖 Welcome to THChatUI.",
    viewDocs: "View Docs"
  },
  Kb: {
    header: "Knowledge Base",
    createRepo: {
      title: "Create Repository",
      name: "Repository Name",
      nameRequired: "Please input repository name",
      description: "Repository Description", 
      descriptionRequired: "Please input repository description"
    },
    repoDetail: {
      title: "Repository Detail",
      fileList: "File List",
      uploadTip: "Drop files here or click to upload",
      uploadLimitTip: "Only PDF/DOC/DOCX/TXT files under 5MB are supported",
      preparing: "Preparing upload...",
      processing: "Processing file...",
      uploadComplete: "Upload complete!",
      uploadFailed: "Upload failed",
      noContent: "No content detected",
      deleteFile: {
        confirm: "Confirm delete this file?",
        success: "File deleted successfully",
        failed: "File deletion failed"
      },
      section: "Section",
      characters: "characters",
      showChunks: "Show Chunks",
      hideChunks: "Hide Chunks",
      uploadTime: "Upload Time",
      fileSize: "File Size",
      createTime: "Create Time"
    },
    stats: {
      totalFiles: "Total Files",
      totalChunks: "Total Chunks"
    }
  }
}

