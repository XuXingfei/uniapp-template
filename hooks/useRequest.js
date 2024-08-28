import { ref, watch, isReactive } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { http } from '@/common/network/http.js'

export const useRequest = function(requestMethod, url, params = {}, initValue = {}, loadGet = true, showGet = true, autoGet = true) {

    const data = ref(initValue)

    async function getData() {
        try {
            const res = await requestMethod(url, params)
            data.value = res
            return res
        } catch (error) {
            return Promise.reject(error)
        }
    }

    if (autoGet && isReactive(params)) {
        watch(params, getData)
    }

    if (loadGet && !showGet) {
        onLoad(getData)
    }

    if (showGet) {
        onShow(getData)
    }

    return {
        data,
        getData
    }
}

export const useGet = (...args) => useRequest(http.get, ...args)

export const usePost = (...args) => useRequest(http.post, ...args)