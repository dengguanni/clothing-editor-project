<template>
    <div class="product-details" @click.stop>
        <div class="header">
            <button :class="selection == 0 ? 'btn-active' : 'btn'" @click="changeSelection(0)">尺码详情</button>
            <button :class="selection == 1 ? 'btn-active' : 'btn'" @click="changeSelection(1)">尺码说明</button>
            <button :class="selection == 2 ? 'btn-active' : 'btn'" @click="changeSelection(2)">包装规格</button>
        </div>
        <div class="content">
            <div class="size-details" v-if="selection == 0">
                <div class="details">
                    <div class="left">产品别名</div>
                    <div class="right">{{ goodsDetailInfo['产品别名'] }}</div>
                </div>
                <div class="item-1">
                    <div v-for="(item, key) in goodsDetailInfo">
                        <div class="details" :key="item" v-if="key !== 'GUID' && key !== '产品别名' && key !== '描述'">
                            <div class="left" >{{ key }}</div>
                            <div class="right">{{
                                goodsDetailInfo[key]
                            }}</div>
                        </div>
                    </div>

                </div>
                <div class="tips">
                    <div class="title-1">其他描述</div>
                    <div class="tips-content">
                        {{ goodsDetailInfo['描述'] }}
                    </div>
                </div>

            </div>
            <div class="size-description" v-if="selection == 1">
                <!-- <Table size="large" :columns="columns1" :data="data1"></Table> -->
                <!-- <commonTabel :titleList="columns1" :data="sizeInfo"></commonTabel> -->
                <el-table :data="sizeInfo" stripe style="width: 100%">
                    <el-table-column prop="Title" label="尺码" />
                    <el-table-column prop="肩宽" label="肩宽" />
                    <el-table-column prop="胸围" label="胸围" />
                    <el-table-column prop="腰围" label="腰围" />
                    <el-table-column prop="衣长" label="衣长" />
                </el-table>
                <div class="warm">*尺码数据仅供参考，因测量方式不同，可能存在一定误差，请以实物为准</div>
            </div>
            <div class="packaging-specifications" v-if="selection == 2">
                <!-- <Table :columns="columns2" :data="data1"></Table> -->
                <el-table :data="sizeInfo" stripe style="width: 100%">
                    <el-table-column prop="Title" label="尺码" />
                    <el-table-column prop="包装体积cm" label="包装体积cm" />
                    <el-table-column prop="包装体积in" label="包装体积in" />
                    <el-table-column prop="包装尺寸in" label="包装尺寸in" />
                    <el-table-column prop="含包装重量g" label="含包装重量g" />
                    <el-table-column prop="含包装重量lb" label="含包装重量lb" />
                </el-table>
            </div>

        </div>
    </div>
</template>
  
<script lang="ts" setup>
import { ElTable, ElTableColumn } from 'element-plus'
import { ref, reactive, onMounted, watch, } from 'vue'
import getLeftClassificationList from '@/api/commodity.ts'
const props = defineProps({
    selectedProduct: {
        type: Number,
        default: 0
    },
    goodsId: {
        type: String,
        default: ''
    }
});

const goodsDetailInfo = ref({
    '产品别名': '',
    '描述': ''
})
const sizeInfo = ref()

let selection = ref(0)
watch(
    () => props.selectedProduct,
    (val) => {
        selection.value = val
        getGoodsDetails()
        getSizeInfo()
    }
);
onMounted(() => {
    selection.value = props.selectedProduct
    initData()
})
const initData = () => {
    getSizeInfo()
    getGoodsDetails()
}
const getSizeInfo = () => {
    const p = {
        GUID: props.goodsId
    }
    getLeftClassificationList.getGoodsSizeDetails(p).then(res => {
        sizeInfo.value = [...res.Tag[0].Table]
        console.log('尺码', sizeInfo.value)
    })
}
const getGoodsDetails = () => {
    const p = {
        GUID: props.goodsId
    }
    getLeftClassificationList.getGoodsDetails(p).then(res => {
        if (res.Tag[0].Table) {
            goodsDetailInfo.value = { ...res.Tag[0].Table[0] }
        }
    })
}
const changeSelection = (val) => {
    selection.value = val
    if (val !== 0) {
        // getSizeInfo()
    } else {

    }
}

</script>
  
<style scoped lang="less">
.product-details {
    // height: 724px;
    width: 970px;
    padding: 0px 16px 16px 16px;
    font-family: Source Han Sans CN-Medium, Source Han Sans CN;
    font-weight: 500;

    .content {
        .size-description {
            width: 100%;

            // display: flex;
            // justify-content: center;
            .warm {
                width: 100%;
                display: flex;
                justify-content: center;
                font-size: 14px;
                font-weight: 400;
                color: #93969C;
                margin-top: 20px;
            }

        }

        .size-details {
            font-size: 14px;
            padding-top: 21px;

            .tips {
                margin-top: 20px;

                .title-1 {
                    font-size: 16px;
                    color: #4E5969;
                    margin-bottom: 15px;

                }

                .tips-content {
                    color: #86909C;
                }

            }

            .details {
                display: flex;
                align-items: center;
                margin-bottom: 5px;
                width: 312px;

                .left {
                    width: 90px;
                    height: 32px;
                    background: #F5F5F5;
                    border-radius: 2px 2px 2px 2px;
                    color: #86909C;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .right {
                    width: 126px;
                    color: #86909C;
                    margin-left: 10px;

                }

            }

            .item-1 {
                display: flex;
                flex-wrap: wrap;
            }

        }
    }

    .header {
        display: flex;
        height: 70px;
        border-bottom: 1px solid #DCE1E9;
        justify-content: center;
        font-family: Source Han Sans CN-Medium, Source Han Sans CN;
        font-weight: 500;
        font-size: 16px;


        .btn {
            width: 108px;
            height: 40px;
            background: #FFFFFF;
            border: 1px solid #DCE1E9;
            cursor: pointer;
            color: #4E5969;


        }

        .btn-active {
            width: 108px;
            height: 40px;
            background: #3064F2;
            border: 1px solid #3064F2;
            cursor: pointer;
            color: #FFFFFF;
        }
    }
}
</style>
  