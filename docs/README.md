# 项目文档

这是 `uni-app-vue3-template` 项目的文档站点，基于 VitePress 构建。

## 目录结构

```
docs/
├─.vitepress/    # VitePress 配置
├─guide/         # 使用指南
├─images/        # 文档图片
├─index.md       # 首页
└─README.md      # 此文件
```

## 开发命令

```bash
# 启动开发服务器
npm run docs:dev

# 构建文档站点
npm run docs:build

# 预览构建结果
npm run docs:preview
```

## 文档内容

- [首页](index.md) - 项目简介和快速预览
- [快速开始](guide/start.md) - 环境要求、安装和运行指南
- [项目结构说明](guide/structure.md) - 目录和文件详细说明
- 核心功能指南：
  - [组件库](guide/components.md) - uv-ui 和 IconPark 使用方法
  - [网络请求](guide/network.md) - Promise 风格请求封装
  - [WebSocket](guide/websocket.md) - 消息收发、心跳、重连实现
  - [主题与样式](guide/theme.md) - CSS 变量主题方案
  - [全局 Loading](guide/loading.md) - 自定义全局 Loading 使用
  - [工具函数](guide/utils.md) - 常用工具函数示例
- [最佳实践](guide/best-practice.md) - 开发建议和规范
- [附录](guide/appendix.md) - 插件链接、贡献指南等

## 贡献文档

欢迎提交 Pull Request 来改进文档内容。