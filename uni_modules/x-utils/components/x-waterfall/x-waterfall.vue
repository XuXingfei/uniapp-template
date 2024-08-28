<template>
    <view class="x-waterfall">
        <image v-if="imgCreate && i[imgKey]" class="x-waterfall_image" :src="i[imgKey]" mode="" v-for="(i, idx) in list" @load="imgLoad(i, idx, $event)" @error="imgError(i, idx, $event)"></image>
        <slot :loadFinishList="loadFinishList"></slot>
    </view>
</template>

<script>
    /* 
	 -- 用法 --
	 
	 结构:
	 <x-waterfall ref="waterfall" img-key="img" :img-width="357" :column-number="2"
	 	:fixed-height="(24 + 19 + 31) * 2">
	 	<view class="content f-r-sb">
	 		<view class="" v-for="c in mescrollList">
	 			<view class="item" v-for="i in c">
	 				<image :src="i.img" :style="[i.imgStyle]" mode=""></image>
	 				<view class="item_bootom">
	 					<view class="name">
	 						xxxxxxxxx
	 					</view>
	 					<cunba-tags :list="['随买随用', '全天票']"></cunba-tags>
	 					<view class="price">
	 						￥188
	 					</view>
	 				</view>
	 			</view>
	 		</view>
	 	</view>
	 </x-waterfall>
	 
	 
	 js:
	 const list = [{
	 	img: 'http:xxxxx'
	 }, {
	 	img: 'http:xxxxx'
	 }]
	 
	 this.$refs.waterfall.getRenderList(list, res => {
		this.mescrollList = [...res]
	 })
	 // res数据结构:
	 // [
	 // 	[{
	 // 		"img": "http:xxxx"
	 // 		"imgWidth": 350,
	 // 		"imgHeight": 130.2325581395349,
	 // 		"imgInfoUnit": "rpx",
	 // 		"imgStyle": {
	 // 			"width": "350rpx",
	 // 			"height": "130.2325581395349rpx"
	 // 		}
	 // 	}],
	 // 	[{
	 // 		"img": "http:xxxx"
	 // 		"imgWidth": 350,
	 // 		"imgHeight": 233.33333333333331,
	 // 		"imgInfoUnit": "rpx",
	 // 		"imgStyle": {
	 // 			"width": "350rpx",
	 // 			"height": "233.33333333333331rpx"
	 // 		}
	 // 	}]
	 // ]
	 */
    export default {
        name: "x-waterfall",
        props: {
            // 图片属性名
            imgKey: {
                type: String,
                required: true
            },
            // 图片渲染宽度
            imgWidth: {
                type: Number,
                required: true
            },
            // 指定列数
            column: {
                type: Number,
            },
            // 固定内容高度
            fixedHeight: {
                type: Number,
                required: true
            },
            // 图片渲染宽度单位
            unit: {
                type: String,
                default: 'rpx'
            },
        },
        data() {
            return {
                columnHeight: [],
                list: [],
                sortLoadFinishList: [],
                loadFinishList: [],
                imgCreate: true,
                columnNumber: 2
            };
        },
        created() {
            this.columnNumber = this.column ? this.column : Math.floor(750 / this.imgWidth)
            this.init()
        },
        methods: {
            init() {
                this.columnHeight = new Array(this.columnNumber)
                this.loadFinishList = new Array(this.columnNumber)
                this.columnHeight.fill(0, 0)
                for (let i = 0; i < this.columnNumber; i++) {
                    this.loadFinishList[i] = []
                }
            },
            imgLoad(i, idx, e) {
                // console.log('imgLoad', i, idx, e);
                const {
                    width,
                    height
                } = e.detail
                const factor = this.imgWidth / width
                const imgHeight = height * factor
                this.sortLoadFinishList[idx] = {
                    ...i,
                    imgWidth: this.imgWidth,
                    imgHeight: imgHeight,
                    imgInfoUnit: this.unit,
                    imgStyle: {
                        width: this.imgWidth + this.unit,
                        height: imgHeight + this.unit
                    }
                }
                if (this.list.length == this.sortLoadFinishList.filter(Boolean).length) {
                    for (let i = 0; i < this.sortLoadFinishList.length; i++) {
                        const minIdx = this.columnHeight.findIndex(i => i == Math.min(...this.columnHeight))
                        this.columnHeight[minIdx] += (this.sortLoadFinishList[i].imgHeight + this.fixedHeight)
                        this.loadFinishList[minIdx].push(this.sortLoadFinishList[i])
                    }
                    this.loadFinishResolve(this.loadFinishList)
                    this.loadFinishCallback(this.loadFinishList)
                }
            },
            imgError(i, idx, e) {
                console.log('imgError', i, idx, e);
                this.sortLoadFinishList[idx] = {
                    ...i,
                    imgWidth: this.imgWidth,
                    imgHeight: this.imgWidth,
                    imgInfoUnit: this.unit,
                    imgStyle: {
                        width: this.imgWidth + this.unit,
                        height: this.imgWidth + this.unit
                    }
                }
                if (this.list.length == this.sortLoadFinishList.filter(Boolean).length) {
                    for (let i = 0; i < this.sortLoadFinishList.length; i++) {
                        const minIdx = this.columnHeight.findIndex(i => i == Math.min(...this.columnHeight))
                        this.columnHeight[minIdx] += (this.sortLoadFinishList[i].imgHeight + this.fixedHeight)
                        this.loadFinishList[minIdx].push(this.sortLoadFinishList[i])
                    }
                    this.loadFinishResolve(this.loadFinishList)
                    this.loadFinishCallback(this.loadFinishList)
                }
            },
            // 重置
            reset() {
                this.list = []
                this.sortLoadFinishList = []
                this.init()
            },
            // 获取渲染列表
            getRenderList(list = [], callback = () => {}) {
                if (list.length == 0) {
                    callback(this.loadFinishList)
                    return Promise.resolve(this.loadFinishList)
                }
                list.forEach((i, idx) => {
                    if (!i[this.imgKey]) this.imgError(i, idx, {})
                })
                this.imgCreate = false
                this.loadFinishCallback = callback
                return new Promise(resolve => {
                    this.loadFinishResolve = resolve
                    this.$nextTick(() => {
                        this.imgCreate = true
                        this.list = [...this.list, ...list]
                    })
                })
            }
        }
    }
</script>

<style lang="scss">
    .x-waterfall .x-waterfall_image {
        display: none;
    }
</style>