import{_ as n,c as s,o as e,ae as p}from"./chunks/framework.ENE7fGf6.js";const h=JSON.parse('{"title":"项目结构说明","description":"","frontmatter":{},"headers":[],"relativePath":"guide/structure.md","filePath":"guide/structure.md"}'),o={name:"guide/structure.md"};function i(l,a,t,c,r,d){return e(),s("div",null,[...a[0]||(a[0]=[p(`<h1 id="项目结构说明" tabindex="-1">项目结构说明 <a class="header-anchor" href="#项目结构说明" aria-label="Permalink to &quot;项目结构说明&quot;">​</a></h1><p>本项目采用清晰的目录结构组织代码，便于维护和扩展。以下是项目的主要目录和文件说明：</p><h2 id="项目目录树" tabindex="-1">项目目录树 <a class="header-anchor" href="#项目目录树" aria-label="Permalink to &quot;项目目录树&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>uni_template/</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├─.vscode               # 存放将 HBuilderX 代码片段转换为 VSCode 代码片段 (推荐使用 VSCode 进行开发)</span></span>
<span class="line"><span>├─common                # 公共 js 文件目录</span></span>
<span class="line"><span>│  ├─api                # 接口 api 目录</span></span>
<span class="line"><span>│  ├─network            # 网络请求和 WebSocket 目录（请求/响应预处理，登录校验， 错误信息输出等）</span></span>
<span class="line"><span>│  ├─utils              # 工具函数目录</span></span>
<span class="line"><span>│  ├─config.js          # 项目配置信息文件</span></span>
<span class="line"><span>│  └─themeStyle.js      # 项目主题样式文件（样式使用示例: color: var(--theme-color);）</span></span>
<span class="line"><span>├─components            # 公共组件目录（components/组件名称/组件名称.(vue|uvue) 符合这种格式的组件无需引用、注册，可直接在页面中使用）</span></span>
<span class="line"><span>│  └─my-container.vue   # 容器组件（该组件应用于每个页面的根元素，如此该页面才能使用 CSS 全局变量和全局 Loading）</span></span>
<span class="line"><span>├─docs                  # 项目文档（可删除）</span></span>
<span class="line"><span>├─hooks                 # 公共通用 hook 目录</span></span>
<span class="line"><span>│  ├─useCommon.js       # 该 hook 返回一些常用的东西（proxy，gProps：全局属性，userStore，globalStore...）</span></span>
<span class="line"><span>│  ├─useCountDown.js    # 倒计时 hook 返回 （countDownInfo：倒计时信息，start：开始倒计时函数，stop：结束倒计时函数）</span></span>
<span class="line"><span>│  ├─usePaging.js       # 分页 hook 返回 （pagingInfo：分页信息，getData：获取分页数据）</span></span>
<span class="line"><span>│  └─useRequest.js      # 网络请求封装成 hook 返回（data：请求数据，getData：获取数据）</span></span>
<span class="line"><span>├─pages                 # 业务页面文件存放的目录（分包）</span></span>
<span class="line"><span>│  ├─forgotPwd.vue      # 忘记密码页面</span></span>
<span class="line"><span>│  ├─login.vue          # 登录页面</span></span>
<span class="line"><span>│  ├─protocol.vue       # 富文本协议页面</span></span>
<span class="line"><span>│  ├─register.vue       # 注册页面</span></span>
<span class="line"><span>│  ├─setting.vue        # 设置页面（切换主题色）</span></span>
<span class="line"><span>│  └─webview.vue        # 打开外部链接</span></span>
<span class="line"><span>├─pagesMain             # 启动页和Tabbar页面存放的目录（主包）--- 建议除启动页和Tabbar页面其他页面都放到分包方便小程序发布</span></span>
<span class="line"><span>│  ├─home.vue           # 首页/启动页</span></span>
<span class="line"><span>│  └─user.vue           # 我的页面</span></span>
<span class="line"><span>├─plugins               # Vue 插件</span></span>
<span class="line"><span>│  └─globalProps.js     # 挂载一些工具函数和配置到全局属性上</span></span>
<span class="line"><span>├─static                # 存放应用引用的本地静态资源（如图片、视频等）的目录，注意：静态资源都应存放于此目录</span></span>
<span class="line"><span>│  ├─images             # 存放图片目录</span></span>
<span class="line"><span>│  ├─tabIcon            # 存放 Tabbar 图标目录</span></span>
<span class="line"><span>│  └─logo.vue           # 项目 logo</span></span>
<span class="line"><span>├─stores                # Pinia 状态管理</span></span>
<span class="line"><span>│  ├─global.js          # 公用状态</span></span>
<span class="line"><span>│  └─user.js            # 用户状态</span></span>
<span class="line"><span>├─uni_modules           # 存放uni_module</span></span>
<span class="line"><span>│  ├─flower-icons       # IconPark https://iconpark.oceanengine.com/official 在该网站复制 Vue 代码即可使用</span></span>
<span class="line"><span>│  ├─flower-svg         # IconPark 依赖</span></span>
<span class="line"><span>│  ├─uv-ui              # uv-ui 组件库 https://www.uvui.cn/components/intro.html</span></span>
<span class="line"><span>│  ├─x-cacheFile        # 文件缓存 https://ext.dcloud.net.cn/plugin?id=24221</span></span>
<span class="line"><span>│  ├─x-container        # 容器组件 https://ext.dcloud.net.cn/plugin?id=20907</span></span>
<span class="line"><span>│  ├─x-fade-in-top      # 顶部淡入效果组件 https://ext.dcloud.net.cn/plugin?id=20909</span></span>
<span class="line"><span>│  ├─x-filter-bg        # 虚化背景组件 https://ext.dcloud.net.cn/plugin?id=20956</span></span>
<span class="line"><span>│  ├─x-fixed-footer     # 固定底部组件 https://ext.dcloud.net.cn/plugin?id=20927</span></span>
<span class="line"><span>│  ├─x-fixed-header     # 固定顶部组件 https://ext.dcloud.net.cn/plugin?id=20928</span></span>
<span class="line"><span>│  ├─x-loading          # 全屏 loading 组件 https://ext.dcloud.net.cn/plugin?id=17704</span></span>
<span class="line"><span>│  ├─x-nav-bar          # 自定义 navBar 组件 https://ext.dcloud.net.cn/plugin?id=20941</span></span>
<span class="line"><span>│  ├─x-network          # 网络请求和 WebSocket 库 https://ext.dcloud.net.cn/plugin?id=15928</span></span>
<span class="line"><span>│  ├─x-network-monitor  # 网络状态监听（用于处理 Ios App 首次安装无网络问题）https://ext.dcloud.net.cn/plugin?id=25089</span></span>
<span class="line"><span>│  ├─x-perm-apply-instr-v2 # Android 上架说明申请权限目录插件 https://ext.dcloud.net.cn/plugin?id=22585</span></span>
<span class="line"><span>│  ├─x-placeholder      # 顶部或底部占位组件 https://ext.dcloud.net.cn/plugin?id=20959</span></span>
<span class="line"><span>│  ├─x-styles           # 公共样式</span></span>
<span class="line"><span>│  ├─x-tools            # 各端常用工具函数 https://ext.dcloud.net.cn/plugin?id=20898</span></span>
<span class="line"><span>│  └─x-utils            # 布局组件，公共样式，各端常用工具函数以及路由跳转简单封装</span></span>
<span class="line"><span>├─unpackage             # 非工程代码，一般存放运行或发行的编译结果</span></span>
<span class="line"><span>├─.gitignore            # Git忽略文件</span></span>
<span class="line"><span>├─.jsbeautifyrc         # 代码格式化风格配置文件</span></span>
<span class="line"><span>├─App.vue               # 应用配置，用来配置App全局样式以及监听 应用生命周期</span></span>
<span class="line"><span>├─main.js               # Vue初始化入口文件</span></span>
<span class="line"><span>├─manifest.json         # 配置应用名称、appid、logo、版本等打包信息</span></span>
<span class="line"><span>├─pages.json            # 配置页面路由、导航条、选项卡等页面类信息</span></span>
<span class="line"><span>├─readme.md             # 项目介绍</span></span>
<span class="line"><span>└─uni.scss              # 内置的常用样式变量</span></span></code></pre></div><h2 id="目录详细说明" tabindex="-1">目录详细说明 <a class="header-anchor" href="#目录详细说明" aria-label="Permalink to &quot;目录详细说明&quot;">​</a></h2><h3 id="common-公共代码" tabindex="-1">common/ - 公共代码 <a class="header-anchor" href="#common-公共代码" aria-label="Permalink to &quot;common/ - 公共代码&quot;">​</a></h3><p>存放项目中通用的代码和配置。</p><h4 id="common-api-api-接口定义" tabindex="-1">common/api/ - API 接口定义 <a class="header-anchor" href="#common-api-api-接口定义" aria-label="Permalink to &quot;common/api/ - API 接口定义&quot;">​</a></h4><p>存放各个业务模块的 API 接口定义，按功能模块组织。</p><h4 id="common-network-网络相关" tabindex="-1">common/network/ - 网络相关 <a class="header-anchor" href="#common-network-网络相关" aria-label="Permalink to &quot;common/network/ - 网络相关&quot;">​</a></h4><ul><li><code>http.js</code>: 网络请求封装，包含请求和响应拦截器</li><li><code>socket.js</code>: WebSocket 连接管理</li><li><code>utils.js</code>: 网络相关的工具函数</li></ul><h4 id="common-utils-工具函数" tabindex="-1">common/utils/ - 工具函数 <a class="header-anchor" href="#common-utils-工具函数" aria-label="Permalink to &quot;common/utils/ - 工具函数&quot;">​</a></h4><p>存放项目中通用的工具函数，如登录检测、位置获取、支付等。</p><h4 id="common-config-js-项目配置" tabindex="-1">common/config.js - 项目配置 <a class="header-anchor" href="#common-config-js-项目配置" aria-label="Permalink to &quot;common/config.js - 项目配置&quot;">​</a></h4><p>项目的全局配置，如基础 URL、超时时间等。</p><h4 id="common-themestyle-js-主题样式" tabindex="-1">common/themeStyle.js - 主题样式 <a class="header-anchor" href="#common-themestyle-js-主题样式" aria-label="Permalink to &quot;common/themeStyle.js - 主题样式&quot;">​</a></h4><p>定义项目的主题色配置，基于 CSS 变量实现。</p><h3 id="components-公共组件" tabindex="-1">components/ - 公共组件 <a class="header-anchor" href="#components-公共组件" aria-label="Permalink to &quot;components/ - 公共组件&quot;">​</a></h3><p>存放项目中可复用的公共组件，如自定义按钮、表单控件等。</p><h3 id="docs-文档站点" tabindex="-1">docs/ - 文档站点 <a class="header-anchor" href="#docs-文档站点" aria-label="Permalink to &quot;docs/ - 文档站点&quot;">​</a></h3><p>使用 VitePress 构建的项目文档站点。</p><h4 id="docs-vitepress-vitepress-配置" tabindex="-1">docs/.vitepress/ - VitePress 配置 <a class="header-anchor" href="#docs-vitepress-vitepress-配置" aria-label="Permalink to &quot;docs/.vitepress/ - VitePress 配置&quot;">​</a></h4><p>VitePress 的配置文件，包括导航、侧边栏等。</p><h4 id="docs-guide-使用指南" tabindex="-1">docs/guide/ - 使用指南 <a class="header-anchor" href="#docs-guide-使用指南" aria-label="Permalink to &quot;docs/guide/ - 使用指南&quot;">​</a></h4><p>详细的使用文档，按功能模块组织。</p><h3 id="hooks-自定义-hooks" tabindex="-1">hooks/ - 自定义 Hooks <a class="header-anchor" href="#hooks-自定义-hooks" aria-label="Permalink to &quot;hooks/ - 自定义 Hooks&quot;">​</a></h3><p>存放 Vue 的自定义 Hooks，如分页、倒计时、请求等。</p><h3 id="pages-业务页面-分包" tabindex="-1">pages/ - 业务页面（分包） <a class="header-anchor" href="#pages-业务页面-分包" aria-label="Permalink to &quot;pages/ - 业务页面（分包）&quot;">​</a></h3><p>存放业务相关的页面，按功能模块组织成分包结构。</p><h3 id="pagesmain-主页面-主包" tabindex="-1">pagesMain/ - 主页面（主包） <a class="header-anchor" href="#pagesmain-主页面-主包" aria-label="Permalink to &quot;pagesMain/ - 主页面（主包）&quot;">​</a></h3><p>存放应用的主要页面，如首页、个人中心等。</p><h3 id="plugins-vue-插件" tabindex="-1">plugins/ - Vue 插件 <a class="header-anchor" href="#plugins-vue-插件" aria-label="Permalink to &quot;plugins/ - Vue 插件&quot;">​</a></h3><p>存放自定义的 Vue 插件，如全局属性注入等。</p><h3 id="static-静态资源" tabindex="-1">static/ - 静态资源 <a class="header-anchor" href="#static-静态资源" aria-label="Permalink to &quot;static/ - 静态资源&quot;">​</a></h3><p>存放图片、字体等静态资源文件。</p><h3 id="stores-pinia-状态管理" tabindex="-1">stores/ - Pinia 状态管理 <a class="header-anchor" href="#stores-pinia-状态管理" aria-label="Permalink to &quot;stores/ - Pinia 状态管理&quot;">​</a></h3><p>使用 Pinia 实现的全局状态管理，按模块组织。</p><h3 id="uni-modules-uniapp-模块" tabindex="-1">uni_modules/ - UniApp 模块 <a class="header-anchor" href="#uni-modules-uniapp-模块" aria-label="Permalink to &quot;uni_modules/ - UniApp 模块&quot;">​</a></h3><p>UniApp 的插件模块，如 uv-ui 组件库、IconPark 图标库等。</p><h3 id="unpackage-构建输出" tabindex="-1">unpackage/ - 构建输出 <a class="header-anchor" href="#unpackage-构建输出" aria-label="Permalink to &quot;unpackage/ - 构建输出&quot;">​</a></h3><p>项目构建后的输出目录，包含各平台的构建结果。</p><h2 id="核心文件说明" tabindex="-1">核心文件说明 <a class="header-anchor" href="#核心文件说明" aria-label="Permalink to &quot;核心文件说明&quot;">​</a></h2><h3 id="app-vue-应用入口" tabindex="-1">App.vue - 应用入口 <a class="header-anchor" href="#app-vue-应用入口" aria-label="Permalink to &quot;App.vue - 应用入口&quot;">​</a></h3><p>应用的根组件，定义全局样式和应用生命周期。</p><h3 id="main-js-主入口文件" tabindex="-1">main.js - 主入口文件 <a class="header-anchor" href="#main-js-主入口文件" aria-label="Permalink to &quot;main.js - 主入口文件&quot;">​</a></h3><p>应用的主入口文件，初始化 Vue 实例和插件。</p><h3 id="pages-json-页面配置" tabindex="-1">pages.json - 页面配置 <a class="header-anchor" href="#pages-json-页面配置" aria-label="Permalink to &quot;pages.json - 页面配置&quot;">​</a></h3><p>配置应用的页面路径、窗口样式、TabBar 等。</p><h3 id="manifest-json-应用配置" tabindex="-1">manifest.json - 应用配置 <a class="header-anchor" href="#manifest-json-应用配置" aria-label="Permalink to &quot;manifest.json - 应用配置&quot;">​</a></h3><p>配置应用的基本信息、权限、SDK 等。</p><h3 id="uni-scss-全局样式" tabindex="-1">uni.scss - 全局样式 <a class="header-anchor" href="#uni-scss-全局样式" aria-label="Permalink to &quot;uni.scss - 全局样式&quot;">​</a></h3><p>全局的 SCSS 变量和样式定义。</p><h2 id="开发建议" tabindex="-1">开发建议 <a class="header-anchor" href="#开发建议" aria-label="Permalink to &quot;开发建议&quot;">​</a></h2><ol><li><strong>组件开发</strong>：公共组件放在 <code>components/</code> 目录，业务组件可放在对应页面目录下</li><li><strong>状态管理</strong>：全局状态使用 Pinia 管理，组件状态使用 Vue 的响应式 API</li><li><strong>网络请求</strong>：统一使用 <code>common/network/http.js</code> 封装的请求方法</li><li><strong>样式管理</strong>：使用 SCSS 变量和 CSS 变量实现主题定制</li><li><strong>工具函数</strong>：通用工具函数放在 <code>common/utils/</code> 目录</li></ol><p>通过遵循这个项目结构，可以确保代码的可维护性和可扩展性。</p>`,55)])])}const m=n(o,[["render",i]]);export{h as __pageData,m as default};
