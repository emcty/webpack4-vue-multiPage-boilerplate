/**
 * @Author: zhaobendong
 * @Date: 2018-03-29 15:43:13
 * @Last Modified by: zhaobendong
 * @Last Modified time: 2018-05-11 20:32:53
 * @Description: Confirm组件编写
 */
/**
 * Confirm组件使用说明
 * {
 * message: 字符串 '表示需要提示的消息',
 * buttons: 数组，默认配置是两个按钮：取消和确定  动态配置按钮，只要满足项目需求个数自己定，格式 buttons: [{name:'test'},{name: 'test1'}],
 * title: 字符串 设置提示的头部信息,
 * textAlign: 字符串 设置中间提示内容的排版，居左居右居中三种，默认样式是居中，设置值为：'left' 'center' 'right'
 * btnLeftStyle: 对象 默认设置左边的按钮样式，设置形式 btnLeftStyle: {color: 'red','font-size': '20px'}，  注意：如果只有一个按钮的话，请设置btnLeftStyle样式即可
 * btnRightStyle: 对象 默认设置右边边的按钮样式，设置形式 btnRightStyle: {color: 'red','font-size': '20px'}
 * contStyle: 对象 默认设置中间提示内容的样式，设置形式 contStyle: {color: 'red','font-size': '20px'}
 * }
 * 组件采用Promise形式调用，例如
 * this.$confirm({message: '使用简理财账号登录拾年宝'}).then(res => {
      // res返回的是当前点击按钮封装的对象形如{index: 0, name: '取消'}，进行业务逻辑处理
    })
 */

import ConfirmComponent from './Confirm.vue'
let Confirm = {}
let CONFIRM_TEXT = '确定'
let CANCEL_TEXT = '取消'
// 设置组件的显示的一些属性值
let setInstanceProperties = (obj,config) => {
    obj.message = config.message
    obj.title = config.title
    obj.buttons = config.buttons
    obj.textAlign = config.textAlign
    obj.btnLeftStyle = config.btnLeftStyle
    obj.btnRightStyle = config.btnRightStyle
    obj.contStyle = config.contStyle
    obj.visible = true
}
// vue插件自动安装
Confirm.install = function (Vue, options = {}) {
    // 组件默认值
    let opt = {
        message: '网络异常',
        buttons: [{
                name: CANCEL_TEXT
            },
            {
                name: CONFIRM_TEXT
            }
        ],
        textAlign: 'center',
        title: ''
    }
    // 在安装的时候便可以传入参数（一个对象）
    for (let key in options) {
        opt[key] = options[key]; 
    }
    let instance = ''
    // 在组件的原型上绑定方法
    Vue.prototype.$confirm = function (option = {}) {
        let config = {}
        // 合并参数
        if (typeof option === 'object') {
            config = Object.assign({},opt, option)
        }
        // 实例化所引入的插件
        const ConfirmController = Vue.extend(ConfirmComponent)
        // 如果组件已经实例化就不再去创建组件
        if (!instance) {
            instance = new ConfirmController({
                el: document.createElement('div')
            })
            document.body.appendChild(instance.$el)
        }
        setInstanceProperties(instance,config)
        return new Promise((resolve, reject) => {
            instance.itemClick = (data) => {
                let callBack = data.callBack
                if (typeof callBack === 'function') {
                    callBack()
                }
                instance.visible = false
                resolve(data)
            }
        })
    }
}
export default Confirm
