export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: Date;
  isLoading?: boolean;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  apiConnected: boolean;
}

export interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
}

// API相关类型
export interface APIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface APIResponse {
  success: boolean;
  message: {
    role: string;
    content: string;
  };
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  timestamp: string;
  error?: string;
}

export interface APIConnectionStatus {
  connected: boolean;
  message: string;
  lastChecked?: Date;
}