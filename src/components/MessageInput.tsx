import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { MessageInputProps } from '../types/chat';
import './MessageInput.css';

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading, disabled = false }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自动调整输入框高度
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 120; // 最大高度
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  // 处理发送消息
  const handleSend = () => {
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message);
      setMessage('');
      // 重置输入框高度
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Shift + Enter 换行
        return;
      } else {
        // Enter 发送
        e.preventDefault();
        handleSend();
      }
    }
  };

  const isDisabled = !message.trim() || isLoading || disabled;

  return (
    <div className="message-input-container">
      <div className={`input-wrapper ${disabled ? 'disabled' : ''}`}>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "AI服务暂时不可用..." : "输入您的消息...（Enter 发送，Shift+Enter 换行）"}
          className="message-textarea"
          disabled={isLoading || disabled}
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={isDisabled}
          className={`send-button ${isDisabled ? 'disabled' : 'active'}`}
          title={disabled ? "AI服务不可用" : "发送消息"}
        >
          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>
      <div className="input-hint">
        {disabled ? "AI服务暂时不可用，请稍后再试" : "按 Enter 发送，Shift + Enter 换行"}
      </div>
    </div>
  );
};

export default MessageInput;