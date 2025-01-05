# x-container

## 页面根容器组件

```bash
项目所有页面使用该组件作为根元素，方便做到一些全局能力，全局loading，全局弹窗，CSS变量，使用CSS变量实现主题切换
```

### 示例

#### my-container组件（需自行实现）
```vue
<template>
    <x-container :theme-style="themeStyle[theme]">
        <slot></slot>
    </x-container>
</template>

<script>
    export default {
        name: "my-container",
        data() {
            return {
                // 主题可以放到全局状态管理
                theme: 'dark',
                themeStyle: {
                    dark: {
                        '--color': '#000'
                    },
                    light: {
                        '--color': 'skyblue'
                    }
                }
            };
        }
    }
</script>
```

#### 页面使用
```vue
<template>
    <my-container>
        <text></text>
    </my-container>
</template>

<style>
    text {
        color: var(--color);
    }
</style>
```

### Slots

| 插槽名	| 说明								|
| -------	| ----------------------------------|
| default	| 页面内容							|

### Props

| 属性名			| 说明						| 类型				| 默认值	|
| ------------------| ------------------------	| ----------------	| ------|
| themeStyle		| 主题CSS变量样式			| Object			|		|
| customStyle		| 其他CSS变量样式			| Object			|		|

### Emits

| 事件名			| 说明				| 回调入参		|
| --------------	| ------------------| -----------	|
| container-style	| 容器样式改变时触发	| 容器当前样式	|


### [实践模版项目](https://ext.dcloud.net.cn/plugin?id=19533)
