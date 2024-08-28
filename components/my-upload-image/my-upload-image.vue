<template>
    <view class="upload-image">
        <view v-if="title" class="title">
            {{ title }}
        </view>
        <view class="imgs f-r f-wp" :style="{ width: width + 'rpx' }">
            <view class="img" v-for="i in imgs">
                <close-one class="del" theme="filled" size="37" fill="#666666" @click="del(i)" />
                <image :src="$joinUrl(i)" mode=""></image>
            </view>
            <view v-if="imgs.length < size" class="add f-r-xy-c" @click="uploadImg">
                <slot>
                    <plus theme="outline" size="150" fill="#ccc" />
                </slot>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "my-upload-image",
        props: {
            width: {
                type: [Number, String],
                default: 690
            },
            imgs: {
                type: Array,
                default: () => []
            },
            size: {
                type: Number,
                default: 9
            },
            title: {
                type: String,
                default: ''
            },
        },
        data() {
            return {
                itemWidth: 0
            };
        },
        created() {
            this.itemWidth = (this.width - 40) / 3 + 'rpx'
        },
        methods: {
            uploadImg() {
                this.$uploadImage().then(res => {
                    console.log(res);
                    if (res) this.$emit('update:imgs', [...this.imgs, res])
                })
            },
            del(i) {
                this.$emit('update:imgs', this.imgs.filter(f => f != i))
            }
        }
    }
</script>

<style lang="scss" scoped>
    .upload-image {
        width: fit-content;
        margin: 20rpx auto;

        .title {
            margin-bottom: 40rpx;
            font-family: Roboto, Roboto;
            font-weight: 400;
            font-size: 29rpx;
            color: #333333;
        }

        .imgs {

            .img,
            .add {
                position: relative;
                width: v-bind(itemWidth);
                height: v-bind(itemWidth);
                border-radius: 20rpx;

                image {
                    width: 100%;
                    height: 100%;
                }

                .del {
                    z-index: 1;
                    position: absolute;
                    right: -17rpx;
                    top: -17rpx;
                }
            }

            .add {
                overflow: hidden;
                border: 1px dashed #ccc;
            }

            >view {
                margin-right: 20rpx;
                margin-bottom: 20rpx;

                &:nth-child(3n) {
                    margin-right: 0;
                }
            }
        }
    }
</style>