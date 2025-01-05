<template>
    <!-- 全局功能（使用本组件作为页面根元素）-->
    <x-container :custom-class="customClass" :theme-style="themeStyle[theme]" :custom-style="customStyle" @container-style="change">
        <slot></slot>
        <x-loading v-if="loading" z-index="99999" mask-bg-color="rgba(0, 0, 0, 0.1)" @click="setLoading(false)">
            <self-building-square-spinner :animation-duration="5000" :size="50" :color="containerStyle['--theme-color']" />
        </x-loading>
    </x-container>
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
    import { mapState, mapActions } from "pinia"
    export default {
        name: "my-container",
        props: {
            customClass: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                themeStyle,
                customStyle: {
                    // '--x-status-bar-height': '0px', 覆盖 x-container 的 innerStyle
                }
            };
        },
        computed: {
            ...mapState(useGlobalStore, ['theme', 'containerStyle', 'loading'])
        },
        methods: {
            ...mapActions(useGlobalStore, ['setLoading', 'setContainerStyle']),
            change(e) {
                this.$emit('container-style', e)
                this.setContainerStyle(e)
            }
        }
    }
</script>