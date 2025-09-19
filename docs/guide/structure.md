# 项目结构说明

本项目采用清晰的目录结构组织代码，便于维护和扩展。以下是项目的主要目录和文件说明：

## 项目目录树

```
uni_template/
│
├─.vscode               # 存放将 HBuilderX 代码片段转换为 VSCode 代码片段 (推荐使用 VSCode 进行开发)
├─common                # 公共 js 文件目录
│  ├─api                # 接口 api 目录
│  ├─network            # 网络请求和 WebSocket 目录（请求/响应预处理，登录校验， 错误信息输出等）
│  ├─utils              # 工具函数目录
│  ├─config.js          # 项目配置信息文件
│  └─themeStyle.js      # 项目主题样式文件（样式使用示例: color: var(--theme-color);）
├─components            # 公共组件目录（components/组件名称/组件名称.(vue|uvue) 符合这种格式的组件无需引用、注册，可直接在页面中使用）
│  └─my-container.vue   # 容器组件（该组件应用于每个页面的根元素，如此该页面才能使用 CSS 全局变量和全局 Loading）
├─docs                  # 项目文档（可删除）
├─hooks                 # 公共通用 hook 目录
│  ├─useCommon.js       # 该 hook 返回一些常用的东西（proxy，gProps：全局属性，userStore，globalStore...）
│  ├─useCountDown.js    # 倒计时 hook 返回 （countDownInfo：倒计时信息，start：开始倒计时函数，stop：结束倒计时函数）
│  ├─usePaging.js       # 分页 hook 返回 （pagingInfo：分页信息，getData：获取分页数据）
│  └─useRequest.js      # 网络请求封装成 hook 返回（data：请求数据，getData：获取数据）
├─pages                 # 业务页面文件存放的目录（分包）
│  ├─forgotPwd.vue      # 忘记密码页面
│  ├─login.vue          # 登录页面
│  ├─protocol.vue       # 富文本协议页面
│  ├─register.vue       # 注册页面
│  ├─setting.vue        # 设置页面（切换主题色）
│  └─webview.vue        # 打开外部链接
├─pagesMain             # 启动页和Tabbar页面存放的目录（主包）--- 建议除启动页和Tabbar页面其他页面都放到分包方便小程序发布
│  ├─home.vue           # 首页/启动页
│  └─user.vue           # 我的页面
├─plugins               # Vue 插件
│  └─globalProps.js     # 挂载一些工具函数和配置到全局属性上
├─static                # 存放应用引用的本地静态资源（如图片、视频等）的目录，注意：静态资源都应存放于此目录
│  ├─images             # 存放图片目录
│  ├─tabIcon            # 存放 Tabbar 图标目录
│  └─logo.vue           # 项目 logo
├─stores                # Pinia 状态管理
│  ├─global.js          # 公用状态
│  └─user.js            # 用户状态
├─uni_modules           # 存放uni_module
│  ├─flower-icons       # IconPark https://iconpark.oceanengine.com/official 在该网站复制 Vue 代码即可使用
│  ├─flower-svg         # IconPark 依赖
│  ├─uv-ui              # uv-ui 组件库 https://www.uvui.cn/components/intro.html
│  ├─x-cacheFile        # 文件缓存 https://ext.dcloud.net.cn/plugin?id=24221
│  ├─x-container        # 容器组件 https://ext.dcloud.net.cn/plugin?id=20907
│  ├─x-fade-in-top      # 顶部淡入效果组件 https://ext.dcloud.net.cn/plugin?id=20909
│  ├─x-filter-bg        # 虚化背景组件 https://ext.dcloud.net.cn/plugin?id=20956
│  ├─x-fixed-footer     # 固定底部组件 https://ext.dcloud.net.cn/plugin?id=20927
│  ├─x-fixed-header     # 固定顶部组件 https://ext.dcloud.net.cn/plugin?id=20928
│  ├─x-loading          # 全屏 loading 组件 https://ext.dcloud.net.cn/plugin?id=17704
│  ├─x-nav-bar          # 自定义 navBar 组件 https://ext.dcloud.net.cn/plugin?id=20941
│  ├─x-network          # 网络请求和 WebSocket 库 https://ext.dcloud.net.cn/plugin?id=15928
│  ├─x-network-monitor  # 网络状态监听（用于处理 Ios App 首次安装无网络问题）https://ext.dcloud.net.cn/plugin?id=25089
│  ├─x-perm-apply-instr-v2 # Android 上架说明申请权限目录插件 https://ext.dcloud.net.cn/plugin?id=22585
│  ├─x-placeholder      # 顶部或底部占位组件 https://ext.dcloud.net.cn/plugin?id=20959
│  ├─x-styles           # 公共样式
│  ├─x-tools            # 各端常用工具函数 https://ext.dcloud.net.cn/plugin?id=20898
│  └─x-utils            # 布局组件，公共样式，各端常用工具函数以及路由跳转简单封装
├─unpackage             # 非工程代码，一般存放运行或发行的编译结果
├─.gitignore            # Git忽略文件
├─.jsbeautifyrc         # 代码格式化风格配置文件
├─App.vue               # 应用配置，用来配置App全局样式以及监听 应用生命周期
├─main.js               # Vue初始化入口文件
├─manifest.json         # 配置应用名称、appid、logo、版本等打包信息
├─pages.json            # 配置页面路由、导航条、选项卡等页面类信息
├─readme.md             # 项目介绍
└─uni.scss              # 内置的常用样式变量
```

