<template>
	<transition name="v-jlc-keyboard-transition">
		<div class="keyboard-wrap keyboard-wrap-iphonex" v-if="visible" @click.stop>
			<div class="keyboard-title">
				<img src="./images/jlc_logo.png" alt="简理财logo">
				<p>简理财安全键盘</p>
			</div>
			<div class="keyboard-cont">
				<ul>
					<li>
						<p @click.stop="getKeyBoardValue('1')">1</p>
						<p @click.stop="getKeyBoardValue('2')">2</p>
						<p @click.stop="getKeyBoardValue('3')">3</p>
					</li>
					<li>
						<p @click.stop="getKeyBoardValue('4')">4</p>
						<p @click.stop="getKeyBoardValue('5')">5</p>
						<p @click.stop="getKeyBoardValue('6')">6</p>
					</li>
					<li>
						<p @click.stop="getKeyBoardValue('7')">7</p>
						<p @click.stop="getKeyBoardValue('8')">8</p>
						<p @click.stop="getKeyBoardValue('9')">9</p>
					</li>
					<li>
						<p class="empty" @click.stop></p>
						<p @click.stop="getKeyBoardValue('0')">0</p>
						<p class="delete" @click.stop="getKeyBoardValue('x')">
							<img src="./images/delete.png" alt="删除">
						</p>
					</li>
					<li class="iphonex"></li>
				</ul>
			</div>
		</div>
	</transition>
</template>

<script>
	export default {
		name: "KeyBoardComponent",
		data() {
			return {
				visible: false, // 控制组件的显示隐藏，默认不显示
				storageValue: '', // 这个值用于存储所按自定义键盘每个值拼接的总字符串，比如12,123,123456等
				number: 0, // 这个值代表输入的字符串长度
				specialValue: '' // 这个特殊值用于存储每次自定义键盘输入的值
			}
        },
        created() {
            // 点击键盘之外的地方可以关闭键盘
			// document.addEventListener('touchstart', (e) => {
			// 	e.stopPropagation()
			// 	this.visible = false
			// }, false)
        },
        mounted() {
        },
		methods: {
			// 获取自定义键盘的按键值
			getKeyBoardValue(value) {
				// if(e.target.nodeName === 'P' && e.target.innerText != '') {
				if(value !== 'x') {
					this.storageValue = this.storageValue + value
					this.specialValue = value
				}else {
					this.storageValue = this.storageValue.substr(0, this.storageValue.length - 1)
				}
				if(this.storageValue.length > this.number) {
					this.clearValue(this.specialValue)
				}
				!this.visible ? this.storageValue = '' : this.callback(this.storageValue)
				// }
			},
			// 用于传出所按键的总值
			callback(data) {},
			// 清空所按键总值并赋予一个特殊的值给按键总值
			clearValue(value) {
				this.storageValue = ''
				this.storageValue = value
			}
		}
	}

</script>

<style lang="scss">
	.keyboard-wrap {
		position: fixed;
		left: 0;
		bottom: 0;
		height: 542px;
		width: 100%;
		z-index: 10000;
		.keyboard-title {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 62px;
			background-color: #f1f2f3;
			img {
				height: 30px;
				width: 30px;
				margin-right: 12px;
			}
			p {
				font-size: 24px;
				color: #d0c29d;
			}
		}
		.keyboard-cont {
			background-color: #fff;
			ul {
				li {
					display: flex;
					justify-content: center;
					align-items: center;
					p {
						flex: 1;
						height: 120px;
						line-height: 120px;
						text-align: center;
						font-size: 38px;
						color: #000;
						border-top: solid 2px #f3f3f3;
						border-right: solid 2px #f3f3f3;
						&:last-child {
							border-right: none;
						}
						&:active {
							background-color: #e5e5e5;
						}
					}
					.empty {
						&:active {
							background-color: #fff;
						}
					}
					.delete {
						text-align: center;
						line-height: 120px;
						background-color: #e5e5e5;
						img {
							height: 30px;
							width: 42px;
						}
						&:active {
							background-color: #fff;
						}
					}
				}
				@media only screen and (device-width:375px) and (device-height:812px) and (-webkit-device-pixel-ratio:3){
					.iphonex {
						height: 68px;
						width: 100%;
						background-color: #fff;
					}
				}
			}
		}
	}
	@media only screen and (device-width:375px) and (device-height:812px) and (-webkit-device-pixel-ratio:3){
		.keyboard-wrap-iphonex {
			height: 610px;
		}
	}
	@keyframes transSport {
		from {
			bottom: -542px;
		}
		to {
			bottom: 0;
		}
	}
	.v-jlc-keyboard-transition-enter-active {
		animation: transSport .5s;
		animation-fill-mode: forwards;
	}
    .v-jlc-keyboard-transition-leave-active {
		animation: transSport .5s reverse;
		animation-fill-mode: forwards;
    }

</style>
