import { baseUrl, uploadUrl, socketUrl } from '@/uni_modules/x-network/js_sdk/config.js'
import { Request, UploadFile } from '@/uni_modules/x-network/js_sdk/http.js'
import { MyWebSocket, Message } from '@/uni_modules/x-network/js_sdk/webSocket.js'

// 登录过期判断
const isLoginExpire = code => {
    if (code == 401 || code == 402 || code == 403) {
        uni.removeStorageSync('token')
        uni.reLaunch({
            url: '/pages/login'
        })
        uni.showToast({
            icon: "none",
            title: "请登录",
            duration: 2000,
        });
        return true
    }
}

// 上传文件限制
const fileLimit = ({ filePath, fileInfo }) => {
    // console.log('fileLimit', filePath, fileInfo);
    const imgSize = 1024 * 1024 * 5
    const videoSize = 1024 * 1024 * 100
    const fileSizeLimit = {
        image: imgSize,
        jpg: imgSize,
        jpeg: imgSize,
        png: imgSize,
        gif: imgSize,
        video: videoSize,
        mp4: videoSize,
    }
    const fileTypes = Object.keys(fileSizeLimit)

    const pathSplit = filePath.split('.')
    let type = pathSplit[pathSplit.length - 1]
    // #ifdef H5
    type = fileInfo.type || fileInfo?.tempFile?.type
    // #endif

    const size = fileInfo.size

    const reg = new RegExp(fileTypes.join('|'))
    if (!reg.test(type) || !type) {
        const tips = `不支持类型“${type}”`
        uni.showToast({
            title: tips,
            icon: 'none'
        })
        throw Error(tips)
    }

    fileTypes.forEach(i => {
        if (new RegExp(i).test(type) && fileSizeLimit[i] < size) {
            const tips = `${type}类型文件限制“${(fileSizeLimit[i] / 1024 / 1024).toFixed(2)}MB”`
            uni.showToast({
                title: tips,
                icon: 'none'
            })
            throw Error(tips)
        }
    })
}

// 统一 loading 处理
const excludeLoadingUrl = ['/api/xxx']
const requestLoadingQueue = []

// 请求拦截器
const requestInterceptor = async function(options) {
    console.log(options);
    if (options.filePath) fileLimit(options)
    options.header.token = uni.getStorageSync('token')

    // 统一 loading 处理
    if (!excludeLoadingUrl.includes(options.url.replace(baseUrl, ''))) {
        uni.showLoading({
            mask: true
        })
        requestLoadingQueue.push(options.url)
    }
}

// 响应拦截器
const responseInterceptor = async function(res) {
    const { reqConf } = res
    // // #ifdef H5
    // console.groupCollapsed(reqConf.url.replace(baseUrl, ''))
    // // #endif
    // // #ifndef H5
    // console.log('------------------------------------------------------------------------------')
    // // #endif
    // console.log('req url', reqConf.url);
    // console.log('req header', reqConf.header);
    // console.log('req data', reqConf.data);
    // console.log('res data', res.data);
    // // #ifndef H5
    // console.log('------------------------------------------------------------------------------')
    // // #endif
    // // #ifdef H5
    // console.groupEnd(reqConf.url.replace(baseUrl, ''))
    // // #endif

    // 统一 loading 处理
    if (!excludeLoadingUrl.includes(reqConf.url.replace(baseUrl, ''))) {
        requestLoadingQueue.splice(requestLoadingQueue.indexOf(reqConf.url), 1)
        if (!requestLoadingQueue.length) {
            uni.hideLoading()
        }
    }

    if (res.statusCode == 200) {
        try {
            if (typeof res.data == 'string') res.data = JSON.parse(res.data)
        } catch (e) {}
        if (res.data.code == 200) {
            return res.data.data
        } else {
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
        if (!isLoginExpire(res.statusCode)) {
            uni.showToast({
                icon: "none",
                title: "Server error",
                duration: 2000,
            });
        }
        return Promise.reject(res)
    }
}

export const request = new Request({
    baseUrl,
    timeout: 1000 * 30,
    requestInterceptor,
    responseInterceptor
})

export const uploadFile = new UploadFile({
    uploadUrl,
    timeout: 1000 * 60 * 3,
    requestInterceptor,
    responseInterceptor
})

// 初始化 webSocket
export const webSocketInit = (token) => {
    if (!token) throw Error('token is not defined, webSocketInit fail')
    try {
        const webSocket = new MyWebSocket(socketUrl + token, (message) => {
            console.log('收到消息 ------ ', message);
            uni.$emit(message.type, message.content)
        }, false)
        // #ifdef H5
        // 方便调试
        window.Message = Message
        window.webSocket = webSocket
        // #endif
        return webSocket
    } catch (e) {
        console.log(e);
    }
}