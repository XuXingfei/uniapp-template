# 工具库使用说明

工具库，支持微信小程序、支付宝小程序、APP 和 H5 平台。

## 目录结构

```
/uni_modules/x-tools/tools/
├── index.js          # 主入口文件，通用工具函数
├── sugar.js          # 语法糖，简化常用操作
├── router.js         # 路由导航工具
├── h5Utils.js        # H5 平台专用工具
├── appletUtils.js    # 小程序专用工具
├── cacheFile.js      # 文件缓存管理
├── codeUtil.js       # 二维码/条码处理工具
└── com.js            # 组件通用属性和工具
```

## 使用方式

### 导入方式

```javascript
// 按需导入
import { sleep, deepClone, countDown } from '@/uni_modules/x-tools/tools/index.js'
import { toast, copy, saveImage } from '@/uni_modules/x-tools/tools/sugar.js'
import { navTo, navBack } from '@/uni_modules/x-tools/tools/router.js'
```

## 主要功能模块

### 1. 通用工具函数 (index.js)

#### 基础工具

```javascript
// 类型判断
const type = _typeof([1, 2, 3]) // 'array'
const type2 = _typeof('hello')  // 'string'

// Promise 判断
const isPromise = isPromise(fetch('/api'))

// 休眠函数
await sleep(1000) // 延迟 1 秒

// 深拷贝
const newObj = deepClone(originalObj)
```

#### 页面信息获取

```javascript
// 获取当前页面路径
const currentPath = getCurrentPagePath()      // '/pages/index/index'
const fullPath = getCurrentPagePath(true)    // '/pages/index/index?id=123'

// 判断是否为 tabBar 页面
const isTabBar = isTabBarPage()
const isSpecificTabBar = isTabBarPage('/pages/home/home')

// 获取页面运行信息
const pageInfo = getPageInfo()
// 返回: { startPage, isSharePage, pageStackLen }
```

#### 倒计时功能

```javascript
// 基本用法
const timerId = countDown('2024-12-31 23:59:59', (info, isEnd) => {
  console.log(info.str) // "12:30:45"
  if (isEnd) {
    console.log('倒计时结束')
  }
})

// 自定义格式
countDown(endTime, callback, 'dd天hh时mm分ss秒')

// 停止倒计时
clearInterval(timerId)
```

#### 轮询功能

```javascript
// 轮询等待结果
const result = await pollingForResult(
  apiFunction,           // 要轮询的函数
  [param1, param2],     // 参数数组
  (res) => {            // 判断函数
    if (res.status === 'success') return 'success'
    if (res.status === 'failed') return 'fail'
    // 返回其他值继续轮询
  },
  1000,  // 轮询间隔(ms)
  60000  // 超时时间(ms)
)

// 轮询获取数据
const stopPolling = pollingForData(
  apiFunction,
  [params],
  (err, res, count) => {
    if (err) {
      console.log('第', count, '次请求失败:', err)
    } else {
      console.log('第', count, '次请求成功:', res)
    }
  },
  1000  // 轮询间隔
)

// 停止轮询
stopPolling()
```

### 2. 语法糖工具 (sugar.js)

#### 基础操作简化

```javascript
// 日志输出
log('hello world')  // console.log 的简写

// 单位转换
const pxValue = upx2px(750)  // rpx 转 px

// 消息提示
toast('操作成功')
toast('错误信息', { icon: 'error', duration: 3000 })

// 拨打电话
makePhoneCall('13800138000')

// 图片预览
previewImage(['url1', 'url2'], 'url1')

// 复制到剪贴板
copy('要复制的文本')

// 打开地图
openMap(116.404, 39.915, '天安门', '北京市东城区')

// 本地存储
setStorage('key', 'value')
```

#### 数据验证

```javascript
// 判断空值
isEmpty('')        // true
isEmpty([])        // true
isEmpty({})        // true
isEmpty(null)      // true
isEmpty('hello')   // false

// 检查对象是否有空字段
const user = { name: 'Tom', age: '', email: 'tom@example.com' }
const emptyField = hasEmptyField(user)  // 'age'

// 排除某些字段检查
const emptyField2 = hasEmptyField(user, ['age'])  // null
```

#### 数据处理

```javascript
// 数据脱敏
dataMask('13800138000', 3, 4)  // '138****8000'
dataMask('张三丰', 1, 1)        // '张*丰'

// 对象转查询字符串
object2queryStr({ name: 'Tom', age: 18 })  // '?name=Tom&age=18'

// HTML 转纯文本
html2text('<p>Hello <b>World</b></p>')  // 'Hello World'
```

#### 平台特定功能

```javascript
// 保存图片
await saveImage('https://example.com/image.jpg')
await saveImage(localImagePath, false)  // 不显示提示

// 跳转企业微信客服
toCustomerService('corpId', 'https://service-url')

// 查询元素信息 (在组件中使用)
const rect = await queryElementRect.call(this, '.my-element')
```

### 3. 路由导航 (router.js)

#### 基础导航

```javascript
// 保留当前页面，跳转到应用内的某个页面
navTo('/pages/detail/detail?id=123')
navTo('/pages/detail/detail', { fail: console.log }, 1000)  // 延迟 1 秒

// 关闭当前页面，跳转到应用内的某个页面
redTo('/pages/login/login')

// 关闭所有页面，打开到应用内的某个页面
clearTo('/pages/home/home')

// 跳转到 tabBar 页面
tabTo('/pages/home/home')
shTab('/pages/profile/profile')  // tabTo 的别名

// 返回上一页
navBack()
navBack(1000, 2)  // 延迟 1 秒，返回 2 级页面
```

