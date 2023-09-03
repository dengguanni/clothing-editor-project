<!-- 版型模块 -->
<template>
    <div class="mode">
        <div class="btn-box">
            <button type="text" class="mode-btn" @click="openDailog(1)">
                选择版型
            </button>
        </div>
        <div class="goods-detail">
            <div class="goods">
                <div class="image"></div>
                <div class="right">
                    <div class="text-1">青少年轻薄运动大事故就...</div>
                    <div class="text-2">(版型编号:12039)</div>
                    <button class="btn-1" @click="openDailog(2)">产品详情</button>
                </div>
            </div>
            <div class="size-box">
                <button class="right" @click.native.stop="openDailog(3)">尺码表</button>
                <Collapse v-model="value1" simple>
                    <Panel name="1">尺寸
                        <!-- <div class="header">
                            <div class="left">尺寸</div>
                            
                        </div> -->
                        <template #content>
                            <div class="size-selection">
                                <div v-for="item in sizeList" :key="item"
                                    :class="sizeSelected == item ? 'size-selected' : 'size'" @click="changeSize(item)">{{
                                        item }}</div>

                            </div>
                        </template>
                    </Panel>
                    <Panel name="2">
                        底板默认颜色
                        <template #content>
                            <div class="color-selection">
                                <div v-for="item in colorList" :key="item"
                                    :class="colorelected == item ? 'color-selected' : 'color'" @click="changeColor(item)"
                                    :style="'background-color:' + item + ';'"></div>
                            </div>
                            <!-- <ColorPicker v-model="color4" recommend /> -->
                            <!-- <colorSelector :color="baseAttr.fill" @change="(value) => changeCommon('fill', value)">
                            </colorSelector> -->
                        </template>
                    </Panel>
                </Collapse>

            </div>
        </div>

    </div>
</template>
  
<script lang="ts" setup scoped>
import { Collapse, Panel } from 'view-ui-plus';
import colorSelector from '@/components/colorSelector.vue';
import { reactive, ref, onMounted } from 'vue'
import useSelect from '@/hooks/select';
const emit = defineEmits();
const value1 = ref('1')
let indeterminate = ref(true);
let checkAll = ref(false);
let checkAllGroup = reactive(['S'])
const sizeSelected = ref('S')
const colorelected = ref('#ffff')
const sizeList = reactive([
    'S',
    'M',
    'L',
    'XL',
    'XXL'
]);
const colorList = reactive([
    '#ffff',
    '#19be6b',

]);
const color4 = ref('#19be6b')
const { fabric, mixinState, canvasEditor } = useSelect();
const activeObject = canvasEditor.canvas.getActiveObject();
const baseAttr = reactive({
    id: '',
    opacity: 0,
    angle: 0,
    fill: '#fff',
    left: 0,
    top: 0,
    strokeWidth: 0,
    strokeDashArray: [],
    stroke: '#fff',
    shadow: {
        color: '#fff',
        blur: 0,
        offsetX: 0,
        offsetY: 0,
    },
    points: {},
});
onMounted(() => {

})
const openDailog = (val) => {
    emit('openDailog', val)
}
const getObjectAttr = () => {
    baseAttr.fill = activeObject.get('fill');
}
const changeCommon = (key, value) => {
    activeObject && activeObject.set(key, value);
    canvasEditor.canvas.renderAll();
    // 更新属性
    getObjectAttr();
}
const changeSize = (item: String) => {
    sizeSelected.value = item
}
const changeColor = (item: String) => {
    colorelected.value = item
}


const handleCheckAll = () => {
    if (indeterminate) {
        checkAll.value = false;
    } else {
        checkAll.value = !checkAll;
    }
    indeterminate.value = false;
    if (checkAll) {
        checkAllGroup = ['S',
            'M',
            'L',
            'XL',
            'XXL'];
    } else {
        checkAllGroup = [];
    }
};
const checkAllGroupChange = (data: any) => {
    if (data.length === 3) {
        indeterminate.value = false;
        checkAll.value = true;
    } else if (data.length > 0) {
        indeterminate.value = true;
        checkAll.value = false;
    } else {
        indeterminate.value = false;
        checkAll.value = false;
    }
}
</script>
  
