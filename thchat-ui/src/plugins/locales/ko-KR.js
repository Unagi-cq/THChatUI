export default {
  Common: {
    warn: "경고",
    confirm: "확인",
    cancel: "취소",
    success: "성공",
    failed: "실패"
  },
  Setting: {
    tabs: {
      model: '모델',
      general: '일반',
      key: 'API 키'
    },
    model: {
      platform: '플랫폼',
      textModel: 'LLM',
      imageModel: 'VL'
    },
    general: {
      theme: '테마',
      themeOptions: {
        glass: '유리',
        dark: '다크',
        light: '라이트'
      },
      language: '언어',
      multiRound: '다중 대화',
      chatStats: '채팅 통계',
      background: '배경',
      clearCache: '로컬 캐시 지우기',
      clearCacheConfirm: '모든 로컬 캐시를 지우시겠습니까? 모든 채팅 기록이 삭제됩니다.',
      clearCacheSuccess: '로컬 캐시가 지워졌습니다'
    },
    key: {
      xunfeiTip: '쉰페이 플랫폼 키가 내장되어 있어 사용 가능합니다',
      localTip: '로컬 모델은 API 키가 필요하지 않습니다',
      placeholder: '{platform} API 키를 입력해주세요'
    },
    upload: {
      sizeLimit: '업로드 이미지 크기는 3MB를 초과할 수 없습니다!',
      failed: '업로드 실패!'
    }
  },
  AppAside: {
    chat_header_title: '채팅',
    tool_kb_name: '라이브러리',
    tool_setting_name: '설정',
    tool_agent_name: '에이전트',
    tool_about_name: '정보'
  },
  AppFooter: {
    repository: "저장소",
    docs: "문서"
  },
  AppHeader: {
    platform: "플랫폼",
    model: "모델",
    chatMode: "채팅 모드",
    multiRound: "다중 대화",
    singleRound: "단일 대화",
    statistics: "통계",
    show: "표시",
    hide: "숨기기",
    modelType: "모델 유형",
    visionModel: "비전 모델",
    languageModel: "언어 모델"
  },
  ChatCard: {
    user_name: "사용자",
    copyMarkdownTooltip: "마크다운 복사",
    copyPlainTextTooltip: "일반 텍스트 복사",
    deleteConversationTooltip: "대화 삭제",
    characterCount: "글자 수: {count}자",
    notifications: {
      codeCopySuccess: "코드가 복사되었습니다!",
      markdownCopySuccess: "마크다운이 복사되었습니다!",
      markdownCopyFailed: "복사 실패!",
      plainTextCopySuccess: "일반 텍스트가 복사되었습니다!",
      plainTextCopyFailed: "복사 실패!"
    }
  },
  SendBox: {
    placeholder: "질문이나 요청을 입력하세요. '↑' 키를 눌러 질문을 빠르게 복사할 수 있습니다",
    uploadLimit: {
      error: "최대 {limit}개의 파일만 업로드할 수 있습니다!"
    },
    uploadType: {
      error: "이미지 파일만 업로드할 수 있습니다!"
    },
    uploadSize: {
      error: "이미지 크기는 {size}MB를 초과할 수 없습니다!"
    },
    errors: {
      apiKey: "API 키가 입력되었는지 또는 만료되었는지 확인해주세요",
      connection: "네트워크 또는 인터페이스가 활성화되어 있는지 확인해주세요",
      interface: "인터페이스가 정상적으로 작동하는지 확인해주세요",
      internalError: "내부 오류나 예외가 있는지 확인해주세요",
      system: "시스템 오류: {error}"
    },
    notifications: {
      remoteFailed: "원격 호출 실패!",
      connectionFailed: "로컬 인터페이스에 연결할 수 없습니다!",
      interfaceError: "로컬 인터페이스 오류!",
      uploadFailed: "업로드 실패"
    }
  }
} 