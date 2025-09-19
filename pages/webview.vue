<template>
    <web-view :src="query.url" :webview-styles="webviewStyles"></web-view>
</template>

<script setup>
    import { ref, reactive } from 'vue'
    import { onLoad } from '@dcloudio/uni-app'

    const query = reactive({});

    const webviewStyles = {}

    onLoad((e) => {
        Object.assign(query, e)
    })
</script>