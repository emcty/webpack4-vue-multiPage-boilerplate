/**
 * Created by RuiXue on 2017/7/17. sdfsdfsf
 * edit on 2017/10/30 通过设备dpr进行适配，覆盖机型更准确。
 * edit on 2018/1/9 Ruixue 增加同盾及通付盾上报数据代码
 */
(function () {
    var width = window.meta && window.meta.uiWidth || 750,//设计稿宽，默认750px,//设计稿宽度
        pw = parseInt(window.screen.width),
        scale = pw / width,
        u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
        var version = parseFloat(u.slice(u.indexOf("Android") + 8)),
            dpr = window.devicePixelRatio < 1.4 ? '330' : window.devicePixelRatio <= 2 ? '400' : 'device-dpi';
        if (version > 2.3) {
            document.write('<meta name="viewport" content="width=' + width + ',minimum-scale=' + scale + ',maximum-scale=' + scale + ',target-densitydpi=' + dpr + ',user-scalable=no">');
        } else {
            document.write('<meta name="viewport" content="width=' + width + ',target-densitydpi=device-dpi,user-scalable=no">');
        }
    } else {
        //适配iphone底部1px白边
        scale = Math.floor(scale * 100) / 100
        document.write('<meta name="viewport" content="width=' + width + ',minimum-scale=' + scale + ',maximum-scale=' + scale + ',target-densitydpi=device-dpi,user-scalable=no">');
    }
})()
