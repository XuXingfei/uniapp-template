<template>
    <view class="x-loading" @touchmove.stop.prevent="() => {}" @click="$emit('click', $event)">
        <view v-if="mask" class="mask" :style="[maskStyle, maskCustomStyle]">
            <slot>
                <self-building-square-spinner :animation-duration="6000" :size="40" color="skyblue" />
            </slot>
        </view>
        <view v-else class="fixed_center" :style="{zIndex, top: systemInfo.windowHeight / 2 + 'px'}">
            <slot>
                <self-building-square-spinner :animation-duration="6000" :size="40" color="skyblue" />
            </slot>
        </view>
    </view>
</template>
<script>
    export default {
        name: 'x-loading',
        props: {
            zIndex: {
                type: [String, Number],
                default: 999
            },
            mask: {
                type: Boolean,
                default: true
            },
            maskBgColor: {
                type: String,
                default: 'rgba(0, 0, 0, 0.1)'
            },
            maskCustomStyle: {
                type: Object,
                default: () => {}
            }
        },
        emits: ['click'],
        data() {
            return {
                systemInfo: uni.getSystemInfoSync()
            }
        },
        computed: {
            maskStyle() {
                return {
                    width: this.systemInfo.windowWidth + 'px',
                    height: this.systemInfo.windowHeight + 'px',
                    background: this.maskBgColor,
                    zIndex: this.zIndex
                }
            }
        }
    }
</script>
<style lang="scss">
    .x-loading {

        .mask {
            position: fixed;
            left: 0;
            top: 0;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .fixed_center {
            position: fixed;
            left: 375rpx;
            transform: translate(-50%, -50%);
        }
    }
</style>