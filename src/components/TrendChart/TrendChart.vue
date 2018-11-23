<template>
	<div style="position: relative;">
		<canvas ref="dataLayer" :width="chartData.canvasW" :height="chartData.canvasH"></canvas>
		<canvas ref="touchLayer" @touchstart="touchstart($event)" @touchmove="touchmove($event)" @touchend="touchend($event)" style="position: absolute; left: 0; top: 0" :width="chartData.canvasW" :height="chartData.canvasH"></canvas>
	</div>
</template>
<script>
	export default {
        name: "TrendChart",
        data() {
        	const areaHeight = 250,
        		halfHeight = areaHeight / 2,
        		sectionHeight = halfHeight / 2

            return {
            	trendList: null, // 走势数据
            	trendListWidth: 0, // 走势图宽度
            	hPerList: null, // 上区间数据
            	lPerList: null, // 下区间数据
				ctx: null, // 数据绘图对象
				tCtx: null, // Touch绘图对象
				dotRadius: 6, // 点的半径
				leftWith: 120, // 左边的宽度
				areaWidth: 590, // 走势区域的宽度
				areaHeight, // 走势区域的高度
				halfHeight, // 走势区域的一半高度
				sectionHeight, // 每段的高度
				lowestProfit: 0, // 最低的收益率
				highestProfit: 0, // 最高的收益率
				sectionProfit: 0, // 每段的收益率
				halfProfit: 0, // 一半的收益率区间
				transfromScale: 0, // 转换比例
				dotRange: 0 // 每个点的距离
            }
        },
        mounted() {
        	if(!this.chartData.list) {
        		let cancelWatch = this.$watch("chartData", val => {
        			if(val.list) {
        				this.init()
                    	cancelWatch()
        			}
                })
				return
        	}

        	this.init()
        },
        methods: {
        	init() {
        		this.ctx = this.$refs.dataLayer.getContext("2d")
	        	this.tCtx = this.$refs.touchLayer.getContext("2d")
	        	this.trendList = this.chartData.list, // 走势数据
            	this.hPerList = this.chartData.hPer, // 上区间数据
            	this.lPerList = this.chartData.lPer, // 下区间数据

	            this.computeFn()
				this.setStyle()
				this.drawFrame()
				this.drawLine()
        	},
            computeFn() {
				var tList = this.trendList.slice().sort((a, b) => a.rate - b.rate),
					hList = this.hPerList.slice().sort((a, b) => a - b),
					lList = this.lPerList.slice().sort((a, b) => a - b),
					profitArea


				this.lowestProfit = Math.min(tList[0].rate, hList[0], lList[0])
				this.highestProfit = Math.max(tList[tList.length - 1].rate, hList[hList.length - 1], lList[lList.length - 1])
				profitArea = this.highestProfit - this.lowestProfit
				this.halfProfit = profitArea / 2 + this.lowestProfit

				this.sectionProfit = profitArea / 4
				this.transfromScale = this.areaHeight / profitArea
				this.dotRange = this.areaWidth / this.hPerList.length
				this.trendListWidth = this.dotRange * this.trendList.length
			},
			setStyle() {
				this.ctx.translate(0, 8)
				this.ctx.font="20px Verdana"
				this.ctx.fillStyle = "#999"
				this.ctx.strokeStyle = "#f5f5f5"
				this.ctx.textAlign="right"
				this.ctx.textBaseline="middle"

				this.tCtx.translate(0, this.halfHeight + 8)
				this.tCtx.font="20px Verdana"
				this.tCtx.fillStyle = "#dab265"
				this.tCtx.strokeStyle = "#d9c295"
			},
			drawFrame() {
				const paddingRight = 10

				this.ctx.translate(this.leftWith, 0)
				this.ctx.save()
					for(let i=0, len=5, last=len-1; i<len; i++) {
						if(i === last) {
							this.ctx.strokeStyle = "#e6e6e6"
						}
						this.ctx.beginPath()
						this.ctx.moveTo(0, this.sectionHeight * i)
						this.ctx.lineTo(this.areaWidth, this.sectionHeight * i)
						this.ctx.stroke()
						this.ctx.fillText((i === last ? this.lowestProfit : this.highestProfit - this.sectionProfit * i).toFixed(2) + "%", -paddingRight, this.sectionHeight * i)
					}
				this.ctx.restore()
			},
			drawLine() {
				this.ctx.save()
					this.ctx.translate(0, this.halfHeight)
					this.drawArea()
					this.drawTrendLine()
				this.ctx.restore()
			},
			drawArea() {
				this.ctx.fillStyle = "rgba(251, 233, 207, .5)"
				this.ctx.beginPath()
				for(let i=0, len=this.hPerList.length, item, x; i<len; i++) {
					item = this.hPerList[i]
					x = i * this.dotRange
					this.ctx[i === 0 ? "moveTo" : "lineTo"](x, -(item - this.halfProfit) * this.transfromScale)
				}
				for(let i=this.lPerList.length-1, item, x; i >= 0; i--) {
					item = this.lPerList[i]
					x = i * this.dotRange
					this.ctx.lineTo(x, -(item - this.halfProfit) * this.transfromScale)
				}
				this.ctx.fill();
			},
			drawTrendLine() {
				const paddingTop = 20
				this.ctx.strokeStyle = "#e0b470"
				this.ctx.fillStyle = "#999"
				this.ctx.lineWidth = 3
				this.ctx.beginPath()
				for(let i=0, len=this.trendList.length, center=len/2, last=len-1, item, x; i<len; i++) {
					item = this.trendList[i]
					x = i * this.dotRange
					item.posY = -(item.rate - this.halfProfit) * this.transfromScale
					this.ctx[i === 0 ? "moveTo" : "lineTo"](x, item.posY)

					if(i === 0) {
						this.ctx.textBaseline = "top"
						this.ctx.textAlign = "left"
						this.ctx.fillText(this.chartData.currentDate ? this.replaceYear(item.navDate) : item.navDate, x, this.halfHeight + paddingTop)
					}else if(this.chartData.currentDate === undefined && i === center) {
						this.ctx.textAlign = "center"
						this.ctx.fillText(item.navDate, x, this.halfHeight + paddingTop)
					}else if(i === last){
						if(this.chartData.currentDate) {
							this.ctx.textAlign = "center"
							this.ctx.fillText(this.replaceYear(this.chartData.currentDate), x, this.halfHeight + paddingTop)
						}else{
							this.ctx.textAlign = "right"
							this.ctx.fillText(item.navDate, x, this.halfHeight + paddingTop)
						}
					}
				}
				if(this.chartData.expectEndDate) {
					// 预期收益结束时间
					this.ctx.textAlign = "right"
					this.ctx.fillText(this.chartData.expectEndDate, this.areaWidth, this.halfHeight + paddingTop)
				}
				this.ctx.stroke()
			},
            replaceYear(str) {
                return str.replace(/\d{4}\//, "")
            },
			drawTouch(positionX) {
				var size = Math.floor((positionX - this.leftWith) / this.dotRange),
					item = this.trendList[size],
					posX = size * this.dotRange + this.leftWith

				this.$emit("update", item)

				if(posX <= this.leftWith) {
					posX = this.leftWith
				}
				if(posX >= this.areaWidth + this.leftWith) {
					posX = this.areaWidth + this.leftWith
				}

				this.tCtx.save()
					this.tCtx.beginPath()
					this.tCtx.moveTo(posX, -this.halfHeight - 8)
					this.tCtx.lineTo(posX, this.halfHeight)
					this.tCtx.stroke()

					this.tCtx.beginPath()
					this.tCtx.arc(posX, item.posY, this.dotRadius, 0, Math.PI * 2, true)
					this.tCtx.fill()
					this.tCtx.save()
						this.tCtx.fillStyle = "#fff"
						this.tCtx.beginPath()
						this.tCtx.arc(posX, item.posY, this.dotRadius - 2, 0, Math.PI * 2, true)
						this.tCtx.fill()
					this.tCtx.restore()
				this.tCtx.restore()
			},
			clearTouch() {
				this.tCtx.clearRect(0, -this.halfHeight - 8, this.chartData.canvasW, this.chartData.canvasH)
			},
			touchstart($event) {
				this.clearTouch()
				this.drawTouch(Math.min($event.changedTouches[0].pageX, this.trendListWidth + this.leftWith))
				$event.preventDefault()
			},
			touchmove($event) {
				this.clearTouch()
				this.drawTouch(Math.min($event.changedTouches[0].pageX, this.trendListWidth + this.leftWith))
			},
			touchend($event) {
				this.$emit("update", {})
				this.clearTouch()
			}
        },
        props: {
        	chartData: {
        		type: Object,
        		required: true
        	}
        }
    }
</script>