<template>
    <view class="x-filter-bg" :style="[{ width, height, margin, borderRadius: radius }, customStyle]" @click="$emit('click', $event)">
        <view class="slot-view" :style="[slotStyle]">
            <slot></slot>
        </view>
        <view class="bg-view" :style="[{ backgroundImage: `url(${src})`, filter: filter || `blur(${blur})`, backgroundColor: bgColor }, bgStyle]">
        </view>
    </view>
</template>

<script>
    export default {
        name: 'x-filter-bg',
        props: {
            width: {
                type: String,
                default: '100%'
            },
            height: {
                type: String,
                required: true
            },
            margin: {
                type: String,
                default: '24rpx auto'
            },
            radius: {
                type: String,
                default: '24rpx'
            },
            src: {},
            bgColor: {
                type: String,
                default: 'skyblue'
            },
            blur: {
                type: String,
                default: '10px'
            },
            filter: {
                type: String // 参考: https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter
            },
            slotStyle: {
                type: Object,
                default: () => ({})
            },
            bgStyle: {
                type: Object,
                default: () => ({})
            },
            customStyle: {
                type: Object,
                default: () => ({})
            }
        },
        emits: ['click'],
    }
</script>

<style lang="scss">
    .x-filter-bg {
        position: relative;
        width: 100%;
        height: auto;
        overflow: hidden;

        .slot-view,
        .bg-view {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
        }

        .slot-view {
            z-index: 1;
        }

        .bg-view {
            z-index: 0;
            width: inherit;
            height: inherit;
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;
        }
    }
</style>