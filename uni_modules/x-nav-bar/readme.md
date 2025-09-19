# x-nav-bar 导航栏组件使用说明

## 组件概述

`x-nav-bar` 顶部导航栏组件，支持自适应状态栏高度、返回按钮、插槽自定义和小程序兼容等功能。

## 功能特性

- 🔧 自适应状态栏高度
- 🔙 智能返回按钮（支持返回和回到首页）
- 🎨 支持深色/浅色返回按钮主题
- 📱 小程序安全区域适配
- 🔌 灵活的插槽系统
- 📐 多种布局方式
- 🎯 可自定义样式


## 基础用法

### 简单标题栏
```vue
<template>
  <x-nav-bar>
    <text>页面标题</text>
  </x-nav-bar>
</template>
```

### 自定义左侧按钮
```vue
<template>
  <x-nav-bar>
    <template #left>
      <button @click="customBack">自定义返回</button>
    </template>
    <text>页面标题</text>
  </x-nav-bar>
</template>
```

### 自定义右侧内容
```vue
<template>
  <x-nav-bar>
    <text>页面标题</text>
    <template #right>
      <button>更多</button>
    </template>
  </x-nav-bar>
</template>
```

## 属性配置

| 属性名				| 类型						| 默认值		| 说明																		|
|--------				|------					|--------	|------																	|
| `zIndex`			| String/Number	| 99			| 导航栏层级															|
| `height`			| String/Number	| 44			| 导航栏高度（不包括状态栏）							|
| `padding`			| String				| '0 8px'	| 内边距																	|
| `backSize`		| String/Number	| 24			| 返回按钮大小														|
| `backColor`		| String				| 'black'	| 返回按钮颜色主题（'black' 或 'white'）	|
| `backHide`		| Boolean				| false		| 是否隐藏返回按钮												|
| `placeholder`	| Boolean				| true		| 是否占位（防止内容被导航栏遮挡）				|
| `mpSafeArea`	| Boolean				| true		| 小程序右侧安全区域适配									|
| `layout`			| String				| 'common'| 布局方式（'common' 或 'fill'）					|
| `bgColor`			| String				| '#fff'	| 背景色																	|
| `customStyle`	| Object				|	  {}		|	自定义样式															|

### 布局方式说明

- **common**: 左右靠两侧，中间居中对齐
- **fill**: 左右靠两侧，中间填充剩余空间

## 插槽

| 插槽名 | 说明 |
|--------|------|
| 默认插槽 | 导航栏中间内容区域 |
| `left` | 左侧自定义内容，会覆盖默认返回按钮 |
| `right` | 右侧自定义内容 |

## 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `innerStyle` | style 对象 | 当内部样式计算完成时触发 |

## 高级用法示例

### 渐变背景导航栏
```vue
<template>
  <x-nav-bar 
    :bg-color="'linear-gradient(45deg, #ff6b6b, #4ecdc4)'"
    back-color="white"
  >
    <text style="color: white; font-weight: bold;">渐变标题栏</text>
  </x-nav-bar>
</template>
```

### 自定义高度和样式
```vue
<template>
  <x-nav-bar 
    :height="60"
    padding="0 20px"
    :bg-color="'#f8f9fa'"
  >
    <view style="display: flex; align-items: center;">
      <image src="/static/logo.png" style="width: 24px; height: 24px; margin-right: 8px;"></image>
      <text style="font-size: 18px; font-weight: bold;">应用名称</text>
    </view>
    <template #right>
      <view style="display: flex; gap: 10px;">
        <button size="mini">搜索</button>
        <button size="mini">菜单</button>
      </view>
    </template>
  </x-nav-bar>
</template>
```

### 填充式布局
```vue
<template>
  <x-nav-bar layout="fill">
    <view style="display: flex; justify-content: space-between; width: 100%;">
      <text>左侧内容</text>
      <text>右侧内容</text>
    </view>
  </x-nav-bar>
</template>
```

### 监听内部样式
```vue
<template>
  <x-nav-bar @innerStyle="onInnerStyle">
    <text>监听样式</text>
  </x-nav-bar>
</template>

<script>
export default {
  methods: {
    onInnerStyle(style) {
      console.log('导航栏样式:', style)
      // 可以根据样式信息调整页面其他元素
    }
  }
}
</script>
```

## 注意事项

1. **状态栏适配**: 组件会自动获取设备状态栏高度并适配
2. **返回逻辑**: 
   - 页面栈 > 1 时显示返回按钮，点击执行 `uni.navigateBack()`
   - 分享页面显示首页按钮，点击执行 `uni.reLaunch()` 到起始页
3. **小程序兼容**: 在小程序中会自动适配右侧安全区域
4. **层级管理**: 默认 z-index 为 99，可根据需要调整
5. **占位模式**: 开启 `placeholder` 可防止页面内容被固定导航栏遮挡


## 样式定制

组件使用 SCSS 编写样式，支持通过 CSS 自定义属性进行部分样式定制：

```css
/* 自定义状态栏高度变量 */
--x-status-bar-height: 状态栏高度;

/* 小程序安全区域变量 */
--x-safe-right: 右侧安全区域宽度;
```



### 插件如果对你有帮助给个好评吧~