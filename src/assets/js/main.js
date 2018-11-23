/**全局路径配置（二级域名）**/
/*cn域名和com域名配置不一样，通过url来区分*/
// GLOBAL_PATH这个变量是通过webpack.DefinePlugin这个插件来定义的全局变量

/**全局路径配置**/
// import path from './global.path.setting'
// const GP =GLOBAL_PATH

const GlobalPath = {
    html: window.GLOBAL_PATH.URL_HTML,
    wapHtml: window.GLOBAL_PATH.URL_HTML_WAP,
    wxLink: window.GLOBAL_PATH.URL_WX_WAP,
    staticUrl: window.GLOBAL_PATH.URL_STATIC,
    ajaxurl: window.GLOBAL_PATH.URL_API,
    wxAppId: window.GLOBAL_PATH.ID_WX_APP,
    wxurl: window.GLOBAL_PATH.URL_WX_VERIFY,
    tdAppId: window.GLOBAL_PATH.ID_TD_APP,
    companyName: window.GLOBAL_PATH.COMPANY_NAME,
    companyICP: window.GLOBAL_PATH.COMPANY_ICP,
    serviceTel: window.GLOBAL_PATH.SERVICE_TEL
}
// pushData数据埋点配置,CONFIG_PUSHDATA_PATH这个变量是通过webpack.DefinePlugin这个插件来定义的全局变量
const ConfigPath = {
    ajaxurl: window.GLOBAL_PATH.URL_API,
    dataAjaxUrl: window.GLOBAL_PATH.URL_PUSH_DATA,
    appkey: window.GLOBAL_PATH.KEY_PUSH_DATA
}
export {ConfigPath}
export default GlobalPath