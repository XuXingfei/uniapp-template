<template>
    <view class="x-fixed-footer" :style="{width, height: (str2px(height) || containerHeight) + 'px'}">
        <view class="fixed-footer-container" :style="[innerStyle, customStyle]">
            <slot></slot>
            <x-placeholder v-if="safeArea"></x-placeholder>
        </view>
    </view>
</template>

<script>
    import { queryElementRect } from '@/uni_modules/x-tools/tools/sugar.js'
    import { getCurrentPagePath } from '@/uni_modules/x-tools/tools/index.js'
    import { commonProps, str2px } from '@/uni_modules/x-tools/tools/com.js'
    export default {
        name: "x-fixed-footer",
        props: {
            // 占位元素宽度
            width: {
                type: String,
                default: '1px'
            },
            // 占位元素高度（一般不设置获取子元素高度）
            height: {
                type: [Number, String],
                default: 0
            },
            // 内边距
            padding: {
                type: String,
                default: ''
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
            ...commonProps
        },
        emits: ['height'],
        data() {
            return {
                containerHeight: 0,
                pagePath: getCurrentPagePath()
            };
        },
        computed: {
            innerStyle() {
                const { zIndex, padding, bgColor } = this
                return {
                    zIndex,
                    padding,
                    background: bgColor,
                }
            }
        },
        mounted() {
            this.setHeight()
        },
        updated() {
            this.setHeight()
        },
        methods: {
            str2px,
            queryElementRect,
            setHeight() {
                this.queryElementRect('.fixed-footer-container').then(res => {
                    if (this.pagePath != getCurrentPagePath()) return
                    this.containerHeight = res.height
                    this.$emit('height', this.containerHeight)
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    .fixed-footer-container {
        position: fixed;
        left: 0;
        bottom: var(--window-bottom);
        width: 750rpx;
    }
</style>