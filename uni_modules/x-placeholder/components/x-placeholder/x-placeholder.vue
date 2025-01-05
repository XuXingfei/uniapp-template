<template>
    <view class="x-placeholder" :style="[innerStyle, customStyle]"></view>
</template>

<script>
    import { str2px, commonProps } from '@/uni_modules/x-tools/tools/com.js'
    export default {
        name: 'x-placeholder',
        props: {
            // 是否顶部占位
            isTop: {
                type: Boolean,
                default: true
            },
            height: {
                type: [String, Number],
                default: '0'
            },
            ...commonProps
        },
        data() {
            return {
                sysInfo: uni.getSystemInfoSync()
            }
        },
        computed: {
            innerStyle() {
                const { isTop, height, bgColor, sysInfo } = this
                return {
                    width: '1px',
                    height: str2px(height) + (isTop ? sysInfo.statusBarHeight : sysInfo.safeAreaInsets.bottom) + 'px',
                    background: bgColor
                }
            },
        },
    }
</script>