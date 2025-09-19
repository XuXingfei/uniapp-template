# x-network

### 用法说明
#### Http [详见](https://ext.dcloud.net.cn/plugin?name=x-http)
```js
import { http, uploadFile } from '@/uni_modules/x-network/demo/index.js'

http.get('/common/sysTime', { a: 123 }).then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
})

http.post('/common/sysTime', { a: 321 }).then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
})

// 上传单图
uploadFile.uploadImage({}, ({ uploadTask, filePath }) => {
    // uploadTask 用法参考 uni 官方文档 (https://uniapp.dcloud.net.cn/api/request/network-file.html#uploadfile)
    console.log(uploadTask, filePath);    
}).then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
})

// 上传多图
uploadFile.uploadImages({}, uploadTasks => {
    // uploadTask 用法参考 uni 官方文档 (https://uniapp.dcloud.net.cn/api/request/network-file.html#uploadfile)
    console.log(uploadTasks);
}).then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
})

// 上传视频
uploadFile.uploadVideo({}, ({ uploadTask, filePath }) => {
    // uploadTask 用法参考 uni 官方文档 (https://uniapp.dcloud.net.cn/api/request/network-file.html#uploadfile)
    console.log(uploadTask, filePath);
}).then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
})

```

#### WebSocket [详见](https://ext.dcloud.net.cn/plugin?name=x-web-socket)
``` js
// 创建 webSocket 实例, 调用初始化方法连接到服务器 webSocket.init(options)
export const webSocket = new MyWebSocket((message) => {
    console.log('收到消息 ------ ', message);
    uni.$emit(message.event, message.data)
}, false)


// 初始化 （初始化成功才能收发消息）
webSocket.init({
    url: 'ws://localhost:3000/api/socket?token=xxx'
}).then(res => {
    uni.$on('newMessage', data => {
        console.log('收到 newMessage', data);
    })

    // 发送消息
    webSocket.send(new Message('newMessage'))
})

// 关闭连接
webSocket.close()
```

#### /uni_modules/x-network/demo/index.js 文件内容 (该文件只是一个示例用法，实际使用请根据自己项目进行更改)
``` js
import {
    baseUrl,
    uploadUrl,
    socketUrl,
    requestTimeout,
    uploadTimeout
} from '@/uni_modules/x-http/demo/config.js'

import { Request, UploadFile } from '@/uni_modules/x-network/js_sdk/http.js'

import { MyWebSocket } from '@/uni_modules/x-network/js_sdk/webSocket.js'

import { isLoginExpire, fileLimit, logReqErr } from '@/uni_modules/x-http/demo/utils.js'

export { Message } from '@/uni_modules/x-network/js_sdk/webSocket.js'

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

// 创建 webSocket 实例, 调用初始化方法连接到服务器 webSocket.init(socketUrl + token)
export const webSocket = new MyWebSocket((message) => {
    console.log('收到消息 ------ ', message);
    uni.$emit(message.event, message.data)
}, true)
```


### 插件如果对你有帮助给个好评吧~
