<template>
    <div ref="touchBox" @touchstart="touchstart($event)" @touchmove="touchmove($event)" @touchend="touchend($event)" class="touch-box">
        <ul ref="touchBar" :style="{'transform': `translate3d(${curX}px, 0, 0)`, 'width': `${unitLength * unitNum}px`}" class="touch-bar box">
            <li :class="{'whole-val': index == 0 || index % chillNum == 0}" :style="{'left': `${index * unitLength}px`}" v-for="(item, index) in scaleData" :key="index">
                <span v-if="index == 0 || index % chillNum == 0">{{ index * cutVal + startVal}}</span>
            </li>
        </ul>
        <span :style="{'left': `${centerDot - 8}px`}" class="touch-arrow"></span>
    </div>
</template>

<script>
    export default {
        name: "PluralBar",
        data() {
            return {
                pageX: 0, // 记录上次的X坐标
                curX: 0, // 当前的X坐标
                initX: 0, // X坐标初始值
                maxVal: 0, // X坐标最大值
                minVal: 0, // X坐标最小值
                startTime: 0, // touchstar时的时间戳
                startX: 0, // 记录touchstart的坐标值
                pageX: 0, // 记录上次X轴的位置值
                animating: false, // 是否在动画执行中
                scrollerWidth: 0, // 可滚动的宽度
                centerDot: 0 // 拖拽区域中心值
            }
        },
        computed: {
            /**
             * [unitNum 计算所有单位的总数量]
             * @return {[Number]} [单位的总数量]
             */
            unitNum() {
                return this.cutNum * this.chillNum
            },
            /**
             * [amountArea 计算金额范围]
             * @return {[Number]} [金额范围]
             */
            amountArea() {
                return this.endVal - this.startVal
            },
            /**
             * [unitAmount 计算单位金额]
             * @return {[Number]} [单位金额]
             */
            unitAmount() {
                return this.amountArea / this.unitNum
            },
            /**
             * [cutVal 计算每段的长度]
             * @return {[Number]} [每段的长度]
             */
            cutVal() {
                return Math.abs(this.endVal - this.startVal) / this.unitNum
            },
            /**
             * [scaleData 渲染表格的数据]
             * @return {[Arrar]} [渲染表格的数据]
             */
            scaleData() {
                this.$nextTick(() => {
                    this.init()
                })
                return new Array(this.unitNum + 1)
            }
        },
        props: {
            chillNum: { // 孩纸数量
                type: Number,
                default: 10
            },
            unitLength: { // 单位长度
                type: Number,
                default: 11
            },
            startVal: { // 起始值
                type: Number,
                default: 0
            },
            initVal: { // 拖拽条初始值，用来跟父组件通信
                type: [Number, Boolean],
                required: true
            },
            endVal: { // 结束值
                type: Number,
                required: true
            },
            cutNum: { // 切割几段
                type: Number,
                required: true
            },
            scrollEnd: {
                type: Function,
                required: false
            }
        },
        methods: {
            /**
             * [init 初始化函数]
             * @return void
             */
            init() {
                if(this.startVal === this.endVal) {
                    return
                }

                this.centerDot = this.$refs.touchBox.offsetWidth / 2
                this.scrollerWidth = this.$refs.touchBar.offsetWidth
                this.maxVal = this.centerDot
                this.minVal = -(this.cutNum * this.chillNum * this.unitLength - this.centerDot)

                if(typeof this.initVal === "number") {
                    let val = this.centerDot - (this.initVal - this.startVal) / this.amountArea * this.scrollerWidth
                    this.animate(this.countSizeVal(val), 0)
                }
            },
            /**
             * [move 移动函数]
             * @return void
             */
            move(positionX) {
                this.curX = positionX
                this.countCurVal();
            },
            countCurVal() {
                var val = this.startVal + this.unitAmount * Math.round(Math.abs(this.curX - this.centerDot) / this.scrollerWidth * this.unitNum);
                this.$emit("update:initVal", val);
            },
            /**
             * [touchstart 惯性拖拽条touchstart函数]
             * @param  {[Object]} $event [event对象]
             * @return void
             */
            touchstart($event) {
                // 获取touchstart的坐标
                this.startX = this.pageX = $event.changedTouches[0].pageX
                // 获取touchstart的时间
                this.startTime = Date.now()
                // 停止惯性动画
                this.animating = false;
            },
            /**
             * [touchmove 惯性拖拽条touchmove函数]
             * @param  {[Object]} $event [event对象]
             * @return void
             */
            touchmove($event) {
                var pageX = $event.changedTouches[0].pageX, // 获取touchmove的坐标
                    range = pageX - this.pageX, // 计算touchmove移动的距离
                    nowTime = Date.now(), // 获取touchmove执行的时间
                    newX // 拖拽条新的X轴坐标

                // 更新上次的位置值
                this.pageX = pageX;
                // 计算拖拽条的新位置
                newX = Math.round(this.curX + range);

                // 如果新的值小于最小值，则等于最小值
                if(newX < this.minVal) {
                    newX = this.minVal;
                }
                // 如果新的值大于最大值，则等于最大值
                if(newX > this.maxVal) {
                    newX = this.maxVal;
                }
                // 移动拖拽条
                this.move(newX);

                // 检测touchmove距离touchstart的时间，来更新最后一点距离的值
                if(nowTime - this.startTime > 300){
                    // 更新startTime和startX的值
                    this.startTime = nowTime;
                    this.startX = pageX;
                }
            },
            /**
             * [touchend 惯性拖拽条touchend函数]
             * @param  {[Object]} $event [event对象]
             * @return void
             */
            touchend($event) {
                var moumentum = null, // 惯性对象
                    duration = Date.now() - this.startTime, // touchend与上一次start的间隔时间
                    distX = $event.changedTouches[0].pageX; // touchend的坐标值

                // 如果间隔时间不超过了300毫秒，则执行惯性滑动
                if (duration < 300) {
                    moumentum = (this.curX <= this.min || this.curX >= this.max)
                    // 如果拖拽条当前的值超过了最大或者最小限制，则不再执行惯性动画
                    ? {
                        distX: 0,
                        time: 0
                    }
                    // 如果用户没有超过限制，则去计算惯性滑动动画需要的时间和距离
                    : this.countMomentum(distX - this.startX, duration, this.centerDot - this.curX, this.scrollerWidth + this.curX - this.centerDot)
                    // 执行惯性滑动动画
                    this.animate(this.countSizeVal(moumentum.distX + this.curX), moumentum.animateTime);
                    return
                }

                this.animate(this.countSizeVal(this.curX), 200)
            },
            countSizeVal(distVal) {
                return Math.round((distVal - this.centerDot) / this.unitLength) * this.unitLength + this.centerDot
            },
            /**
             * [countMomentum 计算惯性滑动动画函数]
             * @param  {[Number]} range [最后一段滑动的距离]
             * @param  {[Number]} time [最后一段滑动的话费的时间]
             * @param  {[Number]} maxVal [能滑动到的最大值，不能大于这个值]
             * @param  {[Number]} minVal [能滑动到的最小值，不能小于这个值]
             * @return {[Object]}      [返回含有滑动距离和缓动时间的对象]
             */
            countMomentum(range, time, maxVal, minVal) {
                var deceleration = 0.001, // 物理阻尼值，值越大，摩擦力越大。值越小，摩擦力越小
                    speed = Math.abs(range) / time, // 计算最后这段距离的平均速度
                    distRange = (speed * speed) / (2 * deceleration), // 计算出惯性需要滑动的距离
                    distTime = 0 // 计算出惯性需要滑动的时间

                // 如果最后一段的距离大于0，表示在向左滑动 && 当最终距离大于最大值是，需重新计算缓动距离和时间
                if (range > 0 && distRange > maxVal) {
                    speed = speed * maxVal / distRange
                    distRange = maxVal
                }
                // 如果最后一段的距离小于0，表示在向右滑动 && 当最终距离小于最小值是，需重新计算缓动距离和时间
                if (range < 0 && distRange > minVal) {
                    speed = speed * minVal / distRange
                    distRange = minVal
                }

                // 计算距离的方向
                distRange = distRange * (range < 0 ? -1 : 1)
                // 计算最终的时间
                distTime = speed / deceleration

                return {
                    distX: distRange,
                    animateTime: Math.round(distTime)
                };
            },
            animate(distX, animateTime) {
                var startX = this.curX, // 获取当前的位置
                    startTime = Date.now(), // 获取当前的时间
                    _this = this

                // 如果当前在动画过程中，则return
                if (this.animating) {
                    return
                }

                // 如果当前的位置等于惯性滑动需到达的距离，则return
                if (startX == distX) {
                    animateTime = 0;
                }

                // 更新动画状态
                this.animating = true;
                // 定义动画循环函数
                var next = (distX, startX, animateTime, startTime) => {
                    var nowTime = Date.now(), // 获取当前动画的时间
                        easeOut, // 缓动动画
                        newDistX // 最新计算出来的X轴坐标

                    // 如果当前的时间 >= 动画开始的时间 + 动画的时长。说明动画执行完毕了
                    if (nowTime >= startTime + animateTime) {
                        // 更新拖拽条的位置
                        this.move(Math.round(distX))
                        // 更新动画的状态
                        this.animating = false
                        // 执行结束的回调
                        this.$emit("scrollEnd")
                        // 结束动画
                        return
                    }

                    // 计算当前的动画时间占比
                    nowTime = (nowTime - startTime) / animateTime - 1
                    // 计算缓动动画
                    easeOut = Math.sqrt(1 - nowTime * nowTime)
                    // 计算新的X轴坐标
                    newDistX = (distX - startX) * easeOut + startX
                    // 跟新拖拽条的位置
                    this.move(Math.round(newDistX))

                    // 循环动画
                    this.animating && window.requestAnimationFrame(function() {
                        next(distX, startX, animateTime, startTime);
                    })
                }
                // 指向动画循环函数
                next(distX, startX, animateTime, startTime);
            }
        }
    }
</script>

<style lang="scss" scoped>
    /* 金额滑动条 */
    .touch-box{
        position: relative;
        width: 100%;
        padding-bottom: 16px;
        overflow: hidden;
        &:before{
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            z-index: 1;
            width: 100%;
            background: -webkit-linear-gradient(left, rgba(255, 255, 255, .95) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, .95) 100%);
        }

        .touch-bar{
            position: relative;
            height: 60px;
            border-bottom: 1px solid #e5e5e5;

            li{
                position: absolute;
                left:0;
                bottom: 0;
                width: 1px;
                height: 6px;
                background: #e5e5e5;

                &.whole-val{
                    height: 10px;
                    background: #c8a556;

                    span{
                        position: absolute;
                        left: 0;
                        bottom: 30px;
                        transform: translateX(-50%);
                        color: #666;
                        font-size: 24px;
                    }
                }
                &:last-child{
                    margin-right: 0;
                }
            }
        }


        .touch-arrow{
            display: block;
            position: absolute;
            bottom: 0;
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-bottom: 12px solid #d1b067;
        }
    }
</style>
