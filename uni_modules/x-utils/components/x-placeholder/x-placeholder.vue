<template>
    <view :style="{width:'1px', height: height + (isTop ? systemInfo.statusBarHeight : systemInfo.safeAreaInsets.bottom) + 'px'}"></view>
</template>

<script>
    export default {
        props: {
            isTop: {
                type: Boolean,
                default: true
            },
            height: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                systemInfo: uni.getSystemInfoSync()
            }
        }
    }
</script>