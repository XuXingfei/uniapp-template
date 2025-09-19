import { useUserStore } from '@/stores/user.js'
import { getCurrentPagePath } from '@/uni_modules/x-tools/tools/index.js'
import { _typeof } from '@/uni_modules/x-tools/tools/index.js'
import { timeFormat } from '@/uni_modules/uv-ui/libs/function/index.js'
import { hasLogin } from '@/common/utils/index.js'

export const paramsFilter = (data, options) => {
    const { method } = options
    if (_typeof(data) == 'array') {
        for (let i = 0, len = data.length; i < len; i++) {
            data[i] = paramsFilter(data[i], options)
        }
    }

    if (_typeof(data) == 'object') {
        const keys = Object.keys(data)
        for (let i = 0, len = keys.length; i < len; i++) {
            const key = keys[i]
            data[key] = paramsFilter(data[key], options)
        }
    }

    if (data === null || data === 'null' || data === undefined || data === 'undefined') return ''

    if (Array.isArray(data) && method == 'GET') return data.join(',')

    return data
}


export const dataFactory = (data) => {
    if (_typeof(data) == 'array') {
        for (let i = 0, len = data.length; i < len; i++) {
            data[i] = dataFactory(data[i])
        }
    }
    if (_typeof(data) == 'object') {
        const keys = Object.keys(data)
        for (let i = 0, len = keys.length; i < len; i++) {
            const key = keys[i]

            // 时间格式化
            // if (key.toLowerCase().includes('time') && !isNaN(new Date(data[key]))) {
            //     data[key] = timeFormat(data[key], 'yyyy-mm-dd hh:MM:ss')
            //     continue
            // }

            data[key] = dataFactory(data[key])
        }
    }
    if (data === null || data === 'null' || data === undefined || data === 'undefined') return ''
    return data
}

// 输出 JSON 格式请求失败信息(方便提供给后端)
export const logReqErr = res => {
    const { reqConf, statusCode, data: response } = res

    const request = {
        url: reqConf.url,
        method: reqConf.method,
        header: reqConf.header,
        data: reqConf.data,
    }

    const errInfo = `请求失败信息\nstatusCode: ${statusCode}\nrequest: ${JSON.stringify(request, null, 4)}\nresponse: ${JSON.stringify(response, null, 4)}\ntime: ${new Date().toLocaleString()}`

    console.log(errInfo)

    return errInfo
}

// 登录过期判断
let loginTimer = null
export const isLoginExpire = code => {

    if (code == 401 || code == 402 || code == 403) {

        useUserStore().setToken('')

        loginTimer && clearTimeout(loginTimer)
        loginTimer = setTimeout(() => {

            // 已在登陆页无需再提示
            if (getCurrentPagePath() == '/pages/login') return

            hasLogin()

        }, 1000)

        return true
    }
}

// 上传文件限制
export const fileLimit = ({ filePath, fileInfo }) => {
    // console.log('fileLimit', filePath, fileInfo);
    const imgSize = 1024 * 1024 * 0.5 // 0.5 MB
    const videoSize = 1024 * 1024 * 20 // 20 MB
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
        throw Error(tips)
    }

    fileTypes.forEach(i => {
        if (new RegExp(i).test(type) && fileSizeLimit[i] < size) {
            const tips = `${type}类型文件限制“${(fileSizeLimit[i] / 1024 / 1024).toFixed(2)}MB”`
            throw Error(tips)
        }
    })
}