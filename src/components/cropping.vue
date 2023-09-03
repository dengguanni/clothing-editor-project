<template>
    <div class="box">
        <div class="menu">
            <div @click="goBack">返回</div>
            <div @click="">恢复</div>
        </div>
        <div class="filter-box">
            <!-- 无参数滤镜 -->
            <div class="filter-item" v-for="(value, key) in imageList" :key="key">
                <img :src="value.src" />
            </div>
        </div>
    </div>
</template>
  
<script setup >
import useSelect from '@/hooks/select';
import { uiType, paramsFilters, combinationFilters } from '@/config/constants/filter';
import { reactive } from 'vue'
const emit = defineEmits()
const { fabric, mixinState, canvasEditor } = useSelect();
const activeObject = canvasEditor.canvas.getActiveObjects()[0];
const state = reactive({
    type: ''
});
const imageList = reactive([
    {
        id: '1',
        src: 'http://127.0.0.1:3000/src/assets/croping/未标题-1.jpg'

    }, {
        id: '2',
        src: 'http://127.0.0.1:3000/src/assets/croping/未标题-2.jpg'

    },
    {
        id: '3',
        src: 'http://127.0.0.1:3000/src/assets/croping/未标题-3.jpg'

    },
    {
        id: '4',
        src: 'http://127.0.0.1:3000/src/assets/croping/未标题-4.jpg'

    },
    {
        id: '5',
        src: 'http://127.0.0.1:3000/src/assets/croping/未标题-5.jpg'

    }
])
onMounted(() => {
    console.log('mixinState', mixinState)
    console.log('activeObject', activeObject)
})


if (activeObject) {
    state.type = activeObject.type;
}
const goBack = () => {
    emit('goBack', 'cropping')
}
</script>
<style lang="less" scoped>
.menu {
    background-color: #fff;
    width: 100%;
    height: 30px;
    border-bottom: 1px solid #0000001f;
    font-size: 14px;
    color: #4E5969;
    padding: 0px 12px;
    display: flex;
    justify-content: space-between;
    div:hover {
        color: #2777ff;
        cursor: pointer;
    }
}

.filter-box {
    overflow: hidden;
    padding: 20px;

    .filter-item {
        float: left;
        cursor: pointer;
        width: 50%;
        margin-bottom: 10px;

        img {
            width: 90%;
            height: auto;
        }
    }
}

.has-params {
    display: inline-block;
    margin-bottom: 10px;
    width: 50%;

    .content {
        width: 90%;
    }

    cursor: none;
}

.box {
    margin-bottom: 12px;
}
</style>
  