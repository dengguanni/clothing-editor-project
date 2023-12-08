<!-- 商品选择 -->
<template>
  <div class="patter-card" @click.native.stop>
    <div class="left">
      <div class="header">
        <button class="btn-1">系统默认分类</button>
      </div>
      <div class="tree">
        <div class="all-btn">全部分类</div>
        <el-tree-v2 :data="treeData" :props="treeProps" :height="499" @nodeExpand="getNode"
          @currentChange="selectNOde"></el-tree-v2>
      </div>
    </div>
    <div class="right">
      <div class="header-1">
        <div class="serach-box">
          <!-- <Icon type="ios-search" size="20" /> -->
          <Input search enter-button="搜索" placeholder="搜索版型" prefix="ios-contact" v-model="searchKey"
            @on-search="searchGoods"></Input>
        </div>
        <button class="reset" @click="searchKey = ''" style="cursor: pointer;">重置</button>
      </div>
      <div class="content">
        <div class="conten-item" v-for="item in goodList" :key="item.GUID" @click="getGoodsId(item)">
          <img class="image" :src="item.ImageUrl" />
          <div>{{ item.Title }}</div>
        </div>
      </div>
      <div class="page">
        <Page :total="1" show-sizer />
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { TreeSelect, Page } from 'view-ui-plus'
import { ref, reactive, onMounted } from 'vue'
import { ElTreeV2 } from 'element-plus'
import commodityApi from '@/api/commodity'
import { useStore } from 'vuex'
import useSelect from '@/hooks/select';
const { canvasEditor } = useSelect();
const store = useStore()
const emit = defineEmits()
let searchKey = ref('')
let goodList = ref([])
let treeValue = ref('parent1')
const list = reactive([1, 4, 5, 6, 7, 89, , 75, 3, 33])
let treeData = ref([])
let currentParentNodeId = ref('')
const treeProps = {
  value: 'id',
  label: 'label',
  children: 'children',
}

onMounted(() => {
  init()
})
const init = () => {
  getTreeInfo()
}
// 切换商品
const getGoodsId = (item) => {
  store.commit('setBgColor', '')
  store.commit('setCommodityInfo', item)
  store.commit('setGoodsSizeGUID', '')
  store.commit('setGoodsId', item.GUID)
  store.commit('setCutPartsType', '')
  store.commit('setCutParts', '')
  store.commit('setBgColorList', '')
  store.commit('setSaveBtnDisabled', true)
  
  const path = new fabric.Rect({ width: 703, height: 703 })
  const objects = canvasEditor.canvas.getObjects().filter((item) => item.id !== 'workspace')
  objects.forEach(el => canvasEditor.canvas.remove(el))
  canvasEditor.canvas.clipPath = path;
  emit('sendGoodsId', item)
}
const searchGoods = (val) => {
  const p = {
    TreeNodeGUID: currentParentNodeId.value,
    Page_Index: 0,
    QueryKeyWord: val,
    Page_RowCount: 1
  }
  commodityApi.getGoodsImageListByTreeNode(p).then(res => {
    let arr = []
    if (res.Tag[0].Table) {
      res.Tag[0].Table.forEach(el => {
        arr.push(el)
      })
      goodList.value = arr
    }
  })
}
const getNode = (val) => {
  if (val.HasChilds == '1') {
    commodityApi.getLeftClassificationList({ PGUID: val.id }).then(res => {
      let arr1 = []
      res.Tag[0].Table.forEach(el => {
        let children = []
        if (el.HasChilds === '1') {
          children = [{
            id: '',
            label: '...',
            children: [],
            HasChilds: '0'
          }]
          const p = {
            TreeNodeGUID: val.id,
            Page_Index: 0,
            QueryKeyWord: '',
            Page_RowCount: 1
          }
          commodityApi.getGoodsImageListByTreeNode(p).then(res => {
          })
        }
        const obj = {
          id: el.GUID,
          label: el.Title,
          children: children,
          HasChilds: el.HasChilds
        }
        arr1.push(obj)
      })
      val.children = arr1
      treeData.value = [...treeData.value]
    })
  }
}
// 获取商品列表
const selectNOde = (val) => {
  if (val.HasChilds == 0) {
    const p = {
      TreeNodeGUID: val.id,
      Page_Index: 0,
      QueryKeyWord: '',
      Page_RowCount: 1
    }
    commodityApi.getGoodsImageListByTreeNode(p).then(res => {
      let arr = []
      if (res.Tag[0].Table) {
        res.Tag[0].Table.forEach(el => {
          arr.push(el)
        })
        goodList.value = arr
        currentParentNodeId.value = val.id
      }
    })
  }

}

