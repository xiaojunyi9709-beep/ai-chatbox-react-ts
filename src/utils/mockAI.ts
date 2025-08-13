// 真实的 AI API 调用函数
// 请将 YOUR_WORKER_URL 替换为您实际的 Cloudflare Worker URL
const API_BASE_URL = 'https://ai-chat-api.your-username.workers.dev';

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

// 调用真实的 DeepSeek API
export async function generateAIResponse(userMessage: string, conversationHistory: APIMessage[] = []): Promise<string> {
  try {
    // 构建消息历史
    const messages: APIMessage[] = [
      {
        role: 'system',
        content: '你是一个友善、乐于助人的AI助手。请用中文回答用户的问题，保持回答简洁明了且有帮助。'
      },
      ...conversationHistory.slice(-10), // 只保留最近10条对话
      {
        role: 'user',
        content: userMessage
      }
    ];

    console.log('Sending request to AI API:', { messages });

    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', response.status, errorData);
      throw new Error(`API request failed: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }

    const data: APIResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'API returned unsuccessful response');
    }

    console.log('AI Response received:', data);
    return data.message.content;

  } catch (error) {
    console.error('Error calling AI API:', error);
    
    // 返回友好的错误消息
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        return '抱歉，无法连接到AI服务。请检查网络连接后重试。';
      }
      if (error.message.includes('401') || error.message.includes('403')) {
        return '抱歉，AI服务认证失败。请联系管理员。';
      }
      if (error.message.includes('429')) {
        return '抱歉，请求过于频繁。请稍后再试。';
      }
      if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
        return '抱歉，AI服务暂时不可用。请稍后再试。';
      }
    }
    
    return '抱歉，处理您的请求时发生了错误。请稍后再试。';
  }
}

// 生成消息ID的工具函数
export function generateMessageId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 测试API连接
export async function testAPIConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    
    if (!response.ok) {
      return { 
        success: false, 
        message: `API health check failed: ${response.status}` 
      };
    }

    const data = await response.json();
    return { 
      success: true, 
      message: `API连接正常 - ${data.timestamp}` 
    };

  } catch (error) {
    console.error('API connection test failed:', error);
    return { 
      success: false, 
      message: `无法连接到API: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}