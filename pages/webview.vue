<template>
    <x-nav-bar>
        <text>{{ title }}</text>
    </x-nav-bar>
    <web-view :src="url" :webview-styles="webviewStyles"></web-view>
</template>

<script setup>
    import { ref, reactive } from 'vue'
    import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
    import { useCommon } from '@/hooks/useCommon.js'
    import {} from '@/common/api/index.js'

    const { gProps, userStore, globalStore } = useCommon()

    const title = ref('')
    const url = ref('')

    const { statusBarHeight } = uni.getSystemInfoSync()
    const navbarHeight = statusBarHeight + 44
    const webviewStyles = {
        top: navbarHeight + 'px',
        bottom: 0
    }

    onLoad((e) => {
        title.value = e.title || '外部链接'
        url.value = e.url || 'http://www.baidu.com'
    })
</script>

<style lang="scss" scoped>
    .container {}
</style>