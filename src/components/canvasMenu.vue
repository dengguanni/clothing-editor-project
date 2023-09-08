<template>
    <div class="canvas-menu-1">
        <!-- <button @click="changeSelection(0)" :class="0 == active ? 'btn-active' : 'btn'">整体设计</button> -->
        <div class="menu-list">
            <div v-for="item in cutParts" :key="item.Title" class="menu-item">
                <div :class="item.Title == active ? 'active-image' : 'image'" @click="changeSelection(item.Title)">
                    <img :src="item.ImageUrl" class="thumbnail">
                </div>
                <div class="text-1">{{ item.Title }}</div>
            </div>
        </div>
    </div>
</template>
  
<script setup >
import { reactive } from 'vue'
import LoadScene from '@/core/3D/loadScene.ts'
import picture from '@/api/picture'
import mitts from '@/utils/mitts'
const baseUrl = 'http://8.140.206.30:8089/'
const props = defineProps({
    sizeList: {
        type: Array,
        default: () => {
            return []
        }
    }
})
const load3DScene = new LoadScene()
const active = ref('')
let cutParts = ref([])
const menuList = reactive([
    {
        name: '前片',
        id: 1,
        ImageUrl: 'http://8.140.206.30:8089/ImageSource/Masks/01.png'
    },
    {
        name: '后片',
        id: 2,
        ImageUrl: 'http://8.140.206.30:8089/ImageSource/Masks/02.png'
    }
])
onMounted(() =>{
    mitts.on('changeSize', (e) => {
        let arr = []
        picture.getCutParts({SizeGUID: e.GUID}).then(res =>{
            res.Tag[0].Table.forEach(el => {
                arr.push({
                    Title: el.Title,
                    ImageUrl: baseUrl + el.ImageUrl
                })
            })
            cutParts.value = [...arr]
            console.log('裁片',JSON.parse(JSON.stringify(res)))
        })
    })
})
const changeSelection = (Title) => {
    active.value = Title
    // load3DScene.setModelCamera()
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

    .btn-active {
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
        border: 2px solid #3064F2;
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
            background: #666661;
            border-radius: 5px 5px 5px 5px;
            border: 2px solid #FFFFFF;
        }

        .active-image {
            border: 2px solid #3064F2;
            width: 60px;
            height: 60px;
            background: #DCE1E9;
            border-radius: 5px 5px 5px 5px;
            background: #666661;
            

        }

        .thumbnail {
            height: 37px;
            width: 30px;
            margin-top: 10px;
            background-color: #FFFFFF;
        }

        .text-1 {
            margin: 10px 0px;
        }
    }
}
</style>
  