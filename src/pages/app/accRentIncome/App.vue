<template>
    <div class="accRentIncome">
      <div class="rentBox">
        aaaaa
      </div>
    </div>
</template>
<script>


	export default {
	    name:"accRentIncome",
	    data() {
	        return {
                pageData:null,  //页面数据
                listData:[],      //列表数据
	            amount:'',     //累计租金收入
                noMore:false,  //没有更多
                loading:false,     //loading
                matchMoneyBox:true, //盒子
                moneyEnd:null,      //是否还有数据
                selectTime:'',      //分页时间
	        }
	    },
	}
</script>
<style>
@import url('./test.css');
</style>




