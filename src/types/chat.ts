export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isLoading?: boolean;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
}

export interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
}