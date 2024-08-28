<template>
    <view class="x-fade-in-top" :style="{ top: opacity > 0 ? '0' : '-200%', zIndex }">
        <view class="slot-container" :style="[{ background: bgColor, opacity }, customStyle]">
            <x-placeholder v-if="safeArea"></x-placeholder>
            <slot></slot>
        </view>
    </view>
</template>

<script>
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
            queryElementRect(selector) {
                if (Array.isArray(selector)) return Promise.all(selector.map(i => this.queryElementRect(i)))
                return new Promise(resolve => {
                    uni.createSelectorQuery()
                        .in(this).select(selector)
                        .boundingClientRect(resolve)
                        .exec();
                })
            }
        }
    }
</script>

<style lang="scss">
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