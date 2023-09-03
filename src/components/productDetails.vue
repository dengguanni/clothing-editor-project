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
                    <div class="left">尺码说明</div>
                    <div class="right">男士短袖夏威夷衬衫</div>
                </div>
                <div class="item-1">
                    <div class="details" v-for="item in list" :key="item">
                        <div class="left">尺码说明</div>
                        <div class="right">男士短袖夏威夷衬衫</div>
                    </div>
                </div>
                <div class="tips">
                    <div class="title-1">其他描述</div>
                    <div class="tips-content">
                        【设计说明】全幅单面印花
                        【材质说明】100%涤
                        【产品性能】采用全涤加密提花面料制成，轻盈、透气、柔软触感、防风、防晒、易于收纳。经久耐用,轻便舒适。防泼水速干材质，让您保持舒适干爽。采用拉链设计，方便穿脱。连帽设计，时尚百搭。舒适的版型，可以搭配多种下装。
                        【适用场景】适合所有户外活动,海滩、跑步、骑行、登山、钓鱼、徒步、旅行、户外、露营。 也适合休闲和锻炼。
                        【适用人群】男女同款
                        【配件构造】长袖；前门襟拉链；连帽设计；下摆、袖口松紧带设计；左侧一内口袋。
                        【洗涤说明】手洗机洗均可，请勿漂白
                        【特别说明】此尺码数据在衣服平铺下测量所得，因测量方法不同，误差在2-4cm内的属于正常现象
                    </div>
                </div>
                <div class="tips">
                    <div class="title-1">其他描述</div>
                    <div class="tips-content">
                        【设计说明】全幅单面印花
                        【材质说明】100%涤
                        【产品性能】采用全涤加密提花面料制成，轻盈、透气、柔软触感、防风、防晒、易于收纳。经久耐用,轻便舒适。防泼水速干材质，让您保持舒适干爽。采用拉链设计，方便穿脱。连帽设计，时尚百搭。舒适的版型，可以搭配多种下装。
                        【适用场景】适合所有户外活动,海滩、跑步、骑行、登山、钓鱼、徒步、旅行、户外、露营。 也适合休闲和锻炼。
                        【适用人群】男女同款
                        【配件构造】长袖；前门襟拉链；连帽设计；下摆、袖口松紧带设计；左侧一内口袋。
                        【洗涤说明】手洗机洗均可，请勿漂白
                        【特别说明】此尺码数据在衣服平铺下测量所得，因测量方法不同，误差在2-4cm内的属于正常现象
                    </div>
                </div>
            </div>
            <div class="size-description" v-if="selection == 1">
                <!-- <Table size="large" :columns="columns1" :data="data1"></Table> -->
                <commonTabel :titleList="columns1"  :data="data1"></commonTabel>
                <div class="warm">*尺码数据仅供参考，因测量方式不同，可能存在一定误差，请以实物为准</div>
            </div>
            <div class="packaging-specifications" v-if="selection == 2">
                <!-- <Table :columns="columns2" :data="data1"></Table> -->
                <commonTabel :titleList="columns2"  :data="data2"></commonTabel>
            </div>

        </div>
    </div>
</template>
  
<script lang="ts" setup>
import commonTabel from '@/components/commonTabel.vue'
import { ref, reactive, onMounted, watch } from 'vue'
const props = defineProps({
    selectedProduct: {
        type: Number,
        default: 0
    }
});


const list = reactive([1, 2, 3, 56, 6, 9])
const columns2 = reactive([
    {
        title: '尺码',
        key: 'name'
    },
    {
        title: '包装尺寸(cm)',
        key: 'aa'
    },
    {
        title: '包装尺寸(in)',
        key: 'address'
    },
    {
        title: '包装体积(cm³)',
        key: 'age'
    },
    {
        title: '包装体积(in³)',
        key: 'bb'
    },
    {
        title: '含包装重量(g)',
        key: 'age'
    },
    {
        title: '含包装重量(g)',
        key: 'cc'
    }
])
const columns1 = reactive([
    {
        title: '尺码',
        key: 'name'
    },
    {
        title: '肩宽',
        key: 'age'
    },
    {
        title: '1/2胸围',
        key: 'address'
    },
    {
        title: '衣长',
        key: 'aa'
    },
    {
        title: '袖长',
        key: 'address'
    }
])
const data2 = reactive([
    {
        name: 'Johon',
        age: 18,
        address: 'NePark',
        date: '2016',
        aa: '12cm',
        bb: '12cm',
        cc: '24mm'
    },
    {
        name: 'Jimn',
        age: 24,
        address: 'ark',
        date: '2016',
        aa: '12cm',
        bb: '12cm',
        cc: '24mm'
    },
    {
        name: 'Joe',
        age: 30,
        address: 'Park',
        date: '2016',
        aa: '12cm',
        bb: '12cm',
        cc: '24mm'
    },
    {
        name: 'Jon',
        age: 26,
        address: 'Park',
        date: '2016',
        aa: '12cm',
        bb: '12cm',
        cc: '24mm'
    }
])
const data1 = reactive([
    {
        name: 'Johon',
        age: 18,
        address: 'NePark',
        date: '2016',
        aa: '12cm'
    },
    {
        name: 'Jimn',
        age: 24,
        address: 'ark',
        date: '2016',
        aa: '12cm'
    },
    {
        name: 'Joe',
        age: 30,
        address: 'Park',
        date: '2016',
        aa: '12cm'
    },
    {
        name: 'Jon',
        age: 26,
        address: 'Park',
        date: '2016',
        aa: '12cm'
    }
])
let selection = ref(0)
watch(
    () => props.selectedProduct,
    (val) => {
        console.log('selection.value', selection.value)
        selection.value = val
    }
);
onMounted(()=>{
    selection.value =  props.selectedProduct
    console.log('prop', props.selectedProduct)
})
const changeSelection = (val) => {
    selection.value = val
    
    // if(selection.value == 1) {

    // }
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
  