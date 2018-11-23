;
(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.$request = factory();
})(this, function() {
    'use strict';

    var utils = { // 工具对象
            /**
             * [extend 深拷贝函数]
             * @return {[Object]}        [返回拷贝完毕的对象]
             */
            extend: function() {
                var targer = Array.prototype.shift.call(arguments);

                Array.prototype.forEach.call(arguments, function(source) {
                    for (var attr in source) {
                        if (utils.isObject(source[attr])) {
                            targer[attr] = targer[attr] || {};
                            this.extend(targer[attr], source[attr]);
                            continue;
                        }
                        targer[attr] = source[attr];
                    }
                }, targer);

                return targer;
            }
        },
        typeArr = ["Function", "Object", "String", "Undefined"]; // 类型数组

    // 给utils对象添加上类型判断的方法
    typeArr.forEach(function(item) {
        /**
         * [检查对象是否属于某个类型的方法]
         * @param  {[Any]} obj [需要检测的对象 必须]
         * @return {[Boolean]}     [返回检测的结果]
         */
        this["is" + item] = function(obj) {
            return Object.prototype.toString.call(obj) === "[object " + item + "]";
        };
    }, utils);


    // 如果浏览器支持Promise，就使用Promise对象 。不支持，就是用简版的Promise对象
    window.Promise = window.Promise || (function() {
        function Promise(callback) {
            this.state = "pending";
            this.value = undefined;
            this.callbacks = [];
            callback(this.resolve.bind(this), this.reject.bind(this));
        }
        Promise.prototype = {
            resolve: function(value) {
                this.state = "fulfilled";
                this.value = value;
                this.execute();
            },
            reject: function(value) {
                this.state = "rejected";
                this.value = value;
                this.execute();
            },
            execute: function() {
                var _this = this;

                setTimeout(function() {
                    _this.callbacks.forEach(function(item) {
                        utils.isFunction(item[_this.state]) && item[_this.state](_this.value);
                    })
                }, 0);
            },
            then: function(fulfilled, rejected) {
                this.callbacks.push({
                    fulfilled: fulfilled,
                    rejected: rejected
                });
                return this;
            },
            constructor: Promise
        }

        return Promise;
    })();


    /**
     * [XHRequest 数据请求对象]
     * @param {[Object|Undefined]} config [默认配置对象 非必须]
     */
    function XHRequest(config) {
        this.config = utils.extend({
            // 公共的请求URL
            baseURL: "",
            // 请求超时的时长，为0时不做请求超时处理
            timeout: 0,
            // 是否执行异步请求，默认是true
            async: true,
            // 设置请求头信息
            headers: null,
            // 请求数据类型："json"(对象序列化) "string"(字符串对象)
            requestType: "json",
            // 返回数据类型："json"(对象序列化) "text"(字符串对象)
            responseType: "json"
        }, config || {});
    }
    /**
     * [prototype 给XHRequest对象添加原型方法]
     * @type {Object}
     */
    XHRequest.prototype = {
        constructor: XHRequest,
        /**
         * [get 请求数据的get方法]
         * @param  {[Sring]} url  [请求地址 必须]
         * @param  {[Object|Undefined]} data [请求数据 非必须]
         * @return {[Object]}      [返回一个Promise对象]
         */
        get: function(url, data) {
            var strData = this.handelData(data);
            // get请求加上时间戳，防止数据缓存
            return this.$http("GET", url + "?" + (strData ? strData + "&" : "") + "stamp=" + Date.now());
        },
        /**
         * [post 请求数据的post方法]
         * @param  {[Sring]} url  [请求地址 必须]
         * @param  {[Object|Undefined]} data [请求数据 非必须]
         * @return {[Object]}      [返回一个Promise对象]
         */
        post: function(url, data) {
            return this.$http("POST", url, this.handelData(data, true));
        },
        /**
         * [$http 用来发起数据请求的方法]
         * @param  {[Sring]} method [请求方式，POST | GET  必须]
         * @param  {[Sring]} url    [请求地址 必须]
         * @param  {[Sring]} data   [处理成字符串类型的请求数据 非必须]
         * @return {[Object]}        [返回一个可以调用then方法的Promise对象]
         */
        $http: function(method, url, data) {
            // 获取本次请求的配置数据
            var config = this.onceData || this.config,
                _this = this;

            // 删除临时数据指针
            !utils.isUndefined(this.onceData) && delete this.onceData;

            if (!utils.isString(url) && !url.length) {
                // 如果不存在url，直接return
                return;
            }

            return new Promise(function(resolve, reject) {
                var xhr = new XMLHttpRequest(),
                    timer = null;

                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        // 请求到结果后，如果设置了请求超时，就清除掉请求超时函数
                        config.timeout && clearTimeout(timer);

                        if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                            // 请求成功后，判断responseType的值，决定是否格式化
                            resolve(config.responseType === "text" ? xhr.responseText : JSON.parse(xhr.responseText));
                        } else {
                            // 请求失败，报告错误结果
                            reject({
                                code: xhr.status,
                                message: xhr.statusText
                            });
                        }
                    }
                }
                xhr.open(method, config.baseURL + url, config.async);
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                // 如果用户设置了headers && 执行设置了headers
                config.headers && _this.setHeaders(xhr, config.headers);
                xhr.send(data);

                // 如果用户设置了请求超时 && 执行请求超时
                config.timeout && (timer = setTimeout(function() {
                    // 取消当前请求
                    xhr.abort();
                }, config.timeout));
            });
        },
        /**
         * [setHeaders 设置请求头函数]
         * @param {[Object]} xhr     [XmlHttpRequest对象]
         * @param {[Object]} headers [请求头数据对象]
         */
        setHeaders: function(xhr, headers) {
            for (var attr in headers) {
                xhr.setRequestHeader(attr, headers[attr]);
            }
        },
        /**
         * [handelData 处理请求数据函数]
         * @param  {[Object]} data [请求数据对象 必须]
         * @param  {[Boolean|Undefined]} isPOST [请求方式是否为POST 非必须]
         * @return void
         */
        handelData: function(data, isPOST) {
            // 获取本次请求的requestType值
            var requestType = utils.isObject(this.onceData) ? this.onceData.requestType : this.config.requestType;

            // 如果数据是undefined，就返回空字符串
            if (typeof data === "undefined") {
                return "";
            }

            // 如果用户设置的request的类型是JSON，就执行JSON字符串
            if (requestType.toLocaleLowerCase() === "string" && isPOST) {
                return JSON.stringify(data);
            }

            // 默认返回数据序列化处理的字符串
            return Object.keys(data).map(function(item) {
                return item + "=" + encodeURIComponent(this[item]);
            }, data).join("&");
        },
        /**
         * [options 设置/获取对象属性的方法]
         * @param  {[Object|String]} prop  [属性对象|属性名称 必须]
         * @param  {[String|Undefined]} value [属性值 非必须]
         * @return {[Any]}       [设置/获取的参数值]
         */
        options: function(prop, value) {
            // 如果没有任何参数，就返回所有配置信息(配置信息对象 !== 配置对象)
            if (utils.isUndefined(prop)) {
                return utils.extend({}, this.config);
            }

            // 如果prop是个Object，就拷贝prop的内容到config
            if (utils.isObject(prop)) {
                return utils.extend(this.config, prop);
            }

            // 如果prop是字符串，判断value是否是undefined ？ 返回config当前项 : 设置config当前项
            if (utils.isString(prop)) {
                return utils.isUndefined(value) ? this.config[prop] : (this.config[prop] = value);
            }
        },
        /**
         * [once 针对下一次请求设置配置参数，配置参数在下一次请求发出后被立即销毁]
         * @param  {[Object|String]} prop  [属性对象|属性名称 非必须]
         * @param  {[String|Undefined]} value [属性值 非必须]
         * @return void
         */
        once: function(prop, value) {
            if (utils.isObject(prop)) {
                this.onceData = utils.extend({}, this.config, prop);
            }

            if (utils.isString(prop) && !utils.isUndefined(value)) {
                this.onceData = utils.extend({}, this.config);
                this.onceData[prop] = value;
            }
        }
    };

    // 对外暴露事件数组(once单独暴露)
    var methods = ["get", "post", "options"];

    /**
     * [factory XHRequest对象的工厂方法，用来创建一个自己的实例]
     * @param  {[Object]} opt [默认配置对象]
     * @return {[Object]}     [一个XHRequest的实例化对象]
     */
    XHRequest.factory = function(opt) {
        var xhrequest = new XHRequest(opt),
            // 容器对象，负责承载所有对外暴露的方法
            vessel = {
                /**
                 * [once 调用XHRequest对象的once方法，此方法需要做特殊的处理，因为once可以链式调用]
                 * @param  {[Object|String]} prop  [属性对象|属性名称 必须]
                 * @param  {[String|Undefined]} value [属性值 非必须]
                 * @return {[Object]}       [返回当前对象，执行链式调用]
                 */
                once: function(prop, value) {
                    xhrequest.once(prop, value);
                    return this;
                }
            };

        // 为容器对象装载所有对外暴露的方法（once除外，已预装载完成）
        methods.forEach(function(item) {
            vessel[item] = this[item].bind(this);
        }, xhrequest);

        return vessel;
    };

    // 用工厂方法生产一个容器对象处理
    var $request = XHRequest.factory();
    // 为容器对象装载上工厂方法
    $request.factory = XHRequest.factory;

    return $request;
})