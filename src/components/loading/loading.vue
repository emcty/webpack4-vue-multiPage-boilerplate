<template>
   <div :id="id" ref="loading" :class="{'cp-hidden': !show,'cp-loading':true}">
      <div ref="inner" class="cp-loading-inner"></div>
   </div>
</template>

<script>
export default {
  name: "cp-loading",
  data() {},
  props: {
    id: {
      type: String
    },
    show: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.cp-loading {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 140px;
  height: 140px;
  opacity: 0.7;
  border-radius: 4px;
  transform: translate(-50%, -50%);
  z-index: 9999999;
  text-align: center;
}

.cp-loading-inner {
  width: 84px;
  height: 84px;
  animation: loading-rot .5s linear infinite;
  -webkit-animation: loading-rotate .5s linear infinite;
  display: inline-block;
  margin: 30px auto 0;
  border-radius: 50%;
  border: 8px solid #bcc1ce;
  border-top-color: #7d8599;
}

.cp-loading-inner:after {
  content: "";
  position: absolute;
  top: 0;
  border-radius: 50%;
  width: 84px;
  height: 84px;
}

.cp-hidden {
  display: none;
}

@keyframes loading-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@-webkit-keyframes loading-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>