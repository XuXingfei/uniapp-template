export default {
	props: {
		// 是否显示遮罩
		show: {
			type: Boolean,
			default: false
		},
		// 层级z-index
		zIndex: {
			type: [String, Number],
			default: 10070
		},
		// 遮罩的过渡时间，单位为ms
		duration: {
			type: [String, Number],
			default: 300
		},
		// 不透明度值，当做rgba的第四个参数
		opacity: {
			type: [String, Number],
			default: 0.5
		},
		...uni.$uvCommonProps, ...uni.$uv?.props?.overlay
	}
}