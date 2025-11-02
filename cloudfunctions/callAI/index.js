// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init()

// 支持多个AI服务商
const AI_PROVIDERS = {
  // DeepSeek配置
  deepseek: {
    url: 'https://api.deepseek.com/v1/chat/completions',
    apiKey: 'sk-36279fe5cc5a454ba2640af24dc8ab62', // 请替换为你的实际API Key
    model: 'deepseek-chat'
  },
  // OpenAI配置（备用）
  openai: {
    url: 'https://api.openai.com/v1/chat/completions',
    apiKey: 'your-openai-api-key', // 请替换为你的实际API Key
    model: 'gpt-3.5-turbo'
  }
};

// 默认使用DeepSeek
const DEFAULT_PROVIDER = 'deepseek';

exports.main = async (event, context) => {
  const { messages, provider = DEFAULT_PROVIDER } = event;
  
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return {
      code: 1,
      msg: '消息格式错误'
    };
  }

  const aiConfig = AI_PROVIDERS[provider];
  if (!aiConfig) {
    return {
      code: 1,
      msg: '不支持的AI服务商'
    };
  }

  try {
    console.log('调用AI接口:', { provider, messageCount: messages.length });
    
    const response = await axios.post(
      aiConfig.url,
      {
        model: aiConfig.model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${aiConfig.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30秒超时
      }
    );

    const aiResponse = response.data;
    console.log('AI响应成功:', { 
      provider, 
      usage: aiResponse.usage,
      model: aiResponse.model 
    });

    return {
      code: 0,
      data: aiResponse,
      provider: provider
    };
  } catch (err) {
    console.error('AI API调用失败:', {
      provider,
      error: err.message,
      status: err.response?.status,
      response: err.response?.data,
      stack: err.stack
    });

    // 如果是网络错误，尝试备用服务商
    if (provider === 'deepseek' && err.code === 'ECONNREFUSED') {
      console.log('尝试使用OpenAI作为备用服务商');
      // 这里可以添加自动切换到OpenAI的逻辑
    }

    return {
      code: 1,
      msg: err.response?.data?.error?.message || err.message || 'AI服务暂时不可用',
      detail: {
        provider,
        status: err.response?.status,
        error: err.response?.data
      }
    };
  }
};
