import { initData } from '@/uni_modules/x-utils/index.js';
import { login, register } from '@/common/api/user.js'
import { useUserStore } from '@/stores/user.js'
import { useGlobalStore } from '@/stores/global.js'

const _devRegister = async username => {

    const res = await register({
        username,
        password: '123456'
    })

    console.log('register success', res);

    return await _devLogin(username)
}


const _devLogin = async username => {

    const { token } = await login({
        username,
        password: '123456',
    })

    console.log('login success', token);

    const { setToken, setUserInfo } = useUserStore()

    setToken(token)

    const userInfo = await setUserInfo()

    uni.showToast({
        title: '开发账号登陆',
        icon: 'success'
    })

    uni.reLaunch({
        url: '/pagesMain/home'
    })

    return userInfo
}

let _global = {}

// #ifdef H5
if (process.env.NODE_ENV == 'development') {
    _global = window
}
// #endif

// #ifdef MP
if (uni.getSystemInfoSync().platform == 'devtools') {
    _global = wx
}
// #endif

setTimeout(() => {
    console.log('开发工具已添加到 global');

    _global._initData = initData

    _global._store = {
        userStore: useUserStore(),
        globalStore: useGlobalStore()
    }
    _global._devLogin = (username = 'ahh1') => _devLogin(username)

    _global._devRegister = (username = 'ahh1') => _devRegister(username)
}, 0)