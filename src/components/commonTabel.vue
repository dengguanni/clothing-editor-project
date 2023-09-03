<template>
    <div class="common-table">
        <div class="title-list">
            <div v-for="(item, index ) in props.titleList" :style="'width:' + (100 / props.titleList.length) + '%;'"
                class="item">{{ item.title }}</div>
        </div>
        <div class="title-list" v-for="(item, index) in props.data" :key="item" :style="'background:' + changeColor(index)">
            <div v-for="(item2, index2) in item" :key="item2" :style="'width:' + (100 / props.data.length) + '%;'"
                class="item">{{ item2 }}</div>
        </div>
    </div>
</template>
  
<script setup>
const props = defineProps({
    titleList: {
        type: Array,
        default: () => {
            return []
        }
    },
    data: {
        type: Array,
        default: () => {
            return []
        }
    }

});
const changeColor = (index) => {
        if ((index % 2) === 0 || index == 0) {
            return '#FFFFFF;'
        } else {
            return '#FAFAFA;'
        }
    };

</script>
<style lang="less" scoped>
.common-table {
    width: 100%;
    height: 100%;

    .title-list {
        display: flex;
        justify-content: space-around;
        height: 40px;
        background: #FAFAFA;
        align-items: center;
        font-size: 16px;
        font-family: Source Han Sans CN-Medium, Source Han Sans CN;
        font-weight: 500;
        color: #4E5969;

        .item {
            text-align: center;
        }

    }
}
</style>
  