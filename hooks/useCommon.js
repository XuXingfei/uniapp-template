import { getCurrentInstance } from 'vue'
import { useUserStore } from '@/stores/user.js'
import { useGlobalStore } from '@/stores/global.js'

/**
 * @Func useCommon
 * @Desc 返回常用对象
 * @return {Object}
 * @Author Xingfei Xu
 * @Email 1824159241@qq.com
 */

export const useCommon = () => {
    const { appContext, proxy } = getCurrentInstance()

    const userStore = useUserStore()

    const globalStore = useGlobalStore()

    const globalProperties = appContext.config.globalProperties

    return {
        proxy,
        appContext,
        userStore,
        globalStore,
        globalProperties,
        gProps: globalProperties,
        pageEvent: proxy.$mpType == 'page' ? proxy.getOpenerEventChannel() : { emit: () => console.error('No EventChannel') },
        containerStyle: globalStore.containerStyle,
    }
}