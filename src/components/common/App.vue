<!-- 简单写个title和一个循环 -->
<template>
    <div id="example">
        <img src="imgs/3.jpg" alt="">
        <h1>{{ msg }}</h1>
        <ul>
            <li v-for="n in 5">{{ n }}</li>
        </ul>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                msg: 'Hello World!9asdfs9'
            }
        }
    }
</script>

<style scoped>
    #example {
        background: ButtonFace;
        height: 100vh;
    }
</style>