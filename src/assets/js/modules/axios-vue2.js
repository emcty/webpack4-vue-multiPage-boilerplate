require('es6-promise').polyfill();

import axios from "axios";
import GlobalPath from '../main';
import Vue from 'vue';
import Confirm from '../../../components/Confirm';
import loading from '../../../components/loading';
import {
    goUrl,
    storage
} from './tool';

Vue.use(Confirm);
Vue.use(loading);



let cancel;
let axiosPromiseObj = {};
let startTime;
let endTime;

const axiosAPI = axios.create({
  baseURL: GlobalPath.ajaxurl,
  timeout: 8000,
  responseType: "json",
  withCredentials: false,
  validateStatus: function (status) {
    return (status >= 200 && status < 300) || status == 304
  },
  cancelToken: new axios.CancelToken(function (c) {
    cancel = c  
  }),

});

function deepCompare(objNew,objOld){
  if(objNew && objOld && Object.keys(objNew).length !== Object.keys(objOld).length){
    return false;
  }
  for(let k in objNew){
    if(!objOld){
      return false;
    }
    if(!objOld.hasOwnProperty(k)){
      return false;
    }
    if(typeof objNew[k] == "object"){
      return deepCompare(objNew[k],objOld[k]);
    }
    return objOld[k] == objNew[k];
  }
  return false;
}


axiosAPI.interceptors.request.use(config => {
  let startTime = +new Date();
  
  if (axiosPromiseObj[config.url] && deepCompare(config.data,axiosPromiseObj["data"]) && startTime - endTime < 500){
    axiosPromiseObj[config.url]();
    axiosPromiseObj[config.url] = cancel;
 
   } else {
    axiosPromiseObj[config.url] = cancel; 
    axiosPromiseObj["data"] = config.data; 
   
  }
  if (config.method.toLowerCase() == 'post') {
    config.headers = Object.assign({}, config.headers, {
        "userId": storage("userInfo") && storage("userInfo").userId ||'',
        "token": storage("userInfo") && storage("userInfo").token || '',
        "wxopenId": storage("userInfo") && storage("userInfo").wxopenId || '',
        "platform": storage("userInfo") && storage("userInfo").platform || ''
    });
  }

  if(config.data && config.data.commonLoading){
    Vue.$loading(true);
  }
  if(config.headers["Content-Type"] === "multipart/form-data"){
    return config;
  }
  config.transformRequest = [function (data, headers) {
    if (Object.prototype.toString.call(data) === '[object Object]') {
      let keys = Object.keys(data);
      return keys.map((name) => `${name}=${encodeURIComponent(data[name])}`).join('&');
    }
  }];
  return config;
}, function (error) {
  return Promise.reject(error);
})

// 响应拦截 对于返回的数据进行处理
axiosAPI.interceptors.response.use(res => {
    endTime = +new Date();

    if (res.status === 200) {
        return Promise.resolve(res);
    }
    return Promise.reject(res);
})


// 请求的方式post，get，请求对象exportAjaxAPI封装（包含了post，get）
const axiosRequestMethod = ["post", "get"]
const exportAjaxAPI = {}

axiosRequestMethod.forEach(method => {
  // 统一处理所有的请求, config可配置弹窗的显示，默认情况是显示的，不需要额外处理error不为0的情况
  exportAjaxAPI[method] = function (url, data, config) {
      let opt = Object.assign({},{show:true},config);

      return new Promise((resolve, reject) => {
          axiosAPI[method](url, data, config).then(response => {
              if (response.data) {
                  Vue.$loading(false);
                  let error = response.data.control.error;
                  if (error == 0) {
                      resolve(response.data);
                     
                  } else if (error === -2 && !/register|login/.test(window.location.pathname)) {
                
                     //判断为-2时，引导用户跳转登录页面
                      let href = window.location.pathname,
                          urlArray = href.split('/'),
                          lastUrl = urlArray[urlArray.length-1],
                          fromUrl = /\.html/.test(lastUrl)?urlArray[urlArray.length-2]:lastUrl
                      Vue.prototype.$confirm({
                          message: response.data.control.message, buttons: [
                              {
                                  name: '去登录',
                                  callBack: function () {
                                      goUrl(`../register/index.html?fromUrl=${fromUrl}`)
                                  }
                              }]
                      }).then((res) => {
                      })
                  } else {
                      if (opt.show) {
                        // 其他情况给与弹层提示
                        Vue.prototype.$confirm({message: response.data.control.message, buttons: [{name: '确定'}]}).then((res) => {
                        })
                    }else {
                        resolve(response.data);

                    }
                  }
              }
          }).catch(error => {
              Vue.$loading(false);
              Vue.prototype.$confirm({message: error.statusText || '网络异常', buttons: [{name: '确定'}]}).then((res) => {
              });
              reject(error);
          })
      })
  }
})

export default {
  install: function (Vue, Option) {
    Object.defineProperty(Vue.prototype, "$http", {
      value: exportAjaxAPI,
      configurable: false,
      writable: false,
      enumerable: false
    })
  }
}
