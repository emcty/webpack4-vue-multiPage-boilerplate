<template>
    <form class="form-horizontal">
        <ul class="list-group">
            <li class="list-group-item " v-for="item in property">
                <div class="form-group form-group-sm">
                    <div v-if="item.type=='fileLoad'">
                        <label class="col-sm-4 control-label" v-text="item.name"></label>
                        <div class="col-sm-8">
                            <upload :curr-component-name="componentName"
                                    :url.sync="fileUrl"
                                    :api="fileApi"
                                    :reset="resetFileFn"></upload>
                        </div>
                    </div>
                    <!--增加元素外边距等控制-->
                    <div v-else-if="item.type==='object'">
                        <label class="col-sm-4 control-label" v-text="item.name"></label>
                        <div class="col-sm-8">
                            <!---->
                            <label v-show="item.objName==='radio' ">
                                <input type="checkbox" value="" v-model="item.isFixed">
                                <span v-text="item.isFixed?'是':'否'"></span>
                            </label>
                            <div v-for="item1 in item.value">
                                <div v-if="item.objName==='radio' " v-show="item.isFixed" >
                                    <div class="radio">
                                        <label>
                                            <input class="form-control pull-left mr-10"
                                                   style="width:14px;margin-top:-5px;"
                                                   type="radio"
                                                   :name="item.name"
                                                   v-model="item.selected"
                                                   :value="item1.value">
                                            {{item1.name}}
                                        </label>
                                    </div>
                                </div>
                                <div v-else="">
                                    <label class="col-sm-4 control-label" v-text="item1.name"></label>
                                    <div class="col-sm-8" style="padding:0;">
                                        <!--普通文本框-->
                                        <input class="form-control pull-left mr-10" style="width:62%;margin-bottom:10px;" :type="item1.type"
                                               v-model.lazy="item1.value"
                                               :placeholder="item1.placeholder">
                                        <span class="pull-left mt-5 ">{{item1.value | unit}}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div v-else-if="item.type==='href'">
                        <v-href :property-obj.sync="item" :page-list="pageList"></v-href>
                    </div>
                    <div v-else>
                        <label class="col-sm-4 control-label" v-text="item.name"></label>
                        <div class="col-sm-8">
                            <!--text-->
                            <input class="form-control" :type="item.type" v-model.sync="item.value" :placeholder="item.placeholder">
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </form>
</template>
<style lang="scss">

</style>
<script>
    import upload from '../../components/upLoad/v-upload.vue'
    import vHref from '../../html-v3/www/x/theme/components/v-href';

    export default {
        props: ['property', 'componentName', 'rsUrl', 'pageList'],
        components: {
            upload,
            vHref
        },
        data: function () {
            return {
                fileUrl: this.rsUrl,
                fileApi: this.$parent.$data.host + this.$parent.$data.API.upLoad,

                test: 0
            }
        },
        watch: {
            fileUrl: function (val) {
                this.$emit('update:rsUrl', val)//通知父组件变化
            }
        },
        methods: {
            /**
             * 清空背景图片
             * */
            resetFileFn: function () {
                if (this.$parent.currComponentName === 'vc-page') {
                    $('#canvas').css(this.$parent.setBgProperty(''));
                } else
                    $('#canvas .vc-active').css(this.$parent.setBgProperty(''));
            }
        },
        filters:{
            /**
             * 处理用户输入数值中如果带%号，则不显示px单位
             * */
            unit(val){
                var reg=/%/;
                return reg.test(val)?'':'px';
            }
        }
    }
</script>