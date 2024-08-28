<template>
    <view class="x-dropdown">
        <view class="dropdown_head" :style="headStyle">
            <slot name="head" :bodyShow="modelValue"></slot>
        </view>
        <view class="dropdown_body" ref="dropdown" :style="[bodyStyle, modelValue ? activeStyle : {}]" :class="{'dropdown_active': modelValue}">
            <slot name="body" :bodyShow="modelValue"></slot>
        </view>
    </view>
</template>

<script>
    export default {
        name: 'x-dropdown',
        props: {
            modelValue: {
                type: Boolean,
                default: false
            },
            headStyle: {
                type: Object,
                default: () => {}
            },
            bodyStyle: {
                type: Object,
                default: () => {}
            },
            activeStyle: {
                type: Object,
                default: () => {}
            }
        }
    }
</script>

<style lang='scss'>
    .x-dropdown {
        z-index: 999;
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .dropdown_head {
        position: relative;
        z-index: 100;
    }

    .dropdown_body {
        z-index: 99;
        position: absolute;
        top: 0;
        visibility: hidden;
        opacity: 0;
        transition: all 0.3s;
    }

    .dropdown_active {
        top: 100%;
        visibility: visible;
        opacity: 1;
    }
</style>