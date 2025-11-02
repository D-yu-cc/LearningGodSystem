/**
 * 调用云函数获取 AI 回复
 * @param {Array} messages 聊天消息数组 [{role: 'user', content: '你好'}]
 * @param {string} provider AI服务商 'deepseek' | 'openai'
 * @returns {Promise<string>} AI 回复内容
 */
function callAI(messages, provider = 'deepseek') {
  return new Promise((resolve, reject) => {
    // 检查云开发环境
    if (!wx.cloud) {
      reject(new Error('云开发环境未初始化'));
      return;
    }

    // 验证消息格式
    if (!Array.isArray(messages) || messages.length === 0) {
      reject(new Error('消息格式错误'));
      return;
    }

    console.log('调用AI云函数:', { messageCount: messages.length, provider });

    wx.cloud.callFunction({
      name: 'callAI',
      data: { 
        messages: messages,
        provider: provider
      },
      success: res => {
        console.log('云函数调用成功:', res);
        
        if (res.result && res.result.code === 0) {
          const aiResponse = res.result.data;
          
          // 兼容不同AI服务商的返回格式
          let reply = '';
          if (aiResponse.choices && aiResponse.choices[0] && aiResponse.choices[0].message) {
            reply = aiResponse.choices[0].message.content;
          } else if (aiResponse.content) {
            reply = aiResponse.content;
          } else if (typeof aiResponse === 'string') {
            reply = aiResponse;
          }
          
          if (reply && reply.trim()) {
            resolve(reply.trim());
          } else {
            reject(new Error('AI返回内容为空'));
          }
        } else {
          const errorMsg = res.result?.msg || '云函数调用失败';
          console.error('云函数返回错误:', res.result);
          reject(new Error(errorMsg));
        }
      },
      fail: err => {
        console.error('云函数调用失败:', err);
        
        // 根据错误类型提供更友好的错误信息
        let errorMessage = '网络连接失败';
        if (err.errMsg) {
          if (err.errMsg.includes('timeout')) {
            errorMessage = '请求超时，请重试';
          } else if (err.errMsg.includes('network')) {
            errorMessage = '网络连接异常';
          } else if (err.errMsg.includes('function not found')) {
            errorMessage = 'AI服务未配置';
          } else {
            errorMessage = err.errMsg;
          }
        }
        
        reject(new Error(errorMessage));
      }
    });
  });
}

/**
 * 检查AI服务是否可用
 * @returns {Promise<boolean>} 服务是否可用
 */
function checkAIService() {
  return new Promise((resolve) => {
    if (!wx.cloud) {
      resolve(false);
      return;
    }

    wx.cloud.callFunction({
      name: 'callAI',
      data: { 
        messages: [{ role: 'user', content: 'test' }],
        provider: 'deepseek'
      },
      success: res => {
        resolve(res.result && res.result.code === 0);
      },
      fail: () => {
        resolve(false);
      }
    });
  });
}

module.exports = {
  callAI,
  checkAIService
};
