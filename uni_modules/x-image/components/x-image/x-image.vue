<template>
    <view class="x-image">
        <image v-if="src" :class="customClass" :style="[innerSize, customStyle]" :src="innerSrc" :mode="mode" :show-menu-by-longpress="showMenuByLongpress" @error="$emit('error', $event)"
            @load="$emit('load', $event)" @click="$emit('click', $event)">
        </image>
    </view>
</template>

<script>
    import { queryElementRect } from '@/uni_modules/x-tools/tools/sugar.js'
    import { commonProps } from '@/uni_modules/x-tools/tools/com.js'
    import { cacheFile } from '@/uni_modules/x-cacheFile/js_sdk/index.js'

    /**
     * @description 图片组件
     * @property {String} src 图片资源地址
     * @property {String} placeholderSrc 占位图片资源地址（传入开启图片懒加载）
     * @property {String} mode 图片裁剪、缩放的模式，详见 https://uniapp.dcloud.net.cn/component/image.html#mode-%E6%9C%89%E6%95%88%E5%80%BC
     * 	@value scaleToFill 不保持纵横比缩放图片，使图片的宽高完全拉伸至填满 image 元素
     * 	@value widthFix 宽度不变，高度自动变化，保持原图宽高比不变
     * 	@value heightFix 高度不变，宽度自动变化，保持原图宽高比不变
     * 	@value aspectFit 保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来。
     * 	@value aspectFill 保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。
     * @property {Boolean} showMenuByLongpress 开启长按图片显示识别小程序码菜单
     * @property {Number} scrollTop 页面在垂直方向已滚动的距离（单位px）
     * @property {Number} scrollLeft 页面在水平方向已滚动的距离（单位px）
     * @property {Number} scrollAreaHeight 滚动区域高度, 默认 windowHeight（单位px）注意：不同平台滚动区域高度有差异
     * @property {Number} scrollAreaWidth 滚动区域宽度, 默认 windowWidth（单位px）
     * @property {Number} offsetTop 滚动区域距离顶部偏移量，使用 scroll-view 通常需要传入（单位px）
     * @property {Number} offsetLeft 滚动区域距离左侧偏移量，使用 scroll-view 通常需要传入（单位px）
     * @property {String} direction 滚动方向，支持 'vertical'、'horizontal'、'both'（默认 vertical）
     *  @value vertical 垂直方向（默认）
     *  @value horizontal 水平方向
     *  @value both 两个方向
     * @property {String} cacheImage 是否缓存图片（默认开启）
     * @property {String} customClass 自定义 class
     * @property {String} customStyle 自定义 style
     * @property {String} size 图片大小（优先级低于width/height）
     * @property {String} width 图片宽度（优先级高于size）
     * @property {String} height 图片高度（优先级高于size）
     */
    export default {
        name: 'x-image',
        props: {
            ...commonProps,
            src: {
                type: String
            },
            placeholderSrc: {
                type: String,
                default: ''
            },
            mode: {
                type: String,
                default: 'aspectFill'
            },
            showMenuByLongpress: {
                type: Boolean,
                default: false
            },
            scrollTop: {
                type: Number,
                default: 0
            },
            scrollLeft: {
                type: Number,
                default: 0
            },
            scrollAreaHeight: {
                type: Number,
                default: () => uni.getSystemInfoSync().windowHeight
            },
            scrollAreaWidth: {
                type: Number,
                default: () => uni.getSystemInfoSync().windowWidth
            },
            offsetTop: {
                type: Number,
                default: 0
            },
            offsetLeft: {
                type: Number,
                default: 0
            },
            direction: {
                type: String,
                default: 'vertical',
                validator: value => ['vertical', 'horizontal', 'both'].includes(value)
            },
            cacheImage: {
                type: Boolean,
                default: true
            },
            customClass: {
                type: String,
                default: ''
            },
            size: {
                type: String,
                default: ''
            },
            width: {
                type: String,
                default: ''
            },
            height: {
                type: String,
                default: ''
            }
        },
        emits: ['error', 'load', 'click'],
        data() {
            return {
                innerSrc: '',
                imageRect: {},
                getFilePathFlag: false,
                showPlaceholder: false
            };
        },
        watch: {
            scrollTop: {
                handler(val) {
                    this.scrollHandler(val)
                },
                immediate: true
            },
            scrollLeft: {
                handler(val) {
                    this.scrollHandler(val)
                },
                immediate: true
            },
            src: {
                handler(val) {
                    if (val) {
                        this.$nextTick(() => {
                            this.init()
                        })
                    } else {
                        this.innerSrc = ''
                        this.showPlaceholder = false
                    }
                },
                immediate: true
            }
        },
        computed: {
            innerSize() {
                const { size, width, height } = this
                return {
                    width: width || size,
                    height: height || size
                }
            }
        },
        mounted() {},
        methods: {
            queryElementRect,
            async init() {
                if (this.placeholderSrc) {
                    this.innerSrc = this.cacheImage ? await cacheFile.getFilePathByUrl(this.placeholderSrc, 1000) : this.placeholderSrc
                    this.showPlaceholder = true
                } else {
                    this.setSrc()
                }

                try {
                    const res = await this.queryElementRect('.x-image')
                    this.imageRect = res
                    // console.log('imageRect', this.imageRect)
                    this.scrollHandler()
                } catch (error) {
                    console.error('获取元素位置失败:', error)
                }
            },
            scrollHandler() {
                if (!this.placeholderSrc || !this.showPlaceholder) return

                const shouldLoad = this.checkIfShouldLoad()
                if (shouldLoad) {
                    this.setSrc()
                }
            },
            checkIfShouldLoad() {
                // 确保有元素位置信息
                if (!this.imageRect || Object.keys(this.imageRect).length === 0) {
                    return false
                }

                switch (this.direction) {
                    case 'vertical':
                        return this.checkVerticalScroll()
                    case 'horizontal':
                        return this.checkHorizontalScroll()
                    case 'both':
                        return this.checkVerticalScroll() && this.checkHorizontalScroll()
                    default:
                        return this.checkVerticalScroll()
                }
            },
            checkVerticalScroll() {
                const { height, top } = this.imageRect
                if (height === undefined || top === undefined) return false

                const showHeight = this.scrollTop + this.scrollAreaHeight
                return showHeight >= top - this.offsetTop
            },
            checkHorizontalScroll() {
                const { width, left } = this.imageRect
                if (width === undefined || left === undefined) return false

                const showWidth = this.scrollLeft + this.scrollAreaWidth
                return showWidth >= left - this.offsetLeft
            },
            setSrc() {
                if (!this.src) return

                if (!this.cacheImage) {
                    this.innerSrc = this.src
                    this.showPlaceholder = false
                    return
                }

                if (!this.getFilePathFlag) {
                    this.getFilePathFlag = true
                    cacheFile.getFilePathByUrl(this.src).then(res => {
                        // console.log('setSrc', res)
                        this.innerSrc = res
                        this.showPlaceholder = false
                    }).finally(() => {
                        this.getFilePathFlag = false
                    })
                }
            }
        },
    };
</script>

<style lang="scss" scoped>
    .x-image {}
</style>