# 快速开始

本指南将帮助您快速搭建和运行 `uni-app-vue3-template` 项目。

## 环境要求

在开始之前，请确保您的开发环境满足以下要求：

- **Node.js**: v14.18+ 或 v16+ (推荐使用 LTS 版本)
- **npm**: v6+ 或 yarn v1.22+ (推荐使用 npm 8+)
- **HBuilderX**: 最新版本 (可选，用于真机调试和打包)
- **Git**: 用于版本控制

## 项目安装

### 1. 克隆项目

```bash
git clone <项目地址>
cd uni_template
```

### 2. 安装依赖

使用 npm:

```bash
npm install
```

或使用 yarn:

```bash
yarn install
```

## 配置说明

### 网络请求配置

在 `common/config.js` 中配置基础 URL 和超时时间：

```javascript
export const baseUrl = 'https://api.example.com'
export const requestTimeout = 10000
```

### 主题配置

在 `common/themeStyle.js` 中配置主题色：

```javascript
const light = {
  '--theme-color': '#87ceeb',
  '--theme-bg': '#87ceeb'
}
```

## 常见问题

### 1. 依赖安装失败

如果遇到依赖安装问题，请尝试：

```bash
# 清除缓存后重新安装
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 2. 开发服务器启动失败

检查端口是否被占用：

```bash
# Windows
netstat -ano | findstr :8000

# macOS/Linux
lsof -i :8000
```

### 3. 构建失败

确保所有依赖已正确安装，并检查代码中是否有语法错误。

## 下一步

- 查看 [项目结构说明](/guide/structure) 了解项目目录组织
- 学习 [核心功能](/guide/components) 的使用方法
- 阅读 [最佳实践](/guide/best-practice) 提升开发效率
