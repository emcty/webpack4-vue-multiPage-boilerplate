<template>
    <transition name="v-jlc-comfirm-fade">
        <div class="v-jlc-confirm-modal" v-if="visible" @click.prevent>
            <div class="v-jlc-comfirm-wrap">
                <div v-if="!!title" class="v-jlc-comfirm-header" :class="titleStyle"  v-html="title"></div>
                <div class="v-jlc-comfirm-content" v-html="message" :class="[getPosition,contentPadding]" :style="setContStyle()"></div>
                <div class="v-jlc-comfirm-buttons">
                    <div class="v-jlc-comfirm-buttons-singal" :style="[setBtnLeftStyle(index),setBtnRightStyle(index)]" v-for="(item, index) in buttons" :key="index"
                         @click.stop="itemClick( {name:item.name,callBack:item.callBack, index} )">{{ item.name }}</div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
// 判断是否是空对象{}
    let isEmptyObject = (obj) => {
            for (let key in obj)
                return !1
            return !0
        }
    export default {
        name: "comfirm",
        data() {
            return {
                visible: false,
                message: '',
                title: '提示',
                buttons: [],
                btnLeftStyle: {},
                btnRightStyle: {},
                contStyle:{},
                textAlign: 'center'
            }
        },
        methods: {
            itemClick(option) {},
            setBtnLeftStyle(index) {
                if(index==0&&!isEmptyObject(this.btnLeftStyle)) {
                    return this.btnLeftStyle
                }
            },
            setBtnRightStyle(index) {
                if(index==1&&!isEmptyObject(this.btnRightStyle)) {
                    return this.btnRightStyle
                }
            },
            setContStyle() {
                if(!isEmptyObject(this.contStyle)) {
                    return this.contStyle
                }
            }
        },
        computed: {
            // 提示文字排版位置，分为居左，居中，居右三种
            getPosition() {
                switch (this.textAlign) {
                    case 'left':
                        return 'v-jlc-confirm-left'
                    case 'right':
                        return 'v-jlc-confirm-right'
                    default:
                        return 'v-jlc-confirm-center'
                }
            },
            contentPadding() {
                return !!this.title ? 'v-jlc-comfirm-content-spe': ''
            },
            titleStyle() {
                return !!this.title&&this.title.indexOf('<br>') ? 'v-jlc-comfirm-header-spe' : ''
            }
        }
    }
</script>

<style lang="scss" scoped>

    .v-jlc-confirm-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .8);
        z-index: 999;
        .v-jlc-comfirm-wrap {
            position: fixed;
            top: 50%;
            left: 50%;
            min-height: 255px;
            width: 75%;
            -webkit-transform: translate3d(-50%, -50%, 0);
            transform: translate3d(-50%, -50%, 0);
            text-align: center;
            background: #fff;
            border-radius: 10px;
            z-index: 1000;
            padding: 0 36px;
            .v-jlc-comfirm-header {
                padding: 30px 10px 10px;
                font-size: 36px;
                color: #535c71;
                font-weight:700;
                letter-spacing:3px;
            }
            .v-jlc-comfirm-header-spe {
                padding: 40px 0 36px;
                line-height: 40px;
            }
            .v-jlc-comfirm-content {
                padding: 62px 30px;
                font-size: 26px;
                line-height: 46px;
                color: #666;
                text-align: center; // white-space: pre-wrap;
            }
            .v-jlc-confirm-left {
                text-align: left;
            }
            .v-jlc-confirm-center {
                text-align: center;
            }
            .v-jlc-confirm-right {
                text-align: right;
            }
            .v-jlc-comfirm-content-spe {
                padding:0 20px 40px;
                font-size: 26px;
                color:#858899;
                text-align:justify;
            }
            .v-jlc-comfirm-buttons {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                border-top: solid 1px #e5e5e5;
                .v-jlc-comfirm-buttons-singal {
                    flex: 1;
                    height: 120px;
                    line-height: 120px;
                    font-size: 32px;
                    font-weight:600;
                    text-align: center;
                    color: #ed2c50;
                    border-right: solid 1px #e5e5e5;
                    letter-spacing:3px;
                    &:first-child {
                        border-bottom-left-radius: 10px;
                    }
                    &:last-child {
                        border-bottom-right-radius: 10px;
                        border-right: none;
                    }
                    &:active {
                        background: #ddd;
                        opacity: .8;
                    }
                }
            }
        }
    }
    .v-jlc-comfirm-fade-enter-active,
    .v-jlc-comfirm-fade-leave-active {
        transition: opacity .5s;
    }

    .v-jlc-comfirm-fade-enter,
    .v-jlc-comfirm-fade-leave-to {
        opacity: 0;
    }

    // .v-jlc-comfirm-bounce-enter-active {
    //     -webkit-animation: bounce-in .5s;
    //     animation: bounce-in .5s;
    // }

    // .v-jlc-comfirm-bounce-leave-active {
    //      -webkit-animation: bounce-in .5s reverse;
    //     animation: bounce-in .5s reverse;
    // }
    // @-webkit-keyframes bounce-in {
    //     0% {
    //         -webkit-transform: scale(1);
    //         transform: scale(1);
    //         opacity: 0;
    //     }
    //     50% {
    //         -webkit-transform: scale(1.2);
    //         transform: scale(1.2);
    //         opacity: .5;
    //     }
    //     100% {
    //         -webkit-transform: scale(1);
    //         transform: scale(1);
    //         opacity: 1;
    //     }
    // }
    // @keyframes bounce-in {
    //     0% {
    //         -webkit-transform: scale(1);
    //         transform: scale(1);
    //         opacity: 0;
    //     }
    //     50% {
    //         -webkit-transform: scale(1.2);
    //         transform: scale(1.2);
    //         opacity: .5;
    //     }
    //     100% {
    //         -webkit-transform: scale(1);
    //         transform: scale(1);
    //         opacity: 1;
    //     }
    // }
</style>
