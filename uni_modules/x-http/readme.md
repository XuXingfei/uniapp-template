# 网络请求和文件上传库使用说明

这是一个基于 uni-app 的网络请求和文件上传工具库，提供了 `Request` 和 `UploadFile` 两个主要类。

## 安装和导入

```javascript
import { Request, UploadFile } from '@/uni_modules/x-http/js_sdk/index.js'
```

## Request 类

### 构造函数

```javascript
const request = new Request(options)
```

#### 参数说明

| 参数 | 类型 | 是否必填 | 默认值 | 说明 |
|------|------|----------|--------|------|
| baseUrl | String | 否 | '' | 请求基础路径 |
| header | Object | 否 | `{"content-type": "application/json; charset=utf-8"}` | 请求头 |
| timeout | Number | 否 | 5000 | 请求超时时间(毫秒) |
| sslVerify | Boolean | 否 | false | 是否验证 SSL 证书 |
| requestInterceptor | Function | 否 | 空函数 | 请求拦截器(支持 Promise) |
| responseInterceptor | Function | 否 | 直接返回响应 | 响应拦截器(支持 Promise) |

### 使用示例

#### 基本使用

```javascript
// 创建请求实例
const api = new Request({
    baseUrl: 'https://api.example.com',
    timeout: 10000
})

// GET 请求
const userData = await api.get('/user/profile', { id: 123 })

// POST 请求
const result = await api.post('/user/update', {
    name: '张三',
    email: 'zhang@example.com'
})
```

#### 使用拦截器

```javascript
const api = new Request({
    baseUrl: 'https://api.example.com',
    requestInterceptor: async (config) => {
        // 在请求发送前添加 token
        config.header.Authorization = `Bearer ${getToken()}`
        console.log('发送请求:', config)
    },
    responseInterceptor: (res) => {
        // 统一处理响应数据
        if (res.statusCode === 200) {
            return res.data
        } else {
            throw new Error(`请求失败: ${res.statusCode}`)
        }
    }
})
```

### 方法说明

#### request(url, data, method, header)

通用请求方法

- `url`: 请求地址（相对路径或绝对路径）
- `data`: 请求数据
- `method`: 请求方法（默认 'post'）
- `header`: 额外的请求头

#### get(url, data, header)

GET 请求的便捷方法

#### post(url, data, header)

POST 请求的便捷方法

## UploadFile 类

### 构造函数

```javascript
const uploader = new UploadFile(options)
```

#### 参数说明

| 参数 | 类型 | 是否必填 | 默认值 | 说明 |
|------|------|----------|--------|------|
| uploadUrl | String | 是 | - | 上传路径 |
| name | String | 否 | 'file' | 文件对应的 key |
| header | Object | 否 | {} | 请求头 |
| timeout | Number | 否 | 60000 | 上传超时时间(毫秒) |
| requestInterceptor | Function | 否 | 空函数 | 请求拦截器(支持 Promise) |
| responseInterceptor | Function | 否 | 直接返回响应 | 响应拦截器(支持 Promise) |

### 使用示例

#### 基本文件上传

```javascript
// 创建上传实例
const uploader = new UploadFile({
    uploadUrl: 'https://api.example.com/upload',
    name: 'avatar',
    header: {
        'Authorization': 'Bearer your-token'
    }
})

// 上传文件
const result = await uploader.uploadFile(
    '/path/to/file.jpg',
    ({ uploadTask, filePath }) => {
        // 上传进度回调
        uploadTask.onProgressUpdate((res) => {
            console.log('上传进度:', res.progress + '%')
        })
    },
    { userId: 123 }, // 额外的表单数据
    { type: 'image', size: 1024000 } // 文件信息
)
```

#### 上传单张图片

```javascript
const imageResult = await uploader.uploadImage(
    {
        sourceType: ['camera', 'album'],
        sizeType: ['compressed']
    },
    ({ uploadTask, filePath }) => {
        console.log('正在上传图片:', filePath)
    },
    { category: 'avatar' }
)
```

#### 上传多张图片

```javascript
const imagesResult = await uploader.uploadImages(
    {
        count: 5,
        sourceType: ['album']
    },
    (uploads) => {
        console.log('所有图片上传任务:', uploads)
    },
    { album: 'photos' }
)
```

#### 上传视频

```javascript
const videoResult = await uploader.uploadVideo(
    {
        maxDuration: 60,
        camera: 'back'
    },
    ({ uploadTask, filePath }) => {
        uploadTask.onProgressUpdate((res) => {
            console.log('视频上传进度:', res.progress + '%')
        })
    },
    { category: 'video' }
)
```