#### 页面间数据传递

```javascript
// 跳转并传递数据
const result = await navToAndEvent(
  '/pages/select/select',
  { list: [1, 2, 3] },        // 传递给目标页面的数据
  (data) => {                 // 接收返回数据的回调
    console.log('返回数据:', data)
  }
)

// 在目标页面接收数据 (Vue2)
onLoad() {
  const eventChannel = this.getOpenerEventChannel()
  eventChannel.on('navData', (data) => {
    console.log('接收到数据:', data)
  })
}

// 在目标页面返回数据
const eventChannel = this.getOpenerEventChannel()
navBackAndEvent(eventChannel, { selected: 'item1' })
```

### 4. H5 工具 (h5Utils.js)

#### 开发调试

```javascript
// 加载在线调试工具
await debug()  // 加载 eruda 调试工具
```

#### URL 处理

```javascript
// 获取查询参数
const params = getQueryParams()  // 当前页面参数
const params2 = getQueryParams('https://example.com?name=Tom&age=18')
// 返回: { name: 'Tom', age: '18' }

// 判断浏览器环境
const browser = judgeBrowser()  // 'wx' | 'ali' | 'unknown'
```

#### 脚本加载

```javascript
// 动态加载 JavaScript
await loadScript('https://cdn.example.com/lib.js')
```

#### 微信公众号开发

```javascript
// 授权获取 code
getWxAuthCode('appId', 'state', 'snsapi_userinfo')

// 配置微信 JS-SDK
wxConfig({
  appId: 'your-app-id',
  timestamp: 1234567890,
  noncestr: 'random-string',
  signature: 'signature'
})

// 微信支付
try {
  const result = await wxPay(paymentParams)
  console.log('支付成功')
} catch (error) {
  console.log('支付失败或取消')
}

// 设置分享信息
wxShare({
  title: '分享标题',
  desc: '分享描述',
  imgUrl: 'https://example.com/share.jpg',
  link: 'https://example.com/page'
})
```

#### 支付宝生活号开发

```javascript
// 授权获取 code
try {
  const result = await getAliAuthCode('appId', 'auth_user')
  console.log('授权成功:', result.authCode)
} catch (error) {
  console.log('授权失败')
}

// 支付宝支付
try {
  const result = await aliPay('tradeNo123456')
  console.log('支付成功')
} catch (error) {
  console.log('支付失败')
}
```

### 5. 小程序工具 (appletUtils.js)

#### 视频号直播

```javascript
// 跳转到视频号直播 (仅微信小程序)
toChannelsLive('finderUserName')
```

#### 分享参数处理

```javascript
// 获取小程序分享参数
const shareParams = getWxShareParams(
  { custom: 'param' },  // 自定义参数
  '分享标题',
  'https://example.com/share.jpg',
  '/pages/share/share'
)
// 返回: { title, path, imageUrl }
```

#### 场景参数获取

```javascript
// 获取小程序场景参数 (扫码进入等)
const sceneParams = getSceneParams()
```

### 6. 文件缓存管理 (cacheFile.js)

```javascript
import { cacheFile } from '@/utils/cacheFile'

// 通过 URL 获取本地文件路径 (自动下载并缓存)
const localPath = await cacheFile.getFilePathByUrl('https://example.com/image.jpg')
```

### 7. 二维码/条码工具 (codeUtil.js)

```javascript
import { CodeUtil } from '@/utils/codeUtil'

// 初始化，定义支持的码类型
const codeUtil = new CodeUtil(['user', 'product', 'coupon'])

// 扫码
const result = await codeUtil.scan()

// 扫码并解析
const codeInfo = await codeUtil.getCodeInfo()
// 返回: { type: 'user', content: { id: 123 } }

// 生成码内容
const codeData = codeUtil.makeCode('user', { id: 123, name: 'Tom' })
```

### 8. 组件工具 (com.js)

```javascript
// 通用组件属性
export const commonProps = {
  bgColor: {
    type: String,
    default: '#fff'
  },
  customStyle: {
    type: Object,
    default: () => ({})
  }
}

// 字符串转像素值
const pxValue = str2px('750rpx')  // 转换为对应的 px 值
const pxValue2 = str2px('100px')  // 100
const pxValue3 = str2px('50')     // 50
```

## Vue2 兼容性

库中包含了 Vue2 的兼容性处理：

```javascript
// 在 main.js 中调用，让 uni API Vue2 支持 Promise
promisify()

// 获取页面通信管道 (Vue2)
const eventChannel = pageEvent.call(this)
```

## 注意事项

1. **平台兼容性**: 某些功能仅在特定平台可用，调用前请检查平台支持
2. **权限申请**: 保存图片、拨打电话等功能需要相应权限
3. **网络请求**: 文件下载、图片保存等功能需要网络权限
4. **错误处理**: 大部分异步操作都包含了错误处理，但建议在业务代码中也加上 try-catch

## 示例项目结构

```javascript
// main.js
import { promisify } from '@/uni_modules/x-tools/tools/index.js'
promisify()  // Vue2 项目中启用

// pages/index.vue
import { toast, copy } from '@/uni_modules/x-tools/tools/sugar.js'
import { navTo } from '@/uni_modules/x-tools/tools/router.js'
import { countDown } from '@/uni_modules/x-tools/tools/index.js'

export default {
  onLoad() {
    // 开始倒计时
    this.timerId = countDown('2024-12-31 23:59:59', (info) => {
      this.countdownText = info.str
    })
  },
  methods: {
    handleCopy() {
      copy('复制内容')
      toast('已复制')
    },
    handleNavigation() {
      navTo('/pages/detail/detail?id=123')
    }
  }
}
```