/**
 * @Author: zhaobendong
 * @Date: 2018-03-28 17:15:34
 * @Last Modified by: zhaobendong
 * @Last Modified time: 2018-05-11 09:34:40
 * @Description: 页面加载用户等待插件
 */
/**
 * 使用方法
 * 显示loading 不是在实例化的组件中 Vue.showDot()  如果是在vue的组件中使用则 this.$showDot()
 * 关闭loading 不是在实例化的组件中 Vue.closeDot()        如果是在vue的组件中使用则 this.$closeDot()
 */


import DotComponent from './DotComponent.vue'
let Dot = {},timer = 0
Dot.install = function (Vue, options = {}) {
    // 在全局状态下只有一个实例
    let instance
    // 在Vue的原型上扩展方法
    Vue.showDot = Vue.prototype.$showDot = function (option = {duration:8000}) {
        // 实例化所引入的插件
        const DotController = Vue.extend(DotComponent)
        // 判断当前实例是不是已经存在
        if (!instance) {
            // 实例化插件并挂在到某一个元素上
            instance = new DotController({
                el: document.createElement('div')
            })
            // 添加在body内
            document.body.appendChild(instance.$el)
        }
        if (instance.show) return
        instance.show = true
        // 如果没有设置时间，默认3s后移除
        clearTimeout(timer)
        timer = setTimeout(() => {
            instance.show = false
        }, option.duration)

    }
    Vue.closeDot = Vue.prototype.$closeDot = function () {
        instance.show = false
    }
}
// 自动安装插件
if(typeof window != 'undefined' && window.Vue){
    Vue.use(Dot)
}
// 导出对象
export default Dot
