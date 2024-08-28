<template>
    <view class="custom_navbar" :style="{width: '1px', height: placeholder ? Number(height) + statusBarHeight + 'px' : '0px'}">
        <view class="fixed_container" :style="[{height: Number(height) + statusBarHeight + 'px', paddingTop: statusBarHeight + 'px', background: bgColor, zIndex }, customStyle]">
            <view class="custom_navbar_left" :style="{width: innerItemWidth[0] + itemUnit}">
                <slot v-if="$slots.left" name="left"></slot>
                <view v-else-if="!backHide" class="back" :style="[{height: height + 'px'}]" @click="back">
                    <!-- <text :style="[{color: backColor}]">{{ isSharePage ? '主页' : pagesLength > 1 ? '返回' : '' }}</text> -->
                    <home-two v-if="isSharePage" theme="outline" :size="String(backSize)" :fill="backColor" />
                    <left v-if="!isSharePage && pagesLength > 1" theme="outline" :size="String(backSize)" :fill="backColor" />
                </view>
            </view>
            <view class="custom_navbar_center" :style="{width: innerItemWidth[1] + itemUnit}">
                <slot name="default"></slot>
            </view>
            <view class="custom_navbar_right" :style="{width: innerItemWidth[2] + itemUnit}">
                <slot name="right"></slot>
            </view>
        </view>
    </view>
</template>


<script>
    import pagesJson from '@/pages.json'

    const startPage = pagesJson.pages[0].path
    const systemInfo = uni.getSystemInfoSync()

    const tabbarList = pagesJson?.tabBar?.list || []

    let menuButtonInfo
    // #ifdef MP
    menuButtonInfo = uni.getMenuButtonBoundingClientRect()
    if (menuButtonInfo) {
        menuButtonInfo.width = systemInfo.screenWidth - menuButtonInfo.left
    }
    // #endif

    export default {
        name: 'x-navbar',
        props: {
            // 是否占位
            placeholder: {
                type: Boolean,
                default: true
            },
            // navbar 高度
            height: {
                type: Number,
                default: 44
            },
            // navbar 背景色
            bgColor: {
                type: String,
                default: '#fff'
            },
            // 是否显示返回按钮  true:隐藏  false:显示
            backHide: {
                type: Boolean,
                default: false
            },
            // navbar 层级
            zIndex: {
                type: [String, Number],
                default: 99
            },
            // 返回按钮大小
            backSize: {
                type: [String, Number],
                default: 48
            },
            // 返回按钮颜色
            backColor: {
                type: String,
                default: '#000'
            },
            // left center right 的宽度
            itemWidth: {
                type: Array,
                default: () => {
                    // #ifdef MP
                    return [menuButtonInfo.width, systemInfo.screenWidth - menuButtonInfo.width * 2, menuButtonInfo.width]
                    // #endif
                    // #ifndef MP
                    return [80, 200, 80]
                    // #endif
                }
            },
            itemUnit: {
                type: String,
                default: 'px'
            },
            // navbar 样式
            customStyle: {
                type: Object,
                default: () => {
                    return {}
                }
            },
            mode: {
                type: String,
            }
        },
        emits: ['update:itemWidth', 'itemWidthMode'],
        data() {
            return {
                statusBarHeight: 0,
                isSharePage: false,
                pagesLength: 0,
                innerItemWidth: []
            }
        },
        watch: {
            itemWidth: {
                deep: true,
                handler(val) {
                    this.innerItemWidth = val
                }
            },
            innerItemWidth: {
                deep: true,
                handler(val) {
                    this.$emit('update:itemWidth', val)
                }
            }
        },
        mounted() {
            this.innerItemWidth = this.itemWidth

            this.statusBarHeight = systemInfo.statusBarHeight

            const leftWidth = uni.upx2px(this.backSize) + 5

            const rigthWidth = menuButtonInfo?.width || 0

            const itemWidthMode = {
                mode1: [leftWidth, systemInfo.screenWidth - leftWidth - rigthWidth - 24, rigthWidth], // 右侧零宽
                mode2: [leftWidth, systemInfo.screenWidth - leftWidth - leftWidth - 24, leftWidth], // 左右等宽
                mode3: [leftWidth, systemInfo.screenWidth - leftWidth - leftWidth - rigthWidth - 24, leftWidth + rigthWidth], // 中间铺满, 右侧兼容小程序
                mode4: [leftWidth + rigthWidth, systemInfo.screenWidth - (leftWidth + rigthWidth * 2) - 24, leftWidth +
                    rigthWidth
                ] // 左右等宽, 右侧兼容小程序
            }

            this.$emit('itemWidthMode', itemWidthMode)

            if (itemWidthMode[`mode${this.mode}`]) {
                this.innerItemWidth = itemWidthMode[`mode${this.mode}`]
            }

            // 延时避免获取的 pages 不正确
            setTimeout(() => {
                const pages = getCurrentPages().reduce((p, c) => {
                    if (!p.find(f => f.route == c.route)) p.push(c)
                    return p
                }, [])

                const [page] = pages
                this.pagesLength = pages.length
                // 在页面栈长度等于 1 的情况下, 并且当前页面不是 tabbar 页面, 也不是启动页面
                this.isSharePage = (pages.length == 1 && page.route != startPage && !tabbarList.some(i => i.pagePath == page.route))
            }, 0)
        },
        methods: {
            upx2px: uni.upx2px,
            back() {
                if (this.isSharePage) {
                    const url = '/' + startPage
                    if (tabbarList.some(i => i.pagePath == startPage)) {
                        uni.switchTab({
                            url
                        })
                    } else {
                        uni.reLaunch({
                            url
                        })
                    }
                } else {
                    if (this.pagesLength > 1)
                        uni.navigateBack()
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    .fixed_container {
        box-sizing: border-box;
        position: fixed;
        left: 0;
        top: var(--window-top);
        /* #ifdef APP-NVUE */
        top: 0;
        /* #endif */
        z-index: 1;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 750rpx;
        padding: 0 12px;

        .back {
            min-width: 30px;
            display: flex;
            flex-direction: row;
            align-items: center;

            text {
                font-size: 28rpx;
            }
        }


        .custom_navbar_left,
        .custom_navbar_center,
        .custom_navbar_right {
            box-sizing: border-box;
            display: flex;
            flex-direction: row;
            align-items: center;
        }

        .custom_navbar_center {
            justify-content: center;
            font-size: 36rpx;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #000;
        }

        .custom_navbar_right {
            flex-direction: row-reverse;
        }

    }
</style>