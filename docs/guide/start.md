# 快速开始

本指南将帮助你在几分钟内搭建并运行 `uni-app-vue3-template` 项目。

## 环境要求

开始之前请确认本地环境满足以下要求：

- **Node.js**：v14.18+ 或 v16+（推荐 LTS 版本）
- **包管理器**：npm v6+ 或 yarn v1.22+（推荐 npm 8+）
- **HBuilderX**：最新版（可选，用于真机调试与打包）
- **Git**：用于获取项目代码

## 项目安装

### 1. 克隆项目/插件市场导入

```bash
git clone <项目地址在右上角>
cd uni_template
```

### 2. 安装依赖

使用 npm：

```bash
npm install
```

或使用 yarn：

```bash
yarn install
```

## 运行项目

### 使用 HBuilderX

1. 打开 HBuilderX，选择“文件 -> 打开目录”，导入 `uni_template`。
2. 在项目管理器中右键项目，选择“运行到浏览器”或“运行到微信小程序”等目标。
3. 如需真机调试，选择“运行到手机或模拟器”，确保设备与 HBuilderX 处于同一局域网。

### 使用命令行（可选）

项目默认通过 HBuilderX 调试。如需 CLI 方案，可安装官方脚手架：

```bash
npm install --save-dev @dcloudio/uni-app-cli
```

常用启动命令示例：

```bash
# H5 调试
npx uni dev:h5

# 微信小程序调试
npx uni dev:mp-weixin
```

命令执行后会启动对应平台的开发服务器；首次运行会自动在 `unpackage/` 目录生成编译结果。

## 构建发布

### 使用 HBuilderX

1. 根据目标环境修改 `common/config.js` 中的域名、协议等配置。
2. 在菜单中选择“发行 -> 发行到网站-H5 / 小程序 / App”等目标，按向导完成打包。

### 使用命令行（可选）

```bash
# 构建 H5 版本
npx uni build:h5

# 构建微信小程序
npx uni build:mp-weixin
```

构建产物将输出至 `unpackage/` 目录，可直接提交至对应平台。

## 配置说明

### 网络请求配置

在 `common/config.js` 中配置基础 URL、超时时间及不同环境的域名：

```javascript
export const baseUrl = 'https://api.example.com'
export const requestTimeout = 10000
```

### 主题配置

在 `common/themeStyle.js` 中维护主题变量：

```javascript
const light = {
  '--theme-color': '#87ceeb',
  '--theme-bg': '#87ceeb'
}
```

## 常见问题

### 依赖安装失败

若安装依赖失败，可尝试清除缓存后重新安装：

```bash
npm cache clean --force
rm -rf node_modules package-lock.json yarn.lock
npm install
```

### 开发服务器启动失败

检查端口是否被占用：

```bash
# Windows
netstat -ano | findstr :8000

# macOS/Linux
lsof -i :8000
```

### 构建失败

确认依赖已正确安装，并检查代码中是否出现语法错误或类型错误。

## 下一步

- 查看 [项目结构说明](/guide/structure) 了解目录组织
- 学习 [核心功能](/guide/components) 的使用方式
- 阅读 [最佳实践](/guide/best-practice) 提升开发效率
- 查阅 [内置 Hooks 指南](/guide/hooks) 掌握常用逻辑封装