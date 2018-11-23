/*!
      Changed by LiXiaoyuan on 2016/12/13
      全局路径配置（二级域名）
            测试1：ajaxurl:'http://192.168.200.48:8888',
            测试2：ajaxurl:'http://192.168.200.134:8888',
            测试3：ajaxurl:'http://192.168.200.36:8888',
            测试4：ajaxurl:'http://10.1.12.124:8888',
            预演： ajaxurl:'http://192.168.200.253:8888',
            线上：ajaxurl:'https://api.jianlc.cn'
      测试环境只有这两个wxAPPId:交换使用
            wxAppId:'wxf075dd328d9cc13e',
            wxAppId:'wx6f2f2095713bc86b',
            wxAppId:'wx09f31686a802ff7e'
      微信分享参数：
            测试1：wxurl:'testmobile.jiandollar.com'
            测试2：wxurl:'qb.wx.jiandollar.com'
            测试2：wxurl:'qc.wx.jiandollar.com'
            测试4：wxurl:'qd.wx.jiandollar.com'
            预演：wxurl:'pre.wx.jiandollar.com'
    update
**/
// 全局路径引用
import GlobalPath from '../main'
// 需要先引入jweixin-1.2.0.js这个文件，才会有wx这个对象，后边的会根据这个对象做配置
window.wx = wx;
/**
 * [wxShare 微信分享相关配置]
 * @defaults  {[object]} 默认参数值
 */
// 注意点：配置依赖Zepto文件，所以你需要在使用这个文件之前先引入Zepto
$.wxShare = function (options) {
    /**
     * [defaults 默认参数]
     * @link {[string]} [分享链接，默认为当前页面链接]
     * @AppMessageImg {[string]} [分享好友图片链接]
     * @AppMessageTitle {[string]} [分享好友标题]
     * @AppMessageContent {[string]} [分享好友描述]
     * @AppMessageSuccess {[function]} [用户确认分享后的回调函数(好友)]
     * @AppMessageCancel {[function]} [用户取消分享后的回调函数(好友)]
     * @TimelineImg {[string]} [分享朋友圈图片]
     * @TimelineTitle {[string]} [分享朋友圈描述]
     * @TimelineSuccess {[function]} [用户确认分享后的回调函数(朋友圈)]
     * @TimelineCancel {[function]} [用户取消分享后的回调函数(朋友圈)]
     * @readyFn {[function]} [wx.ready的回调函数里需要执行的回调函数]
     * @onBridgeReadyName {[string]} [接口名称，默认'']
     * @debug {[boolean]} [是否打开微信debug，默认false]
     */
    let defaults = {
            link: window.location.href,
            AppMessageImg: '',
            AppMessageTitle: '',
            AppMessageContent: '',
            AppMessageSuccess: function () {},
            AppMessageCancel: function () {},
            TimelineImg: '',
            TimelineTitle: '',
            TimelineSuccess: function () {},
            TimelineCancel: function () {},
            readyFn: null,
            onBridgeReadyName: '',
            debug: false
        },
        opt = $.extend({}, defaults, options),
        configInfo = {},
        shareurl = window.location.href.split('#')[0];
    /**
     * [success description]
     * @timestamp  {[string]} [生成签名的时间戳]
     * @nonceStr  {[string]} [生成签名的随机串]
     * @signature {[string]} [签名]
     */
    $.ajax({
        url: GlobalPath.ajaxurl + '/wap/wx_share.shtml',
        data: {
            'shareUrl': shareurl
        },
        async: false, //同步请求
        dataType: 'json',
        success: function (info) {
            configInfo.timestamp = info.timestamp;
            configInfo.nonceStr = info.nonceStr;
            configInfo.signature = info.signature;
        },
        error: function (err) {}
    });
    /**
     * [testUrl 给图片路径添加域名]
     */
    function testUrl(url) {
        if (/http/.test(url)) {
            return url;
        } else {
            return GlobalPath.img + url;
        }
    };
    /**
     * [onBridgeReady 微信初始准备函数]
     * @onBridgeReadyName {[string]} [接口名称]
     */
    function onBridgeReady() {
        WeixinJSBridge.call(opt.onBridgeReadyName);
    }
    if (opt.onBridgeReadyName) {
        if (typeof WeixinJSBridge == 'undefined') {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
        } else {
            onBridgeReady();
        }
    }

    /**
     * [donfig 微信分享注入权限验证配置]
     * @debug {[boolean]} [是否开启调试模式]
     * @appId {[string]} [公众号的唯一标识]
     * @timestamp {[string]} [生成签名的时间戳]
     * @nonceStr {[string]} [生成签名的随机串]
     * @signature {[string]} [签名]
     * @jsApiList {[array]} [需要使用的JS接口列表]
     */
    wx.config({
        debug: opt.debug,
        appId: GlobalPath.wxAppId,
        timestamp: configInfo.timestamp,
        nonceStr: configInfo.nonceStr,
        signature: configInfo.signature,
        jsApiList: [
            'onMenuShareTimeline', // 分享到朋友圈
            'onMenuShareAppMessage', // 分享到朋友
            'onMenuShareQQ', // 分享到QQ
            'onMenuShareQZone', // 分享到QQ空间
            'showOptionMenu', // 显示右上角菜单
            'hideOptionMenu', // 隐藏右上角菜单
            'showMenuItems', // 批量显示右上角功能
            'hideMenuItems', // 批量隐藏右上角功能
            'chooseImage', //选择图片
            'uploadImage' //上传图片
        ]
    });
    /**
     * [ready 接口处理成功验证]
     * @isHideShare  {[boolean]} [隐藏显示分享菜单，默认false]
     * @showOptionMenu  {[function]} [显示右上角菜单接口]
     * @hideOptionMenu  {[function]} [隐藏右上角菜单接口]
     * @onMenuShareAppMessage  {[function]} [分享到好友接口]
     * @onMenuShareTimeline  {[function]} [分享到朋友圈接口]
     * @readyFn {[function]} [wx.ready的回调函数里需要执行的回调函数]
     */
    wx.ready(function () {

        /* 需要特殊处理的接口 */
        opt.onBridgeReadyName && wx[opt.onBridgeReadyName]();

        /* 分享到好友 */
        wx.onMenuShareAppMessage({
            title: opt.AppMessageTitle,
            desc: opt.AppMessageContent,
            link: opt.link,
            imgUrl: testUrl(opt.AppMessageImg),
            success: opt.AppMessageSuccess,
            cancel: opt.AppMessageCancel
        });

        /* 分享到朋友圈 */
        wx.onMenuShareTimeline({
            title: opt.TimelineTitle,
            link: opt.link,
            imgUrl: testUrl(opt.TimelineImg),
            success: opt.TimelineSuccess,
            cancel: opt.TimelineCancel
        });

        /* 如果有readyFn就执行此回调函数 */
        opt.readyFn && opt.readyFn();

    });
}
export default $.wxShare