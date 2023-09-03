<template>
    <div class="big-preview" @click.stop>
        <div class="mode-selection">
            <button :class="is3D ? 'btn-active':'btn'" @click="changeMode(true)">3D</button>
            <button :class="!is3D ? 'btn-active':'btn'" @click="changeMode(false)">2D</button>
        </div>
        <div class="box" v-if="is3D">

        </div>
        <div class="pre-2d" v-if="!is3D">
            <div class="box"></div>
            <div class="right">
                <div :class="directionSelection == item ? 'direction-active' : 'direction'" v-for="item in list" :key="item"
                    @click="changeDirection(item)">
                    <div v-if="directionSelection == item" class="active">效果图{{ item }}</div>
                </div>
                <Icon type="ios-arrow-dropup-circle" size="36" color="#DCE1E9" class="up" />
                <Icon type="ios-arrow-dropdown-circle" size="36" color="#DCE1E9" class="down" />
            </div>
        </div>
        <div class="color-selection">
            <div :class="colorSelection == item ? 'item-active' : 'item'" v-for="item in colorList" :key="item"
                @click="changeColor(item)">
                <div class="color" :style="'background-color: ' + item + ';'">
                    <Icon type="ios-checkmark" size="20" color="#3064F2" v-if="colorSelection == item" />
                </div>
            </div>
        </div>

    </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
const props = defineProps({
    is3D: {
        type: Number,
        default: 4
    }
})

const is3D = ref(true)
const colorSelection = ref('black')
const colorList = reactive([
    'black',
    'red'
])

const directionSelection = ref(0)
const list = reactive([0, 2, 34, 6, 9])
onMounted(() => {
   is3D.value = props.is3D === 4 ? true : false 
})
const changeDirection = (item) => {
    directionSelection.value = item
}
const changeColor = (item) => {
    colorSelection.value = item
}
const changeMode = (val) => {
    is3D.value = val
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

        .btn {
            width: 108px;
            height: 40px;
            background: #FFFFFF;
            border: 1px solid #DCE1E9;
            font-size: 16px;
            color: #4E5969;
        }
        .btn-active{
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
        border: 1px solid #DCE1E9;

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

        .right {
            height: auto;
            width: 120px;
            position: relative;
            padding-left: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;


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

            .up {
                position: absolute;
                top: 0px;
                cursor: pointer;
            }

            .down {
                position: absolute;
                bottom: 0px;
                cursor: pointer;
            }
        }
    }
}
</style>