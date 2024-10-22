### uni-app项目开发基础模版（Vue3）

- 常用组件库（uv-ui 库，IconPark 图标库）
- Promise 风格网络请求（自定义请求响应拦截器）
- WebSocket 集成消息收发、心跳、重连（简单易用）
- CSS 变量主题方案（简单切换项目主题色）
- 自定义全局 Loading
- 各端实用工具函数


### 项目结构

```bash
root/
│
├─common                # 公共 js 文件目录
│  ├─api                # 接口 api 目录
│  ├─network            # 网络请求和 WebSocket 目录
│  ├─utils              # 工具函数目录
│  ├─config.js          # 项目配置信息文件
│  └─themeStyle.js      # 项目主题样式文件（样式使用示例: color: var(--theme-color);）
├─components            # 公共组件目录（components/组件名称/组件名称.(vue|uvue) 符合这种格式的组件无需引用、注册，可直接在页面中使用）
│  └─my-container.vue   # 容器组件（该组件应用于每个页面的根元素，如此该页面才能使用 CSS 全局变量和全局 Loading）
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
│  ├─x-loading          # 全屏 loading 组件 https://ext.dcloud.net.cn/plugin?id=17704
│  ├─x-network          # 网络请求和 WebSocket 库 https://ext.dcloud.net.cn/plugin?id=15928
│  ├─x-perm-apply-instr # Android 上架说明申请权限目录插件 https://ext.dcloud.net.cn/plugin?id=15897
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



