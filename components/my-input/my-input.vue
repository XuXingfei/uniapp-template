<template>
	<view class="my-input-view">
		<view v-if="mode == 'row'" class="my-input row f-r-y-c" :style="[{ width, height }, customStyle]">
			<text v-if="label" class="label" :style="{ width: labelWidth }"><text v-if="required">*</text>{{ label }}</text>
			<input :type="innerType" v-bind="$attrs" class="f-1" :style="{ margin: label ? '0 20rpx' : '' }" placeholder-class="placeholder-class" />
			<template v-if="type == 'password' && $attrs.modelValue">
				<preview-close v-if="innerType == 'password'" @click="innerType = 'text'" theme="outline" size="48" fill="#8A8776" />
				<preview-open v-else theme="outline" @click="innerType = 'password'" size="48" fill="#8A8776" />
			</template>
			<slot></slot>
		</view>
		<view v-if="mode == 'column'" class="my-input column f-c" :style="[{ width }, customStyle]">
			<text v-if="label" class="label"><text v-if="required">*</text>{{ label }}</text>
			<view class="f-r-y-c">
				<input :type="innerType" v-bind="$attrs" class="f-1" placeholder-class="placeholder-class" />
				<template v-if="type == 'password' && $attrs.modelValue">
					<preview-close v-if="innerType == 'password'" @click="innerType = 'text'" theme="outline" size="48" fill="#8A8776" />
					<preview-open v-else theme="outline" @click="innerType = 'password'" size="48" fill="#8A8776" />
				</template>
				<slot></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "my-input",
		props: {
			width: {
				type: String,
				default: '690rpx'
			},
			height: {
				type: String,
				default: '100rpx'
			},
			label: {
				type: String,
				default: ''
			},
			labelWidth: {
				type: String,
				default: '130rpx'
			},
			type: {
				type: String,
				default: 'text'
			},
			mode: {
				type: String,
				default: 'row'
			},
			required: {
				type: Boolean,
				default: false
			},
			customStyle: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				innerType: ''
			};
		},
		created() {
			this.innerType = this.type
		}
	}
</script>

<style lang="scss">
	.my-input-view {
		width: 100%;
	}

	.my-input {
		margin: 0 auto;
		margin-bottom: 20rpx;
		border-bottom: 1px solid #efefef;

		.label {
			font-size: 30rpx;

			text {
				color: red;
			}
		}

		input {
			font-size: 30rpx;
		}
	}

	.column {
		.label {
			font-size: 30rpx;
			margin-bottom: 15rpx;
		}

		input {
			height: 70rpx;
			font-size: 30rpx;
		}
	}
</style>