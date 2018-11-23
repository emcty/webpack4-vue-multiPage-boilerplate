<template>
    <div @click="updateSelect" :class="{'cur': isCur}" class='pub-radio-btn'></div>
</template>

<script>
    export default {
        name: "Radio",
        data() {
            return {
                isCur: !!this.value
            }
        },
        methods: {
            updateSelect() {
                this.isCur = !this.isCur
                this.$emit("input", this.isCur)
            }
        },
        props: ["value"]
    }
</script>

<style lang="scss" scoped>
    @import '~@css/common/UI.scss';
</style>