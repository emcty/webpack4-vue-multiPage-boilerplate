<template>
    <!--loading开始-->
    <transition name="v-jlc-dot-fade">
        <div class="loader-app" v-show="show">
            <div class="loader-inner ball-pulse">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    </transition>
    <!--loading结束-->
</template>

<script>
    export default {
        name: "DotComponent",
        data() {
            return {
                show: false
            }
        }
    }
</script>

<style scoped>
    /*页面加载loading动画*/
    .loader-app {
        position: fixed;
        top: 50%;
        left: 50%;
        z-index: 10000;
        width: 120px;
        height: 70px;
        margin-left: -60px;
        margin-top: -35px;
        border-radius: 10px;
        background: rgba(0,0,0,.8)
    }

    .loader-app .loader-inner {
        width: 120px;
        height: 70px;
        text-align: center;
        line-height: 70px;;
        background: #242424;
        border-radius: 10px;
    }

    .loader-app .ball-pulse>div {
        display: inline-block;
        height: 12px;
        width: 12px;
        background-color: #fff;
        border-radius: 50%;
    }
    @keyframes bgChange {
        from,60% {
            background: #828282;
        }
        to {
            background: #fff;
        }
    }

    .loader-app .ball-pulse>div:nth-child(1) {
        animation: bgChange .9s 0s infinite;

    }

    .loader-app .ball-pulse>div:nth-child(2) {
        animation: bgChange .9s .2s infinite;
    }

    .loader-app .ball-pulse>div:nth-child(3) {
        animation: bgChange .9s .4s infinite;
    }

    .v-jlc-dot-fade-enter-active {
        animation: fade .3s;
    }

    .v-jlc-dot-fade-leave-active {
        animation: fade .3s reverse;
    }
    @keyframes fade {
        0% {
            opacity: 0;
        }
        50% {
            opacity: .5;
        }
        100% {
            opacity: 1;
        }
    }
</style>
