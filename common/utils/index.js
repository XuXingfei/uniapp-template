import { useUserStore } from '@/stores/user.js'
import { userApi, commonApi } from '@/common/api/index.js'
import { themeStyle } from '@/common/themeStyle.js'
import { $isTabBarPage } from '@/uni_modules/x-utils/js/utils.js'

let setThemeIconTimer = null
export const setThemeIcon = function(theme, ms = 0) {
    setThemeIconTimer && clearTimeout(setThemeIconTimer)

    setThemeIconTimer = setTimeout(() => {
        if (!$isTabBarPage()) return

        uni.setStorageSync('theme', theme);

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

// 判空
export const isEmptyValue = value => {
    if (value === null || value === undefined || value === '') {
        return true;
    }
    if (Array.isArray(value)) {
        return value.length === 0;
    }
    if (typeof value === 'object') {
        return Object.keys(value).length === 0;
    }
    return false;
}

// 返回对象属性为空的 property path
const getEmptyValuePropertyPath = (obj, excludedKeys = []) => {
    for (let key in obj) {
        if (obj.hasOwnProperty(key) && !excludedKeys.includes(key)) {
            let value = obj[key];
            if (Array.isArray(value)) {
                // 判断是否为数组对象
                for (let item of value) {
                    const childrenKey = getEmptyValuePropertyPath(item, excludedKeys)
                    if (item instanceof Object && childrenKey) {
                        return key + '.' + childrenKey;
                    }
                }
                if (value.length === 0) {
                    return key;
                }
            } else if (value instanceof Object) {
                const childrenKey = getEmptyValuePropertyPath(value, excludedKeys)
                if (childrenKey) {
                    return key + '.' + childrenKey;
                }
            } else if (isEmptyValue(value)) {
                return key;
            }
        }
    }
    return null;
}

// 有无空字段
export const hasEmptyField = (obj, excludedKeys = []) => getEmptyValuePropertyPath(obj, excludedKeys)

// 微信小程序支付
export const mpWxPay = async (orderNo) => {

    if (!orderNo) return Promise.reject()

    const params = await commonApi.mpWxPay({
        orderNo,
        payType: 'smallPay'
    })

    await uni.requestPayment({
        provider: 'wxpay',
        timeStamp: params.timeStamp,
        nonceStr: params.nonceStr,
        package: params.package,
        signType: params.signType,
        paySign: params.paySign
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
        address: "福田体育公园",
        area: "福田区",
        city: "深圳市",
        latitude: 22.526018,
        longitude: 114.036043,
        name: "福田体育公园",
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

// h5 文件转 Base64
export function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function(event) {
            resolve(event.target.result);
        };

        reader.onerror = function(error) {
            reject(error);
        };

        reader.readAsDataURL(file);
    });
}