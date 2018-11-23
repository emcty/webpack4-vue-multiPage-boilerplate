<template>
    <transition name="v-jlc-toast-fade">
        <div v-show="visible" class="v-jlc-toast-wrap-fixed">
            <div v-if="type=='icon'" class="v-jlc-toast-common-wrap v-jlc-toast-icon">
                <div class="img">
                    <img v-if="iconType=='fail'" src="./images/fail.png" alt="失败">
                    <img v-else src="./images/success.png" alt="成功">
                </div>
                <p v-html="tips"></p>
            </div>
            <div v-else class="v-jlc-toast-tips" :class="[getPosition,chineseVerify]" :style="setToastPosition" v-html="tips"></div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: "Toast",
        data() {
            return {
                visible: false,
                type: '',
                iconType: 'success',
                tips: '网络异常',
                position: 'middle'
            }
        },
        computed: {
            // 不需要图标展示toast的位置，分为上中下三种
            getPosition() {
                switch (this.position) {
                    case 'top':
                        return 'v-jlc-toast-top'
                    case 'bottom':
                        return 'v-jlc-toast-bottom'
                    // case 'middle':
                    //     return 'v-jlc-toast-middle'
                    default:
                        return 'v-jlc-toast-middle'
                        return ''
                }
            },
            // 中文地址验证
            chineseVerify: function () {
                // 验证中文的正则表达式
                if (this.tips == '') {
                    return false
                }
                // 判断中文的长度至少大于5位,split按照中文的分割字符串成数组，数组长度减一就是字符串的长度
                if (this.tips.split(/[\u4e00-\u9fa5]/).length - 1 < 10)
                    return false
                return 'v-jlc-toast-tips-height'
            },
            setToastPosition() {
                if(!isNaN(parseFloat(this.position))) {
                    return {top: `${this.position}%`,
                        '-webkit-transform': `translate3d(-50%, -${this.position}%, 0)`,
                        'transform': `translate3d(-50%, -${this.position}%, 0)`
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @charset 'UTF-8';
    @mixin computePosition($position) {
        top: $position;
        -webkit-transform: translate3d(-50%, -$position, 0);
        transform: translate3d(-50%, -$position, 0);
    }

    .v-jlc-toast-wrap-fixed {
        position: fixed;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        z-index: 1000;
    }

    .v-jlc-toast-common-wrap {
        position: absolute;
        left: 0;
        top: 50%;
        z-index: 1001;
    }

    .v-jlc-toast-wrap {
        width: 100%;
    }
    .v-jlc-toast-tips {
        position: absolute;
        left: 50%;
        top: 50%;
        padding: 15px 26px;
        min-width: 220px;
        min-height: 100px;
        height: auto;
        transform: translateX(-50%,-50%);
        background: #a5a4a9;
        border-radius: 10px;
        color: #fff;
        text-align: center;
        line-height: 70px;
        font-size: 30px;
    }
    .v-jlc-toast-tips-height {
        line-height: 50px;
    }

    .v-jlc-toast-top {
        @include computePosition(10%);
    }

    .v-jlc-toast-middle {
        @include computePosition(50%);
    }

    .v-jlc-toast-bottom {
        @include computePosition(90%);
    } // 有图标展示的toast
    .v-jlc-toast-icon {
        left: 50%;
        min-height: 193px;
        min-width: 211px;
        padding: 30px 50px 20px;
        transform: translate3d(-50%, -50%, 0);
        background: rgba(0, 0, 0, .8);
        border-radius: 10px;
        color: #f0f0f0;
        text-align: center;
        line-height: 0;
        font-size: 28px;
        .img {
            padding-bottom: 10px;
        }
        p {
            max-width: 196px;
            line-height: 36px;
            white-space: normal;
            word-wrap: break-word;
            word-break: break-all;
        }
    }
    .v-jlc-toast-fade-enter-active,
    .v-jlc-toast-fade-leave-active {
        transition: opacity .5s;
    }

    .v-jlc-toast-fade-enter,
    .v-jlc-toast-fade-leave-to {
        opacity: 0;
    }
</style>
