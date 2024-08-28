<template>
    <my-container>
        <view class="container f-c">
            <x-navbar>
                <text class="navbar_title">{{ title }}</text>
            </x-navbar>
            <uv-parse :content="content"></uv-parse>
        </view>
    </my-container>
</template>

<script setup>
    import { ref } from 'vue'
    import { onLoad, onReady } from '@dcloudio/uni-app'
    import { useCommon } from '@/hooks/useCommon.js'

    const { gProps, userStore } = useCommon()

    const title = ref('')
    const content = ref('<div>富文本内容从后端获取</div>')

    onLoad((e) => {
        title.value = e.title || '协议'
    })

    onReady(() => {})
</script>

<style lang="scss">
    .container {
        padding: 24rpx;
        font-size: 30rpx;
        color: #333333;
        line-height: 48rpx;
    }
</style>