// 模拟 AI 响应逻辑
const mockResponses = [
  "这是一个很有趣的问题！让我思考一下...",
  "根据我的理解，这个问题可以从多个角度来看。",
  "感谢您的提问！我会尽力为您提供有用的信息。",
  "让我为您分析一下这个问题的几个关键点...",
  "这确实是一个值得深入讨论的话题。",
  "基于目前的信息，我认为可以这样考虑...",
  "您提到的这点很重要，让我详细解释一下。",
  "从技术角度来看，这涉及到几个核心概念...",
  "我理解您的关注点，让我们一起探讨一下可能的解决方案。",
  "这个话题涉及面很广，我尽量给您一个全面的回答。"
];

const contextualResponses: Record<string, string[]> = {
  greeting: [
    "您好！我是AI助手，很高兴与您交流！",
    "嗨！有什么我可以帮助您的吗？",
    "你好！我在这里为您提供帮助。"
  ],
  question: [
    "这是一个很棒的问题！",
    "让我仔细考虑一下您的问题...",
    "基于您的提问，我认为..."
  ],
  help: [
    "当然！我很乐意帮助您。",
    "没问题，让我为您解答。",
    "我来为您提供一些建议。"
  ]
};

// 简单的关键词检测
function detectContext(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('你好') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return 'greeting';
  }
  
  if (lowerMessage.includes('?') || lowerMessage.includes('？') || lowerMessage.includes('什么') || lowerMessage.includes('怎么')) {
    return 'question';
  }
  
  if (lowerMessage.includes('帮助') || lowerMessage.includes('help') || lowerMessage.includes('请')) {
    return 'help';
  }
  
  return 'general';
}

// 生成随机延迟，模拟真实的AI响应时间
function getRandomDelay(): number {
  return Math.random() * 2000 + 1000; // 1-3秒随机延迟
}

// 主要的模拟AI响应函数
export async function generateAIResponse(userMessage: string): Promise<string> {
  const delay = getRandomDelay();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const context = detectContext(userMessage);
      let responses = contextualResponses[context] || mockResponses;
      
      // 如果是特定上下文，有50%概率使用通用响应
      if (context !== 'general' && Math.random() > 0.5) {
        responses = mockResponses;
      }
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      resolve(randomResponse);
    }, delay);
  });
}

// 生成消息ID的工具函数
export function generateMessageId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}