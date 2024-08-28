const defaultOptions = {
    header: {
        "content-type": "application/json; charset=utf-8"
    },
    requestInterceptor: function(options) {},
    responseInterceptor: function(res) {
        return res
    },
}

const responseHandler = (res, responseInterceptor, resolve, reject) => {
    try {
        if (typeof responseInterceptor === "function") {
            res = responseInterceptor(res)
            if ((typeof res === "object" || typeof res === "function") && typeof res.then === "function") {
                res.then(resolve).catch(reject)
            } else {
                resolve(res)
            }
        } else {
            resolve(res)
        }
    } catch (err) {
        reject(err)
    }
}

export class Request {
    /**
     * @desc 网络请求
     * @param {String} options.baseUrl 请求基础路径
     * @param {String} options.header 请求头
     * @param {String} options.timeout 请求超时时间(默认 1000 * 5)
     * @param {String} options.sslVerify 是否验证 ssl 证书(默认 false)
     * @param {String} options.requestInterceptor 请求拦截器(支持 Promise)
     * @param {String} options.responseInterceptor 响应拦截器(支持 Promise)
     * @Author huiliyi
     * @Email 1824159241@qq.com
     */
    constructor(options) {
        if (!options.baseUrl) console.warn('options.baseUrl is not defined')
        this.baseUrl = options.baseUrl || ''
        this.header = options.header || defaultOptions.header
        this.requestInterceptor = options.requestInterceptor || defaultOptions.requestInterceptor
        this.responseInterceptor = options.responseInterceptor || defaultOptions.responseInterceptor
        this.timeout = options.timeout || 1000 * 5
        this.sslVerify = options.sslVerify || false
    }

    request = (url, data, method = 'post', header = {}) => {
        return new Promise(async (resolve, reject) => {
            const requestConfig = {
                url: url.startsWith('http') ? url : this.baseUrl + url,
                data,
                method: method.toUpperCase(),
                timeout: this.timeout,
                sslVerify: this.sslVerify,
                header: {
                    ...this.header,
                    ...header
                },
            }
            try {
                await this.requestInterceptor(requestConfig)
                uni.request({
                    ...requestConfig,
                    success: res => {
                        res.reqConf = requestConfig
                        responseHandler(res, this.responseInterceptor, resolve, reject)
                    },
                    fail: err => {
                        responseHandler({ err, reqConf: requestConfig }, this.responseInterceptor, resolve, reject)
                    }
                });
            } catch (err) {
                responseHandler({ err, reqConf: requestConfig }, this.responseInterceptor, resolve, reject)
            }
        })
    }

    get = (url, data, header) => {
        return this.request(url, data, 'get', header)
    }

    post = (url, data, header) => {
        return this.request(url, data, 'post', header)
    }
}


export class UploadFile {
    /**
     * @desc 上传文件
     * @param {String} options.uploadUrl 上传路径(必须)
     * @param {String} options.name 文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容 (默认：file)
     * @param {String} options.header 请求头
     * @param {String} options.timeout 上传超时时间(默认：1000 * 60)
     * @param {String} options.requestInterceptor 请求拦截器(支持 Promise)
     * @param {String} options.responseInterceptor 响应拦截器(支持 Promise)
     * @Author huiliyi
     * @Email 1824159241@qq.com
     */
    constructor(options) {
        if (!options.uploadUrl) throw Error('options.uploadUrl is not defined')
        this.uploadUrl = options.uploadUrl
        this.name = options.name || 'file'
        this.header = options.header || {}
        this.timeout = options.timeout || 1000 * 60
        this.requestInterceptor = options.requestInterceptor || defaultOptions.requestInterceptor
        this.responseInterceptor = options.responseInterceptor || defaultOptions.responseInterceptor
    }

