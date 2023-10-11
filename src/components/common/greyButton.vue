<template>
    <button class="btn-box" :style="'width:' + props.width + 'px'" type="submit" v-show="!disabled" @click="buttonClick">
        {{ content }}
        <v-slot></v-slot>
        <span v-html="svg" v-if="svg"></span>
    </button>
    <button class="btn-box-disabled" disabled :style="'width:' + props.width + 'px;cursor:' + 'not-allowed;'" type="submit"
        v-show="disabled">
        <v-slot></v-slot>
        {{ content + 1 }}
        <span v-html="svg" v-if="svg" :style="'cursor:' + 'not-allowed;'"></span>
    </button>
</template>
  
<script setup>
 const emit = defineEmits()
const props = defineProps({
    bgColor: {
        type: String,
        default: '#F0F2F5'
    },
    textColor: {
        type: String,
        default: '#4E5969'
    },
    disabled: {
        type: Boolean,
        default: false
    },
    content: {
        type: String,
        default: ''
    },
    width: {
        type: Number,
        default: 136
    },
    svg: {
        type: String,
        default: ''
    }
})
const buttonClick = ()=>{
    emit('buttonClick')
}
</script>
<style scoped lang="less">
/deep/.el-button.is-text {
    font-size: 14px;
    color: #4E5969;
}

/deep/.el-button {
    height: 40px !important;
}

.text {
    font-size: 14px;
    color: #4E5969;
}

.btn-box {
    font-size: 14px;
    color: #4E5969;
    height: 40px;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    background-color: #F0F2F5;
    width: 136px;
    margin-bottom: 12px;

    &:hover {
        color: #3064F2;
        background-color: #f8f8f9;
        // color: #ffff;
        // background-color: #3064F2;
    }
}

.btn-box-disabled {
    font-size: 14px;
    color: #4E5969;
    height: 40px;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    background-color: #F0F2F5;
    width: 136px;
    margin-bottom: 12px;
}
.a,
.b,
.c {
  fill: #4e5969;
}

.a,
.b,
.c,
.d {
  stroke: #4e5969;
}

.a {
  opacity: 0;
}

.b {
  stroke-linecap: round;
}

.b,
.c,
.d {
  stroke-linejoin: round;
  stroke-width: 2px;
}

.d {
  fill: none;
}
</style>
  