<template>
    <div>
        <svg class="icon" aria-hidden="true" :fill="fill" color="red"
            :style="'width:' + size + 'px;' + 'height:' + size + 'px'">
            <use :xlink:href="'#icon-' + type"></use>
        </svg>
    </div>
</template>
<script setup>
import './iconfont.js'
const emit = defineEmits()
const props = defineProps({
    type: {
        type: String,
        default: 'yunshangchuan_o'
    },
    fill: {
        type: String,
        default: '#4E5969'
    },
    size: {
        type: String,
        default: 30
    }

})
const buttonClick = () => {
    emit('buttonClick')
}
</script>
<style scoped lang="less">
.icon {
    width: 30px;
    height: 30px;
    // vertical-align: -0.15em;
    // fill: red;
    overflow: hidden;
    // color: red;

}

.icon:hover {
    // color: red;
    fill: #3064F2;
}

/depp/.ivu-btn {
    outline: none;
}
</style>
  