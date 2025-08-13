import React from 'react';
import { MessageListProps } from '../types/chat';
import './MessageList.css';

const MessageList: React.FC<MessageListProps> = ({ messages, isTyping }) => {
  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="message-list">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`message-item ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
        >
          <div className="message-avatar">
            {message.sender === 'user' ? '🙋‍♂️' : '🤖'}
          </div>
          <div className="message-content">
            <div className="message-bubble">
              <p>{message.content}</p>
            </div>
            <div className="message-time">
              {formatTime(message.timestamp)}
            </div>
          </div>
        </div>
      ))}
      
      {/* 打字指示器 */}
      {isTyping && (
        <div className="message-item ai-message typing-indicator">
          <div className="message-avatar">
            🤖
          </div>
          <div className="message-content">
            <div className="message-bubble typing-bubble">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;