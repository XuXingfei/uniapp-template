<template>
    <view class="x-fixed-header" :style="{width, height: (height || containerHeight) + 'px'}">
        <view class="fixed-header-container" :style="[innerStyle, customStyle]">
            <x-placeholder v-if="safeArea"></x-placeholder>
            <slot></slot>
        </view>
    </view>
</template>

<script>
    import { queryElementRect } from '@/uni_modules/x-tools/tools/sugar.js'
    import { getCurrentPagePath } from '@/uni_modules/x-tools/tools/index.js'
    import { commonProps } from '@/uni_modules/x-tools/tools/com.js'
    export default {
        name: "x-fixed-header",
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
                default: false
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
            queryElementRect,
            setHeight() {
                this.queryElementRect('.fixed-header-container').then(res => {
                    if (this.pagePath != getCurrentPagePath()) return
                    this.containerHeight = res.height
                    this.$emit('height', this.containerHeight)
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    .fixed-header-container {
        position: fixed;
        left: 0;
        top: var(--window-top);
        width: 750rpx;
    }
</style>