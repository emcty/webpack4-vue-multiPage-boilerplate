<template>
  <div class="cp-message-container" @click="getMessageCode">
      <span v-text="buttonValue"></span>
  </div>
</template>
<script>

const totleTime = 30;

export default {
  data: function() {
    return {
      buttonValue: "发送",
      totleTime,
      duration: 1000,
      isRun: false
    };
  },
  props: {
    passValidator: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    passValidator(val) {
      if (val) {
        if(!this.isRun){
          this.isRun = true;
          this.$emit("sendMessageAction");
          this.countDown();
        }
      }
    }
  },
  methods: {
    getMessageCode() {
      if(this.isRun) return;
      this.$emit("getMessageCodeFn");
    },
    countDown() {
      this.timer = setInterval(() => {
        if (this.totleTime == 0) {
          clearInterval(this.timer);
          this.totleTime = totleTime;
          this.buttonValue = "发送";
          this.isRun = false;
          this.$parent.passValidator = false;
        }else{
          this.totleTime--;
          this.buttonValue = this.totleTime + "S";
        }
      }, this.duration);
    },
  }
};
</script>

<style scoped>
.cp-message-container {
  display: inline-block;
  color: #e72a4d;
  padding-left: 22px;
}
</style>

