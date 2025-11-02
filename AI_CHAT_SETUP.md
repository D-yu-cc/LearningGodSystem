# AI对话功能使用说明

## 功能概述

您的微信小程序现在已经具备了完整的AI对话功能，支持与DeepSeek等大模型进行实时对话。

## 主要特性

### 🎨 现代化UI设计
- 渐变背景和现代化聊天界面
- 用户和AI消息区分显示
- 头像和消息气泡设计
- 响应式布局适配

### ⚡ 智能交互体验
- 实时打字效果模拟
- 自动滚动到最新消息
- 加载状态指示
- 空状态友好提示

### 🔧 强大的功能
- 支持多轮对话
- 历史消息本地存储
- 错误处理和重试机制
- 支持多个AI服务商

## 配置步骤

### 1. 云开发环境配置

在 `app.js` 中更新您的云开发环境ID：

```javascript
wx.cloud.init({
  env: 'your-env-id',  // 替换为您的实际环境ID
  traceUser: true,
});
```

### 2. AI API配置

在 `cloudfunctions/callAI/index.js` 中配置您的API密钥：

```javascript
const AI_PROVIDERS = {
  deepseek: {
    url: 'https://api.deepseek.com/v1/chat/completions',
    apiKey: 'your-deepseek-api-key', // 替换为您的API密钥
    model: 'deepseek-chat'
  },
  // 可选：添加OpenAI作为备用
  openai: {
    url: 'https://api.openai.com/v1/chat/completions',
    apiKey: 'your-openai-api-key', // 替换为您的API密钥
    model: 'gpt-3.5-turbo'
  }
};
```

### 3. 部署云函数

1. 在微信开发者工具中右键点击 `cloudfunctions/callAI` 文件夹
2. 选择"上传并部署：云端安装依赖"
3. 等待部署完成

### 4. 测试功能

1. 在微信开发者工具中预览小程序
2. 进入"对话"页面
3. 输入消息测试AI回复功能

## 使用说明

### 基本对话
- 在输入框中输入您的问题或想法
- 点击"发送"按钮或按回车键发送
- AI会以打字效果回复您的消息

### 快捷功能
- **生成战报**：生成每日学习战报
- **查看属性**：查看用户属性统计
- **发布任务**：进入任务管理页面

### 消息管理
- 对话历史会自动保存到本地
- 最多保留最近50条消息
- 支持多轮连续对话

## 技术架构

### 前端组件
- `pages/chat/chat.js` - 聊天页面逻辑
- `pages/chat/chat.wxml` - 聊天页面模板
- `pages/chat/chat.wxss` - 聊天页面样式
- `utils/ai.js` - AI调用工具函数

### 后端服务
- `cloudfunctions/callAI/index.js` - 云函数入口
- `cloudfunctions/callAI/package.json` - 依赖配置

### 数据流
1. 用户输入消息
2. 前端调用云函数
3. 云函数请求AI API
4. 返回结果并显示

## 故障排除

### 常见问题

1. **AI无回复**
   - 检查API密钥是否正确
   - 确认网络连接正常
   - 查看云函数日志

2. **云函数调用失败**
   - 确认云开发环境ID正确
   - 检查云函数是否已部署
   - 查看控制台错误信息

3. **界面显示异常**
   - 确认微信开发者工具版本
   - 检查基础库版本是否支持
   - 清除缓存重新编译

### 调试方法

1. 打开微信开发者工具控制台
2. 查看网络请求和错误日志
3. 检查云函数调用日志
4. 使用真机调试测试功能

## 扩展功能

### 添加新的AI服务商
在 `cloudfunctions/callAI/index.js` 中添加新的服务商配置：

```javascript
const AI_PROVIDERS = {
  // 现有配置...
  newProvider: {
    url: 'your-api-endpoint',
    apiKey: 'your-api-key',
    model: 'your-model-name'
  }
};
```

### 自定义消息样式
修改 `pages/chat/chat.wxss` 中的样式定义。

### 添加消息类型
在 `pages/chat/chat.js` 中扩展消息处理逻辑。

## 注意事项

1. **API费用**：使用AI服务会产生费用，请注意控制调用频率
2. **内容安全**：建议添加内容审核机制
3. **性能优化**：大量消息时考虑分页加载
4. **隐私保护**：敏感信息不要发送给AI

## 更新日志

- v1.0.0 - 初始版本，支持基础AI对话功能
- v1.1.0 - 添加打字效果和UI优化
- v1.2.0 - 增强错误处理和用户体验

---

如有问题，请查看控制台日志或联系开发者。
