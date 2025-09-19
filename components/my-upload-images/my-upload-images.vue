<template>
	<view class="my-upload-images">
		<view v-if="title" class="title">
			{{ title }}
		</view>
		<slot v-else></slot>
		<view class="imgs f-r f-wp" :style="{ width: width + 'rpx' }">
			<view class="img" v-for="i in imgs">
				<view class="del" @click.stop="del(i)">
					<close-one theme="filled" size="37" fill="#666666" />
				</view>
				<image :src="i" mode="aspectFill" @click="$previewImage(imgs, i)"></image>
			</view>
			<view v-if="imgs.length < size" class="add f-r-xy-c" @click="uploadImg">
				<slot>
					<plus theme="outline" size="100" fill="#ccc" />
				</slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "my-upload-images",
		props: {
			width: {
				type: [Number, String],
				default: 690
			},
			imgs: {
				type: Array,
				default: () => []
			},
			size: {
				type: Number,
				default: 9
			},
			title: {
				type: String,
				default: ''
			},
			bgColor: {
				type: String,
				default: '#f5f5f5'
			}
		},
		data() {
			return {
				itemWidth: 0
			};
		},
		created() {
			this.itemWidth = (this.width - 40) / 3 + 'rpx'
		},
		methods: {
			uploadImg() {
				const { size, imgs } = this
				if (size - imgs.length <= 0) return
				this.$uploadImages({
					count: size - imgs.length
				}).then(res => {
					if (res) this.$emit('update:imgs', [...imgs, ...res].slice(0, size))
				})
			},
			del(i) {
				this.$emit('update:imgs', this.imgs.filter(f => f != i))
			}
		}
	}
</script>

<style lang="scss" scoped>
	.my-upload-images {
		width: fit-content;
		margin: 20rpx auto;

		.title {
			margin-bottom: 40rpx;
			font-family: Roboto, Roboto;
			font-weight: 400;
			font-size: 29rpx;
			color: #333333;
		}

		.imgs {

			.img,
			.add {
				position: relative;
				width: v-bind(itemWidth);
				height: v-bind(itemWidth);
				border-radius: 20rpx;
				background-color: v-bind(bgColor);

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

			>view {
				margin-right: 20rpx;
				margin-bottom: 20rpx;

				&:nth-child(3n) {
					margin-right: 0;
				}
			}
		}
	}
</style>