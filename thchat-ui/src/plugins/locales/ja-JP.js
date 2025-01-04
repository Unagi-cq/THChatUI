export default {
  Common: {
    warn: "警告",
    confirm: "確認",
    cancel: "キャンセル",
    success: "成功",
    failed: "失敗",
    is_true: "はい",
    is_false: "いいえ"
  },
  Setting: {
    tabs: {
      model: 'モデル',
      general: '一般',
      key: 'APIキー'
    },
    model: {
      platform: 'プラットフォーム',
      textModel: 'LLM',
      imageModel: 'VL'
    },
    general: {
      theme: 'テーマ',
      themeOptions: {
        glass: 'ガラス',
        dark: 'ダーク',
        light: 'ライト'
      },
      language: '言語',
      multiRound: 'マルチラウンドチャット',
      chatStats: 'チャット統計',
      background: '背景',
      clearCache: 'ローカルキャッシュを削除',
      clearCacheConfirm: 'すべてのローカルキャッシュを削除してもよろしいですか？チャット履歴がすべて削除されます。',
      clearCacheSuccess: 'ローカルキャッシュを削除しました'
    },
    key: {
      xunfeiTip: '讯飞プラットフォームのキーは組み込み済みで使用可能です',
      localTip: 'ローカルモデルはAPIキーを必要としません',
      placeholder: '{platform}のAPIキーを入力してください'
    },
    upload: {
      sizeLimit: '画像サイズは3MBを超えることはできません！',
      failed: 'アップロードに失敗しました！'
    }
  },
  AppAside: {
    chat_header_title: 'チャット',
    tool_kb_name: 'ライブラリ',
    tool_setting_name: '設定',
    tool_agent_name: 'エージェント',
    tool_about_name: '概要'
  },
  AppFooter: {
    repository: "リポジトリ",
    docs: "ドキュメント"
  },
  AppHeader: {
    platform: "プラットフォーム",
    model: "モデル",
    chatMode: "チャットモード",
    multiRound: "マルチラウンド",
    singleRound: "シングルラウンド",
    statistics: "統計",
    show: "表示",
    hide: "非表示",
    modelType: "モデルタイプ",
    visionModel: "ビジョンモデル",
    languageModel: "言語モデル",
    canWebSearch: "ウェブ検索をサポート"
  },
  ChatCard: {
    user_name: "ユーザー",
    copyMarkdownTooltip: "Markdownをコピー",
    copyPlainTextTooltip: "プレーンテキストをコピー",
    deleteConversationTooltip: "会話を削除",
    characterCount: "文字数: {count}文字",
    notifications: {
      codeCopySuccess: "コードをコピーしました！",
      markdownCopySuccess: "Markdownをコピーしました！",
      markdownCopyFailed: "コピーに失敗しました！",
      plainTextCopySuccess: "プレーンテキストをコピーしました！",
      plainTextCopyFailed: "コピーに失敗しました！"
    }
  },
  SendBox: {
    placeholder: "質問や要望を入力してください。'↑'キーで質問を素早くコピーできます",
    uploadLimit: {
      error: "アップロードできるファイルは{limit}個までです！"
    },
    uploadType: {
      error: "画像ファイルのみアップロード可能です！"
    },
    uploadSize: {
      error: "画像サイズは{size}MBを超えることはできません！"
    },
    errors: {
      apiKey: "APIキーが入力されているか、有効期限が切れていないか確認してください",
      connection: "ネットワークまたはインターフェースが有効になっているか確認してください",
      interface: "インターフェースが正常に動作しているか確認してください",
      internalError: "内部エラーや例外がないか確認してください",
      system: "システムエラー: {error}"
    },
    notifications: {
      remoteFailed: "リモート呼び出しに失敗しました！",
      connectionFailed: "ローカルインターフェースに接続できません！",
      interfaceError: "ローカルインターフェースエラー！",
      uploadFailed: "アップロードに失敗しました"
    },
    webSearch: "インターネット検索"
  }
} 