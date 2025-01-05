# x-perm-apply-instr

### 安卓应用申请权限时弹窗告知用户使用目的

## 用法说明, 在main.js引入
```js
import { addPermisionInterceptor, removePermisionInterceptor } from '@/uni_modules/x-perm-apply-instr/js_sdk/index.js'
addPermisionInterceptor('chooseImage', '为了修改个人头像和发布信息图片视频等, 我们需要申请您设备的相机和存储权限')
addPermisionInterceptor('chooseVideo', '为了发布信息图片视频等, 我们需要申请您设备的相机和存储权限')
addPermisionInterceptor('saveImageToPhotosAlbum', '为了保存推广海报到手机相册, 我们需要申请您设备的存储权限')
addPermisionInterceptor('getLocation', '为了根据您的位置展示信息, 我们需要申请您设备的位置权限')
addPermisionInterceptor('makePhoneCall', '为了联系客服/用户/咨询等, 我们需要申请您设备的拨打电话权限')
addPermisionInterceptor('getRecorderManager', '为了使用语言消息功能等, 我们需要申请您设备的麦克风权限')
addPermisionInterceptor('startLocationUpdate', '为了根据您的位置展示信息, 我们需要申请您设备的位置权限')
addPermisionInterceptor('scanCode', '为了识别二维码信息, 我们需要申请您设备的相机权限')
```

**addPermisionInterceptor 添加 uniApi 调用拦截**

| 位置	| 类型			| 描述																															| 可选值																												|
| ----	| -------------	| ------------------------------------------------------------																	 | ------------------------------------------------------------																	 |
| 0		| String		| 要拦截的 uniApi 名称																											| scanCode、chooseImage、chooseVideo、saveImageToPhotosAlbum、saveVideoToPhotosAlbum、getLocation、startLocationUpdate、makePhoneCall、getRecorderManager、startBluetoothDevicesDiscovery	|
| 1		| String		| 申请权限说明信息																												| 自定义文本																							|
| 2		| Boolean		| 只询问一次, 用户不同意申请或拒绝权限将无法使用 uniApi, 如果要继续使用 Api 先用 removePermisionInterceptor 函数移除拦截再调用 Api	| true, false	|

**removePermisionInterceptor 移除 uniApi 调用拦截**

| 位置 | 类型        | 描述                     | 可选值                |
| ---- | ------------- | ------------------------ | ------------------------ |
| 0    | String | 要移除拦截的 uniApi 名称 | 同上 |

### 注意, 如果需要拦截 getRecorderManager , 在使用时不要直接在 script 下初始化, 会导致拦截失败, 请在 onLoad 或 onReady 中调用

``` vue
<script>
	// 错误写法
	const recorderManager = uni.getRecorderManager();
	// 正确写法
	let recorderManager = null
    export default {
		onLoad() {
			recorderManager = uni.getRecorderManager();
		}
    }
</script>
```

## 手动控制权限说明弹窗（自行控制显示、关闭逻辑）
```js
import { popup } from '@/uni_modules/x-perm-apply-instr/js_sdk/native_popup.js'
// 显示
popup.show({
    title: '权限申请说明',
    content: '为了xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
})
// 关闭
popup.close()
```

### 插件如果对你有帮助给个好评吧~
