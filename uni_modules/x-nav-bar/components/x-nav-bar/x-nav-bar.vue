<template>
    <view class="x-nav-bar" :style="[{height: placeholder ? innerStyle.height : 0}]">
        <view class="fixed-container" :style="[innerStyle, customStyle]">
            <view class="nav-bar-main" :style="[{height: str2px(height) + 'px'}]">
                <view class="nav-bar-left">
                    <slot v-if="$slots.left" name="left"></slot>
                    <view v-if="!$slots.left && (!backHide && (pageInfo.pageStackLen > 1 || pageInfo.isSharePage))" class="back" :style="[backStyle]" @click="onBack">
                        <!-- 深色 -->
                        <template v-if="backColor == 'black'">
                            <image v-if="pageInfo.pageStackLen > 1" :style="[backImageStyle]" src="./static/back_black.png" mode="aspectFill"></image>
                            <image v-if="pageInfo.isSharePage" :style="[backImageStyle]" src="./static/home_black.png" mode="aspectFill"></image>
                        </template>
                        <!-- 浅色 -->
                        <template v-else>
                            <image v-if="pageInfo.pageStackLen > 1" :style="[backImageStyle]" src="./static/back_white.png" mode="aspectFill"></image>
                            <image v-if="pageInfo.isSharePage" :style="[backImageStyle]" src="./static/home_white.png" mode="aspectFill"></image>
                        </template>
                    </view>
                </view>
                <view class="nav-bar-center" :style="[centerStyle]">
                    <slot></slot>
                </view>
                <view class="nav-bar-right">
                    <slot name="right"></slot>
                    <!-- #ifdef MP -->
                    <view v-if="mpSafeArea" class="mp-placeholder"></view>
                    <!-- #endif -->
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    import { str2px, commonProps } from '@/uni_modules/x-tools/tools/com.js'
    import { getPageInfo } from '@/uni_modules/x-tools/tools/index.js'
    /**
     * @description 顶部导航栏
     * @property {String} layout 布局方式
     * 	@value common 左右靠两侧, 中间居中
     * 	@value fill 左右靠两侧, 中间填充剩余空间
     */
    export default {
        name: 'x-nav-bar',
        props: {
            // navbar 层级
            zIndex: {
                type: [String, Number],
                default: 99
            },
            // navbar 高度
            height: {
                type: [String, Number],
                default: 44
            },
            // 内边距
            padding: {
                type: String,
                default: '0 8px'
            },
            // 返回按钮大小
            backSize: {
                type: [String, Number],
                default: 24
            },
            // 返回按钮颜色
            backColor: {
                type: String,
                default: 'black' // black | white
            },
            // 是否隐藏返回按钮  true:隐藏  false:显示
            backHide: {
                type: Boolean,
                default: false
            },
            // 是否占位
            placeholder: {
                type: Boolean,
                default: true
            },
            // 小程序右侧安全区域
            mpSafeArea: {
                type: Boolean,
                default: true
            },
            // 布局方式
            layout: {
                type: String,
                default: 'common'
            },
            ...commonProps
        },
        emits: ['innerStyle'],
        data() {
            return {
                sysInfo: uni.getSystemInfoSync(),
                pageInfo: {}
            }
        },
        computed: {
            innerStyle() {
                const { sysInfo, height, zIndex, bgColor, padding } = this
                const { statusBarHeight, safeAreaInsets, screenWidth } = sysInfo

                // #ifdef MP
                const menuRect = uni.getMenuButtonBoundingClientRect()
                // #endif

                const style = {
                    zIndex,
                    padding,
                    height: str2px(height) + statusBarHeight + 'px',
                    paddingTop: statusBarHeight + 'px',
                    background: bgColor,
                    '--x-status-bar-height': statusBarHeight + 'px',
                    // #ifdef MP
                    '--x-safe-right': screenWidth - menuRect.left + 'px',
                    // #endif
                }

                this.$emit('innerStyle', style)

                return style
            },
            backStyle() {
                const { height, backSize } = this
                let size = str2px(backSize) * 1.2
                if (size > str2px(height)) size = height
                size += 'px'
                return {
                    width: size,
                    height: size
                }
            },
            backImageStyle() {
                const { height, backSize } = this
                let size = str2px(backSize)
                if (size > str2px(height)) size = height
                size += 'px'
                return {
                    width: size,
                    height: size
                }
            },
            centerStyle() {
                const { layout } = this
                return {
                    position: layout == 'common' ? '' : 'static',
                    transform: layout == 'common' ? '' : 'none',
                    flex: layout == 'common' ? '' : '1',
                }
            }
        },
        mounted() {
            this.pageInfo = getPageInfo()
        },
        methods: {
            str2px,
            onBack() {
                const { startPage, isSharePage, pageStackLen } = this.pageInfo

                if (isSharePage) {
                    uni.reLaunch({
                        url: '/' + startPage
                    })
                    return
                }

                if (pageStackLen > 1) {
                    uni.navigateBack()
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    view {
        box-sizing: border-box;
    }

    .x-nav-bar {
        .fixed-container {
            position: fixed;
            left: 0;
            top: 0;
            width: 750rpx;

            .nav-bar-main {
                position: relative;
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .nav-bar-left {
                z-index: 1;
                .back {
                    display: flex;
                    align-items: center;
                }
            }

            .nav-bar-center {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                width: fit-content;
                height: fit-content;
            }

            .nav-bar-right {
                display: flex;
                align-items: center;

                .mp-placeholder {
                    width: var(--x-safe-right);
                    height: 1px;
                }
            }

        }
    }
</style>