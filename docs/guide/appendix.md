# 附录

## 相关插件与资源

### 官方文档

- [uni-app 官方文档](https://uniapp.dcloud.io/)
- [Vue 3 官方文档](https://v3.vuejs.org/)
- [Pinia 官方文档](https://pinia.vuejs.org/)
- [VitePress 官方文档](https://vitepress.dev/)

### 组件库文档

- [uv-ui 组件库](https://www.uvui.cn/)
- [IconPark 图标库](https://iconpark.oceanengine.com/)

### 开发工具

- [HBuilderX](https://www.dcloud.io/hbuilderx.html) - uni-app 官方 IDE
- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- [Node.js](https://nodejs.org/)

### 项目依赖插件

以下是在本项目中使用的 uni_modules 插件：

- [IconPark 图标库](https://iconpark.oceanengine.com/official) - 项目中使用的图标组件库
- [IconPark 依赖](https://iconpark.oceanengine.com/official) - IconPark 的依赖组件
- [uv-ui 组件库](https://www.uvui.cn/components/intro.html) - 项目主要使用的 UI 组件库
- [文件缓存](https://ext.dcloud.net.cn/plugin?id=24221) - 用于文件缓存功能
- [容器组件](https://ext.dcloud.net.cn/plugin?id=20907) - 基础容器组件
- [顶部淡入效果组件](https://ext.dcloud.net.cn/plugin?id=20909) - 实现顶部淡入动画效果
- [虚化背景组件](https://ext.dcloud.net.cn/plugin?id=20956) - 实现背景虚化效果
- [固定底部组件](https://ext.dcloud.net.cn/plugin?id=20927) - 固定在页面底部的组件
- [固定顶部组件](https://ext.dcloud.net.cn/plugin?id=20928) - 固定在页面顶部的组件
- [全屏 loading 组件](https://ext.dcloud.net.cn/plugin?id=17704) - 全屏加载状态组件
- [自定义 navBar 组件](https://ext.dcloud.net.cn/plugin?id=20941) - 自定义导航栏组件
- [网络请求和 WebSocket 库](https://ext.dcloud.net.cn/plugin?id=15928) - 网络请求和 WebSocket 功能实现
- [网络状态监听](https://ext.dcloud.net.cn/plugin?id=25089) - 用于处理 iOS App 首次安装无网络问题
- [Android 上架说明申请权限目录插件](https://ext.dcloud.net.cn/plugin?id=22585) - Android 应用上架所需的权限说明
- [顶部或底部占位组件](https://ext.dcloud.net.cn/plugin?id=20959) - 用于顶部或底部占位的组件
- [各端常用工具函数](https://ext.dcloud.net.cn/plugin?id=20898) - 提供多端兼容的工具函数

## 贡献指南

我们欢迎所有形式的贡献，包括但不限于代码提交、文档改进、问题报告等。

### 提交 Issue

如果您发现了 bug 或有功能建议，请在 GitHub 上提交 Issue：

1. 访问项目的 GitHub 仓库
2. 点击 "Issues" 标签
3. 点击 "New Issue" 按钮
4. 选择合适的 Issue 模板
5. 填写相关信息并提交

### 提交代码

#### Fork 仓库

1. 访问项目的 GitHub 仓库
2. 点击右上角的 "Fork" 按钮
3. 在您的 GitHub 账户下创建一个仓库副本

#### 克隆仓库

```bash
git clone https://github.com/your-username/repository-name.git
cd repository-name
```

#### 创建分支

```bash
git checkout -b feature/your-feature-name
```

#### 提交更改

```bash
git add .
git commit -m "feat: add your feature description"
```

#### 推送到 GitHub

```bash
git push origin feature/your-feature-name
```

#### 创建 Pull Request

1. 访问您的 GitHub 仓库页面
2. 点击 "Compare & pull request" 按钮
3. 填写 Pull Request 信息
4. 点击 "Create pull request" 按钮

### 代码规范

在提交代码之前，请确保：

1. 遵循项目的代码风格配置 (`.jsbeautifyrc`)
2. 添加必要的注释和文档
3. 确保代码通过所有测试
4. 编写清晰的提交信息

### 提交信息规范

请遵循以下提交信息格式：

```
<type>: <subject>

<body>

<footer>
```

#### 类型说明

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整（不影响代码运行）
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

#### 示例

```
feat: 添加用户登录功能

- 实现微信小程序登录
- 添加手机号登录方式
- 完善登录状态管理

Closes #123
```

## 技术支持

如果您在使用过程中遇到问题，可以通过以下方式获取技术支持：

1. 查看官方文档和 FAQ
2. 在 GitHub 上提交 Issue
3. 加入相关的技术交流群
4. 联系项目维护者
