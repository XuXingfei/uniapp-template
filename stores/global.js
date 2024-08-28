import {
    ref,
    computed
} from 'vue'
import {
    defineStore
} from 'pinia'

export const useGlobalStore = defineStore('global', () => {
    const theme = ref('light')

    function setTheme(payload) {
        theme.value = payload || 'light'
    }

    const containerStyle = ref({})

    function setContainerStyle(payload) {
        Object.assign(containerStyle.value, payload)
    }

    const loading = ref(false)

    function setLoading(payload) {
        loading.value = payload
    }
    return {
        theme,
        setTheme,
        containerStyle,
        setContainerStyle,
        loading,
        setLoading
    }
})