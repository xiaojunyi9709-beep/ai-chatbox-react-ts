import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Message } from '../types/chat';
import { generateAIResponse, generateMessageId } from '../utils/mockAI';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import './ChatBox.css';

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateMessageId(),
      content: '您好！我是您的AI助手，很高兴为您提供帮助。请问有什么我可以为您做的吗？',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // 发送消息处理函数
  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    // 添加用户消息
    const userMessage: Message = {
      id: generateMessageId(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      // 模拟AI思考时间
      const aiResponse = await generateAIResponse(content);
      
      // 添加AI回复
      const aiMessage: Message = {
        id: generateMessageId(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // 错误处理
      const errorMessage: Message = {
        id: generateMessageId(),
        content: '抱歉，我现在遇到了一些技术问题。请稍后再试。',
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [isLoading]);

  // 清空对话
  const handleClearChat = useCallback(() => {
    setMessages([
      {
        id: generateMessageId(),
        content: '对话已清空。有什么新的问题我可以帮助您吗？',
        sender: 'ai',
        timestamp: new Date()
      }
    ]);
  }, []);

  return (
    <div className="chatbox-container">
      <div className="chatbox-header">
        <div className="header-info">
          <div className="ai-avatar">🤖</div>
          <div className="ai-status">
            <h3>AI 助手</h3>
            <span className={`status-indicator ${isTyping ? 'typing' : 'online'}`}>
              {isTyping ? '正在输入...' : '在线'}
            </span>
          </div>
        </div>
        <button 
          className="clear-button" 
          onClick={handleClearChat}
          title="清空对话"
        >
          🗑️
        </button>
      </div>
      
      <div className="chatbox-content">
        <MessageList 
          messages={messages} 
          isTyping={isTyping}
        />
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chatbox-footer">
        <MessageInput 
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ChatBox;