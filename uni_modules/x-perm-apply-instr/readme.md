# x-perm-apply-instr

## 安卓应用申请权限时弹窗告知用户使用目的

### 用法说明, 在main.js引入
```js
 // @func addPermisionInterceptor
 // @param {String} permisionName 要拦截的 uniApi 名称
 // @param {String} content 申请权限说明信息
 // @param {Boolean} once 只询问一次, 用户不同意申请或拒绝权限将无法使用 uniApi, 如果要继续使用 Api 先用 removePermisionInterceptor 函数移除拦截再调用 Api
 
 // @func removePermisionInterceptor
 // @param {String} permisionName 要移除拦截的 uniApi 名称

import { addPermisionInterceptor, removePermisionInterceptor } from '@/uni_modules/x-perm-apply-instr/js_sdk/index.js'
addPermisionInterceptor('chooseImage', '为了xxxxxx, 我们需要申请您设备的相机和存储权限')
addPermisionInterceptor('chooseVideo', '为了xxxxxx, 我们需要申请您设备的相机和存储权限')
addPermisionInterceptor('saveImageToPhotosAlbum', '为了xxxxxx, 我们需要申请您设备的存储权限')
addPermisionInterceptor('getLocation', '为了xxxxxx, 我们需要申请您设备的位置权限')
addPermisionInterceptor('makePhoneCall', '为了xxxxxx, 我们需要申请您设备的拨打电话权限')
addPermisionInterceptor('getRecorderManager', '为了xxxxxx, 我们需要申请您设备的麦克风权限')
addPermisionInterceptor('startLocationUpdate', '为了xxxxxx, 我们需要申请您设备的位置权限')
addPermisionInterceptor('scanCode', '为了xxxxxx, 我们需要申请您设备的相机权限')
```

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

### 交互逻辑说明
1. 在调用需要申请权限的 uni api 时会对该 uni api 进行拦截, 并弹出申请权限说明弹窗 (应用商店的审核要求)
2. 用户如果**不同意**申请权限该 uni api 会进入错误回调, 如果用户**同意**申请权限会显示申请系统权限的弹窗(因为第一步有说明申请权限用途, 已达到应用商店审核要求)
3. 当申请系统权限的弹窗显示时, 用户可以选择同意或拒绝**(此时才是同意或拒绝权限)**, **同意**后将会调用 uni api, **拒绝**会进入 uni api 错误回调

### 插件如果对你有帮助给个好评吧~
