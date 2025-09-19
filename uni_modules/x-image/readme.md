# x-image 组件使用说明

## 概述

`x-image` 是一个功能强大的图片组件，支持图片懒加载、缓存、多种显示模式等特性。

## 主要特性

- 🖼️ **图片懒加载**：支持占位图和滚动触发加载
- 💾 **图片缓存**：自动缓存图片，提升加载性能
- 🔄 **滚动监听**：支持垂直、水平、双向滚动监听

## 基础用法

### 简单使用

```vue
<template>
  <x-image src="https://example.com/image.jpg" />
</template>
```

### 设置尺寸

```vue
<template>
  <!-- 方式1：使用 size 属性 -->
  <x-image 
    src="https://example.com/image.jpg" 
    size="200rpx" 
  />
  
  <!-- 方式2：分别设置宽高 -->
  <x-image 
    src="https://example.com/image.jpg" 
    width="200rpx" 
    height="200rpx" 
  />
</template>
```

### 图片懒加载

```vue
<template>
  <x-image 
    src="https://example.com/image.jpg"
    placeholder-src="https://example.com/placeholder.jpg"
    :scroll-top="scrollTop"
    :scroll-area-height="scrollAreaHeight"
  />
</template>

<script>
export default {
  data() {
    return {
      scrollTop: 0,
      scrollAreaHeight: 0
    }
  },
  mounted() {
    // 注意：不同平台滚动区域高度有差异
    this.scrollAreaHeight = uni.getSystemInfoSync().windowHeight
  },
  onPageScroll(e){
    this.scrollTop = e.scrollTop
  }
}
</script>

```

## 属性说明

### 基础属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `src` | String | - | 图片资源地址 |
| `placeholder-src` | String | '' | 占位图片资源地址（传入开启图片懒加载） |
| `mode` | String | 'aspectFill' | 图片裁剪、缩放的模式 |
| `show-menu-by-longpress` | Boolean | false | 开启长按图片显示识别小程序码菜单 |
| `cache-image` | Boolean | true | 是否缓存图片 |

### 尺寸属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `size` | String | '' | 图片大小（优先级低于width/height） |
| `width` | String | '' | 图片宽度（优先级高于size） |
| `height` | String | '' | 图片高度（优先级高于size） |

### 滚动相关属性

| 属性名							| 类型		| 默认值				| 说明																									|
|--------							|------	|--------			|------																								|
| `scroll-top`				| Number| 0						| 页面在垂直方向已滚动的距离（单位px）									|
| `scroll-left`				| Number| 0						| 页面在水平方向已滚动的距离（单位px）									|
| `scroll-area-height`| Number| windowHeight| 滚动区域高度（单位px）注意：不同平台滚动区域高度有差异	|
| `scroll-area-width`	| Number| windowWidth	| 滚动区域宽度（单位px）																|
| `offset-top`				| Number| 0						| 滚动区域距离顶部偏移量（单位px）											|
| `offset-left`				| Number| 0						| 滚动区域距离左侧偏移量（单位px）											|
| `direction`					| String| 'vertical'	| 滚动方向：'vertical'、'horizontal'、'both'						|

### 样式属性

| 属性名				| 类型		| 默认值		| 说明					|
|--------				|------	|--------	|------				|
| `custom-class`| String| ''			| 自定义 class	|
| `custom-style`| Object| ''			| 自定义 style	|

## 图片模式说明

| 模式值 | 说明 |
|--------|------|
| `scaleToFill` | 不保持纵横比缩放图片，使图片完全填满元素 |
| `widthFix` | 宽度不变，高度自动变化，保持原图宽高比 |
| `heightFix` | 高度不变，宽度自动变化，保持原图宽高比 |
| `aspectFit` | 保持纵横比缩放，完整显示图片 |
| `aspectFill` | 保持纵横比缩放，填满元素（可能裁剪） |

## 事件说明

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| `@error` | 图片加载失败时触发 | event |
| `@load` | 图片加载成功时触发 | event |
| `@click` | 点击图片时触发 | event |

## 使用示例

### 在 scroll-view 中使用懒加载

```vue
<template>
  <scroll-view 
    scroll-y 
    @scroll="onScroll"
    style="height: 400px;"
  >
    <x-image 
      v-for="(item, index) in imageList" 
      :key="index"
      :src="item.url"
      :placeholder-src="item.placeholder"
      :scroll-top="scrollTop"
      :scroll-area-height="400"
      :offset-top="0"
      size="200rpx"
      @load="onImageLoad"
      @error="onImageError"
    />
  </scroll-view>
</template>

<script>
export default {
  data() {
    return {
      scrollTop: 0,
      imageList: [
        {
          url: 'https://example.com/image1.jpg',
          placeholder: 'https://example.com/placeholder1.jpg'
        },
        {
          url: 'https://example.com/image2.jpg',
          placeholder: 'https://example.com/placeholder2.jpg'
        }
      ]
    }
  },
  methods: {
    onScroll(e) {
      this.scrollTop = e.detail.scrollTop
    },
    onImageLoad(e) {
      console.log('图片加载成功', e)
    },
    onImageError(e) {
      console.log('图片加载失败', e)
    }
  }
}
</script>
```

### 自定义样式

```vue
<template>
  <x-image 
    src="https://example.com/image.jpg"
    custom-class="my-image"
    size="200rpx"
  />
</template>

<style>
.my-image {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
```

### 禁用图片缓存

```vue
<template>
  <x-image 
    src="https://example.com/image.jpg"
    :cache-image="false"
    size="200rpx"
  />
</template>
```

## 注意事项

1. **懒加载使用**：需要传入 `placeholder-src` 才会启用懒加载功能
2. **滚动监听**：在 scroll-view 中使用时，需要正确设置 `offset-top` 和 `offset-left`
3. **图片缓存**：默认开启图片缓存，如不需要可设置 `cache-image` 为 `false`
4. **尺寸优先级**：`width`/`height` 优先级高于 `size` 属性
5. **平台差异**：不同平台的滚动区域高度可能有差异，建议根据实际情况调整