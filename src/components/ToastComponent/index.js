/*
 * @Author: zhaobendong
 * @Date: 2017-12-11 19:16:15
 * @Last Modified by: zhaobendong
 * @Last Modified time: 2018-05-07 11:48:23
 * @Describetion: Toast插件
 */

 /**
  * Toast组件使用说明
  * 参数
  * {
  * msg:'表示需要提示的消息',
  * position: '没有设置type选项时提示框的位置，上中下三种，默认是中间，可以设置的值为：middle,top,bottom,20(这个20是位置，实际上设置的20%距离top多少)',
  * type: '表示是否需要图标提示，默认是不需要，可以设置的值为：空和icon',
  * iconType: '表示图标提示是成功还是失败，默认是成功图标，前提是要设置了type的值，否则设置该值无意义，可以设置的值为：空和fail',
  * duration: '表示多久之后toast弹窗消失，默认是2s，设置格式 duration: 3000'
  * }
  * ? 显示toast 不是在实例化的组件中 Vue.toast({})  如果是在vue的组件中使用则 this.$toast({})
  * 默认是2s之后自动关闭toast
  */

import ToastComponent from './Toast.vue'
let Toast = {},timer
Toast.install = function (Vue, options = {}) {
    let opt = {
        duration: 2000 // 默认时间是2s
    }
    // 在安装的时候便可以传入参数（一个对象）
    for (let key in options) {
        opt[key] = options[key]; 
    }
    // 在全局状态下只有一个实例
    let instance
    // 在Vue的原型上扩展方法
    Vue.toast = Vue.prototype.$toast = function (option = {}) {
        // 对option进行解析
        if (typeof option == 'object') {
            for (let key in option) {
                opt[key] = option[key]
            }
        }
        // 实例化所引入的插件
        const ToastController = Vue.extend(ToastComponent)
        // 判断当前实例是不是已经存在
        if (!instance) {
            // 实例化插件并挂在到某一个元素上
            instance = new ToastController({
                el: document.createElement('div')
            })
        }
        if (instance.visible) return
        instance.tips = opt.msg
        instance.type = opt.type
        instance.iconType = opt.iconType
        instance.position = opt.position
        instance.visible = true
        // 添加在body内
        document.body.appendChild(instance.$el)
        // 如果没有设置时间，默认3s后移除
        clearTimeout(timer)
        timer = setTimeout(() => {
            instance.visible = false
            if(opt.callback){
                opt.callback();
            }
        }, opt.duration)
    }
}
// 自动安装插件
if(typeof window != 'undefined' && window.Vue){
    Vue.use(Toast)
}
// 导出对象
export default Toast