#### 完整示例 (示例文件 /uni_modules/x-http/demo/index.js，实际使用请根据自己项目进行更改)
```js
import {
    baseUrl,
    uploadUrl,
    socketUrl,
    requestTimeout,
    uploadTimeout
} from '@/uni_modules/x-http/demo/config.js'

import { Request, UploadFile } from '@/uni_modules/x-http/js_sdk/index.js'

import { isLoginExpire, fileLimit, logReqErr } from './utils.js'

// 统一 loading 处理
const excludeLoadingUrl = ['/api/xxx'] // 不显示 loading 的 url
let requestLoadingCount = 0

// 请求拦截器支持异步 (如果返回失败的 Promise 或抛出错误将终止本次请求, 错误信息在响应拦截器处理)
const requestInterceptor = async function(options) {
    // console.log(options);

    // 统一 loading 处理
    if (!excludeLoadingUrl.includes(options.url.replace(baseUrl, ''))) {
        uni.showLoading({
            mask: true
        })
        requestLoadingCount++
    }

    options.header.token = uni.getStorageSync('token')

    if (options.filePath) fileLimit(options)
}

// 响应拦截器支持异步, 响应拦截器的返回值即请求的返回值 (处理请求响应结果或请求调用过程中出现的错误)
// 响应拦截器不是异步的话抛出错误即请求失败
const responseInterceptor = async function(res) {
    // reqConf: 请求的配置, err: 请求调用过程中出现的错误
    const {
        reqConf,
        err
    } = res
    // 输出请求信息, 方便 app 调试
    // #ifndef APP
    console.groupCollapsed(reqConf.url.replace(baseUrl, ''))
    // #endif
    // #ifdef APP
    console.log('------------------------------------------------------------------------------')
    // #endif
    console.log('REQ URL', reqConf.url);
    console.log('REQ HEADER', reqConf.header);
    console.log('REQ DATA', reqConf.data);
    console.log('RES DATA', res.data);
    // #ifdef APP
    console.log('------------------------------------------------------------------------------')
    // #endif
    // #ifndef APP
    console.groupEnd(reqConf.url.replace(baseUrl, ''))
    // #endif

    // 统一 loading 处理
    if (!excludeLoadingUrl.includes(reqConf.url.replace(baseUrl, ''))) {
        requestLoadingCount--
        if (!requestLoadingCount) {
            uni.hideLoading()
        }
    }
    if (res.statusCode == 200) {
        // 请求成功
        try {
            if (typeof res.data == 'string') res.data = JSON.parse(res.data)
        } catch (e) {}
        if (res.data.code == 200) {
            return res.data.data
        } else {
            logReqErr(res)
            // 不是登录过期提示后端的错误信息
            if (!isLoginExpire(res.data.code)) {
                uni.showToast({
                    icon: "none",
                    title: res.data.msg || res.data.message || `Error code ${res.data.code}`,
                    duration: 2000,
                });
            }
            return Promise.reject(res)
        }
    } else {
        logReqErr(res)
        // 请求失败
        // 不是登录过期和前端代码报错
        if (!isLoginExpire(res.statusCode) && !err) {
            uni.showToast({
                icon: "none",
                title: "网络错误, 请稍后重试~",
                duration: 2000,
            });
        }
        // 前端代码报错, 提示错误信息(可能是自己抛出的错误, 或 uniApi 的失败回调错误)
        if (err) {
            uni.showToast({
                icon: "none",
                title: err.message || err.errMsg,
                duration: 2000,
            });
        }
        return Promise.reject(res)
    }
}

// 创建网络请求实例
export const http = new Request({
    baseUrl,
    timeout: requestTimeout,
    requestInterceptor,
    responseInterceptor
})

// 创建上传文件实例
export const uploadFile = new UploadFile({
    uploadUrl,
    timeout: uploadTimeout,
    requestInterceptor,
    responseInterceptor
})
```

### 方法说明

#### uploadFile(filePath, callBack, formData, fileInfo)

通用文件上传方法

- `filePath`: 文件路径
- `callBack`: 回调函数，返回 uploadTask 对象和文件路径
- `formData`: HTTP 请求中的额外表单数据
- `fileInfo`: 文件信息对象

#### uploadImage(options, callBack, formData)

上传单张图片

- `options`: uni.chooseImage 的参数
- `callBack`: 回调函数
- `formData`: 额外的表单数据

#### uploadImages(options, callBack, formData)

上传多张图片

- `options`: uni.chooseImage 的参数
- `callBack`: 回调函数
- `formData`: 额外的表单数据

#### uploadVideo(options, callBack, formData)

上传视频

- `options`: uni.chooseVideo 的参数
- `callBack`: 回调函数
- `formData`: 额外的表单数据

## 高级用法

### 错误处理

```javascript
try {
    const result = await api.post('/api/data', { key: 'value' })
    console.log('请求成功:', result)
} catch (error) {
    console.error('请求失败:', error)
    // 处理错误
}
```

### 上传进度监听

```javascript
await uploader.uploadFile(
    filePath,
    ({ uploadTask }) => {
        uploadTask.onProgressUpdate((res) => {
            console.log(`上传进度: ${res.progress}%`)
            console.log(`已上传: ${res.totalBytesSent}`)
            console.log(`总大小: ${res.totalBytesExpectedToSend}`)
        })
    }
)
```

### 取消上传

```javascript
let currentUploadTask = null

await uploader.uploadFile(
    filePath,
    ({ uploadTask }) => {
        currentUploadTask = uploadTask
    }
)

// 需要时取消上传
if (currentUploadTask) {
    currentUploadTask.abort()
}
```

## 注意事项

1. 所有异步操作都返回 Promise，建议使用 async/await 语法
2. 拦截器支持异步操作，可以返回 Promise
3. 上传方法中的 callBack 是可选的，主要用于获取 uploadTask 对象进行进度监听
4. 文件上传时会自动处理错误，失败的上传会被过滤掉





### 插件如果对你有帮助给个好评吧~
