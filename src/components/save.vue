<!--
 * @Author: 邓官妮
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 邓官妮
 * @LastEditTime: 2023-07-24 23:12:22
 * @LastEditors: 邓官妮
 * @LastEditTime: 2023-04-10 14:33:18
 * @Description: 保存文件
-->

<template>
  <div class="save-box">
    <!-- <Button style="margin-left: 10px" type="text" @click="beforeClear">
      {{ $t('empty') }}
    </Button> -->
    <!-- <Button type="primary" @click="getData">
      拿取{{ count }} -->
      <!-- <Icon type="ios-arrow-down"></Icon> -->
    <!-- </Button> -->
    <Button type="primary" @click="saveWith">
      {{ $t('keep') }}
      <!-- <Icon type="ios-arrow-down"></Icon> -->
    </Button>
  </div>
</template>

<script setup name="save-bar">
import { Modal } from 'view-ui-plus';
import useSelect from '@/hooks/select';
import historyAip from '@/api/history.ts'
import { debounce } from 'lodash-es';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex'
const store = useStore()
const commodityInfo = computed(() => {
  return store.state.commodityInfo
})
const aa = ref('')
const { t } = useI18n();
const { canvasEditor } = useSelect();
const cbMap = {
  clipboard() {
    canvasEditor.clipboard();
  },
  saveJson() {
    canvasEditor.saveJson();
  },

  saveSvg() {
    canvasEditor.saveSvg();
  },

  saveImg() {
    canvasEditor.saveImg();
  },
};

const getData = () => {
  const p = {
    ID: '6'
  }
  // store.commit('increment')
  // historyAip.getHistory(p).then(res => {
  //   console.log('res', res)
  //   const aa = res.Tag[0].Table[0].JsonValue
  //   console.log('aa', aa)
  //   console.log('拿回', JSON.parse(aa))
  // })
}
const saveWith = debounce(function (type) {
  console.log('保存', store)
  console.log('commodityInfo', commodityInfo.value)
  // const p = {
  //   aa: {
  //     cc: '214214',
  //     sdsd: {
  //       ww: '中文'
  //     }
  //   },
  //   b: 'asfsfs'
  // }
  // historyAip.setHistory([{ 'JsonValue': JSON.stringify(p) }]).then(res => {
  //   console.log('保存结果', res)
  // })
}, 300);

/**
 * @desc clear canvas 清空画布
 */
const clear = () => {
  canvasEditor.clear();
};

const beforeClear = () => {
  Modal.confirm({
    title: t('tip'),
    content: `<p>${t('clearTip')}</p>`,
    okText: t('ok'),
    cancelText: t('cancel'),
    onOk: () => clear(),
  });
};
</script>

<style scoped lang="less">
.save-box {
  display: inline-block;
  padding-right: 10px;
}
</style>
