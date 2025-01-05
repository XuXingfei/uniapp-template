<template>
    <view class="x-fade-in-top" :style="{ top: opacity > 0 ? '0' : '-200%', zIndex }">
        <view class="slot-container" :style="[{ background: bgColor, opacity }, customStyle]">
            <x-placeholder v-if="safeArea"></x-placeholder>
            <slot></slot>
        </view>
    </view>
</template>

<script>
    import { queryElementRect } from '@/uni_modules/x-tools/tools/sugar.js'
    export default {
        name: 'x-fade-in-top',
        props: {
            scrollTop: {
                type: Number,
                required: true
            },
            zIndex: {
                type: [String, Number],
                default: 999
            },
            bgColor: {
                type: String,
                default: 'var(--theme-color)'
            },
            safeArea: {
                type: Boolean,
                default: false
            },
            customStyle: {
                type: Object,
                default: () => ({})
            }
        },
        emits: ['change'],
        data() {
            return {
                slotHeight: 0
            }
        },
        computed: {
            opacity() {
                let opacity = 0
                if (this.scrollTop > this.slotHeight) {
                    opacity = 1
                } else {
                    opacity = this.scrollTop / this.slotHeight
                }
                if (isNaN(opacity)) opacity = 0
                this.$emit('change', {
                    ...this.$data,
                    opacity
                })
                return opacity.toFixed(2)
            },
        },
        mounted() {
            this.queryElementRect(`.slot-container`).then(res => {
                this.slotHeight = res.height
            })
        },
        methods: {
            queryElementRect
        }
    }
</script>

<style lang="scss" scoped>
    .x-fade-in-top {
        position: fixed;
        top: 0;
        left: 0;

        .slot-container {
            width: 750rpx;
            background-color: #fff;
        }
    }
</style>