## 目录详细说明

### common/ - 公共代码

存放项目中通用的代码和配置。

#### common/api/ - API 接口定义

存放各个业务模块的 API 接口定义，按功能模块组织。

#### common/network/ - 网络相关

- `http.js`: 网络请求封装，包含请求和响应拦截器
- `socket.js`: WebSocket 连接管理
- `utils.js`: 网络相关的工具函数

#### common/utils/ - 工具函数

存放项目中通用的工具函数，如登录检测、位置获取、支付等。

#### common/config.js - 项目配置

项目的全局配置，如基础 URL、超时时间等。

#### common/themeStyle.js - 主题样式

定义项目的主题色配置，基于 CSS 变量实现。

### components/ - 公共组件

存放项目中可复用的公共组件，如自定义按钮、表单控件等。

### docs/ - 文档站点

使用 VitePress 构建的项目文档站点。

#### docs/.vitepress/ - VitePress 配置

VitePress 的配置文件，包括导航、侧边栏等。

#### docs/guide/ - 使用指南

详细的使用文档，按功能模块组织。

### hooks/ - 自定义 Hooks

存放 Vue 的自定义 Hooks，如分页、倒计时、请求等。

### pages/ - 业务页面（分包）

存放业务相关的页面，按功能模块组织成分包结构。

### pagesMain/ - 主页面（主包）

存放应用的主要页面，如首页、个人中心等。

### plugins/ - Vue 插件

存放自定义的 Vue 插件，如全局属性注入等。

### static/ - 静态资源

存放图片、字体等静态资源文件。

### stores/ - Pinia 状态管理

使用 Pinia 实现的全局状态管理，按模块组织。

### uni_modules/ - UniApp 模块

UniApp 的插件模块，如 uv-ui 组件库、IconPark 图标库等。

### unpackage/ - 构建输出

项目构建后的输出目录，包含各平台的构建结果。

## 核心文件说明

### App.vue - 应用入口

应用的根组件，定义全局样式和应用生命周期。

### main.js - 主入口文件

应用的主入口文件，初始化 Vue 实例和插件。

### pages.json - 页面配置

配置应用的页面路径、窗口样式、TabBar 等。

### manifest.json - 应用配置

配置应用的基本信息、权限、SDK 等。

### uni.scss - 全局样式

全局的 SCSS 变量和样式定义。

## 开发建议

1. **组件开发**：公共组件放在 `components/` 目录，业务组件可放在对应页面目录下
2. **状态管理**：全局状态使用 Pinia 管理，组件状态使用 Vue 的响应式 API
3. **网络请求**：统一使用 `common/network/http.js` 封装的请求方法
4. **样式管理**：使用 SCSS 变量和 CSS 变量实现主题定制
5. **工具函数**：通用工具函数放在 `common/utils/` 目录

通过遵循这个项目结构，可以确保代码的可维护性和可扩展性。