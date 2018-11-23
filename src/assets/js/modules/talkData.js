/**
 * Created by liyaping on 2017/10/27.
 * 区分talkingData使用的appid测试和生产
 * talkingdata埋点方式
 * 测试 APPID：11DFEA1043AD4423BCCA6E30482BA9BE
 * 生产 APPID：F36AAD0DBA0347728550670CB266992C
 */
// import GlobalPath from '../main.js'

let GlobalPath = window.GLOBAL_PATH

function talkData(options) {
    var defaults = {
        vn: 'jlc',
        vc: '1.0.1'
    }
    this.opt = Object.assign({}, defaults, options || {})
    this.loadScript('https://jic.talkingdata.com/app/h5/v1?appid=')
}

talkData.prototype = {
    //loadScript 动态加载js
    loadScript: function (url, callback) {
        url = url + GlobalPath.ID_TD_APP + '&vn=' + this.opt.vn + '&vc=' + this.opt.vc
        var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement,
            script,
            options,
            s
        if (typeof url === "object") {
            options = url
            url = undefined
        }
        s = options || {}
        url = url || s.url
        callback = callback || s.success
        script = document.createElement("script")
        script.async = s.async || false
        script.type = "text/javascript"
        if (s.charset) {
            script.charset = s.charset
        }
        if (s.cache === false) {
            url = url + (/\?/.test(url) ? "&" : "?") + "_=" + (new Date()).getTime()
        }
        script.src = url
        head.insertBefore(script, head.firstChild)
        if (callback) {
            document.addEventListener ? script.addEventListener("load", callback, false) : script.onreadystatechange = function () {
                if (/loaded|complete/.test(script.readyState)) {
                    script.onreadystatechange = null
                    callback()
                }
            }
        }
    },
    clickEvents: function (Cname, Ename) {
        TDAPP.onEvent(Cname, Ename)
    },
    constructor: talkData
}

export default talkData