export * from './js/index.js';

import router from './js/router.js'
import * as utils from './js/utils.js'

import { initInterceptor } from './js/interceptor.js'

import pages from '@/pages.json'

import { id, version } from './package.json'

export const homePath = '/' + pages.pages[0].path

const install = Vue => {

    if (process.env.NODE_ENV === 'development') {
        console.log(`\n %c ${id} ${version} https://ext.dcloud.net.cn/plugin?id=15875 \n`, 'color: #ffffff; background: skyblue; padding:5px 0px; border-radius: 5px;');
    }

    initInterceptor()

    let targetObj = {}
    // #ifdef VUE2
    targetObj = Vue.prototype
    // #endif
    // #ifdef VUE3
    targetObj = Vue.config.globalProperties
    // #endif

    String.prototype.splice = function(start, deleteCount, ...args) {
        const strArr = this.split('')
        strArr.splice(start, deleteCount, ...args)
        return strArr.join('')
    }

    targetObj.homePath = uni.homePath = homePath

    // 路由跳转
    for (let key in router) {
        if (!targetObj[key] && !uni[key]) targetObj[key] = uni[key] = router[key]
        else console.error(`${key} key clash, targetObj.${key}=${targetObj[key]}, uni.${key}=${uni[key]}`)
    }

    // utils
    for (let key in utils) {
        if (!targetObj[key] && !uni[key]) targetObj[key] = uni[key] = utils[key]
        else console.error(`${key} key clash, targetObj.${key}=${targetObj[key]}, uni.${key}=${uni[key]}`)
    }
}

export default {
    install
}