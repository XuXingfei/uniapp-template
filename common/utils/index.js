import { useUserStore } from '@/stores/user.js'
import { userApi, commonApi } from '@/common/api/index.js'
import { themeStyle } from '@/common/themeStyle.js'
import { isTabBarPage } from '@/uni_modules/x-tools/tools/index.js'

let setThemeIconTimer = null
export const setThemeIcon = function(theme, ms = 0) {
    setThemeIconTimer && clearTimeout(setThemeIconTimer)

    setThemeIconTimer = setTimeout(() => {
        if (!isTabBarPage()) return

        uni.setTabBarStyle({
            selectedColor: themeStyle[theme]['--theme-color'],
        });

        // 设置每个 TabBar 的主题图标
        ['home', 'me'].forEach((i, index) => {
            uni.setTabBarItem({
                index,
                selectedIconPath: `/static/tabIcon/${i}_${theme}.png`
            })
        })

        setThemeIconTimer = null
    }, ms)
}

// 微信支付
export const wxPay = async (orderNo) => {

    if (!orderNo) return Promise.reject()

    const params = await commonApi.wxPay({
        orderNo
    })

    await uni.requestPayment({
        provider: 'wxpay',
        orderInfo: params
    })
}

// 微信小程序支付
export const mpWxPay = async (orderNo) => {

    if (!orderNo) return Promise.reject()

    const params = await commonApi.mpWxPay({
        orderNo
    })

    await uni.requestPayment({
        provider: 'wxpay',
        timeStamp: params.timeStamp,
        nonceStr: params.nonceStr,
        package: params.package,
        signType: params.signType,
        paySign: params.sign
    })
}

// 微信小程序手机号登陆
export const mpWxPhoneLogin = async function(phoneNumberInfo = {}) {
    try {
        if (!phoneNumberInfo) return Promise.reject('手机号信息缺失')

        delete phoneNumberInfo.errMsg

        const { code } = await uni.login()

        const { iv, encryptedData } = await uni.getUserInfo()

        const userInfo = await userApi.login({
            code,
            iv,
            encryptedData,
            phoneNumberInfo
        })

        const { token } = userInfo

        if (token) {
            return token
        }

        return Promise.reject(userInfo)
    } catch (error) {
        return Promise.reject(error)
    }
}

// 获取位置信息
export const getLocation = async function(regeo = true, options = {}) {
    // #ifdef H5
    return {
        area: "福田区",
        city: "深圳市",
        province: "广东省",
        latitude: 22.520922,
        longitude: 114.055198,
    }
    // #endif
    const { longitude, latitude } = await uni.getLocation({ type: 'gcj02', ...options })

    if (regeo) {
        const { provinceName, cityName, areaName } = await commonApi.regeo({ longitude, latitude })

        return {
            longitude,
            latitude,
            province: provinceName,
            city: cityName,
            area: areaName
        }
    }

    return {
        longitude,
        latitude
    }
}

// 选择位置
export const chooseLocation = async function(regeo = true, options = {}) {
    // #ifdef H5
    return {
        address: "广东省深圳市宝安区海秀路19号",
        area: "宝安区",
        city: "深圳市",
        latitude: 22.526018,
        longitude: 114.036043,
        name: "国际西岸商务大厦",
        province: "广东省",
    }
    // #endif

    const { longitude, latitude, name, address } = await uni.chooseLocation(options)

    if (regeo) {

        const { provinceName, cityName, areaName } = await commonApi.regeo({ longitude, latitude })

        return {
            name,
            address,
            longitude,
            latitude,
            province: provinceName,
            city: cityName,
            area: areaName
        }
    }

    return {
        name,
        address,
        longitude,
        latitude
    }
}

// 判断是否登陆
let loginModalShow = false
export const hasLogin = (showModal = true) => {

    if (useUserStore().token) return true

    if (showModal && !loginModalShow) {

        loginModalShow = true

        uni.showModal({
            title: '提示',
            content: '当前未登录, 是否前往登录',
            confirmText: "去登录",
            cancelText: "稍后",
            complete: (res) => {
                if (res.confirm) {
                    uni.navigateTo({
                        url: '/pages/login'
                    })
                }
                loginModalShow = false
            }
        })

    }
    return false
}

// 格式化金额
export const formatAmount = function(amount) {
    if (!amount) return amount
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
