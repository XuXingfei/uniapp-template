<template>
    <view :class="customClass" :style="[innerStyle, themeStyle, customStyle]">
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
            customClass: {
                type: String,
                default: ''
            },
        },
        computed: {
            innerStyle() {
                // #ifdef MP
                const menuRect = uni.getMenuButtonBoundingClientRect()
                // #endif
                const { statusBarHeight, safeAreaInsets, screenWidth } = uni.getSystemInfoSync()
                return {
                    '--x-status-bar-height': statusBarHeight + 'px',
                    '--x-safe-top': safeAreaInsets.top + 'px',
                    '--x-safe-bottom': safeAreaInsets.bottom + 'px',
                    // #ifdef MP
                    '--x-safe-top': menuRect.bottom + 'px',
                    '--x-safe-right': screenWidth - menuRect.left + 'px',
                    // #endif
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