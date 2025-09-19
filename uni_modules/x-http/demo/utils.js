// 输出请求失败信息（某些后端的接口就是一坨💩，一调就报错所以有了这个方便复制）
export const logReqErr = res => {
    const { reqConf, statusCode, data: response } = res

    const request = {
        url: reqConf.url,
        method: reqConf.method,
        header: reqConf.header,
        data: reqConf.data,
    }

    const errInfo = `请求失败信息\nstatusCode: ${statusCode}\nrequest: ${JSON.stringify(request, null, 4)}\nresponse: ${JSON.stringify(response, null, 4)}\ntime: ${new Date().toString()}`

    console.log(errInfo)
    
    return errInfo
}

// 登录过期判断
export const isLoginExpire = code => {
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
export const fileLimit = ({ filePath, fileInfo }) => {
    // console.log('fileLimit', filePath, fileInfo);
    const imgSize = 1024 * 1024 * 1
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
        throw Error(tips)
    }

    fileTypes.forEach(i => {
        if (new RegExp(i).test(type) && fileSizeLimit[i] < size) {
            const tips = `${type}类型文件限制“${(fileSizeLimit[i] / 1024 / 1024).toFixed(2)}MB”`
            throw Error(tips)
        }
    })
}