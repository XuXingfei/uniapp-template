<template>
    <text class="x-amount">
        <text :style="{ color: symbolColor ? symbolColor : color, fontSize: fontSize / scale + 'rpx', fontWeight: bold ? 'bold' : 'normal', textDecoration: isLineThrough ? 'line-through' : ''}">
            {{ symbol }}
        </text>
        <text :style="{ color, fontSize: fontSize + 'rpx', fontWeight: bold ? 'bold' : 'normal', textDecoration: isLineThrough ? 'line-through' : ''}">
            {{ amount }}
        </text>
    </text>
</template>

<script>
    export default {
        name: "x-amount",
        props: {
            // 金额颜色
            color: {
                type: String,
                default: '#000'
            },
            // 金额
            amount: {
                type: Number,
                default: 0
            },
            // 符号颜色
            symbolColor: {
                type: String,
            },
            // 符号
            symbol: {
                type: String,
                default: '￥'
            },
            // 字体大小
            fontSize: {
                type: [Number, String],
                default: 50
            },
            // 是否加粗
            bold: {
                type: Boolean,
                default: true
            },
            // 缩放比
            scale: {
                type: [Number, String],
                default: 1.5
            },
            // 删除线
            isLineThrough: {
                type: Boolean,
                default: false
            },
        }
    }
</script>

<style lang="scss" scoped>
    .x-amount {
        font-family: PingFang SC-Bold, PingFang SC;

        >text {
            &:first-child {
                font-size: 24rpx;
                color: #000;
            }
        }

    }
</style>