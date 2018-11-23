/**
 * @Author: zhaobendong
 * @Date: 2018-04-11 17:57:53
 * @Last Modified by: zhaobendong
 * @Last Modified time: 2018-05-07 10:30:47
 * @Description: 数字键盘组件
 */
/**
 * 键盘组件使用说明
 * 参数：
 * {
 * 		visible: boolean '键盘显示与否，默认false不显示,这个值一般不需要设置',
 * 		number: number '键盘最大允许输入位数，默认是6位',
 * 		storageValue: string '键盘值主要是为了重置输入框的值，这个值一般不需要设置'
 * }
 *
 		this.$keyboard({number: 6},(data)=>{
					// data 表示键盘按键返回的值
				})
 *
 */

import KeyBoardComponent from './KeyBoardComponent.vue'
let KeyBoard = {}
KeyBoard.install = function (Vue, options = {}) {
    let opt = {
		visible: false,
		number: 6,
		storageValue: ''
    }
    // 在安装的时候便可以传入参数（一个对象）
    for (let key in options) {
        opt[key] = options[key];
    }
    let instance = ''
    Vue.keyboard = Vue.prototype.$keyboard = function (option = {}, callback) {
        if (typeof option === 'object') {
            Object.assign(opt, option)
		}else if (typeof option === 'function') {
			callback = option
		}
        // 实例化所引入的插件
        const KeyBoardController = Vue.extend(KeyBoardComponent)
        if (!instance) {
            instance = new KeyBoardController({
                el: document.createElement('div')
            })
		}else {
            instance.visible = true
			instance.callback = (option) => {
				callback(option)
			}
			return
        }
		instance.number = opt.number
		instance.storageValue = opt.storageValue
        instance.visible = true
        document.body.appendChild(instance.$el)
        instance.callback = (option) => {
            callback(option)
        }
	}
	Vue.resetKeyboadrValue = Vue.prototype.$resetKeyboadrValue = function () {
		instance ? instance.storageValue = '' : ''
    }
    Vue.closeKeyboard = Vue.prototype.$closeKeyboard = function () {
		Vue.resetKeyboadrValue()
		instance ? instance.visible = false : ''
    }
}
export default KeyBoard
