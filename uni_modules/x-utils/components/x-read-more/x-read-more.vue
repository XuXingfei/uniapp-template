<template>
    <view class="read-more" :style="{color : fontColor}">
        <view v-if="isLongContent && !isWatchMore" class="content-1" :style="{height: showRow * lineHeight + unit,lineHeight:lineHeight + unit,fontSize:fontSize + unit}">
            <text>{{ content }}</text>
            <view class="watchMore" :style="{lineHeight: lineHeight + unit,fontSize:fontSize + unit}">
                ...<text :style="{lineHeight: lineHeight + unit,fontSize:fontSize + unit}" @click="watchMore">全文</text>
            </view>
        </view>
        <view v-else-if="isLongContent && isWatchMore" class="content-2" :style="{lineHeight: lineHeight + unit,fontSize:fontSize + unit}">
            <text>{{ content }}</text>
            <text class="packUp" @click="watchMore">收起</text>
        </view>
        <view v-else class="content-3" :style="{lineHeight: lineHeight + unit,fontSize:fontSize + unit}">
            <text>{{ content }}</text>
        </view>
    </view>
</template>
<script>
    export default {
        data() {
            return {
                isWatchMore: false,
                isLongContent: false,
            };
        },
        props: {
            unit: {
                type: String,
                default: 'px' // px or rpx
            },
            fontSize: {
                type: [Number, String],
                default: 12,
            },
            fontColor: {
                type: String,
                default: '#000'
            },
            lineHeight: {
                type: [Number, String],
                default: 20,
            },
            showRow: {
                type: [Number, String],
                default: 4,
            },
            content: {
                type: String,
            }
        },
        created() {},
        mounted() {
            this.$nextTick(function() {
                this.init();
            });
        },
        updated() {
            this.init();
        },
        methods: {
            watchMore() {
                this.isWatchMore = !this.isWatchMore;
            },
            init() {
                this.queryElementRect('.content-3').then(res => {
                    // console.log(this.content, res.height);
                    // 判断高度，如果真实内容高度大于占位高度，则显示收起与展开的控制按钮
                    // if (res.height > uni.upx2px(this.lineHeight * this.showRow)) {
                    if (res.height > (this.unit == 'px' ? this.lineHeight * this.showRow : uni.upx2px(this
                            .lineHeight *
                            this.showRow))) {
                        this.isLongContent = true;
                    }
                });
            },
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
    };
</script>

<style lang="scss" scoped>
    .content-1,
    .content-2,
    .content-3 {
        position: relative;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        // color: #000;
    }

    .content-1 {
        overflow: hidden;
    }

    .watchMore {
        position: absolute;
        right: 0;
        bottom: 0;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        background: #fff;
        padding-left: 5rpx;

        text {
            color: #FD9038;
            margin-left: 10rpx;
        }
    }

    .packUp {
        color: #FD9038;
        margin-left: 10rpx;
    }
</style>