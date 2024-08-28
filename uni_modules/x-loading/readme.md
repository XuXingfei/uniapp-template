# x-loading

### 本插件是对[epic-spinners](https://epic-spinners.epicmax.co/)库的uni适配, 并增加了loading遮罩
### 用法说明(loading组件的props参考 [epic-spinners](https://epic-spinners.epicmax.co/))
``` vue
<x-loading v-if="loading"></x-loading>
<x-loading v-if="loading">
    <self-building-square-spinner
      :animation-duration="6000"
      :size="40"
      color="#ff1d5e"
    />
</x-loading>
```
### x-loading props
| 属性名			| 类型			| 默认值						| 描述				|
|---				|---			|---						|---				|
| zIndex			| String, Number| 999						| loading元素层级	|
| mask				| Boolean		| true						| 是否显示遮罩		|
| maskBgColor		| String		| rgba(000, 000, 000, 0.3)	| 遮罩背景色			|
| maskCustomStyle	| Object		| {}						| 遮罩自定义样式		|

### 注意, 以下loading效果只支持H5
1. flower-spinner
2. pixel-spinner
3. spring-spinner

### 插件如果对你有帮助给个好评吧~
### 有问题联系QQ: 1824159241