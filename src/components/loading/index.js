/**
 * @Author: dinglei
 * @Date: 2018-06-12
 * @Description: loading组件
 */

import Vue from 'vue';
import Loading from './loading.vue';

export default {
  install(Vue, options) {
    const sub = Vue.extend(Loading);
    const oCache = {};

    function loading(show = true, options = {}) {
      const subLoading = oCache[options.id] || (oCache[options.id] = new sub);

      if (!subLoading.$el) {
        const vm = subLoading.$mount();
        document.querySelector('body').appendChild(vm.$el);
      }
      subLoading.show = show;
      Object.assign(subLoading, options);
    }

    Vue.$loading = Vue.prototype.$loading = loading;
    Vue.$clearLoading = Vue.prototype.$clearLoading = function () {
      Object.keys(oCache).forEach(item => {
        oCache[item].show = false;
      })
    }
  }
}