<template>
  <div class="patter-card" @click.native.stop>
    <div class="left">
      <div class="header">
        <button class="btn-1">系统默认分类</button>
      </div>
      <div class="tree">
        <div class="all-btn">全部分类</div>
        <TreeSelect v-model="treeValue" :data="treeData" v-width="200" />
        <TreeSelect v-model="treeValue" :data="treeData" v-width="200" />
        <TreeSelect v-model="treeValue" :data="treeData" v-width="200" />
        <TreeSelect v-model="treeValue" :data="treeData" v-width="200" />
        <TreeSelect v-model="treeValue" :data="treeData" v-width="200" />
      </div>
    </div>
    <div class="right">
      <div class="header-1">
        <div class="serach-box">
          <!-- <Icon type="ios-search" size="20" /> -->
          <Input search enter-button="搜索" placeholder="Enter something..." prefix="ios-contact"></Input>
        </div>
        <button class="reset">重置</button>
      </div>
      <div class="content">
        <div class="conten-item" v-for="item in list" :key="item">
          <div class="image"></div>
          <div>儿童轻薄运动长袖防晒衣</div>
        </div>
      </div>
      <div class="page">
        <Page :total="100" show-sizer />
      </div>

    </div>
  </div>
</template>
  
<script setup>
import { TreeSelect, Page } from 'view-ui-plus'
import { ref, reactive } from 'vue'
const treeValue = ref('parent1')
const list = reactive([1, 4, 5, 6, 7, 89, , 75, 3, 33])
const treeData = reactive(
  [
    {
      title: 'parent1',
      expand: true,
      value: 'parent1',
      selected: false,
      checked: false,
      children: [
        {
          title: 'parent 1-1',
          expand: true,
          value: 'parent1-1',
          selected: false,
          checked: false,
          children: [
            {
              title: 'leaf 1-1-1',
              value: 'leaf1',
              selected: false,
              checked: false,
            },
            {
              title: 'leaf 1-1-2',
              value: 'leaf2',
              selected: false,
              checked: false,
            }
          ]
        },
        {
          title: 'parent 1-2',
          expand: true,
          value: 'parent1-2',
          selected: false,
          checked: false,
          children: [
            {
              title: 'leaf 1-2-1',
              value: 'leaf3',
              selected: false,
              checked: false,
            },
            {
              title: 'leaf 1-2-1',
              value: 'leaf4',
              selected: false,
              checked: false,
            }
          ]
        }
      ]
    }
  ]
)
</script>
<style lang="less" scoped>
.patter-card {
  width: 1230px;
  height: 554px;
  display: flex;

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
      }
    }

    .tree {
      .all-btn {
        margin-left: 42px;
        margin-top: 21px;
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
        .image {
          height: 177px;
          width: 177px;
          background-color: #e4e1dd;
          border-radius: 4%;
          margin: 8px;
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