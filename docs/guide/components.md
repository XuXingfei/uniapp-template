# 组件库使用指南

模板集成了 uv-ui、IconPark 等第三方组件库，同时提供了若干项目内置的业务组件。本页介绍它们的安装方式、常用用法以及全局插件注入的能力。

## uv-ui 组件库 [文档地址](https://www.uvui.cn/components/intro.html)

uv-ui 是一套基于 uni-app 的高度可定制 UI 组件库，项目已经通过 `uni_modules` 集成，无需额外安装。

### 安装与配置

在 `main.js` 中已经完成自动注册：

```javascript
import uvUI from '@/uni_modules/uv-ui/index.js'
app.use(uvUI)
```

### 基本使用

在页面中可以直接引用 uv-ui 组件，不需要手动注册：

```vue
<template>
  <view>
    <uv-button type="primary" @click="handleClick">点击按钮</uv-button>
    <uv-input v-model="inputValue" placeholder="请输入内容" />
    <uv-list>
      <uv-list-item title="列表一" />
      <uv-list-item title="列表二" />
    </uv-list>
  </view>
</template>

<script>
export default {
  data() {
    return { inputValue: '' }
  },
  methods: {
    handleClick() {
      uni.showToast({ title: '按钮被点击', icon: 'none' })
    }
  }
}
</script>
```

### 主题定制

uv-ui 支持通过 CSS 变量覆盖主题色：

```scss
:root {
  --uv-primary: #87ceeb;
  --uv-success: #568203;
}
```

## IconPark 图标库 [文档地址](https://iconpark.oceanengine.com/official)

IconPark 提供了大量可配置的矢量图标，模板中同样已完成集成，可直接使用：

```vue
<template>
  <view>
    <icon-park name="home" size="24" />
    <icon-park name="user" size="24" color="#87ceeb" />
    <icon-park name="setting" size="24" theme="filled" />
  </view>
</template>
```

项目同时提供了封装后的 `uv-icon`，使图标与 uv-ui 主题保持一致：

```vue
<uv-icon name="home" size="24" />
<uv-icon name="user" size="24" color="primary" />
```

如需自定义图标，可将 SVG 文件放入 `static/icons/`，并通过 `icon-park` 的 `custom` 模式引入。

## 项目内置组件

除第三方组件外，模板还提供了常用的业务组件，位于 `components/` 目录。

### my-container

- 用作页面根节点，注入主题变量并监听 Pinia 中的 `loading` 状态。
- 内置 `x-loading` 覆盖全局请求 Loading，自动同步 `containerStyle` 到全局。

```vue
<template>
  <my-container>
    <view class="page-body">内容区域</view>
  </my-container>
</template>
```

建议所有页面都使用 `my-container` 作为最外层元素，以保证主题切换和 Loading 正常工作。

### my-upload-image

- 单图上传组件，依赖 `$uploadImage` 全局方法。
- 支持自定义尺寸、边距和插槽内容。

```vue
<my-upload-image v-model:img="form.avatar" size="180rpx" />
```

### my-upload-images

- 多图上传组件，通过 `v-model:imgs` 维护图片数组。
- 自动控制最大数量，并提供预览、删除按钮。

```vue
<my-upload-images
  v-model:imgs="form.album"
  :size="6"
  title="示例图片"
/>
```

上述两类上传组件的上传逻辑完全依赖全局插件，无需在页面中重复封装。

## 全局插件注入

`plugins/globalProps.js` 会在应用启动时加载，将常用能力挂载到 `app.config.globalProperties`：

- `$uploadImage` / `$uploadImages` / `$uploadVideo`：封装统一的文件上传逻辑。
- `$joinUrl`：自动拼接静态资源前缀，避免手动维护域名。
- `config` 与 `utils` 导出的常量、方法：可通过 `this.$baseUrl`、`this.$formatAmount` 等方式直接调用。

借助该插件，页面和组件可以便捷地访问配置与工具函数，而无需额外导入。

## 最佳实践

1. **优先复用**：尽量使用内置组件，确保样式与交互保持一致。
2. **按需引入**：对于第三方库，按需导入组件可减少打包体积。
3. **统一主题**：通过 CSS 变量集中处理主题色，避免硬编码。
4. **遵循封装**：上传、Loading 等通用能力通过全局插件调用，不要在业务页面重复实现。