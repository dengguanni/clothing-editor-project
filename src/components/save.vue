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
    <Button type="primary" @click="getData">
      拿取
      <Icon type="ios-arrow-down"></Icon>
    </Button>
    <Button type="primary" @click="setSaveData">
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
import { allCustomAttribute } from '@/config/customAttributeFabricObj.ts'
const store = useStore()
const saveData = computed(() => {
  return store.state.saveData
})
const saveSteps = computed(() => {
  return store.state.saveSteps
})
const handelSave = computed(() => {
  return store.state.handelSave
})
watch(handelSave, (newVal, oldVal) => {
  if (newVal) {
    setSaveData()
  }
}, { immediate: true, deep: true });
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
  // saveSteps.value.ID
  const p = {
    ID: ''
  }
  historyAip.getHistory(p).then(res => {
    const data = res.Tag[0].Table[0].JsonValue
    console.log('拿回', JSON.parse(data))
  })
}
const setSaveData = debounce(function (type) {
  const objects = canvasEditor.canvas.getObjects().filter(v => !(v.id == 'workspace' || v.isMask !== undefined || v.id == 'grid'))
  console.log('保存对象',objects)
  const objectsCopy = JSON.parse(JSON.stringify(objects))
  objectsCopy.forEach((element, index) => {
    allCustomAttribute.forEach(key => {
      element[key] = objects[index][key]
    })
    element['src'] = ''
  });
  store.commit('setCanvasObjects', objectsCopy)
  // console.log('JSON.stringify(newObj)', JSON.stringify(objectsCopy))
  historyAip.setHistory([{ 'JsonValue': JSON.stringify(saveData.value) }]).then(res => {
    store.commit('setSaveSteps', res.Tag[0].Table[0])
    console.log('保存结果', res)
  })
}, 700);

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
