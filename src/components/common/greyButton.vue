<template>
    <button :class="isSelected ? 'btn-box-radio' : 'btn-box'" :style="'width:' + props.width + 'px'" type="submit"
        v-show="!disabled" @click="buttonClick">
        {{ content }}
        <v-slot></v-slot>
        <span v-html="svg" v-if="svg"></span>
        
        <!-- <commonIconfont :type="type" size="26" v-if="type"></commonIconfont> -->
    </button>
    <button class="btn-box-disabled" disabled :style="'width:' + props.width + 'px;cursor:' + 'not-allowed;'" type="submit"
        v-show="disabled">
        <v-slot></v-slot>
        {{ content }}
        <span v-html="svg" v-if="svg" :style="'cursor:' + 'not-allowed;'"></span>
        <!-- <commonIconfont size="26"></commonIconfont> -->
    </button>
</template>
  
<script setup>
import commonIconfont from '@/components/fontClass/commonIconfont.vue'
const emit = defineEmits()
const props = defineProps({
    bgColor: {
        type: String,
        default: '#F0F2F5'
    },
    type: {
        type: String,
        default: ''
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
    },
    isSelected: {
        type: Boolean,
        default: false
    }
})
const buttonClick = () => {
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

.btn-box-radio {
    font-size: 14px;
    color: #ffff;
    height: 40px;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    background-color: #3064F2;
    width: 136px;
    margin-bottom: 12px;
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


</style>
  