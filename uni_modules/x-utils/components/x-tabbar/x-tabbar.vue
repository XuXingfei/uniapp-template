<template>
    <view class="custom_tabbar" :style="{width: '1px', height: `calc(${height} + ${safeBottom})`}">
        <view class="fixed_container" :style="[{height: `calc(${height} + ${safeBottom})`, paddingBottom: safeBottom, background: backgroundColor, borderTopColor: borderStyle}]">
            <view class="item" v-for="i in list" @click="$emit('tab-click', i)">
                <view v-if="i.iconPath && i.selectedIconPath" class="image" :style="[{marginBottom: spacing}]">
                    <image :style="[{width: iconWidth, height: iconWidth}]" :src="i.pagePath == activePath ? i.selectedIconPath : i.iconPath" mode="widthFix"></image>
                    <view v-if="i.badge && i.badge > 0" class="badge" :style="[{color: badgeFontColor, background: badgeBgColor, badgeStyle}]">
                        {{ i.badge > 99 ? '99+' : i.badge }}
                    </view>
                </view>
                <text :style="[{color: i.pagePath == activePath ? selectedColor : color, fontSize}]">{{ i.text }}</text>
            </view>
        </view>
    </view>

</template>

<script>
    import { $getCurrentPagePath } from '@/uni_modules/x-utils/js/utils.js'
    export default {
        name: 'x-tabbar',
        emits: ['tab-click'],
        props: {
            // 是否开启安全区域适配
            safeArea: {
                type: Boolean,
                default: true
            },
            // tab 上的文字默认颜色
            color: {
                type: String,
                default: '#ccc'
            },
            // tab 上的文字选中时的颜色
            selectedColor: {
                type: String,
                default: '#111111'
            },
            // tab 的背景色
            backgroundColor: {
                type: String,
                default: '#f1f1f1'
            },
            // tabbar 上边框的颜色
            borderStyle: {
                type: String,
                default: '#cccccc'
            },
            // tab 的列表
            // item = {
            //     pagePath: '页面路径，必须在 pages 中先定义',
            //     text: 'tab 上按钮文字',
            //     iconPath: '图片路径',
            //     selectedIconPath: '选中时的图片路径',
            //     badge: '角标',
            // }
            list: {
                type: Array,
                default: () => ({})
            },
            // 文字默认大小
            fontSize: {
                type: String,
                default: '12px'
            },
            // 图标默认宽度（高度等比例缩放）
            iconWidth: {
                type: String,
                default: '24px'
            },
            // 图标和文字的间距
            spacing: {
                type: String,
                default: '3px'
            },
            // tabBar 默认高度
            height: {
                type: String,
                default: '100rpx'
            },
            // 角标背景色
            badgeBgColor: {
                type: String,
                default: '#dd001b'
            },
            // 角标文字颜色
            badgeFontColor: {
                type: String,
                default: '#fff'
            },
            // 角标样式
            badgeStyle: {
                type: Object,
                default: () => ({})
            },
        },
        data() {
            return {
                activePath: $getCurrentPagePath(),
                safeBottom: 0
            };
        },
        mounted() {
            this.safeBottom = this.getPaddingBottom()
        },
        updated() {
            this.safeBottom = this.getPaddingBottom()
        },
        methods: {
            getPaddingBottom() {
                if (this.safeArea) {
                    const { safeAreaInsets } = uni.getSystemInfoSync()
                    return safeAreaInsets.bottom + 'px'
                } else {
                    return 0
                }
            },
        }
    }
</script>

<style lang="scss">
    .fixed_container {
        z-index: 99;
        position: fixed;
        left: 0;
        bottom: var(--window-bottom);
        /* #ifdef APP-NVUE */
        bottom: 0;
        /* #endif */
        width: 750rpx;
        display: flex;
        justify-content: space-around;
        align-items: center;
        border-top: 1px solid;

        .item {
            display: flex;
            flex-direction: column;
            align-items: center;

            .image {
                position: relative;
                width: fit-content;

                .badge {
                    position: absolute;
                    top: 5rpx;
                    right: 5rpx;
                    transform: translate(50%, -50%);
                    width: fit-content;
                    min-width: 30rpx;
                    height: 30rpx;
                    padding: 0 5rpx;
                    border-radius: 15rpx;
                    line-height: 30rpx;
                    font-size: 10px;
                    text-align: center;
                }
            }
        }
    }
</style>