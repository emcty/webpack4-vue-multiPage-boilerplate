/*
 * update by liyaping on 2017/9/11 
 * 新增信用卡列表：creditCardList
 *
 * update by yangjinghua on 2017/9/210
 * 新增右上角可配置字段：rightItems
 *
 *
 * jlcApp.invest() // 不需要穿数据直接调用
 * jlcApp.addrate(['lsls','haha']) // 需要拼很多字段用数组
 * jlcApp.share({"shareShowType":1, "shareTitle":"我是title", "shareImageUrl":"lala.jpg","shareLinkUrl":"www.aa.com","wechatShareLinkUrl":"www.bb.com","shareDescription":"我是描述", "shareType":2}) 需要穿json数据
 * jlcApp.addrate('lll') 需要传单个数据
 * 
 * update by zhaobendong 2017.11.21
 * 增加打开的微信客户端字段 openWX
 * */

let tool = { // 工具对象（对内）
    getPara: function (param) { // 获取url参数
        let query = window.location.search
        let iStart = query.indexOf(param)
        let iEnd = query.indexOf("&", iStart += param.length + 1)
        return query.indexOf(param) == -1 ? '' : (iEnd == -1 ? query.substring(iStart) : query.substring(iStart, iEnd))
    },
    typeHendle: function (key, object) { // 处理参数类型
        return key + "::" + ({
            "[object Array]": object.join && object.join("::"),
            "[object Object]": JSON.stringify(object)
        }[toString.call(object)] || object)
    },
    extend: function (option) { // 浅拷贝(为对象拷贝方法和属性)
        for (let attr in option) {
            this[attr] = option[attr]
        }
    }
}

let newVersion = tool.getPara('newVersion'), // APP版本号
    vNum = (newVersion.replace(/\./g, '')) | 0, // vNum == 0||1 为2.9.0之前版本
    initArr = ['h5Login', 'invest', 'home', 'safe', 'events', 'account', 'feedback', 'addrate', 'updateApp', 'dreamPlan', 'actionLogin', 'salaryPlan', 'rentOrMortgagePlan', 'currentAssets', 'addRateDetailList', 'dreamPlanDetailList', 'tradeRecord', 'backLast', 'backAll', 'dreamPlanDetail', 'dreamPlanCurrentList', 'addCreditCard', 'creditCardPayment', 'login', 'rentOrMortgagePlanList', 'salaryPlanDetail', 'sevenDaysPlanAmount', 'bindCreditCard', 'creditCardList', 'bindCard', 'openWX'] // 可以直接使用的key

const jlcApp = { // 对外提供方法的对象
    newVersion: vNum // APP版本号
}

tool.extend.call(jlcApp, (function () { // 为jlcApp对象添加initArr的方法
    let json = {}
    for (let i = 0, len = initArr.length; i < len; i++) {
        json[initArr[i]] = (function () {
            let key = initArr[i]
            return function (data) {
                let url = 'jlcapp::' + (data ? (vNum >= 290 && data.join && tool.typeHendle(key, data) || vNum >= 291 && tool.typeHendle(key, data) || key) : (vNum >= 291 ? key + "::" : key))
                document.location = url
            }
        })()
    }
    return json
})())

tool.extend.call(jlcApp, { // 为jlcApp添加需要特殊处理的方法
    goAddRate: function () {
        let url = 'jlcapp::' + (vNum >= 291 ? "goAddRate::" : "addrate")
        document.location = url
    },
    share: function (data) {
        if (data == null) {
            return
        }
        let url = 'jlcapp::' + (vNum >= 291 ? tool.typeHendle('share', data) : tool.typeHendle('share', [data.shareType - 1, data.shareTitle, data.shareImageUrl, data.wechatShareLinkUrl, data.shareDescription]))
        document.location = url
    },
    rightItems: function (data) {
        let url = "jlcapp::rightItems::" + JSON.stringify([data])
        document.location = url
    }
})
export default jlcApp