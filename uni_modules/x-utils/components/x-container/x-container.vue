<template>
    <view :style="[innerStyle, themeStyle, customStyle]">
        <slot></slot>
    </view>
</template>

<script>
    export default {
        props: {
            // 示例: { '--theme-color': 'skyblue' }
            themeStyle: {
                type: Object
            },
            customStyle: {
                type: Object
            },
        },
        computed: {
            innerStyle() {
                const { statusBarHeight, safeAreaInsets } = uni.getSystemInfoSync()
                return {
                    '--x-status-bar-height': statusBarHeight + 'px',
                    '--x-safe-top': safeAreaInsets.top + 'px',
                    '--x-safe-bottom': safeAreaInsets.bottom + 'px',
                }
            }
        },
        created() {
            this.$emit('container-style', Object.assign({}, this.innerStyle, this.themeStyle, this.customStyle))
        },
        updated() {
            this.$emit('container-style', Object.assign({}, this.innerStyle, this.themeStyle, this.customStyle))
        }
    }
</script>