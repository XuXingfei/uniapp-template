# x-nav-bar

## 自定义导航栏

```bash
在使用原生导航栏时有很多不便，例如：导航栏左右两侧的内容自定义程度低，返回按钮在小程序分享页时不能跳转到主页，
需要在导航栏放置搜索框或其他自定义内容，本组件可以便捷的实现这些布局（并且对小程序的右侧胶囊按钮进行了处理）
```

### 示例

```vue
<!-- 基本使用 -->
<x-nav-bar>
    <text>标题</text>
</x-nav-bar>

<!-- 默认插槽填充剩余空间 -->
<x-nav-bar layout="fill">
    <view style="width: 100%;">
       <input style="width: 100%;" placeholder="请输入关键词" />
    </view>
    <template #right>
        <text>搜索</text>
    </template>
</x-nav-bar>
```

### Props

| 属性名			| 说明						| 类型												| 默认值		|
| ------------------| ------------------------	| ----------------									| ------	|
| zIndex			| 容器的层级					| [Number, String]									| 9			|
| height			| 高度						| [String, Number]									| 44		|
| padding			| 组件的内边距				| String											| '0 8px'	|
| backSize			| 返回按钮大小				| String											| 24		|
| backColor			| 返回按钮颜色				| black，white										| black		|
| backHide			| 是否隐藏返回按钮			| Boolean											| false		|
| placeholder		| 是否占位					| Boolean											| true		|
| mpSafeArea		| 小程序右侧安全区域			| Boolean											| true		|
| layout			| 布局方式					| common（常规布局），fill（中间填充整个剩余空间）	| 'common'	|
| bgColor			| 背景色						| String											| '#fff'	|
| customStyle		| 自定义样式					| Object											|			|

### Emits

| 事件名		| 说明					| 回调入参		|
| --------------| ------------------	| -----------	|
| innerStyle	| 内部样式发生改变触发	| 样式对象		|

### Slots

| 插槽名	| 说明																	|
| -------	| ----------------------------------									|
| default	| 导航栏中间区域															|
| left		| 导航栏左侧区域															|
| right		| 导航栏右侧区域	（默认处理了小程序右侧胶囊可以通过 mpSafeArea 属性禁止）	|


### 插件如果对你有帮助给个好评吧~