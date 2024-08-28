import App from './App'

import { createSSRApp } from 'vue';

import * as Pinia from 'pinia';

import globalProps from '@/plugins/globalProps.js'

import xUtils from '@/uni_modules/x-utils/index.js';
import { getWxShareParams } from '@/uni_modules/x-utils/js/appletUtils.js';

import uvUI from '@/uni_modules/uv-ui/index.js'

// Android 上架需要
import { addPermisionInterceptor, removePermisionInterceptor } from '@/uni_modules/x-perm-apply-instr/js_sdk/index.js'
addPermisionInterceptor('chooseImage', '为了修改个人头像和发布信息图片视频等, 我们需要申请您设备的相机和存储权限')
addPermisionInterceptor('chooseVideo', '为了发布信息图片视频等, 我们需要申请您设备的相机和存储权限')
addPermisionInterceptor('saveImageToPhotosAlbum', '为了保存推广海报到手机相册, 我们需要申请您设备的存储权限')
addPermisionInterceptor('getLocation', '为了根据您的位置展示信息, 我们需要申请您设备的位置权限')
addPermisionInterceptor('makePhoneCall', '为了联系客服/用户/咨询等, 我们需要申请您设备的拨打电话权限')
addPermisionInterceptor('getRecorderManager', '为了使用语言消息功能等, 我们需要申请您设备的麦克风权限')
addPermisionInterceptor('startLocationUpdate', '为了根据您的位置展示信息, 我们需要申请您设备的位置权限')
addPermisionInterceptor('scanCode', '为了识别二维码信息, 我们需要申请您设备的相机权限')

export function createApp() {

    const app = createSSRApp(App);

    app.use(Pinia.createPinia());

    app.use(globalProps)

    app.use(xUtils)

    app.use(uvUI)

    app.mixin({
        // 因为有全局的自定义 loading，所以延迟后关闭默认刷新 loading
        onPullDownRefresh() {
            setTimeout(() => {
                uni.stopPullDownRefresh()
            }, 100)
        },
        // 混入全局微信小程序分享钩子
        // #ifdef MP-WEIXIN
        onShareAppMessage() {
            const hookName = 'onShareAppMessage'

            if (this.$[hookName] && this.$[hookName].length > 1) {
                const [hook] = this.$[hookName]
                return hook.call(this)
            }

            return getWxShareParams()
        },
        onShareTimeline() {
            const hookName = 'onShareTimeline'

            if (this.$[hookName] && this.$[hookName].length > 1) {
                const [hook] = this.$[hookName]
                return hook.call(this)
            }

            return getWxShareParams()
        },
        // #endif
    })

    return {
        app,
        Pinia,
    };
}