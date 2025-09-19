import App from './App'

import { createSSRApp } from 'vue';

import * as Pinia from 'pinia';

import globalProps from '@/plugins/globalProps.js'

import xUtils from '@/uni_modules/x-utils/index.js';
import { getWxShareParams } from '@/uni_modules/x-tools/tools/appletUtils.js';

import uvUI from '@/uni_modules/uv-ui/index.js'

// 开发环境下通过控制台登录
import '@/common/utils/dev.js'

// Android 上架需要
import { createRequestPermissionListener } from '@/uni_modules/x-perm-apply-instr-v2/js_sdk/index.js'
createRequestPermissionListener()

import { useGlobalStore } from '@/stores/global.js'
const _showModal = uni.showModal
uni.showModal = function(options) {
    if (!options.confirmColor) options.confirmColor = useGlobalStore().containerStyle['--theme-color']
    return _showModal(options)
}

import { createNetworkMonitor } from '@/uni_modules/x-network-monitor/js_sdk/index.js'

// 用于处理 Ios App 首次安装无网络问题
createNetworkMonitor({
    onRestore: (networkType) => {
        console.log(`网络已恢复: ${networkType}`);
        // #ifdef APP
		// 网络恢复重启 App, 也可以改为重启当前页面使用 uni.redirectTo
        plus.runtime.restart()
        // #endif
    }
});


export function createApp() {
    // #ifdef H5
    if (process.env.NODE_ENV == 'production')
        for (let key in console) console[key] = () => {} // 生产环境清除 log
    // #endif

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