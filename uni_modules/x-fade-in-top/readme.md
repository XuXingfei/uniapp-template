# x-fade-in-top 组件使用说明

## 组件简介

`x-fade-in-top` 是一个基于滚动位置的顶部渐入组件，通常用于创建页面顶部的导航栏或工具栏，当用户向下滚动时，该组件会从顶部渐入显示。

## 主要特性

- 基于页面滚动位置自动控制透明度
- 支持从顶部滑入的动画效果
- 可自定义背景色、层级、样式等
- 支持安全区域适配
- 提供透明度变化事件回调

## 属性 (Props)

| 属性名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|------|
| `scrollTop` | Number | 是 | - | 当前页面滚动距离，用于计算透明度 |
| `zIndex` | String/Number | 否 | 999 | 组件的层级，控制显示优先级 |
| `bgColor` | String | 否 | 'var(--theme-color)' | 背景颜色，支持CSS颜色值或CSS变量 |
| `safeArea` | Boolean | 否 | false | 是否启用安全区域适配（如刘海屏） |
| `customStyle` | Object | 否 | {} | 自定义样式对象 |

## 事件 (Events)

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `change` | `{ slotHeight, opacity }` | 当透明度发生变化时触发，返回当前透明度值和插槽高度 |

## 使用示例

### 基础用法

```vue
<template>
  <view>
    <!-- 页面内容 -->
    <scroll-view 
      @scroll="handleScroll" 
      scroll-y 
      class="scroll-container"
    >
      <view class="content">
        <!-- 页面主要内容 -->
      </view>
    </scroll-view>
    
    <!-- 顶部渐入组件 -->
    <x-fade-in-top 
      :scroll-top="scrollTop"
      @change="handleFadeChange"
    >
      <view class="header">
        <text>页面标题</text>
      </view>
    </x-fade-in-top>
  </view>
</template>

<script>
export default {
  data() {
    return {
      scrollTop: 0
    }
  },
  methods: {
    handleFadeChange(data) {
      console.log('透明度变化:', data.opacity)
      console.log('插槽高度:', data.slotHeight)
    }
  }
}
</script>
```

### 高级配置

```vue
<template>
  <x-fade-in-top 
    :scroll-top="scrollTop"
    :z-index="1000"
    bg-color="#ffffff"
    :safe-area="true"
    :custom-style="customHeaderStyle"
    @change="handleFadeChange"
  >
    <view class="custom-header">
      <view class="nav-left">
        <button>返回</button>
      </view>
      <view class="nav-center">
        <text>自定义导航栏</text>
      </view>
      <view class="nav-right">
        <button>更多</button>
      </view>
    </view>
  </x-fade-in-top>
</template>

<script>
export default {
  data() {
    return {
      scrollTop: 0,
      customHeaderStyle: {
        padding: '10px 20px',
        borderBottom: '1px solid #e0e0e0'
      }
    }
  }
}
</script>
```

## 工作原理

1. **透明度计算**：组件根据 `scrollTop` 和插槽内容高度计算透明度
   - 当 `scrollTop` 小于插槽高度时：`opacity = scrollTop / slotHeight`
   - 当 `scrollTop` 大于等于插槽高度时：`opacity = 1`

2. **位置控制**：通过动态调整 `top` 样式属性实现滑入效果
   - 透明度大于0时：`top: 0`（显示）
   - 透明度等于0时：`top: -200%`（隐藏）

3. **高度获取**：组件挂载后自动获取插槽内容的实际高度用于计算

## 样式说明

组件使用固定定位 (`position: fixed`)，默认宽度为 `750rpx`（uni-app单位）。可通过 `customStyle` 属性覆盖默认样式。


## 常见应用场景

- 页面顶部导航栏
- 搜索框固定显示
- 操作工具栏
- 页面标题栏
- 返回顶部按钮容器

## 最佳实践

1. 配合页面滚动事件使用，及时更新 `scrollTop` 值
2. 合理设置 `zIndex` 避免层级冲突
3. 使用 CSS 变量定义主题色，便于统一管理
4. 监听 `change` 事件可以实现更复杂的交互逻辑


### 插件如果对你有帮助给个好评吧~
