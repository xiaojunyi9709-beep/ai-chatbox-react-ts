import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Message } from '../types/chat';
import { generateAIResponse, generateMessageId, testAPIConnection, APIMessage } from '../utils/mockAI';
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
  const [apiStatus, setApiStatus] = useState<{ connected: boolean; message: string }>({
    connected: false,
    message: '检查中...'
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // 组件加载时测试API连接
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await testAPIConnection();
        setApiStatus({
          connected: result.success,
          message: result.message
        });
      } catch (error) {
        setApiStatus({
          connected: false,
          message: '连接测试失败'
        });
      }
    };

    checkConnection();
  }, []);

  // 将消息历史转换为API格式
  const buildConversationHistory = useCallback((): APIMessage[] => {
    return messages
      .filter(msg => msg.sender !== 'system') // 过滤掉系统消息
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant' as const,
        content: msg.content
      }));
  }, [messages]);

  // 发送消息处理函数
  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    // 检查API连接状态
    if (!apiStatus.connected) {
      const errorMessage: Message = {
        id: generateMessageId(),
        content: '抱歉，AI服务当前不可用。请稍后再试或联系管理员。',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

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
      // 构建对话历史
      const conversationHistory = buildConversationHistory();
      
      // 调用真实的AI API
      const aiResponse = await generateAIResponse(content, conversationHistory);
      
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
        content: '抱歉，我现在遇到了一些技术问题。请稍后再试。如果问题持续存在，请联系管理员。',
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [isLoading, apiStatus.connected, buildConversationHistory]);

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

  // 重新连接API
  const handleReconnect = useCallback(async () => {
    setApiStatus({ connected: false, message: '重新连接中...' });
    
    try {
      const result = await testAPIConnection();
      setApiStatus({
        connected: result.success,
        message: result.message
      });
      
      if (result.success) {
        const successMessage: Message = {
          id: generateMessageId(),
          content: 'AI服务已重新连接成功！现在可以正常对话了。',
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, successMessage]);
      }
    } catch (error) {
      setApiStatus({
        connected: false,
        message: '重新连接失败'
      });
    }
  }, []);

  return (
    <div className="chatbox-container">
      <div className="chatbox-header">
        <div className="header-info">
          <div className="ai-avatar">🤖</div>
          <div className="ai-status">
            <h3>AI 助手 (DeepSeek)</h3>
            <span className={`status-indicator ${
              isTyping ? 'typing' : apiStatus.connected ? 'online' : 'offline'
            }`}>
              {isTyping ? '正在输入...' : apiStatus.connected ? '在线' : '离线'}
            </span>
          </div>
        </div>
        
        <div className="header-actions">
          {!apiStatus.connected && (
            <button 
              className="reconnect-button"
              onClick={handleReconnect}
              title="重新连接"
            >
              🔄
            </button>
          )}
          <button 
            className="clear-button" 
            onClick={handleClearChat}
            title="清空对话"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* API状态指示器 */}
      {!apiStatus.connected && (
        <div className="api-status-banner">
          ⚠️ API连接状态: {apiStatus.message}
          <button onClick={handleReconnect} className="status-retry-btn">
            重试
          </button>
        </div>
      )}
      
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
          disabled={!apiStatus.connected}
        />
      </div>
    </div>
  );
};

export default ChatBox;