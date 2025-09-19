<template>
	<view class="upload-image" :style="[{margin}, customStyle]">
		<view v-if="img" class="img" :style="customStyle">
			<view class="del" @click.stop="del">
				<close-one theme="filled" size="37" fill="#666666" />
			</view>
			<image :src="img" mode="aspectFill" :style="customStyle" @click="$previewImage([img])"></image>
		</view>
		<view v-else class="add f-r-xy-c" :style="customStyle" @click="uploadImg">
			<slot>
				<plus theme="outline" size="100" fill="#ccc" />
			</slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: "my-upload-image",
		props: {
			size: {
				type: String,
				default: '140rpx'
			},
			img: {
				type: String,
				default: ''
			},
			margin: {
				type: String,
				default: ''
			},
			customStyle: {
				type: Object,
				default: () => ({})
			}
		},
		methods: {
			uploadImg() {
				this.$uploadImage().then(res => {
					if (res[0]) this.$emit('update:img', res[0])
				})
			},
			del(i) {
				this.$emit('update:img', '')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.upload-image {
		width: fit-content;
		margin: 20rpx auto;

		.img,
		.add {
			position: relative;
			width: v-bind(size);
			height: v-bind(size);
			background: #F5F5F5;
			border-radius: 12rpx;

			image {
				width: 100%;
				height: 100%;
				border-radius: 20rpx;
			}

			.del {
				z-index: 1;
				position: absolute;
				right: -17rpx;
				top: -17rpx;
			}
		}

		.add {
			overflow: hidden;
		}
	}
</style>