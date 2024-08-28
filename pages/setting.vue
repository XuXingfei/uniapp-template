<template>
    <my-container>
        <view class="container">
            <x-navbar>
                <text class="navbar_title">设置</text>
            </x-navbar>
            <view class="main">
                <text class="common_title">主题色</text>
                <view class="theme f-r-y-c-sb">
                    <view class="item f-r-y-c" v-for="i,key in themeStyle" @click="globalStore.setTheme(key)">
                        <view class="color" :style="{ background: i['--theme-color']}"></view>
                        <x-radio :model-value="globalStore.theme == key"></x-radio>
                    </view>
                </view>
            </view>
            <x-fixed-footer :custom-style="{ background: 'transparent', paddingBottom: '30rpx' }">
                <my-button type="default" width="300rpx" @click="userStore.logout()">退出登录</my-button>
            </x-fixed-footer>
        </view>
    </my-container>
</template>

<script setup>
    import { ref, reactive } from 'vue'
    import { onLoad } from '@dcloudio/uni-app'
    import { useCommon } from '@/hooks/useCommon.js'
    import { themeStyle } from '@/common/themeStyle.js'

    const { globalProperties, userStore, globalStore } = useCommon()

    onLoad(() => {
        console.log('onLoad');
    })
</script>

<style lang="scss" scoped>
    .container {
        padding-top: 30rpx;

        .common_title {
            display: inline-block;
            margin-bottom: 20rpx;
        }

        .main {
            padding: 30rpx;

            .theme {
                .item {
                    .color {
                        width: 50rpx;
                        height: 50rpx;
                        margin-right: 10rpx;
                        border-radius: 5rpx;
                    }
                }
            }
        }
    }
</style>