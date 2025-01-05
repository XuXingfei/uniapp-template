# x-fade-in-top

## 顶部淡入效果


### 示例

```vue
<x-nav-bar>
    <text>标题</text>
</x-nav-bar>
<x-fade-in-top :scroll-top="scrollTop">
    <x-nav-bar bg-color="skyblue">
        <text>标题</text>
    </x-nav-bar>
</x-fade-in-top>
```

### Props

| 属性名			| 说明						| 类型				| 默认值	|
| ------------------| ------------------------	| ----------------	| ------|
| scrollTop			| 页面滚动位置（必传）		| Boolean			| false	|
| zIndex			| 容器的层级					| [Number, String]	| 9		|
| safeArea			| 顶部安全区域适配			| Boolean			| false	|
| bgColor			| 容器背景色					| String			| '#fff'|
| customStyle		| 自定义样式					| Object			|		|

### Emits

| 事件名		| 说明					| 回调入参									|
| --------------| ----------------------| ------------------------------------------|
| change		| 组件显示状态改变触发	|{opacity: '透明度', slotHeight: '容器高度'}	|

### Slots

| 插槽名	| 说明								|
| -------	| ----------------------------------|
| default	| 需要淡入显示的内容					|


### 插件如果对你有帮助给个好评吧~
