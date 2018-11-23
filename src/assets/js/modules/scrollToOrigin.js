/**
 * Created by RuiXue on 2017/8/22.
 */
// (function () {



// import {cookie} from 'tool'
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
// const storage = window.localStorage

let scrollWindow = () => {
    let scrollTop = 0
    // if (history.length > 2) {
    if (!!cookie('scrollTop')) {
        scrollTop = cookie('scrollTop')
    }
    window.scrollTo(0, parseInt(scrollTop) - 50)
}

let addOnBeforeUnload = () => {
    let scrollTop = window.scrollY || window.pageYOffset || document.body.scrollTop
    cookie('scrollTop', scrollTop)
}

if (window.attachEvent) {
    window.attachEvent('onbeforeunload', addOnBeforeUnload)
} else {
    window.addEventListener('load', scrollWindow, false)
    window.addEventListener('beforeunload', addOnBeforeUnload, false)
}
export {}
 /*   const storage = window.localStorage

    let scrollWindow = () => {
        let scrollTop = 0
        // if (history.length > 2) {
        if (!!storage.getItem('scrollTop')) {
            scrollTop = storage.getItem('scrollTop')
        }
        window.scrollBy(0, parseInt(scrollTop) - 50)
    }

    let addOnBeforeUnload = () => {
        let scrollTop = window.scrollY || window.pageYOffset || document.body.scrollTop
        storage.setItem('scrollTop', scrollTop)
    }

    if (window.attachEvent) {
        window.attachEvent('onbeforeunload', addOnBeforeUnload)
    } else {
        window.addEventListener('load', scrollWindow, false)
        window.addEventListener('beforeunload', addOnBeforeUnload, false)
    }*/
// })()