const getTreeInfo = () => {
  commodityApi.getLeftClassificationList({ PGUID: '' }).then(res => {
    let arr1 = []
    res.Tag[0].Table.forEach(el => {
      let children = []
      if (el.HasChilds === '1') {
        children = [{
          id: '',
          label: '...',
          HasChilds: '0',
          children: []
        }]
      }
      const obj = {
        id: el.GUID,
        label: el.Title,
        children: children,
        HasChilds: el.HasChilds,
      }
      arr1.push(obj)
    })
    treeData.value = [...arr1]
  })
}


</script>
<style lang="less" scoped>
.patter-card {
  width: 1230px;
  height: 554px;
  display: flex;
  overflow: hidden;

  .left {
    /deep/.ivu-select-selection {
      border: none;
    }

    /deep/.ivu-select-selected-value {
      margin-left: 40px;
    }

    /deep/.ivu-select-arrow {
      right: 166px;
    }

    /deep/.ivu-icon-ios-arrow-down:before {
      right: 166px;
    }

    height: 100%;
    border-right: 1px solid #DCE1E9;
    width: 267px;

    .header {
      height: 40px;
      border-bottom: 1px solid #DCE1E9;

      .btn-1 {
        font-size: 14px;
        font-family: Source Han Sans CN-Medium, Source Han Sans CN;
        font-weight: 500;
        color: #3064F2;
        border: none;
        background-color: #fff;
        height: 100%;
        border-bottom: 2px solid #3064F2;
        margin-left: 20px;
        border-radius: 0px;
        width: 84px;
      }
    }

    .tree {
      overflow: hidden;
      padding-left: 27px;

      .all-btn {
        margin-left: 15px;
        margin-top: 21px;
        margin-bottom: 17px;
      }
    }
  }

  .right {
    margin-top: 8px;
    width: 100%;
    padding-right: 16px;
    padding-left: 16px;

    .header-1 {
      display: flex;
      width: 100%;
      justify-content: flex-end;

      .reset {
        width: 60px;
        height: 32px;
        background: #FFFFFF;
        border-radius: 5px 5px 5px 5px;
        border: 1px solid #DCE1E9;
        margin-left: 8px;
      }


      .serach-box {
        width: 305px;
        height: 32px;
        background: #FFFFFF;
        border-radius: 10px 10px 10px 10px;
        display: flex;
        align-items: center;

        // border: 1px solid #DCE1E9;
        // padding: 8px;
        .input-1 {
          border: none;
          width: 100%;
          height: 100%;

        }
      }
    }

    .page {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .content {
      margin-top: 17px;
      display: flex;
      flex-wrap: wrap;
      height: 454px;
      // overflow-y: scroll;
      font-size: 14px;
      font-family: Source Han Sans CN-Medium, Source Han Sans CN;
      font-weight: 500;
      color: #4E5969;
      text-align: center;

      .conten-item {
        cursor: pointer;

        .image {
          height: 177px;
          width: 177px;
          background-color: #e4e1dd;
          border-radius: 4%;
          margin: 8px;

          &hover {
            border: 1px solid #3064F2;
          }
        }
      }
    }

  }

  // width: 1000px;
  // height: 724px;

  // .size-seletion {
  //   display: flex;
  //   width: 100%;
  //   border-bottom: 1px solid #DCE1E9;
  // }
}
</style>