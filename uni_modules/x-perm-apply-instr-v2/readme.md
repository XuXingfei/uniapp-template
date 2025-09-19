### 用法说明（在 main.js 导入函数并调用）
```js
import { createRequestPermissionListener } from '@/uni_modules/x-perm-apply-instr-v2/js_sdk/index.js'
createRequestPermissionListener()
```

**createRequestPermissionListener 创建权限申请监听**

**示例入参 （传入参数配置会覆盖掉默认配置，建议根据自己项目传入配置， 不传也可使用）**

```js

import { createRequestPermissionListener } from '@/uni_modules/x-perm-apply-instr-v2/js_sdk/index.js'
// 入参对象的 key 对应安卓权限，可自行扩展
createRequestPermissionListener({
	'android.permission.CAMERA': {
        title: '相机权限申请说明',
        content: '应用需要访问您的相机，以便拍摄照片或扫描二维码。'
    },
    'android.permission.ACCESS_COARSE_LOCATION': {
        title: '定位权限申请说明',
        content: '应用需要获取您的大致位置信息，以便提供基于位置的服务。'
    }
})
```

**stopRequestPermissionListener 清除权限申请监听（无入参）**

```js
import { stopRequestPermissionListener } from '@/uni_modules/x-perm-apply-instr-v2/js_sdk/index.js'
stopRequestPermissionListener()
```

**requestAndroidPermission 主动申请权限同时弹出申请目的弹窗**

**示例入参**

```js
import { requestAndroidPermission } from '@/uni_modules/x-perm-apply-instr-v2/js_sdk/index.js'
// 入参：申请安卓权限名称和申请权限说明信息，
requestAndroidPermission('android.permission.CAMERA', {
    title: '相机权限申请说明',
    content: '应用需要访问您的相机，以便拍摄照片或扫描二维码。'
}).then(status => {
    // status 权限申请结果 （1:已获得权限, 0:拒绝本次申请, -1:永久拒绝申请）
    console.log('status', status);
})
```



### 补充使用，手动控制权限说明弹窗（自行在需要使用权限的功能处增加显示/关闭逻辑）

```js
import { popup } from '@/uni_modules/x-perm-apply-instr-v2/js_sdk/native_popup.js'
// 显示
popup.show({
    title: '权限申请说明',
    content: '为了xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
})
// 关闭
popup.close()
```


### 插件如果对你有帮助给个好评吧~
