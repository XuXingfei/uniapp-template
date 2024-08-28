import { initData } from '@/uni_modules/x-utils/index.js';

import { login } from '@/common/api/user.js'

import { useUserStore } from '@/stores/user.js'

const _devLogin = phone => {
    login({
        phone,
        code: 123123
    }).then(res => {
        const { setToken, setUserInfo } = useUserStore()
        setToken(res.token)
        setUserInfo().then(res => {
            uni.showToast({
                title: '开发账号登陆',
                icon: 'success'
            })
        })
    })
}

// #ifdef H5

if (process.env.NODE_ENV == 'development') {
    window.initData = initData
    window._devLogin = (phone = 13315511111) => _devLogin(phone)
}

// #endif

// #ifdef MP

if (uni.getSystemInfoSync().platform == 'devtools') {
    wx._devLogin = (phone = 13315511111) => _devLogin(phone)
}

// #endif