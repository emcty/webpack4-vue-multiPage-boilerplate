<template>
    <article class="page-error">
        <div class="system-busy">
            <!--根据传入状态显示对应图片及文案-->
            <img v-if="errorType=='0'" src="~@image/components/pageError/0.png"/>
            <img v-if="errorType=='1'" src="~@image/components/pageError/1.png"/>
            <img v-if="errorType=='2'" src="~@image/components/pageError/2.png"/>
            <img v-if="errorType=='4'" src="~@image/components/pageError/4.png"/>
            <img v-if="errorType=='3' || errorType=='5'" src="~@image/components/pageError/3.png"/>
            <div class="content">
                <h2 v-if="!!pageData[errorType].title" v-text="pageData[errorType].title"></h2>
                <p v-text="pageData[errorType].content"></p>
            </div>
        </div>
    </article>
</template>

<script>
    /**
     * 处理页面错误或业务状态组件
     */
    export default {
        name: "pageError",
        data() {
            return {
                /**
                 *  errorType类型
                 *  0: "系统繁忙，请稍后重试"(默认)
                 *  1："哎呦！不错哦 所有资金均已匹配至相应租约啦～"
                 *  2: "抢光了！所有租约均已被抢光，请等待新的租约加入。 "
                 *  3: "您还没有加入任何租约！"
                 *  4: "正在为您匹配租约中……！"
                 *  5: "您还没有交易记录"
                 */
                pageData: {
                    '0': {
                        title: '',
                        content: '系统繁忙，请稍后重试',
                        img: ''
                    },
                    '1': {
                        title: '哎呦！不错哦',
                        content: '所有资金均已匹配至相应租约啦～'
                    },
                    '2': {
                        title: '抢光了！',
                        content: '所有租约均已被抢光，请等待新的租约加入。'
                    }
                    ,
                    '3': {
                        title: '',
                        content: '您还没有加入任何租约！'
                    }
                    ,
                    '4': {
                        title: '',
                        content: '正在为您匹配租约中…'
                    }
                    ,
                    '5': {
                        title: '',
                        content: '您还没有交易记录'
                    }
                }
            }
        },
        props: {
            errorType: {
                type: String,
                default: '0'
            }
        },
        computed: {}
    }
</script>

<style lang="scss" scoped>
    .page-error{
        text-align:center;
        img{
            display:inline-block;
            width:550px;
            margin-bottom:-50px;
        }
        .system-busy{
            padding-top:35%;
        }
        .content{
            display:inline-block;
            width:336px;
            font-size:28px;
            color:#9598a0;
            line-height:48px;
            margin-top: 60px;
            h2{
                font-size:30px;
                line-height:1;
                margin:20px 0 15px 0;
                color:#233251;
                font-weight:700;
            }
        }
    }

</style>
