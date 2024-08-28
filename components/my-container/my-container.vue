<template>
    <!-- 全局功能（使用本组件作为页面根元素）-->
    <x-container :theme-style="themeStyle[globalStore.theme]" :custom-style="customStyle" @container-style="change">
        <slot></slot>
    </x-container>
    <x-loading v-if="globalStore.loading" z-index="99999" mask-bg-color="rgba(0, 0, 0, 0.1)" @click="globalStore.setLoading(false)">
        <self-building-square-spinner :animation-duration="5000" :size="50" :color="globalStore.containerStyle['--theme-color']" />
    </x-loading>
</template>

<script>
    // uni.$uvCommonProps = {
    //     cancelText: {
    //         default: 'Cancel'
    //     },
    //     cancelColor: {
    //         default: '#333'
    //     },
    //     confirmText: {
    //         default: 'Confirm'
    //     },
    //     confirmColor: {
    //         default: 'var(--theme-color)'
    //     },
    // }
    import { useGlobalStore } from '@/stores/global.js'
    import { themeStyle } from '@/common/themeStyle.js'

    export default {
        name: "my-container",
        setup() {
            const globalStore = useGlobalStore()
            return { globalStore }
        },
        data() {
            // #ifdef MP
            const menuRect = uni.getMenuButtonBoundingClientRect()
            const { screenWidth } = uni.getSystemInfoSync()
            // #endif
            return {
                themeStyle,
                customStyle: {
                    // #ifdef MP
                    '--x-safe-top': menuRect.bottom + 'px',
                    '--x-safe-right': screenWidth - menuRect.left + 'px',
                    // #endif
                }
            };
        },
        methods: {
            change(e) {
                this.$emit('container-style', e)
                this.globalStore.setContainerStyle(e)
            }
        }
    }
</script>