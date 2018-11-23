/**
 * Created by YKDZ127 on 2016/5/19.
 * 数据埋点
 */
/*
//使用demo
1、使用require
    //引入埋点
    require('push')
    //检测埋点
    try {
        let pushDataObj = new UserData()
        pushDataObj.userId = userId
    } catch (error) {}
2、直接引入pushData.js
    try {
        let pushDataObj = new UserData()
        pushDataObj.userId = userId
    } catch (error) {}

*/
// import { cookie } from './tool.js'//这种方式引入，wx2Share.js中会自动依赖全局的_dll_common，问题待查，先用下面的方式声明
let cookie = function (name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        let expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            let date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        let path = options.path ? '; path=' + options.path : '; path=/';
        let domain = options.domain ? '; domain=' + options.domain : '';
        let secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        let cookieValue = null;
        if (document.cookie && document.cookie != '') {
            let cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].replace(/\s/g, "");
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};
let ConfigPath = window.GLOBAL_PATH
let apiJianlc = "https://api.jianlc.com"
import $request from './xhrequest'


function UserData() {
    this.userId = "" //用户userId
    this.timestampEnter = "" //进入页面的时间戳
    this.timestampLeft = "" //离开页面的时间戳
    this.ipAddress = "" //ip地址(通过后端接口返回)
    this.url = "" //当前页面的链接
    this.referer = "" //记录页面来源(此页面从哪个页面跳转过来的)
    this.fromPageUrl = "" //来源页面(同referer)
    this.goPageUrl = "" //去往页面(跳转页面的链接不包含参数)
    this.ticket = "" //后续接口访问票据
    this.errorFlag = true //数据接口鉴权失败是否需要提示
    this.tempUid = '' //用户的唯一标识 //不存在userId时的用户标识(通过后端接口返回) //在app中使用tempSign的值
    this.userAgent = window.navigator.userAgent //浏览器的HTTP请求的用户代理头的值
    this.app = /webview/i.test(this.userAgent) //在app中
    this.micromessenger = /MicroMessenger/i.test(this.userAgent) //在微信中
    this.flag = false //上报信息失败的标识，上报成功为true,暂时未用
    this.clickEvent = "" //点击事件需要上报的埋点名称(英文)
    this.content = "" //附加信息，如手机号码等，暂时只有pc注册成功页需要上传
    this.rid = "" //鉴权接口需要的参数标识
    this.preventUnload = true //控制location.href触发onunload事件

    /* 热点图新增字段 */
    this.appVersion = this.getPara("newVersion") // APP版本号
    this.clickLocationX = "" //点击位置的X坐标
    this.clickLocationY = "" //点击位置的Y坐标
    this.isPv = 1 // 是不是pv

    this.init()
}

