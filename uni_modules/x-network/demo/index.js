import {
	baseUrl,
	uploadUrl,
	socketUrl,
	requestTimeout,
	uploadTimeout
} from '@/uni_modules/x-network/demo/config.js'
import {
	Request,
	UploadFile
} from '@/uni_modules/x-network/js_sdk/http.js'
import {
	MyWebSocket
} from '@/uni_modules/x-network/js_sdk/webSocket.js'
import {
	isLoginExpire,
	fileLimit,
	logReqErr
} from './utils.js'
export {
	Message
}
from '@/uni_modules/x-network/js_sdk/webSocket.js'

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
	uni.$emit(message.event, message.content)
}, false)