# x-filter-bg 组件使用说明

## 组件概述

`x-filter-bg` 是一个具有背景滤镜效果的 Vue 组件，可以为内容提供美观的毛玻璃背景效果。组件支持自定义尺寸、滤镜效果、背景图片等多种配置选项。

## 功能特性

- 支持背景图片设置
- 内置模糊滤镜效果
- 支持自定义 CSS 滤镜
- 可配置组件尺寸和样式
- 支持点击事件
- 灵活的插槽内容布局

## Props 参数

| 参数名 | 类型 | 默认值 | 必填 | 说明 |
|--------|------|--------|------|------|
| `width` | String | `'100%'` | 否 | 组件宽度 |
| `height` | String | - | 是 | 组件高度（必填） |
| `margin` | String | `'24rpx auto'` | 否 | 外边距 |
| `radius` | String | `'24rpx'` | 否 | 圆角半径 |
| `src` | String/Object | - | 否 | 背景图片地址 |
| `bgColor` | String | `'skyblue'` | 否 | 背景颜色（当无背景图片时显示） |
| `blur` | String | `'10px'` | 否 | 模糊程度 |
| `filter` | String | - | 否 | 自定义 CSS 滤镜效果 |
| `slotStyle` | Object | `{}` | 否 | 插槽容器样式 |
| `bgStyle` | Object | `{}` | 否 | 背景容器样式 |
| `customStyle` | Object | `{}` | 否 | 组件自定义样式 |

## 事件

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| `click` | 点击组件时触发 | `event` - 点击事件对象 |

## 使用示例

### 基础用法

```vue
<template>
  <x-filter-bg 
    height="200rpx"
    src="/static/background.jpg">
    <text>这里是内容区域</text>
  </x-filter-bg>
</template>
```

### 自定义滤镜效果

```vue
<template>
  <x-filter-bg 
    height="300rpx"
    src="/static/background.jpg"
    filter="blur(5px) brightness(0.8) contrast(1.2)">
    <view class="content">
      <text>自定义滤镜效果</text>
    </view>
  </x-filter-bg>
</template>
```

### 纯色背景

```vue
<template>
  <x-filter-bg 
    height="150rpx"
    bg-color="#ff6b6b"
    blur="0px">
    <text>纯色背景</text>
  </x-filter-bg>
</template>
```

### 完整配置示例

```vue
<template>
  <x-filter-bg 
    width="90%"
    height="400rpx"
    margin="20rpx auto"
    radius="32rpx"
    src="/static/bg-image.jpg"
    blur="8px"
    :slot-style="{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '40rpx'
    }"
    :custom-style="{ 
      boxShadow: '0 8rpx 32rpx rgba(0,0,0,0.1)' 
    }"
    @click="handleClick">
    
    <view class="card-content">
      <text class="title">标题内容</text>
      <text class="description">这里是描述文字</text>
    </view>
  </x-filter-bg>
</template>

<script>
export default {
  methods: {
    handleClick(event) {
      console.log('组件被点击', event)
    }
  }
}
</script>
```

## CSS 滤镜参考

组件支持所有标准的 CSS `filter` 属性值，常用的滤镜效果包括：

- `blur(5px)` - 模糊效果
- `brightness(0.8)` - 亮度调节
- `contrast(1.2)` - 对比度调节
- `saturate(1.5)` - 饱和度调节
- `grayscale(0.5)` - 灰度效果
- `sepia(0.3)` - 棕褐色效果
- `hue-rotate(90deg)` - 色相旋转

多个滤镜可以组合使用，用空格分隔：
```vue
filter="blur(3px) brightness(0.9) contrast(1.1)"
```

## 注意事项

1. `height` 参数是必填的，请务必设置组件高度
2. 当设置了 `filter` 参数时，`blur` 参数将被忽略
3. 组件使用绝对定位布局，背景层级为 0，内容层级为 1
4. 背景图片默认使用 `cover` 模式填充，居中显示

## 样式层级说明

组件内部采用层级布局：
- `.slot-view`：内容层（z-index: 1）
- `.bg-view`：背景层（z-index: 0）

确保内容始终显示在背景之上，提供良好的视觉效果。


### 插件如果对你有帮助给个好评吧~
