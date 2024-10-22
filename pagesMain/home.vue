<template>
    <my-container>
        <view class="container f-c">
            <x-navbar>
                <text class="navbar_title">首页</text>
            </x-navbar>
            <!-- 淡入顶部 -->
            <x-fade-in-top :scroll-top="scrollTop">
                <x-navbar bg-color="var(--theme-color)">
                    <text class="navbar_title">首页</text>
                </x-navbar>
            </x-fade-in-top>

            <text class="fs-40 bold mb-20">常用组件</text>

            <text class="title">金额</text>
            <x-amount :amount="20" scale="1.5" color="red"></x-amount>

            <text class="title">单选按钮</text>
            <x-radio></x-radio>

            <text class="title">取色器</text>
            <x-color-extractor width="702rpx" @change="$toast"></x-color-extractor>

            <text class="title">虚化背景</text>
            <x-filter-bg :src="logo" height="200rpx" :slot-style="{padding: '20rpx'}">
                <view class="">
                    x-filter-bg
                </view>
            </x-filter-bg>

            <text class="title">上传图片（需在 common/config.js 文件设置正确的请求信息）</text>
            <my-upload-image :width="702" v-model:imgs="imgs"></my-upload-image>

            <view class="mt-32 p-20" v-for="i in 50">
                {{ i }}
            </view>

            <x-fixed-footer padding="20rpx 30rpx" bg-color="var(--theme-color)">
                <text class="title">固定底部</text>
                <button @click="loading" style="color: var(--theme-color);">全局loading</button>
            </x-fixed-footer>
        </view>
    </my-container>
</template>

<script setup>
    import { ref } from 'vue'
    import { onLoad, onPullDownRefresh, onPageScroll } from '@dcloudio/uni-app'
    import { useCommon } from '@/hooks/useCommon.js'
    import { commonApi } from '@/common/api/index.js'

    const { gProps, userStore, globalStore } = useCommon()

    const imgs = ref([])

    const scrollTop = ref(0)

    function loading() {
        commonApi.config().then(res => {
            console.log(res);
        })
    }

    onLoad(() => {

    })

    onPageScroll((e) => {
        scrollTop.value = e.scrollTop
    })

    onPullDownRefresh(() => {
        commonApi.config()
    })
</script>

<style lang="scss" scoped>
    .container {
        padding: 0 24rpx;

        .title {
            font-size: 32rpx;
            margin-bottom: 10rpx;
            margin-top: 30rpx;
        }
    }
</style>