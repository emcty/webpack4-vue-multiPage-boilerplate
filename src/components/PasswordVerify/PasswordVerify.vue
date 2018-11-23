<template>
    <transition name="v-jlc-password-fade" v-on:after-enter="afterEnter" v-on:enter="enter">
        <div class="v-jlc-password-wrap" v-if="visible" key="input-name" @click.stop.prevent="close(true)">
            <div ref="inner" class="v-jlc-password-inner" @click.stop>
                <div class="v-jlc-password-header">
                    <p v-html="title"></p>
                    <img @click.stop="close(true)" src="./images/close.png" alt="关闭">
                </div>
                <div v-if="isShowDes" class="v-jlc-password-content">
                    <h3 v-html="describe"></h3>
                    <p><span class="qian">{{money | moneyFilter}}</span><span class="yuan">元</span></p>
                </div>
                <div class="v-jlc-password-pay">
                    <label ref="labelCode" for="code">
                        <!-- <ul class="security-code-container">
                            <li class="field-wrap" v-for="(item, index) in number" :key="index">
                                <i class="char-field" :class="{'char-field-dot': value[index]}"></i>
                            </li>
                        </ul> -->
                        <table>
                            <tr class="security-code-container">
                                <td class="field-wrap entry" v-for="(item, index) in number" :key="index">
                                    <i class="char-field" :class="{'char-field-dot': value[index]}"></i>
                                </td>
                            </tr>
                        </table>
                    </label>
                    <input ref="passwordObj" aotufocus class="input-code" @keyup="handleInput($event)" v-model="value" id="code" name="code" type="tel"
                        :maxlength="number"  autocorrect="off" autocomplete="off" autocapitalize="off">
						<!-- <div ref="passwordObj" class="input-code">{{value}}</div> -->
                </div>
                <div class="v-jlc-password-info">
                    <img src="./images/safety.png" alt="公安部监管信息安全">
                    <p>公安部监管信息安全</p>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
	import {formatThousand} from '@js/modules/tool'
    export default {
        name: "PasswordVerify",
        data() {
            return {
                visible: false, // 控制组件的显示隐藏，默认不显示
                isShowDes: false, // 是否显示描述性的文字，默认不显示
                title: '', // 组件的title
                value: '', // 输入框的值
                number: 6, // 密码框的位数
                describe: '', // 内容描述
                money: '' // 金额
            }
		},
        methods: {
            enter(el, done) {
                let inner = el.children[0]
                inner.className = `${inner.className} inner-animate`
                done()
            },
            afterEnter(el) {
                this.$refs.passwordObj.focus()
			},
            close(data) {
                this.clearInput()
				this.visible = false
            },
            handleSubmit() {
                this.$emit('input', this.value)
            },
            handleInput(e) {
                this.$refs.passwordObj.value = this.value
                if (this.value.length >= this.number) {
                    this.hideKeyboard()
                    this.callback(this.value)
                    this.clearInput()
                }
                this.handleSubmit()
            },
            hideKeyboard() {
                // 输入完成隐藏键盘
                document.activeElement.blur() // ios隐藏键盘
                this.$refs.passwordObj.blur() // android隐藏键盘
            },
            callback(data) {},
            // 清除输入框的值
            clearInput() {
                this.value = ''
            }
        },
        filters: {
			moneyFilter: function(value) {
				return formatThousand(value, 2)
			}
		}
    }
</script>

<style lang="scss" scoped>
    .v-jlc-password-wrap {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .8);
        z-index: 999;
        .v-jlc-password-inner {
            position: absolute;
            top: -20%;
            left: 50%;
            min-height: 295px;
            width: 69%;
            transform: translate3d(-50%, -45%, 0);
            text-align: center;
            background: #f5f5f5;
            border-radius: 10px;
            z-index: 1000;
            .v-jlc-password-header {
                position: relative;
                height: 94px;
                border-bottom: solid 1px #e5e5e5;
                p {
                    height: 100%;
                    line-height: 94px;
                    font-size: 30px;
                    color: #333;
                }
                img {
                    position: absolute;
                    top: 29px;
                    right: 25px;
                }
            }
            .v-jlc-password-content {
                text-align: center;
                h3 {
                    height: 78px;
                    line-height: 78px;
                    font-size: 24px;
                    color: #666;
                }
                p{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .qian {
                        font-size: 48px;
                        color: #333;
                    }
                    .yuan {
                        margin-left: 8px;
                        font-size: 36px;
                    }
                }
            }
            .v-jlc-password-pay {
                label {
                    display: block;
                    width: 100%;
                    height: 76px;
                    margin-top: 46px;
                }
                table {
                    width: 100%;
                }
                .security-code-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 445px;
                    margin: 0 auto;
                    .field-wrap {
                        flex: 1;
                        height: 76px;
                        // width: 73px;
                        border: solid 1px #e5e5e5;
                        border-right: none;
                    }
                    .entry {
                        position: relative;
                        background: #fff;
                        &:nth-of-type(1) {
                            border-radius: 10px 0 0 10px;
                        }
                        &:last-child {
                            border-radius: 0 10px 10px 0;
                            border-right: solid 1px #e5e5e5;
                        }
                        .char-field {
                            font-style: normal;
                        }
                        .char-field-dot {
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            height: 16px;
                            width: 16px;
                            margin-left: -8px;
                            margin-top: -8px;
                            background: #000;
                            border-radius: 50%;
                        }
                    }
                }
                .input-code {
                    position: absolute;
                    left: -9999px;
                    top: -99999px;
                    width: 100px;
                    height: 100px;
                    opacity: 0;
                    overflow: visible;
                    z-index: -1;
                }
            }
            .v-jlc-password-info {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 79px;
                img {
                    width: 20px;
                    height: 23px;
                    margin-right: 10px;
                }
                p {
                    font-size: 22px;
                    color: #d2c29f;
                    letter-spacing: 1px;
                }
            }
        }
        @keyframes top-middle {
            from {
                top: -20%;
            }
            to {
                top: 30%;
            }
        }
        .inner-animate {
            animation: top-middle .5s ease;
            animation-fill-mode: forwards;
        }
    }

    .v-jlc-password-fade-enter-active,
    .v-jlc-password-fade-leave-active {
        transition: opacity .5s;
    }

    .v-jlc-password-fade-enter,
    .v-jlc-password-fade-leave-to {
        opacity: 0;
    }
</style>