<style scoped lang="less">
// /deep/.ivu-checkbox-inner {
//     width: 63px;
//     height: 32px;
//     display: flex;
//     align-items: center;
//     // background: #F0F2F5;
//     border-radius: 16px 16px 16px 16px;
//     // border: 1px solid #3064F2;
// }
// /deep/.ivu-checkbox-inner:after{
//     // width: 63px;
//     // height: 32px;
//     // display: flex;
//     // align-items: center;
//     background: #3064F2;
//     // border-radius: 16px 16px 16px 16px;
//     // border: 1px solid #3064F2;
// }
/deep/.ivu-collapse-item-active {
    border: none
}

/deep/.ivu-collapse-simple {
    border-bottom: none;
    height: 60px;
    // padding-top: 10px;
}
/deep/.ivu-collapse-header{
    height: 60px;
    // padding-top: 10px;
}
/deep/.ivu-collapse-content{
    padding: 20px 0px;
}

.mode {
    height: 100%;
    width: 100%;
    // background: #F0F2F5;

    .btn-box {
        height: 62px;
        border: 1px solid #DCE1E9;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0px 15px;
    }



    .goods-detail {
        // height: 100%;

        padding: 0px 15px;

        .size-box {
            width: 100%;
            height: 167px;
            position: relative;

            .right {
                position: absolute;
                font-size: 14px;
                color: #3064F2;
                width: 75px;
                height: 30px;
                background: #FFFFFF;
                border-radius: 6px 6px 6px 6px;
                border: 1px solid #3064F2;
                right: 0px;
                top: 4px;
                z-index: 99;
                cursor: pointer;

            }

            // border-bottom: 1px solid #DCE1E9;
            .color-selection {
                display: flex;

                .color-selected {
                    width: 30px;
                    height: 30px;
                    border: 7px solid #3064F2;
                    border-radius: 16px 16px 16px 16px;
                    margin-left: 7px;
                    cursor: pointer;
                }

                .color {
                    width: 30px;
                    height: 30px;
                    border-radius: 16px 16px 16px 16px;
                    border: 7px solid #F0F2F5;
                    margin-left: 7px;
                    cursor: pointer;
                }
            }

            .size-selection {
                display: flex;
                font-family: Source Han Sans CN-Medium, Source Han Sans CN;
                font-weight: 500;


                .size-selected {
                    width: 63px;
                    height: 32px;
                    background: #3064F2;
                    border-radius: 16px 16px 16px 16px;
                    border: 1px solid #3064F2;
                    cursor: pointer;
                    font-size: 14px;
                    color: #FFFFFF;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 7px;
                }

                .size {
                    margin-right: 7px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    color: #4E5969;
                    width: 63px;
                    height: 32px;
                    background: #F0F2F5;
                    border-radius: 16px 16px 16px 16px;
                    cursor: pointer;
                }
            }


            .header {
                display: flex;
                justify-content: space-evenly;
                font-family: Source Han Sans CN-Medium, Source Han Sans CN;
                font-weight: 500;

                .left {
                    font-size: 16px;
                    color: #4E5969;

                }


            }
        }

        .goods {
            height: 162px;
            // border-bottom: 1px solid #DCE1E9;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .image {
                // background: #6d6c6c;
                height: 120px;
                width: 120px;
                border-radius: 10%;
                border: 1px solid #DCE1E9;
            }

            .right {
                display: flex;
                flex-direction: column;
                font-family: Source Han Sans CN-Medium, Source Han Sans CN;
                font-weight: 500;
                height: 60%;
                justify-content: space-evenly;


                .text-1 {
                    font-size: 18px;
                    color: #4E5969;
                }

                .text-2 {
                    font-size: 14px;
                    color: #86909C;
                }

                .btn-1 {
                    width: 80px;
                    height: 26px;
                    background: #FFFFFF;
                    border-radius: 6px 6px 6px 6px;
                    border: 1px solid #3064F2;
                    font-size: 14px;
                    color: #3064F2;
                }
            }
        }
    }

    .mode-btn {
        width: 100%;
        height: 40px;
        background: #E6F2FF;
        border-radius: 5px 5px 5px 5px;
        border: none;
        font-size: 16px;
        font-family: Source Han Sans CN-Medium, Source Han Sans CN;
        font-weight: 500;
        color: #3064F2;
        cursor: pointer;
    }
}
</style>