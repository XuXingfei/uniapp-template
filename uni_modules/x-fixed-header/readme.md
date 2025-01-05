# x-fixed-header

## 固定顶部
```bash
将某些内容固定到顶部时, 通常还需要对顶部进行占位处理以免其他元素被固定内容遮住
使用该组件固定内容的同时并处理占位
```

### 示例

```vue
<x-fixed-header padding="24rpx" bg-color="#fff">
    <view class="footer">
        保存
    </view>
</x-fixed-header>
```

### Props

| 属性名			| 说明											| 类型				| 默认值	|
| ------------------| ------------------------						| ----------------	| ------|
| width				| 占位元素宽度（通常无需设置）					| String			| '1px'	|
| height			| 占位元素高度（通常不设置自动获取插槽内容高度）	| [Number, String]	| 9		|
| padding			| 固定元素内边距									| String			|		|
| zIndex			| 固定元素层级									| [Number, String]	| 9		|
| safeArea			| 顶部安全区域适配								| Boolean			| false	|
| bgColor			| 容器背景色										| String			| '#fff'|
| customStyle		| 自定义样式										| Object			|		|

### Emits

| 事件名		| 说明					| 回调入参									|
| --------------| ----------------------| ------------------------------------------|
| height		| 组件高度改变时触发		| 高度										|

### Slots

| 插槽名	| 说明								|
| -------	| ----------------------------------|
| default	| 需要固定到顶部的内容				|


### 插件如果对你有帮助给个好评吧~
