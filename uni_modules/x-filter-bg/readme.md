# x-filter-bg

## 背景虚化，背景过滤，背景模糊（将模糊或颜色偏移等图形效果应用于元素） 

```bash
在某些情况下我们只需要对元素的背景图/背景色进行虚化，过滤，在使用 CSS filter 属性时
会直接作用于整个元素导致达不到预期效果, 使用组件将他们分离开
```

### 示例

```vue
<x-filter-bg bg-color="pink" width="500rpx" height="500rpx">
    <view class="f-r-xy-c" style="width: 100%; height: 100%;">
        <text style="color: #000; font-size: 40rpx;">背景色虚化</text>
    </view>
</x-filter-bg>

<x-filter-bg :src="logo" width="500rpx" height="500rpx">
    <view class="f-r-xy-c" style="width: 100%; height: 100%;">
        <text style="color: #000; font-size: 40rpx;">背景图片虚化</text>
    </view>
</x-filter-bg>
```

### Props

| 属性名			| 说明																							| 类型				| 默认值		|
| ------------------| ------------------------																		| ----------------	| ------	|
| width				| 宽度																							| String			| 100%		|
| height			| 高度（必传）																					| String			|			|
| margin			| 组件外边距																						| String			| 24rpx auto|
| radius			| 圆角																							| String			|	24rpx	|
| src				| 图片资源																						|					|			|
| bgColor			| 虚化背景色																						| String			| skyblue	|
| blur				| 模糊值对应 blur() 函数																			| String			| 10px		|
| filter			| CSS 属性（设置后会覆盖默认 blur） 参考: https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter	| String			|			|
| bgStyle			| 背景元素自定义样式																				| Object			|			|
| slotStyle			| 插槽内容自定义样式																				| Object			|			|
| customStyle		| 组件自定义样式																					| Object			|			|

### Emits

| 事件名		| 说明				| 回调入参		|
| --------------| ------------------| -----------	|
| click			| 点击元素触发		| event			|

### Slots

| 插槽名	| 说明								|
| -------	| ----------------------------------|
| default	| 不用虚化的内容						|


### 插件如果对你有帮助给个好评吧~
