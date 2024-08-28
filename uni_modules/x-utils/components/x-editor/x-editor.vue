<template>
	<view class="x-editor">
		<view class="editor-wrapper" :style="[{height: contentHieght}, contentCustomStyle]">
			<editor id="editor" class="editor-container" :placeholder="placeholder" show-img-size show-img-toolbar show-img-resize @statuschange="onStatusChange" :read-only="readOnly"
				@ready="onEditorReady" @focus="$emit('focus', $event)" @blur="$emit('blur', $event)" @input="$emit('input', $event)">
			</editor>
		</view>
		<view class='toolbar' :style="{height: toolbarHieght, color: toolDeactiveColor}" @tap="format">
			<view :style="{color: formats.bold ? toolActiveColor : '' }" class="iconfont icon-zitijiacu" data-name="bold"></view>
			<view :style="{color: formats.italic ? toolActiveColor : ''}" class="iconfont icon-zitixieti" data-name="italic"></view>
			<view :style="{color: formats.underline ? toolActiveColor : ''}" class="iconfont icon-zitixiahuaxian" data-name="underline"></view>
			<view :style="{color: formats.strike ? toolActiveColor : ''}" class="iconfont icon-zitishanchuxian" data-name="strike"></view>
			<!-- #ifndef MP-BAIDU -->
			<view :style="{color: formats.align === 'left' ? toolActiveColor : ''}" class="iconfont icon-zuoduiqi" data-name="align" data-value="left"></view>
			<!-- #endif -->
			<view :style="{color: formats.align === 'center' ? toolActiveColor : ''}" class="iconfont icon-juzhongduiqi" data-name="align" data-value="center"></view>
			<view :style="{color: formats.align === 'right' ? toolActiveColor : ''}" class="iconfont icon-youduiqi" data-name="align" data-value="right"></view>
			<view :style="{color: formats.align === 'justify' ? toolActiveColor : ''}" class="iconfont icon-zuoyouduiqi" data-name="align" data-value="justify"></view>
			<!-- #ifndef MP-BAIDU -->
			<view :style="{color: formats.lineHeight ? toolActiveColor : ''}" class="iconfont icon-line-height" data-name="lineHeight" data-value="2"></view>
			<view :style="{color: formats.letterSpacing ? toolActiveColor : ''}" class="iconfont icon-Character-Spacing" data-name="letterSpacing" data-value="2em"></view>
			<view :style="{color: formats.marginTop ? toolActiveColor : ''}" class="iconfont icon-722bianjiqi_duanqianju" data-name="marginTop" data-value="20px"></view>
			<view :style="{color: formats.marginBottom ? toolActiveColor : ''}" class="iconfont icon-723bianjiqi_duanhouju" data-name="marginBottom" data-value="20px"></view>
			<!-- #endif -->


			<!-- #ifndef MP-BAIDU -->
			<!-- <view :style="{color: formats.fontFamily ? toolActiveColor : ''}" class="iconfont icon-font" data-name="fontFamily" data-value="Pacifico"></view> -->
			<view :style="{color: formats.fontSize === '24px' ? toolActiveColor : ''}" class="iconfont icon-fontsize" data-name="fontSize" data-value="24px"></view>
			<!-- #endif -->
			<view :style="{color: formats.color === '#0000ff' ? toolActiveColor : ''}" class="iconfont icon-text_color" data-name="color" data-value="#0000ff"></view>
			<view :style="{color: formats.backgroundColor === '#00ff00' ? toolActiveColor : ''}" class="iconfont icon-fontbgcolor" data-name="backgroundColor" data-value="#00ff00"></view>

			<view class="iconfont icon--checklist" data-name="list" data-value="check"></view>
			<view :style="{color: formats.list === 'ordered' ? toolActiveColor : ''}" class="iconfont icon-youxupailie" data-name="list" data-value="ordered"></view>
			<view :style="{color: formats.list === 'bullet' ? toolActiveColor : ''}" class="iconfont icon-wuxupailie" data-name="list" data-value="bullet"></view>

			<view class="iconfont icon-outdent" data-name="indent" data-value="-1"></view>
			<view class="iconfont icon-indent" data-name="indent" data-value="+1"></view>

			<view :style="{color: formats.header === 1 ? toolActiveColor : ''}" class="iconfont icon-format-header-1" data-name="header" :data-value="1"></view>
			<view :style="{color: formats.script === 'sub' ? toolActiveColor : ''}" class="iconfont icon-zitixiabiao" data-name="script" data-value="sub"></view>
			<view :style="{color: formats.script === 'super' ? toolActiveColor : ''}" class="iconfont icon-zitishangbiao" data-name="script" data-value="super"></view>

			<view :style="{color: formats.direction === 'rtl' ? toolActiveColor : ''}" class="iconfont icon-direction-rtl" data-name="direction" data-value="rtl"></view>

			<view class="iconfont icon-fengexian" @tap="insertDivider"></view>
			<view class="iconfont icon-date" @tap="insertDate"></view>
			<view class="iconfont icon-charutupian" @tap="insertImage"></view>
			<view class="iconfont icon-undo" @tap="undo"></view>
			<view class="iconfont icon-redo" @tap="redo"></view>
			<view class="iconfont icon-clearedformat" @tap="removeFormat"></view>
			<view class="iconfont icon-shanchu" @tap="clear"></view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			placeholder: {
				type: String,
				default: '开始输入...'
			},
			readOnly: {
				type: Boolean,
				default: false
			},
			uploadImgFun: {
				type: Function
			},
			contentHieght: {
				type: String,
				default: '400rpx'
			},
			contentCustomStyle: {
				type: Object
			},
			toolbarHieght: {
				type: String,
			},
			toolActiveColor: {
				type: String,
				default: 'skyblue'
			},
			toolDeactiveColor: {
				type: String,
				default: '#000'
			}
		},
		data() {
			return {
				formats: {}
			}
		},
		created() {
			// // #ifndef MP-BAIDU 
			// uni.loadFontFace({
			// 	family: 'Pacifico',
			// 	source: 'url("https://sungd.github.io/Pacifico.ttf")'
			// })
			// // #endif
		},
		mounted() {},
		methods: {


			readOnlyChange() {
				this.readOnly = !this.readOnly
			},
			onEditorReady() {
				// #ifdef MP-BAIDU
				this.editorCtx = requireDynamicLib('editorLib').createEditorContext('editor');
				// #endif

				// #ifdef APP-PLUS || MP-WEIXIN || H5
				uni.createSelectorQuery().in(this).select('#editor').context((res) => {
					this.editorCtx = res.context
				}).exec()
				// #endif
			},
			undo() {
				this.editorCtx.undo()
			},
			redo() {
				this.editorCtx.redo()
			},
			format(e) {
				let {
					name,
					value
				} = e.target.dataset
				if (!name) return
				// console.log('format', name, value)
				this.editorCtx.format(name, value)
			},
			onStatusChange(e) {
				const formats = e.detail
				this.formats = formats
			},
			insertDivider() {
				this.editorCtx.insertDivider({
					success: function() {
						console.log('insert divider success')
					}
				})
			},
			clear() {
				uni.showModal({
					title: '清空编辑器',
					content: '确定清空编辑器全部内容？',
					success: res => {
						if (res.confirm) {
							this.editorCtx.clear({
								success: function(res) {
									console.log("clear success")
								}
							})
						}
					}
				})
			},
			removeFormat() {
				this.editorCtx.removeFormat()
			},
			insertDate() {
				const date = new Date()
				const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
				this.editorCtx.insertText({
					text: formatDate
				})
			},
			insertImage() {
				if (this.uploadImgFun) {
					this.uploadImgFun(src => {
						if (typeof src != 'string') return console.error('src 应为 String')
						if (!src.startsWith('http')) return console.error('src 应为图片的全路径')
						this.editorCtx.insertImage({
							src,
							alt: '',
							success: res => {
								console.log(res);
							},
							fail: err => {
								console.log(err);
							}
						})
					})
				} else {
					console.error('请传入上传图片方法')
				}
			}
		}
	}
</script>

<style>
	@import "./editor-icon.css";

	.editor-wrapper {
		height: 600rpx;
		background: #fff;
	}

	.iconfont {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 60rpx;
		height: 60rpx;
		margin-right: 20rpx;
		margin-bottom: 25rpx;
		cursor: pointer;
		font-size: 40rpx;
	}

	.iconfont:nth-child(9n) {
		margin-right: 0;
	}

	.toolbar {
		padding: 25rpx;
		display: flex;
		flex-wrap: wrap;
		box-sizing: border-box;
		font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
		overflow-y: auto;
	}

	.editor-container {
		box-sizing: border-box;
		padding: 25rpx;
		font-size: 32rpx;
		line-height: 1.5;
	}
</style>