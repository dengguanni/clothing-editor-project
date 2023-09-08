<template>
  <div class="patter-card" @click.native.stop>
    <div class="left">
      <div class="header">
        <button class="btn-1">系统默认分类</button>
      </div>
      <div class="tree">
        <div class="all-btn">全部分类</div>
        <el-tree-v2 :data="treeData" :props="treeProps" :height="499" @nodeExpand="getNode" @currentChange="selectNOde"
          @getCurrentNode="getCurrentNode"></el-tree-v2>
      </div>
    </div>
    <div class="right">
      <div class="header-1">
        <div class="serach-box">
          <!-- <Icon type="ios-search" size="20" /> -->
          <Input search enter-button="搜索" placeholder="Enter something..." prefix="ios-contact" v-model="searchKey"
            @on-search="searchGoods"></Input>
        </div>
        <button class="reset">重置</button>
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
import getLeftClassificationList from '@/api/commodity.ts'
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
const getGoodsId = (item) => {
  emit('senGoodsId', item)
}
const getCurrentNode = () => {
  console.log('getCurrentNode')
}
const searchGoods = (val) => {
  console.log(val)
  const p = {
    TreeNodeGUID:currentParentNodeId.value ,
    Page_Index: 0,
    QueryKeyWord: val,
    Page_RowCount: 1
  }
  getLeftClassificationList.getGoodsImageListByTreeNode(p).then(res => {
    let arr = []
    if (res.Tag[0].Table) {
      res.Tag[0].Table.forEach(el => {
        arr.push(el)
      })
      goodList.value = arr
    }
    console.log('搜索', res.Tag[0].Table)
  })
}
const getNode = (val) => {
  if (val.HasChilds == '1') {
    console.log('展开节点', val)
    getLeftClassificationList.getLeftClassificationList({ PGUID: val.id }).then(res => {
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
          getLeftClassificationList.getGoodsImageListByTreeNode(p).then(res => {
            console.log('缩略图', res)
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
      console.log('treeData.value', treeData.value)
    })
  }
}
const selectNOde = (val) => {
  const p = {
    TreeNodeGUID: val.id,
    Page_Index: 0,
    QueryKeyWord: '',
    Page_RowCount: 1
  }
  getLeftClassificationList.getGoodsImageListByTreeNode(p).then(res => {
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
const getTreeInfo = () => {
  getLeftClassificationList.getLeftClassificationList({ PGUID: '' }).then(res => {
    console.log('res', res)
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
    console.log('treeData', treeData)
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