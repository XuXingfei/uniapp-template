<template>
    <my-container>
        <view class="container">
            <x-fixed-header>
                <view class="userInfo radius f-c-x-c">
                    <x-placeholder></x-placeholder>
                    <image class="radius" :src="$joinUrl(userInfo.avatar) || logo" mode=""></image>
                    <text @click="$navTo('/pages/login')">昵称：{{ userInfo.nickname || '点击登陆' }}</text>
                </view>
            </x-fixed-header>
            <view class="menu radius">
                <view class="item f-r-y-c-sb" v-for="i in menu" @click="$navTo(i.path)">
                    <text>{{ i.name }}</text>
                    <right size="40" fill="#333" />
                </view>
            </view>
            <view class="" v-for="i in 50">
                {{ i }}
            </view>
        </view>
    </my-container>
</template>

<script setup>
    import { ref } from 'vue'
    import { onLoad, onShow } from '@dcloudio/uni-app'
    import { useCommon } from '@/hooks/useCommon.js'

    const {
        gProps,
        userStore,
        globalStore
    } = useCommon()

    const {
        userInfo,
        bodyInfo
    } = userStore

    const menu = [{
        name: '设置',
        path: '/pages/setting'
    }]

    onLoad(() => {

    })

    onShow(() => {
        gProps.setThemeIcon(globalStore.theme)
    })
</script>

<style lang="scss">
    .container {
        padding-bottom: 30rpx;

        .radius {
            border-radius: 20rpx;
        }

        .menu {
            width: 690rpx;
            margin: 0 auto;
            margin-top: 30rpx;
            padding: 0 30rpx;
            background-color: #fff;

            .item {
                height: 100rpx;
                border-bottom: 1px solid var(--border-color);

                text {
                    font-size: 28rpx;
                }

                &:last-child {
                    border: 0;
                }
            }
        }

        .userInfo {
            padding: 20rpx;
            background-color: #fff;
            border-radius: 0 0 30rpx 30rpx;

            padding-right: (var(--x-safe-right));
            padding-top: (var(--x-safe-top));

            >image {
                width: 120rpx;
                height: 120rpx;
            }

            >text {
                margin-top: 20rpx;
                font-size: 32rpx;
            }
        }
    }
</style>