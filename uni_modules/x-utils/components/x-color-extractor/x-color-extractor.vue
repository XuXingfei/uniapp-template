<template>
    <view class="x-color-extractor">
        <view class="canvas-container" :style="[{width, height},customStyle]">
            <canvas :style="{width, height, transform: `translateX(${offsetCorrection})`}" @touchend="touchend" id="colorCanvas" canvas-id="colorCanvas"></canvas>
            <view v-if="circleShow" :style="{left: left + 'px', top: top + 'px'}" class="circle"></view>
        </view>
    </view>
</template>

<script>
    const rgba2hex = rgbColor => {
        let values = rgbColor
            .replace(/rgba?\(/, '')
            .replace(/\)/, '')
            .replace(/[\s+]/g, '')
            .split(',')
        let a = !values[3] || values[3] > 1 ? 1 : values[3],
            r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
            g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
            b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255)
        return '#' +
            ('0' + r.toString(16)).slice(-2) +
            ('0' + g.toString(16)).slice(-2) +
            ('0' + b.toString(16)).slice(-2)
    }
    export default {
        name: 'x-color-extractor',
        props: {
            width: {
                default: '750rpx'
            },
            height: {
                default: '50rpx'
            },
            customStyle: {
                default: () => ({})
            },
            offsetCorrection: {
                type: String
            }
        },
        data() {
            return {
                left: 0,
                top: 0,
                circleShow: false
            }
        },
        mounted() {
            console.log('------------');
            this.init()
        },
        methods: {
            init() {
                let ctx = null
                let width = this._width = this.width.includes('rpx') ? uni.upx2px(parseInt(this.width)) : parseInt(this.width)
                let height = this._height = this.width.includes('rpx') ? uni.upx2px(parseInt(this.height)) : parseInt(this.height)
                this.ctx = ctx = uni.createCanvasContext('colorCanvas', this)
                const grd = ctx.createLinearGradient(0, 0, width, height)
                grd.addColorStop(0, 'red')
                grd.addColorStop(0.15, 'orange')
                grd.addColorStop(0.3, 'yellow')
                grd.addColorStop(0.45, 'green')
                grd.addColorStop(0.6, 'cyan')
                grd.addColorStop(0.75, 'blue')
                grd.addColorStop(0.9, 'purple')
                grd.addColorStop(1, 'red')
                ctx.setFillStyle(grd)
                ctx.fillRect(0, 0, width, height)
                ctx.draw()
            },
            touchend(e) {
                // console.log(e);
                this.circleShow = true
                let {
                    x,
                    y
                } = e.changedTouches[0]
                uni.canvasGetImageData({
                    canvasId: 'colorCanvas',
                    x,
                    y,
                    width: 1,
                    height: 1,
                    success: (res) => {
                        this.left = x - 9
                        this.top = y - 9
                        const hexColor = rgba2hex(res.data.join(','))
                        console.log(`%c${hexColor}:■■■`, "color: " + hexColor);
                        this.$emit('change', hexColor)
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    .x-color-extractor {
        // background: linear-gradient(to right, #FF0000, #FF7F00, #FFFF00, #00FF00, #00FFFF, #0000FF, #8B00FF, #FF0000);

        .canvas-container {
            background-color: skyblue;
            position: relative;

            .circle {
                position: absolute;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #FFFFFF;
                box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.16);
            }
        }
    }
</style>