UserData.prototype = {
    init: function () {
        let _this = this
        this.getUserId()
        this.getTempUid()
        this.getEle("rid", _this.getRandom)
        this.getUrl()
        this.eventHandle()
        this.getInfoFromJava()
        this.hotSpot()
    },
    getUserId: function () {
        this.userId = cookie('userId') || '';
    },
    getPara: function (param) { //获取地址栏中的参数值
        let query = window.location.search
        if (query.length == 0) {
            return ""
        } else {
            let iLen = param.length
            let iStart = query.indexOf(param)
            //判断是否有那个需要查询值的传递参数
            if (iStart == -1) {
                return "" //没有就返回一个空值
            }
            iStart += iLen + 1
            let iEnd = query.indexOf("&", iStart) //判断是不是带有多个参数   &为多个参数的连接符号
            if (iEnd == -1) {
                return query.substring(iStart)
            }
            return query.substring(iStart, iEnd)
        }
    },
    getTempUid: function () { //获取临时id(区分app和非app)
        let _this = this
        if (this.app) {
            //tempSign   在app中使用app传来的此字段值
            this.tempUid = cookie('tempSign') || this.getPara('tempSign')
        } else {
            this.getEle("tempUid", _this.generateUUID)
        }
    },
    getEle: function (ele, getFn) { //定义公共方法获取rid和temmpUid
        let _ele = cookie(ele),
            _this = this
        if (_ele) {
            this[ele] = _ele
        } else {
            this[ele] = getFn()
            cookie(ele, _this[ele])
        }
    },
    generateUUID: function () { //获取唯一字符标识(临时用户Id,tempUid)
        let d = new Date().getTime()
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0
            d = Math.floor(d / 16)
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
        })
        return uuid
    },
    getTimeStamp: function () { //获取当前时间戳
        return new Date().getTime()
    },
    getRandom: function () { //获取8位随机数字rid
        let res = ""
        for (let i = 0; i < 8; i++) {
            let id = Math.floor(Math.random() * 8)
            res += id
        }
        return res
    },
    getAppWxUrl: function () { //微信和app中的fromPageUrl的特定标识
        if (this.micromessenger) {
            this.fromPageUrl = "micromessenger"
        } else if (this.app) {
            this.fromPageUrl = "app"
        } else { //
            this.fromPageUrl = "browser"
        }
    },
    getUrl: function () { //获取页面相关路径url,referer,fromPageUrl
        let _href = window.location.href,
            _referer = window.document.referrer,
            _this = this
        this.referer = encodeURI(_referer)
        this.url = encodeURI(_href)
        if (_referer) {
            let _fromPageUrl = cookie('prevUrl')
            if (_fromPageUrl) {
                let link1 = _fromPageUrl.split('?')[0],
                    link2 = _referer.split('?')[0]
                if (link1 == link2) {
                    this.fromPageUrl = _referer
                    cookie('prevUrl', _this.fromPageUrl)
                } else {
                    this.fromPageUrl = _fromPageUrl
                }

            } else {
                this.fromPageUrl = _referer
                cookie('prevUrl', _this.fromPageUrl)
            }
        } else {
            this.fromPageUrl == ''
        }
        this.getAppWxUrl()
    },
    eventHandle: function () { //页面进入和离开时的时间设置timestampEnter,timestampLeft
        let _this = this
        _this.timestampEnter = _this.getTimeStamp()

        window.onunload = function () {
            _this.timestampLeft = _this.getTimeStamp()

            if (_this.preventUnload) {
                _this.setTicket()
            }

            return false
        }
    },
    getInfoFromJava: function () { //获取ip地址
        let _url = apiJianlc + "/wap/platform/v1/ip",
            _this = this
        if (/^https?:\/\/[0-9]/.test(apiJianlc)) {
            _this.ipAddress = apiJianlc.replace(/https?:\/\//,'')
            _this.setTicket()
            return false
        }
        $request.get(_url).then((data)=> {
            _this.ipAddress = data.data.ip || ""
                _this.setTicket()
        })
    },
    authtication: function () { //鉴权接口
        let _url = ConfigPath.URL_PUSH_DATA + "/report/access",
            _this = this,
            rids = this.rid

        $request.post(_url + "?appKey=" + ConfigPath.KEY_PUSH_DATA + "&rid=" + rids + "&version=1.0").then((data)=> {
            if (data.status == 1) {
                _this.ticData(data)
            } else {
                // if (_this.errorFlag) {
                //     _this.setTicket()
                //     //alert("鉴权失败:"+data.desc)
                // }
                throw new Error('鉴权失败');
            }
        })
    },
    ticData: function (data) { //存储鉴权信息(cookie)
        this.ticket = data.result.ticket
        cookie("ticket", data.result.ticket, {
            expires: new Date(data.result.effectTime * 1000)
        })
        this.pushData()
    },
    setTicket: function (isHotTap) { //获取票据信息
        let _ticket = cookie("ticket")
        if (_ticket) {
            this.ticket = _ticket
            this.pushData(isHotTap)
        } else {
            this.authtication()
        }
    },
    pushData: function (isHotTap) { //上报接口
        let _url = ConfigPath.URL_PUSH_DATA + "/report/js/upload",
            rids = this.rid,
            _this = this,
            uploadData = isHotTap ? {
                "url": this.url,
                "clickLocationX": this.clickLocationX,
                "clickLocationY": this.clickLocationY,
                "userId": this.userId,
                "tempUid": this.tempUid,
                "fromPageUrl": this.fromPageUrl
            } : {
                "userId": this.userId,
                "tempUid": this.tempUid,
                "timestampEnter": this.timestampEnter,
                "timestampLeft": this.timestampLeft,
                "url": this.url,
                "referer": this.referer,
                "fromPageUrl": this.fromPageUrl,
                "goPageUrl": this.goPageUrl,
                "ipAddress": this.ipAddress,
                "content": this.content,
                "userAgent": this.userAgent,
                "clickEvent": this.clickEvent,
                "appVersion": this.appVersion,
                "isPv": this.isPv
            }
        $request.post(_url + "?rid=" + rids + "&version=1.0&ticket=" + this.ticket,{data:JSON.stringify(uploadData)}).then((data)=>{
            if (data.status == 1) {
                //alert('接口成功')
                //接口成功
                _this.flag = true
            } else {
                _this.flag = false
            }
        })
    },
    clickEvents: function (goPageUrl, clickEvent, contentPhone) { //设置点击事件的上报信息并上报
        if (goPageUrl) {
            this.timestampLeft = this.getTimeStamp()
        }
        this.goPageUrl = goPageUrl ? goPageUrl : ''
        this.content = contentPhone ? contentPhone : ''
        this.clickEvent = clickEvent
        this.preventUnload = false
        this.isPv = 0
        this.setTicket()
    },
    hotSpot: function () {
        let drawingWidth = 750, // 设计图宽度
            // scaleNum = drawingWidth / $(window).width(), // 设计图与实际尺寸的
            scaleNum = drawingWidth / window.screen.width, // 设计图与实际尺寸的
            dElm = document.documentElement,
            startX, startY, _this = this

        document.addEventListener("touchstart", function (ev) {
            let oTouch = ev.changedTouches[0]
            startX = oTouch.pageX
            startY = oTouch.pageY
        }, false)

        document.addEventListener("touchend", function (ev) {
            let oTouch = ev.changedTouches[0]
            if (_this.isFixedStyle(ev.target) && Math.abs(oTouch.pageX - startX) < 4 && Math.abs(oTouch.pageY - startY) < 4) {
                _this.clickLocationX = Math.floor(startX * scaleNum) //点击位置的X坐标
                _this.clickLocationY = Math.floor((startY + dElm.scrollTop) * scaleNum) //点击位置的Y坐标
                _this.preventUnload = false
                _this.isPv = 0
                _this.setTicket(true)
            }
        }, false)
    },
    isFixedStyle: function (oThis) {
        if (getComputedStyle(oThis, null).position === "fixed") {
            return false
        } else {
            if (oThis.nodeName.toLocaleLowerCase() === "body") {
                return true
            } else {
                // return arguments.callee(oThis.parentNode)
                // ES6中没有arguments
                return this.isFixedStyle(oThis.parentNode)
            }
        }
    }
}
export default UserData