    /**
     * @func uploadFile
     * @desc 上传文件
     * @param {String} filePath 要上传文件资源的路径
     * @param {Function} callBack 回调时会传入 uploadTask 对象和文件路径 (uploadTask 用法参照 uni 官方文档 https://uniapp.dcloud.net.cn/api/request/network-file.html#uploadfile)
     * @param {Object} formData HTTP 请求中其他额外的 form data
     * @param {Object} fileInfo 文件信息用于在请求拦截器统一处理, 通常包含 {type: 文件类型, size: 文件大小}
     * @return
     * @Author huiliyi
     * @Email 1824159241@qq.com
     */
    uploadFile = (filePath, callBack, formData = {}, fileInfo = {}) => {
        return new Promise(async (resolve, reject) => {
            const uploadConfig = {
                url: this.uploadUrl,
                filePath,
                formData,
                name: this.name,
                timeout: this.timeout,
                header: {
                    ...this.header
                },
                fileInfo
            }
            try {
                await this.requestInterceptor(uploadConfig)
                const uploadTask = uni.uploadFile({
                    ...uploadConfig,
                    success: res => {
                        res.reqConf = uploadConfig
                        responseHandler(res, this.responseInterceptor, resolve, reject)
                    },
                    fail: err => {
                        responseHandler({ err, reqConf: uploadConfig }, this.responseInterceptor, resolve, reject)
                    }
                });
                callBack && callBack({
                    filePath,
                    uploadTask
                })
            } catch (err) {
                responseHandler({ err, reqConf: uploadConfig }, this.responseInterceptor, resolve, reject)
            }
        })
    }

    /**
     * @func uploadImage
     * @desc 上传单张图片
     * @param {Object} options options 参数，参照 uni.chooseImage
     * @param {Function} callBack 回调时会传入 uploadTask 对象和文件路径 (uploadTask 用法参照 uni 官方文档 https://uniapp.dcloud.net.cn/api/request/network-file.html#uploadfile)
     * @param {Object} formData HTTP 请求中其他额外的 form data
     * @return
     * @Author huiliyi
     * @Email 1824159241@qq.com
     */
    uploadImage = async (options = {}, callBack, formData) => {
        try {
            options.count = 1
            const res = await this.uploadImages(options, uploads => {
                callBack && callBack(uploads[0])
            }, formData)
            return res[0]
        } catch (e) {
            return Promise.reject(e)
        }
    }

    /**
     * @func uploadImages
     * @desc 上传多张图片
     * @param {Object} options options 参数，参照 uni.chooseImage
     * @param {Function} callBack 回调时会传入 uploadTask 对象和文件路径数组 (uploadTask 用法参照 uni 官方文档 https://uniapp.dcloud.net.cn/api/request/network-file.html#uploadfile)
     * @param {Object} formData HTTP 请求中其他额外的 form data
     * @return
     * @Author huiliyi
     * @Email 1824159241@qq.com
     */
    uploadImages = (options = {}, callBack, formData) => {
        return new Promise((resolve, reject) => {
            uni.chooseImage({
                ...options,
                success: (res) => {
                    const {
                        tempFilePaths,
                        tempFiles
                    } = res
                    const uploads = []
                    Promise.allSettled(tempFilePaths.map((tempFilePath, idx) => this.uploadFile(tempFilePath, params => {
                        uploads.push(params)
                        if (callBack && uploads.length == tempFilePaths.length) callBack(uploads)
                    }, formData, tempFiles[idx]))).then(results => {
                        resolve(results.filter(result => result.status == 'fulfilled').map(result => result.value))
                    }).catch(reject)
                },
                fail: reject
            })
        })
    }

    /**
     * @func uploadVideo
     * @desc 上传视频
     * @param {Object} options options 参数，参照 uni.chooseVideo
     * @param {Function} callBack 回调时会传入 uploadTask 对象和文件路径 (uploadTask 用法参照 uni 官方文档 https://uniapp.dcloud.net.cn/api/request/network-file.html#uploadfile)
     * @param {Object} formData HTTP 请求中其他额外的 form data
     * @return
     * @Author huiliyi
     * @Email 1824159241@qq.com
     */
    uploadVideo = (options = {}, callBack, formData) => {
        return new Promise((resolve, reject) => {
            uni.chooseVideo({
                ...options,
                success: (res) => {
                    this.uploadFile(res.tempFilePath, callBack, formData, res).then(resolve).catch(reject)
                },
                fail: reject
            })
        })
    }
}