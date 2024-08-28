import permisionUtil from "./permission.js"
const prefix = 'permision_'
const {
    uniPlatform,
    platform
} = uni.getSystemInfoSync()

const permisionMap = {
    scanCode: async function() {
        try {
            const status = await permisionUtil.requestAndroidPermission('android.permission.CAMERA')
            return Promise.resolve(status)
        } catch (e) {
            return Promise.resolve(0)
        }
    },
    album: async function() {
        try {
            const status = await permisionUtil.requestAndroidPermission('android.permission.READ_EXTERNAL_STORAGE')
            return Promise.resolve(status)
        } catch (e) {
            return Promise.resolve(0)
        }
    },
    camera: async function() {
        try {
            const status = await permisionUtil.requestAndroidPermission('android.permission.CAMERA')
            return Promise.resolve(status)
        } catch (e) {
            return Promise.resolve(0)
        }
    },
    chooseFile: async function() {
        try {
            const status = await permisionUtil.requestAndroidPermission('android.permission.READ_EXTERNAL_STORAGE')
            return Promise.resolve(status)
        } catch (e) {
            return Promise.resolve(0)
        }
    },
    chooseImage: async function() {
        try {
            const status1 = await permisionUtil.requestAndroidPermission('android.permission.CAMERA')
            const status2 = await permisionUtil.requestAndroidPermission('android.permission.READ_EXTERNAL_STORAGE')
            if (status1 == 1 || status2 == 1) {
                return Promise.resolve(1)
            } else {
                return Promise.resolve(-1)
            }
        } catch (e) {
            return Promise.resolve(0)
        }
    },
    chooseVideo: async function() {
        try {
            const status1 = await permisionUtil.requestAndroidPermission('android.permission.CAMERA')
            const status2 = await permisionUtil.requestAndroidPermission('android.permission.READ_EXTERNAL_STORAGE')
            if (status1 == 1 || status2 == 1) {
                return Promise.resolve(1)
            } else {
                return Promise.resolve(-1)
            }
        } catch (e) {
            return Promise.resolve(0)
        }
    },
    saveImageToPhotosAlbum: async function() {
        try {
            const status = await permisionUtil.requestAndroidPermission('android.permission.WRITE_EXTERNAL_STORAGE')
            return Promise.resolve(status)
        } catch (e) {
            return Promise.resolve(0)
        }
    },
    saveVideoToPhotosAlbum: async function() {
        try {
            const status = await permisionUtil.requestAndroidPermission('android.permission.WRITE_EXTERNAL_STORAGE')
            return Promise.resolve(status)
        } catch (e) {
            return Promise.resolve(0)
        }
    },
    getLocation: async function() {
        try {
            const status = await permisionUtil.requestAndroidPermission('android.permission.ACCESS_FINE_LOCATION')
            return Promise.resolve(status)
        } catch (e) {
            return Promise.resolve(0)
        }
    },
    startLocationUpdate: async function() {
        try {
            const status = await permisionUtil.requestAndroidPermission('android.permission.ACCESS_FINE_LOCATION')
            return Promise.resolve(status)
        } catch (e) {
            return Promise.resolve(0)
        }
    },
    makePhoneCall: async function() {
        try {
            const status = await permisionUtil.requestAndroidPermission('android.permission.CALL_PHONE')
            return Promise.resolve(status)
        } catch (e) {
            return Promise.resolve(0)
        }
    },
    getRecorderManager: async function() {
        try {
            const status = await permisionUtil.requestAndroidPermission('android.permission.RECORD_AUDIO')
            return Promise.resolve(status)
        } catch (e) {
            return Promise.resolve(0)
        }
    }
}

const resultHandler = function(args, err) {
    args.fail && args.fail(err)
    args.complete && args.complete(err)
}

let getRecorderManagerFlag = false
const _getRecorderManager = uni.getRecorderManager

/**
 * @func addPermisionInterceptor
 * @desc 添加权限申请说明拦截
 * @param {String} permisionName 要拦截的 uniApi 名称
 * @param {String} content 申请权限说明信息
 * @param {Boolean} once 只询问一次, 用户不同意申请或拒绝权限将无法使用 uniApi, 如果要继续使用 Api 先用 removePermisionInterceptor 函数移除拦截再调用 Api
 * @return 无
 * @Author huiliyi
 * @Email 1824159241@qq.com
 */
