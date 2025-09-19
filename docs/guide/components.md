# 组件库使用指南

本项目集成了各种常用的组件库：uv-ui 和 IconPark等，提供丰富的 UI 组件和图标资源。

## uv-ui 组件库 [文档地址](https://www.uvui.cn/components/intro.html)

uv-ui 是一个基于 uni-app 的 UI 组件库，提供了丰富的组件以满足各种业务需求。

### 安装与配置

uv-ui 已作为 uni_modules 集成在项目中，无需额外安装。在 `main.js` 中已自动注册：

```javascript
import uvUI from '@/uni_modules/uv-ui/index.js'
app.use(uvUI)
```

### 基本使用

在页面中直接使用 uv-ui 组件：

```vue
<template>
  <view>
    <!-- 按钮组件 -->
    <uv-button type="primary" @click="handleClick">点击按钮</uv-button>

    <!-- 输入框组件 -->
    <uv-input v-model="inputValue" placeholder="请输入内容" />

    <!-- 列表组件 -->
    <uv-list>
      <uv-list-item title="列表项1" />
      <uv-list-item title="列表项2" />
    </uv-list>
  </view>
</template>

<script>
export default {
  data() {
    return {
      inputValue: ''
    }
  },
  methods: {
    handleClick() {
      uni.showToast({
        title: '按钮被点击',
        icon: 'none'
      })
    }
  }
}
</script>
```

### 常用组件示例

#### 1. 按钮组件

```vue
<!-- 不同类型的按钮 -->
<uv-button type="primary">主要按钮</uv-button>
<uv-button type="success">成功按钮</uv-button>
<uv-button type="warning">警告按钮</uv-button>
<uv-button type="error">错误按钮</uv-button>
<uv-button type="info">信息按钮</uv-button>

<!-- 不同形状的按钮 -->
<uv-button shape="circle">圆形按钮</uv-button>
<uv-button shape="square">方形按钮</uv-button>

<!-- 禁用状态 -->
<uv-button disabled>禁用按钮</uv-button>
```

#### 2. 表单组件

```vue
<template>
  <view>
    <!-- 输入框 -->
    <uv-input
      v-model="formData.name"
      label="姓名"
      placeholder="请输入姓名"
    />

    <!-- 选择器 -->
    <uv-picker
      v-model="formData.gender"
      :range="genderOptions"
      label="性别"
    />

    <!-- 开关 -->
    <uv-switch v-model="formData.agreement" />
    <text>同意用户协议</text>
  </view>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        name: '',
        gender: '',
        agreement: false
      },
      genderOptions: ['男', '女']
    }
  }
}
</script>
```

### 主题定制

uv-ui 支持主题定制，可以通过修改 CSS 变量来改变组件主题色：

```scss
/* 在 App.vue 或全局样式中 */
:root {
  --uv-primary: #87ceeb; /* 修改主色调 */
  --uv-success: #568203; /* 修改成功色 */
}
```

## IconPark 图标库 [文档地址](https://iconpark.oceanengine.com/official)

IconPark 提供了丰富的图标资源，支持多种主题和尺寸。

### 基本使用

```vue
<template>
  <view>
    <!-- 基本图标 -->
    <icon-park name="home" size="24" />

    <!-- 带颜色的图标 -->
    <icon-park name="user" size="24" color="#87ceeb" />

    <!-- 不同主题的图标 -->
    <icon-park name="setting" size="24" theme="filled" />
    <icon-park name="setting" size="24" theme="outline" />
  </view>
</template>
```

### 图标组件封装

项目中对 IconPark 进行了封装，可以更方便地使用：

```vue
<template>
  <view>
    <!-- 使用封装的图标组件 -->
    <uv-icon name="home" size="24" />
    <uv-icon name="user" size="24" color="primary" />
  </view>
</template>
```

### 自定义图标

如果需要使用自定义图标，可以将 SVG 文件放入 `static/icons/` 目录，然后通过以下方式使用：

```vue
<template>
  <view>
    <icon-park
      name="custom-icon"
      size="24"
      :custom="true"
      path="/static/icons/custom-icon.svg"
    />
  </view>
</template>
```

## 最佳实践

1. **组件选择**：优先使用 uv-ui 组件，保持 UI 风格统一
2. **性能优化**：避免在列表中使用过多复杂组件
3. **主题一致性**：使用项目定义的主题色变量，保持整体风格一致

通过合理使用这些组件库，可以大幅提升开发效率并保证 UI 的一致性。
