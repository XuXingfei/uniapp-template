<template>
    <my-container>
        <view class="container f-c">
            <x-nav-bar>
                <text class="navbar_title">首页</text>
            </x-nav-bar>
        </view>
    </my-container>
</template>

<script setup>
    import { ref } from 'vue'
    import { onLoad, onPullDownRefresh, onPageScroll } from '@dcloudio/uni-app'
    import { useCommon } from '@/hooks/useCommon.js'
    import { commonApi } from '@/common/api/index.js'

    const { gProps, userStore, globalStore } = useCommon()
    
    console.log('gProps', gProps);
    
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