export const addPermisionInterceptor = function(permisionName, content, once) {
    if (uniPlatform != 'app' || platform != 'android') return
    const getRecorderManagerAdapter = function() {
        const recorder = _getRecorderManager()
        const _start = recorder.start.bind(recorder)
        recorder.start = function(options) {
            const perm = uni.getStorageSync(prefix + permisionName)
            if (perm == 1) {
                _start(options)
                return
            }
            if (once && typeof perm == 'number') {
                console.error(`用户不同意申请或已拒绝权限`)
                return
            }
            uni.showModal({
                title: '权限申请说明',
                content,
                cancelText: '不同意',
                confirmText: '同意',
                success: async (res) => {
                    try {
                        if (res.confirm) {
                            let status = 0
                            if (permisionMap[permisionName]) {
                                status = await permisionMap[permisionName]()
                            } else {
                                status = 1
                                console.error(`addPermisionInterceptor fail, ${permisionName}-未配置获取权限方法`)
                            }
                            uni.setStorageSync(prefix + permisionName, status)
                            if (status === 1) {
                                _start(options)
                            }
                            if (status === 0) {
                                console.error(`申请麦克风权限失败`)
                            }
                            if (status === -1) {
                                console.error(`用户已拒绝麦克风权限`)
                                uni.showModal({
                                    title: '是否前往开启权限?',
                                    cancelText: '否',
                                    confirmText: '是',
                                    success: (res) => {
                                        if (res.confirm) {
                                            permisionUtil.gotoAppPermissionSetting()
                                        }
                                    }
                                })
                            }
                        }
                        if (res.cancel) {
                            uni.setStorageSync(prefix + permisionName, 0)
                            console.error(`用户不同意申请权限`)
                        }
                    } catch (err) {
                        console.error(err)
                    }
                },
                fail: err => {
                    console.error(err)
                }
            })
        }
        return recorder
    }
    if (permisionName == 'getRecorderManager') {
        if (getRecorderManagerFlag) return
        uni.getRecorderManager = getRecorderManagerAdapter
        getRecorderManagerFlag = true
        return
    }
    uni.addInterceptor(permisionName, {
        invoke(args) {
            if (args.sourceType && Array.isArray(args.sourceType) && args.sourceType.length == 1) permisionName = args.sourceType[0]
            return new Promise((resolve, reject) => {
                const perm = uni.getStorageSync(prefix + permisionName)
                if (perm == 1) {
                    resolve(args)
                    return
                }
                if (once && typeof perm == 'number') {
                    reject(args)
                    resultHandler(args, {
                        errMsg: '用户不同意申请或已拒绝权限'
                    })
                    return
                }
                uni.showModal({
                    title: '权限申请说明',
                    content,
                    cancelText: '不同意',
                    confirmText: '同意',
                    success: async (res) => {
                        try {
                            if (res.confirm) {
                                let status = 0
                                if (permisionMap[permisionName]) {
                                    status = await permisionMap[permisionName]()
                                } else {
                                    status = 1
                                    console.error(`addPermisionInterceptor fail, ${permisionName}-未配置获取权限方法`)
                                }
                                uni.setStorageSync(prefix + permisionName, status)
                                if (status === 1) {
                                    resolve(args)
                                }
                                if (status === 0) {
                                    reject(args)
                                    resultHandler(args, {
                                        errMsg: '申请权限失败'
                                    })
                                }
                                if (status === -1) {
                                    reject(args)
                                    resultHandler(args, {
                                        errMsg: '用户已拒绝该权限'
                                    })
                                    uni.showModal({
                                        title: '是否前往开启权限?',
                                        cancelText: '否',
                                        confirmText: '是',
                                        success: (res) => {
                                            if (res.confirm) {
                                                permisionUtil.gotoAppPermissionSetting()
                                            }
                                        }
                                    })
                                }
                            }
                            if (res.cancel) {
                                uni.setStorageSync(prefix + permisionName, 0)
                                reject(args)
                                resultHandler(args, {
                                    errMsg: '用户不同意申请权限'
                                })
                            }
                        } catch (err) {
                            reject(args)
                            resultHandler(args, err)
                        }
                    },
                    fail: err => {
                        reject(args)
                        resultHandler(args, err)
                    }
                })
            });
        },
        fail(err) {
            console.log('interceptor-fail', err)
            const errMsg = String(err?.errMsg)
            if (errMsg.includes('fail No Permission') || (errMsg.includes('fail') && errMsg.includes('权限'))) {
                uni.setStorageSync(prefix + permisionName, 0)
                uni.showModal({
                    title: '是否前往开启权限?',
                    cancelText: '否',
                    confirmText: '是',
                    success: (res) => {
                        if (res.confirm) {
                            permisionUtil.gotoAppPermissionSetting()
                        }
                    }
                })
            }
        }
    })
}

/**
 * @func removePermisionInterceptor
 * @desc 移除权限申请说明拦截
 * @param {String} permisionName 要移除拦截的 uniApi 名称
 * @return 无
 * @Author huiliyi
 * @Email 1824159241@qq.com
 */
export const removePermisionInterceptor = function(permisionName) {
    if (permisionName == 'getRecorderManager') {
        getRecorderManagerFlag = false
        uni.getRecorderManager = _getRecorderManager
    }
    uni.removeInterceptor(permisionName)
    uni.removeStorageSync(prefix + permisionName)
}