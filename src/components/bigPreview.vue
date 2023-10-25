<template>
    <div class="big-preview" @click.stop v-loading="bigLoad3d">
        <div class="mode-selection">
            <button :class="is3D ? 'btn-active' : 'btn'" @click.native="changeMode(true)">3D</button>
            <button :class="!is3D ? 'btn-active' : 'btn'" @click.native="changeMode(false)">2D</button>
        </div>
        <div class="box" v-show="is3D" id="big-3d" ></div>
        <div class="pre-2d" v-show="!is3D">
            <div class="box">
                <img :src="imageActive" style="height: 600px; width: 600px;">
            </div>
            <div class="right">
                <div :class="directionSelection == item.id ? 'direction-active' : 'direction'"
                    v-for="(item, index ) in screenshotList" :key="item.id" @click="changeDirection(item)">
                    <div v-if="directionSelection == item.id" class="active">效果图{{ index + 1 }}</div>
                    <img :src="item.src" style="width: 96px; height: 96px;">
                </div>
            </div>
            <Icon type="ios-arrow-dropup-circle" size="36" color="#DCE1E9" class="up" @click="changeImage('up')" />
            <Icon type="ios-arrow-dropdown-circle" size="36" color="#DCE1E9" class="down" @click="changeImage('down')" />
        </div>
        <div class="color-selection">
            <div :class="colorSelection == item.GUID ? 'item-active' : 'item'" v-for="item in colorList" :key="item.GUID"
                @click="changeColor(item)">
                <div class="color" :style="'background-color:rgb(' + item.R + ',' + item.G + ',' + item.B + ');'">
                    <Icon type="ios-checkmark" size="20" color="#3064F2" v-if="colorSelection == item" />
                </div>
            </div>
        </div>

    </div>
</template>
<script setup>
import { reactive, ref, onUnmounted, onMounted } from 'vue'
import LoadScene from '@/core/3D/loadScene.ts'
import mitts from '@/utils/mitts'
import GoodsInfo from '@/core/objects/goods/goodsInfo'
import { useStore } from 'vuex'
const store = useStore()
const bgColor = computed(() => {
    return store.state.bgColor
})
const screenshotList = computed(() => {
    return store.state.screenshotList.big
})
const colorList = computed(() => {
    return store.state.saveData.commodityInfo.colorList
})
const bigLoad3d = computed(() => {
    return store.state.bigLoad3d
})
const colorSelection = ref('')
const load3DScene = new LoadScene()
const props = defineProps({
    is3D: {
        type: Number,
        default: 4
    }
})
let scene, renderer, camera
const is3D = ref(false)

let directionSelection = ref('')
let imageActive = ref('')
const list = reactive([0, 2, 34, 6, 9])

watch(bgColor, (newVal, oldVal) => {
    if (newVal) {
        colorSelection.value = newVal.GUID
    }
}, { immediate: true, deep: true });
watch(screenshotList, (newVal, oldVal) => {
    if (newVal.length > 0) {
        imageActive.value = newVal[0].src
        directionSelection.value = newVal[0].id
    }
}, { immediate: true, deep: true });

onMounted(() => {
    is3D.value = props.is3D === 4 ? true : false
    LoadScene.change3dBox('big-3d', () => {
        load3DScene.getScreenshotList('big')
        if (screenshotList.value.length > 0) {
            imageActive.value = screenshotList.value[0].src
            directionSelection.value = screenshotList.value[0].id
        }

    })

})
onUnmounted(() => {
    LoadScene.change3dBox('small-3d')
    store.commit('setsPreviewTyped', 'small')
})
const changeDirection = (item) => {

    directionSelection.value = item.id
    imageActive.value = item.src
}
const changeImage = (val) => {
    if (val == 'up') {
        screenshotList.value.forEach((el, index) => {
            if (el.id == directionSelection.value && screenshotList.value[index - 1]) {
                directionSelection.value = screenshotList.value[index - 1].id
                imageActive.value = screenshotList.value[index - 1].src
            }
        })
    } else {
        let key = 0
        screenshotList.value.forEach((el, index) => {
            if (el.id == directionSelection.value && screenshotList.value[index + 1]) {
                key = index + 1
            }
        })
        directionSelection.value = screenshotList.value[key].id
        imageActive.value = screenshotList.value[key].src
    }
}
const changeColor = (item) => {
    colorSelection.value = item.GUID
    store.commit('setBgColor', item)
}
const changeMode = (val) => {
    is3D.value = val
    if (!is3D.value) load3DScene.getScreenshotList('big')
}
</script>
<style lang="less" scoped>
.big-preview {
    padding: 20px 20px 0px 20px;
    position: relative;
    font-family: Source Han Sans CN-Medium, Source Han Sans CN;
    font-weight: 500;

    .mode-selection {
        position: absolute;
        top: -47px;
        right: 30%;
        cursor: pointer;
        z-index: 888;

        .btn {
            width: 108px;
            height: 40px;
            background: #FFFFFF;
            border: 1px solid #DCE1E9;
            font-size: 16px;
            color: #4E5969;

        }

        .btn-active {
            color: #FFFFFF;
            width: 108px;
            height: 40px;
            background: #3064F2;
            border: 1px solid #3064F2;
            font-size: 16px;
        }
    }

    .box {
        width: 600px;
        height: 600px;
    }

    .color-selection {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 10px;

        .item-active {
            width: 32px;
            height: 32px;
            background: #FFFFFF;
            border-radius: 16px 16px 16px 16px;
            border: 2px solid #3064F2;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;

        }

        .color {
            width: 18px;
            height: 18px;
            border-radius: 16px 16px 16px 16px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .item {
            width: 32px;
            height: 32px;
            background: #FFFFFF;
            border-radius: 16px 16px 16px 16px;
            border: 2px solid #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;

        }
    }

    .pre-2d {
        display: flex;

        .up {
            position: absolute;
            top: 0px;
            cursor: pointer;
            right: 55px;
        }

        .down {
            position: absolute;
            bottom: 22px;
            cursor: pointer;
            right: 55px;
        }

        .right {
            height: auto;
            // width: 120px;
            position: relative;
            padding-left: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 600px;
            overflow-y: scroll;
            overflow-x: hidden;


            .direction {
                height: 100px;
                width: 100px;
                border: 1px solid #DCE1E9;
                border-radius: 5%;
                margin-bottom: 20px;
            }


            .direction-active {
                height: 100px;
                width: 100px;
                border: 1px solid #3064F2;
                border-radius: 5%;
                margin-bottom: 20px;
                position: relative;

                .active {
                    width: 100%;
                    height: 30px;
                    background: #3064F2;
                    position: absolute;
                    bottom: 0px;
                    font-size: 14px;
                    color: #FFFFFF;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }


        }
    }
}
</style>