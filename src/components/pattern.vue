<!-- 版型模块 -->
<template>
    <div class="mode">
        <div class="btn-box">
            <button type="text" class="mode-btn" @click="openDailog(1)">
                选择版型
            </button>
        </div>
        <div class="goods-detail" v-if="props.sizeList.length !== 0">
            <div class="goods">
                <img class="image" :src="info.ImageUrl" />
                <div class="right">
                    <div class="text-1">{{ info.Title }}</div>
                    <div class="text-2">(版型编号:12039)</div>
                    <button class="btn-1" @click="openDailog(2)">产品详情</button>
                </div>
            </div>
            <div class="size-box" v-if="props.sizeList.length !== 0">
                <button class="right" @click.native.stop="openDailog(3)">尺码表</button>
                <Collapse v-model="value1" simple>
                    <Panel name="1">尺寸
                        <template #content>
                            <div class="size-selection">
                                <div v-for="item in props.sizeList" :key="item.GUID"
                                    :class="sizeSelected == item.GUID ? 'size-selected' : 'size'" @click="changeSize(item)">
                                    {{
                                        item.Title }}</div>
                            </div>
                        </template>
                    </Panel>
                    <Panel name="2">
                        底板默认颜色
                        <template #content>
                            <div class="color-selection">
                                <div v-for="item in colorList" :key="item.GUID"
                                    :class="colorSelected == item.GUID ? 'color-selected' : 'color'"
                                    @click="changeColor(item)"
                                    :style="'background-color:rgb(' + item.R + ',' + item.G + ',' + item.B + ');'">
                                </div>

                            </div>

                        </template>
                    </Panel>
                </Collapse>
            </div>
        </div>
    </div>
</template>
  
<script lang="ts" setup scoped>
import { Collapse, Panel } from 'view-ui-plus';
import { reactive, ref, onMounted, provide, watch, onUnmounted } from 'vue'
import useSelect from '@/hooks/select';
import mitts from '@/utils/mitts.js';
import commodityApi from '@/api/commodity'
import GoodsInfo from '@/core/objects/goods/goodsInfo'
import { useStore } from 'vuex'
import historyAip from '@/api/history.ts'
const store = useStore()
const { canvasEditor } = useSelect();
const info: any = ref({
    GUID: '',
    ImageUrl: '',
    Title: ''
})
const emit = defineEmits();
const props = defineProps({
    goodsInfo: {
        type: Object,
        default: () => {
            return {
                GUID: '',
                ImageUrl: '',
                Title: ''
            }
        }
    },
    sizeList: {
        type: Array,
        default: () => {
            return []
        }
    }
})
const bgColor = computed(() => {
    return store.state.bgColor
})
const sizeGUID = computed(() => {
    return store.state.sizeGUID
})
const colorList = computed(() => {
    return store.state.colorList
})
const userID = computed(() => {
    return store.state.userID
})
const goodsId = computed(() => {
    return store.state.goodsId
})

const value1 = ref('1')
const sizeSelected = ref('')
const colorSelected = ref('')
// const colorList = ref([]);
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
onUnmounted(() => {
    mitts.off('changeSize', '')
})
watch(
    () => props.goodsInfo,
    (val) => {
        if (val.GUID) {
            info.value = { ...val }
        }
    }
);
watch(sizeGUID, (newVal, oldVal) => {
    if (newVal) {
        sizeSelected.value = newVal
        getSaveData()
    }
}, { immediate: true, deep: true });
watch(bgColor, (newVal, oldVal) => {
    if (newVal) {
        colorSelected.value = newVal.GUID

    }
}, { immediate: true, deep: true });
watch(goodsId, (newVal, oldVal) => {
    if (newVal) {
        getBgColor(newVal)
    }
}, { immediate: true, deep: true });


const openDailog = (val) => {
    emit('openDailog', val)
}

const changeSize = (item: any) => {
    console.log(new Date().getMinutes() + '分' + new Date().getSeconds() + '秒' + new Date().getMilliseconds() + '毫秒', '点击尺码：加载开始')
    store.commit('setBgColor', '')
    store.commit('setCutParts', '')
    store.commit('setGoodsSizeGUID', item.GUID)
    store.commit('setSaveBtnDisabled', true)

}
const getSaveData = () => {
    store.commit('setPageLoading', true)
    store.commit('setIsSetSteps', true)
    const steps = {
        ID: 0,
        ID_Next: 0,
        ID_Previous: 0,
    }
    store.commit('setSaveSteps', steps)
    const p = {
        ID: '',
        userID: userID.value,
        SizeGUID: sizeGUID.value
    }
    historyAip.getHistory(p).then(res => {
        if (res.Tag.length > 0) {
            const data = res.Tag[0].Table[0].JsonValue
            const dataJson = JSON.parse(data)
            console.log('获取旧数据,', dataJson)
            const objectsData = dataJson.canvasObjects
            store.commit('setCanvasObjects', objectsData)
            console.log(new Date().getMinutes() + '分' + new Date().getSeconds() + '秒' + new Date().getMilliseconds() + '毫秒', '存储的颜色1加载完毕', dataJson.commodityInfo.bgColo)
            dataJson.commodityInfo.bgColor ? store.commit('setBgColor', dataJson.commodityInfo.bgColor) : store.commit('setPageLoading', false)
           
        }
    })
}

const changeColor = (item: any) => {
    store.commit('setBgColor', item)
    store.commit('setDisableClipping', false)
    canvasEditor.setAllCuts(true)
}
const getBgColor = (GUID: string) => {
    console.log('获取颜色', GUID)
    commodityApi.getColorListByGoodGUID({ GUID: GUID }).then(res => {
        console.log(new Date().getMinutes() + '分' + new Date().getSeconds() + '秒' + new Date().getMilliseconds() + '毫秒',GUID ,'颜色列表加载完毕',res)
        if (res.Tag[0]) {
            // colorList.value = [...res.Tag[0].Table]
            store.commit('setBgColorList', [...res.Tag[0].Table])
            if (!bgColor.value) {
                // colorSelected.value = colorList.value[0].GUID
                GoodsInfo.modelColorList = colorList.value
                // store.commit('setBgColor', colorList.value[0])
                // changeColor(colorSelected.value)
            }
        } else {
            ElMessage({
                showClose: true,
                message: '该版型未设置底板颜色',
                type: 'error',
            })
            store.commit('setBgColor', '')
            store.commit('setBgColorList', [])
        }

    })
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

/deep/.ivu-collapse-header {
    height: 60px;
    // padding-top: 10px;
}

/deep/.ivu-collapse-content {
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
            justify-content: space-around;

            .image {
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