<template>
    <view class="my-status-bar-mask" :style="{top: containerOpacity > 0 ? '0' : '-200%', zIndex}">
        <view class="slot-container" :style="{background:bgColor, opacity: containerOpacity}">
            <x-placeholder v-if="safeArea"></x-placeholder>
            <slot></slot>
        </view>
    </view>
</template>

<script>
    export default {
        name: 'my-status-bar-mask',
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
                type: String
            },
            safeArea: {
                type: Boolean,
                default: true
            },
        },
        data() {
            return {
                slotHeight: 0
            }
        },
        computed: {
            containerOpacity() {
                let opacity = 0
                if (this.scrollTop > this.slotHeight) {
                    opacity = 1
                } else {
                    opacity = this.scrollTop / this.slotHeight
                }
                if (isNaN(opacity)) opacity = 0
                return opacity.toFixed(2)
            },
            info() {
                const data = {
                    ...this.$data,
                    opacity: this.containerOpacity
                }
                this.$emit('info', data)
                return data
            }
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
    .my-status-bar-mask {
        position: fixed;
        top: 0;
        left: 0;

        .slot-container {
            width: 750rpx;
            background-color: #fff;
        }
    }
</style>