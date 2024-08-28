<template>
    <view class="x-fixed-footer" :style="{width: width + 'rpx', height: (height || containerHeight) + 'px'}">
        <view ref="fixedFooterContainer" class="fixed-footer-container" :style="[{zIndex, padding, background: bgColor}, customStyle]">
            <slot></slot>
            <x-placeholder v-if="safeArea" :is-top="false"></x-placeholder>
        </view>
    </view>
</template>

<script>
    // #ifdef APP-NVUE
    const dom = weex.requireModule('dom')
    // #endif
    export default {
        name: "x-fixed-footer",
        props: {
            // 占位元素宽度
            width: {
                type: [Number, String],
                default: 1
            },
            // 占位元素高度
            height: {
                type: [Number, String],
                default: 0
            },
            // 固定元素层级
            zIndex: {
                type: [Number, String],
                default: 9
            },
            // 是否开启安全区域适配
            safeArea: {
                type: Boolean,
                default: true
            },
            // 背景色
            bgColor: {
                type: String,
                default: 'transparent'
            },
            // 内边距
            padding: {
                type: String,
                default: ''
            },
            // 固定元素样式
            customStyle: {
                type: Object,
                default: () => {
                    return {}
                }
            }
        },
        data() {
            return {
                containerHeight: 0
            };
        },
        mounted() {
            this.setHeight()
        },
        updated() {
            this.setHeight()
        },
        methods: {
            setHeight() {
                // #ifndef APP-NVUE
                this.queryElementRect('.fixed-footer-container').then(res => {
                    this.containerHeight = res.height
                    this.$emit('height', this.containerHeight)
                })
                // #endif
                // #ifdef APP-NVUE
                setTimeout(() => {
                    dom.getComponentRect(this.$refs.fixedFooterContainer, option => {
                        this.containerHeight = option.size
                        this.$emit('height', this.containerHeight)
                    })
                }, 500)
                // #endif
            },
            queryElementRect(selector) {
                if (Array.isArray(selector)) return Promise.all(selector.map(i => this.queryElementRect(i)))
                return new Promise(resolve => {
                    uni.createSelectorQuery()
                        .in(this).select(selector)
                        .boundingClientRect(resolve)
                        .exec();
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .fixed-footer-container {
        position: fixed;
        left: 0;
        bottom: var(--window-bottom);
        /* #ifdef APP-NVUE */
        bottom: 0;
        /* #endif */
        width: 750rpx;
        background-color: #fff;
    }
</style>