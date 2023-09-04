<template>
    <div class="canvas-menu-1">
        <button class="btn">整体设计</button>
        <div class="menu-list">
            <div v-for="item in menuList" class="menu-item" >
                <div :class="item.id == active ? 'active-image':'image'" @click="changeSelection(item.id)"></div>
                <div class="text-1">{{ item.name }}</div>
            </div>
        </div>
    </div>
</template>
  
<script setup >
import { reactive } from 'vue'
import LoadScene from '@/core/3D/loadScene.ts'
const load3DScene = new LoadScene()
const active = ref(1)
const menuList = reactive([
    {
        name: '前片',
        id: 1
    },
    {
        name: '后片',
        id: 2
    },
    {
        name: '左袖片',
        id: 3
    },
    {
        name: '右袖片',
        id: 4
    },
])
const changeSelection = (id) => {
    active.value = id
    load3DScene.setModelCamera()
    console.log('1234567')
}
</script>
<style lang="less">
.canvas-menu-1 {
    width: 70px;

    .btn {
        width: 70px;
        height: 30px;
        background: #FFFFFF;
        border-radius: 5px 5px 5px 5px;
        border: none;
        font-size: 14px;
        font-family: Source Han Sans CN-Medium, Source Han Sans CN;
        font-weight: 500;
        color: #3064F2;
        margin-bottom: 10px;
        cursor: pointer;

    }

    .menu-list {
        width: 70px;
        background: #FFFFFF;
        border-radius: 5px 5px 5px 5px;
        padding: 10px 5px;
        text-align: center;
        font-size: 14px;
        font-family: Source Han Sans CN-Medium, Source Han Sans CN;
        font-weight: 500;
        color: #4E5969;

        .menu-item {
            cursor: pointer;
        }

        .image {
            width: 60px;
            height: 60px;
            background: #DCE1E9;
            border-radius: 5px 5px 5px 5px;
            border: 2px solid #FFFFFF;
        }

        .active-image {
            border: 2px solid #3064F2;
            width: 60px;
            height: 60px;
            background: #DCE1E9;
            border-radius: 5px 5px 5px 5px;
        }

        .text-1 {
            margin: 10px 0px;
        }
    }
}
</style>
  