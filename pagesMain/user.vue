<template>
	<my-container>
		<view class="container">
			<x-nav-bar>
				<text class="navbar_title">我的</text>
			</x-nav-bar>
			<view class="userInfo radius-20 f-c-x-c mt-32">
				<x-placeholder></x-placeholder>
				<image class="size-100 radius-20 mt-35" :src="$joinUrl(userInfo.avatar) || logo" mode=""></image>
				<text @click="$navTo('/pages/login')">昵称：{{ userInfo.nickname || '点击登陆' }}</text>
			</view>
			<view class="menu radius">
				<view class="item f-r-y-c-sb" v-for="i in menu" @click="$navTo(i.path)">
					<text>{{ i.name }}</text>
					<right size="40" fill="#333" />
				</view>
			</view>
		</view>
	</my-container>
</template>

<script setup>
	import { ref } from 'vue'
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import { useCommon } from '@/hooks/useCommon.js'

	const { gProps, userStore, globalStore } = useCommon()

	const { userInfo } = userStore

	const menu = [{
		name: '设置',
		path: '/pages/setting'
	}, {
		name: '用户协议',
		path: '/pages/protocol?title=用户协议'
	}, {
		name: '隐私政策',
		path: '/pages/protocol?title=隐私政策'
	}]

	onLoad(() => {

	})

	onShow(() => {
		// 没有切换主题的需求注释掉这行代码
		gProps.setThemeIcon(globalStore.theme)
	})
</script>

<style lang="scss">
	.container {
		padding-bottom: 30rpx;

		.menu {
			width: 690rpx;
			margin: 0 auto;
			margin-top: 30rpx;
			padding: 0 30rpx;
			border-radius: 30rpx;
			background-color: #fff;

			.item {
				height: 100rpx;
				border-bottom: 1px solid #f2f2f2;

				text {
					font-size: 28rpx;
				}

				&:last-child {
					border: 0;
				}
			}
		}

		.userInfo {
			width: 690rpx;
			margin: 30rpx auto;
			padding: 30rpx;
			background-color: #fff;
			border-radius: 30rpx;

			>text {
				margin-top: 20rpx;
				font-size: 32rpx;
			}
		}
	}
</style>