<!--
 * @Description: 保存文件
-->

<template>
  <div class="save-box">
    <!-- <Button type="primary" @click="getData">
      <commonIconfont type="gistuceng"></commonIconfont>
    </Button> -->
    <Button type="primary" @click="setSaveData(true)">
      {{ $t('keep') }}
      <!-- <Icon type="ios-arrow-down"></Icon> -->
    </Button>
    <!-- <commonIconfont type="jiesuo_o"></commonIconfont> -->
  </div>
</template>

<script setup name="save-bar">
import { Modal } from 'view-ui-plus';
import useSelect from '@/hooks/select';
import historyAip from '@/api/history.ts'
import { debounce } from 'lodash-es';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex'
import crypto from '@/utils/crypto'
import { allCustomAttribute } from '@/config/customAttributeFabricObj.ts'
import commonIconfont from '@/components/fontClass/commonIconfont.vue'
import * as THREE from 'three';

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
const userID = computed(() => {
  return store.state.userID
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
let a = ref(0)
const getData = () => {
  const frustum = new THREE.Frustum();
  console.log(frustum.setFromProjectionMatrix())
  // console.log('getObjects', canvasEditor.canvas.getObjects().filter(v => !(v.id == 'workspace' || v.isMask !== undefined || v.id == 'grid')))
  // canvasEditor.test(1111)
  // saveSteps.value.ID
  // const p = {
  //   ID: ''
  // }
  // historyAip.getHistory(p).then(res => {
  //   const data = res.Tag[0].Table[0].JsonValue
  //   console.log('拿回', JSON.parse(data))
  // })

}
const setSaveData = debounce(function (showLoading = false) {
  if (showLoading) store.commit('setPageLoading', showLoading)
  const objects = canvasEditor.canvas.getObjects().filter(v => !(v.id == 'workspace' || v.isMask !== undefined || v.id == 'grid' || v.tileParentId))
  // console.log('保存对象', objects)
  const objectsCopy = JSON.parse(JSON.stringify(objects))
  objectsCopy.forEach((element, index) => {
    allCustomAttribute.forEach(key => {
      element[key] = objects[index][key]
    })
    element['src'] = ''
  });
  store.commit('setCanvasObjects', objectsCopy)
  historyAip.setHistory([{ 'JsonValue': JSON.stringify(saveData.value),userID: userID.value  }]).then(res => {
    store.commit('setSaveSteps', res.Tag[0].Table[0])
    // console.log('保存结果', res)
    showLoading ? ElMessage({
      showClose: true,
      message: '保存成功',
      type: 'success',
    }) : ''
    store.commit('setPageLoading', false)
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
