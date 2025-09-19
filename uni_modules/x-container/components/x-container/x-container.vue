<template>
    <view :class="customClass" :style="[innerStyle, themeStyle, customStyle]">
        <slot></slot>
    </view>
</template>

<script>
    // 添加额外的 css 变量
    const externalStyle = {
        '--color-0': '#000'
    }
    export default {
        name: 'x-container',
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
        emits: ['container-style'],
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
                    '--x-safe-right': '0px',
                    // #ifdef MP
                    '--x-safe-top': menuRect.bottom + 'px',
                    '--x-safe-right': screenWidth - menuRect.left + 'px',
                    // #endif
                    ...externalStyle
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