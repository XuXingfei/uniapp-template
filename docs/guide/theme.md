# 主题与样式使用指南

本项目基于 CSS 变量实现了一套灵活的主题系统，支持动态切换主题色。

## 主题配置

主题配置在 `common/themeStyle.js` 中定义：

```javascript
// common/themeStyle.js
// 默认主题
const light = {
  '--theme-color': '#87ceeb',
  '--theme-bg': '#87ceeb'
}

// 牛油果绿主题
const avocadoGreen = {
  '--theme-color': '#568203',
  '--theme-bg': '#568203'
}

// 淡牛油果绿主题
const lightAvocadoGreen = {
  '--theme-color': '#A5D152',
  '--theme-bg': '#A5D152'
}

// 牛油果黄主题
const avocadoYellow = {
  '--theme-color': '#B2C248',
  '--theme-bg': '#B2C248'
}

// 牛油果灰主题
const avocadoGray = {
  '--theme-color': '#8A8776',
  '--theme-bg': '#8A8776'
}

// 主题样式集合
export const themeStyle = {
  light,
  avocadoGreen,
  lightAvocadoGreen,
  avocadoYellow,
  avocadoGray
}
```

## 主题切换

### 基本用法

```javascript
import { useGlobalStore } from '@/stores/global.js'
import { setThemeIcon } from '@/common/utils/index.js';

// 切换主题
const switchTheme = (themeName) => {
  const globalStore = useGlobalStore()

  // 应用主题到全局样式
  globalStore.setTheme(theme)

  // 更新 TabBar 图标（如果在 TabBar 页面）
  setThemeIcon(themeName)
}
```

### 在组件中使用主题色

```vue
<template>
  <view class="container">
    <button class="theme-button" @click="switchToGreen">切换为绿色主题</button>
    <button class="theme-button" @click="switchToYellow">切换为黄色主题</button>
  </view>
</template>

<script>
import { useGlobalStore } from '@/stores/global.js'

export default {
  methods: {
    switchToGreen() {
      this.switchTheme('avocadoGreen')
    },
    switchToYellow() {
      this.switchTheme('avocadoYellow')
    },
    switchTheme(themeName) {
      const globalStore = useGlobalStore()
      globalStore.setTheme(theme)
    }
  }
}
</script>

<style scoped>
.container {
  padding: 20rpx;
}

.theme-button {
  background-color: var(--theme-color); /* 使用主题色 */
  color: white;
  border: none;
  padding: 20rpx 40rpx;
  margin: 10rpx;
  border-radius: 10rpx;
}
</style>
```

## 全局主题应用

### 在 App.vue 中应用主题

```vue
<!-- App.vue -->
<script>
import { useGlobalStore } from '@/stores/global.js'

export default {
  onLaunch() {
    // 应用默认主题
    const globalStore = useGlobalStore()
    globalStore.setTheme(theme)
  }
}
</script>

<style>
/* 全局样式中使用主题变量 */
page {
  background-color: var(--theme-bg);
}
</style>
```

### 动态更新 TabBar 图标

```javascript
// common/utils/index.js
import { themeStyle } from '@/common/themeStyle.js'
import { isTabBarPage } from '@/uni_modules/x-tools/tools/index.js'

let setThemeIconTimer = null
export const setThemeIcon = function(theme, ms = 0) {
  setThemeIconTimer && clearTimeout(setThemeIconTimer)

  setThemeIconTimer = setTimeout(() => {
    if (!isTabBarPage()) return

    uni.setTabBarStyle({
      selectedColor: themeStyle[theme]['--theme-color'],
    });

    // 设置每个 TabBar 的主题图标
    ['home', 'me'].forEach((i, index) => {
      uni.setTabBarItem({
        index,
        selectedIconPath: `/static/tabIcon/${i}_${theme}.png`
      })
    })

    setThemeIconTimer = null
  }, ms)
}
```

## 自定义主题

### 添加新主题

在 `common/themeStyle.js` 中添加新的主题配置：

```javascript
// 添加紫色主题
const purple = {
  '--theme-color': '#8A2BE2',
  '--theme-bg': '#8A2BE2',
  '--theme-text': '#FFFFFF'
}

// 更新主题样式集合
export const themeStyle = {
  light,
  avocadoGreen,
  lightAvocadoGreen,
  avocadoYellow,
  avocadoGray,
  purple // 添加新主题
}
```

### 使用自定义主题变量

在样式中使用自定义的主题变量：

```scss
/* 在样式中使用自定义主题变量 */
.custom-component {
  background-color: var(--theme-bg);
  color: var(--theme-text);
  border-color: var(--theme-color);
}
```

## 主题与组件库

### uv-ui 主题适配

uv-ui 组件库支持主题定制，可以通过 CSS 变量进行适配：

```scss
/* 在 App.vue 或全局样式中 */
:root {
  --uv-primary: var(--theme-color); /* 使用主题色作为主色调 */
  --uv-success: #568203;
}
```

## 最佳实践

1. **主题一致性**：在整个应用中统一使用主题变量，保持视觉一致性
2. **性能优化**：避免频繁切换主题，合理使用防抖机制
3. **用户体验**：提供主题切换的用户界面，让用户可以根据喜好选择
4. **兼容性**：确保在不同平台下主题切换功能正常工作
5. **可维护性**：集中管理主题配置，便于后续扩展和维护

通过合理使用主题系统，可以让应用具备更好的视觉效果和用户体验。
