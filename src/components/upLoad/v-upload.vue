<template>
    <form class="row" id="upload_form" enctype="mutipart/form-data">
        <input name="type" value="1" type="hidden"/>
        <input name="flag" value="1" type="hidden"/>
        <input name="tag" value="1" type="hidden"/>
        <input id="uploadFileName" name="uploadFileName" type="hidden">
        <input id="uploadFile" name="upload" type="file" value="浏览...">
        <br>
        <!--<input  type="button" value="上传" @click="upFile"/>-->
        <div class="col-xs-8 padding-0">
            <button id="uploadSub" type="button" class="btn btn-primary btn-sm" @click="upFile">上传图片</button>
        </div>
        <div class="col-xs-4 padding-0">
            <button type="button" class="btn btn-primary btn-sm" @click="resetFileFn">重置</button>
        </div>
    </form>
</template>
<script>
    export default {
        data() {
            return {}
        },
        props: ['currComponentName', 'url', 'api', 'reset'],
        methods: {
            upFile() {
                let _this = this;
                let reg = new RegExp("(.gif|.jpg|.jpeg|.bmp|.ico|.png)$");
                if (!reg.test($("#uploadFile").val().toLowerCase())) {
                    alert("请选择上传图片");
                    return;
                }
                let options = {
                    url: this.api,
                    type: "POST",
                    success: function (res) {
                        res = JSON.parse(res)
                        _this.resultUrl = res.imgUrl;
                        res.imgUrl && _this.$emit('update:url', res.imgUrl)
                    }
                };
                $("#upload_form").ajaxSubmit(options)//绑定页面中form表单的id
            },
            resetFileFn() {
                this.reset();
            }
        }
    }
</script>