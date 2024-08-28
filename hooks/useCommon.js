import { getCurrentInstance } from 'vue'
import { useUserStore } from '@/stores/user.js'
import { useGlobalStore } from '@/stores/global.js'

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