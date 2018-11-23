import TalkData from '@js/modules/talkData'
import PushData from '@js/modules/pushData'

class DataReport {
    constructor() {
        this.talkData = new TalkData()
        this.pushData = new PushData()
        this.bindEvent()
    }

    /**
     * 获取用户绑定到dom的上报数据
     */
    init(ev) {
        ev = ev || window.event
        let target = ev.target || ev.srcElement,
            params = target.dataset.report
        !!params && this.push(params)
    }

    /**
     * 数据上报
     * @param params goPageUrl要跳转的页面 enName英文事件名 cnName中文事件名
     */
    push(params = {goPageUrl: '', cnName: '', enName: '',}) {
        if (typeof params == 'string') {
            params = JSON.parse(params)
        }
        this.talkData.clickEvents(params.cnName || '', params.enName || '')
        this.pushData.clickEvents(params.goPageUrl || '', params.enName || '',params.cnName || '')
    }

    /**
     * 事件绑定（委托）
     */
    bindEvent() {
        let _this = this
        window.document.addEventListener('touchstart', function () {
            _this.init()
        })
    }
}

export default new DataReport
