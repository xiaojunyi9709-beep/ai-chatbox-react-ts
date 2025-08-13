# AI 聊天框 - React + TypeScript

这是一个基于 React 和 TypeScript 构建的现代化 AI 聊天界面。

## 功能特性

- 🎨 现代化的聊天界面设计
- 💬 实时消息交互
- 📱 响应式布局，支持移动设备
- ⚡ 基于 React 18 和 TypeScript
- 🎯 模拟 AI 响应功能
- 🌈 精美的渐变背景和动画效果

## 技术栈

- React 18
- TypeScript
- CSS3 (Flexbox & Grid)
- Lucide React (图标库)

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
```

## 项目结构

```
src/
├── components/
│   ├── ChatBox.tsx          # 主聊天容器组件
│   ├── ChatBox.css          # 聊天框样式
│   ├── MessageList.tsx      # 消息列表组件
│   └── MessageInput.tsx     # 消息输入组件
├── types/
│   └── chat.ts              # TypeScript 类型定义
├── utils/
│   └── mockAI.ts            # 模拟 AI 响应逻辑
├── App.tsx                  # 主应用组件
├── App.css                  # 应用样式
├── index.tsx                # 应用入口
└── index.css                # 全局样式
```

## 自定义配置

您可以通过修改以下文件来自定义聊天框：

- `src/utils/mockAI.ts` - 修改 AI 响应逻辑
- `src/components/ChatBox.css` - 调整界面样式
- `src/types/chat.ts` - 扩展消息类型定义

## 部署

本项目可以轻松部署到各种平台：

- [Vercel](https://vercel.com/)
- [Netlify](https://netlify.com/)
- [GitHub Pages](https://pages.github.com/)

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
