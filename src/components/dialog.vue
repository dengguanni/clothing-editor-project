<template>
    <div class="commom-dalig" @click.native.stop="closeDailog">
        <div class="card">
            <div class="header">
                <div class="text-1">效果图
                    <!-- <span class="text-2">(编号12039)</span>" -->
                </div>
                <Icon type="ios-close" size="24" @click="closeDailog" style="cursor: pointer;" />
            </div>
            <slot></slot>
        </div>

    </div>
</template>
  
<script setup >
import { defineEmits } from 'vue'
const emit = defineEmits();
const closeDailog = () => {
    emit('closeDailog')
}
</script>
<style lang="less">
.commom-dalig {
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;

    .card {
        background: #ffff;
        padding: 0px 0px  20px 0px;
        border-radius: 10px 10px 10px 10px;

        .text-1 {
            font-size: 16px;
            font-family: Source Han Sans CN-Medium, Source Han Sans CN;
            font-weight: 500;
            color: #4E5969;

        }

        .text-2 {
            font-size: 14px;
            font-family: Source Han Sans CN-Medium, Source Han Sans CN;
            font-weight: 500;
            color: #86909C;

        }

        .header {
            height: 55px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #DCE1E9;
            padding: 0px 20px;
        }
    }
}
</style>
  