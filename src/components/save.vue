

<template>
  <div class="save-box">
    <!-- <Button type="primary" @click="getData">
      全部清空
    </Button> -->
    <Button type="primary" @click="savaProject(true)" :disabled="saveBtnDisabled">
      {{ saveBtnValue }}
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
const cutParts = computed(() => {
  return store.state.cutParts
})
const sizeGUID = computed(() => {
  return store.state.sizeGUID
})
const bgColor = computed(() => {
  return store.state.bgColor
})
const saveBtnDisabled = computed(() => {
  return store.state.saveBtnDisabled
})
let saveBtnValue = ref('保存')
// let saveBtnDisabled = ref(true)

watch(handelSave, (newVal, oldVal) => {
  if (newVal) {
    setSaveData()
  }
}, { immediate: true, deep: true });

watch(sizeGUID, (newVal, oldVal) => {
  if (newVal) {
    saveBtnValue.value = '保存'

    // saveBtnDisabled.value = false
  }
}, { immediate: true, deep: true });

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
const repeatList = {
  basic: '基础平铺',
  mirror: '镜像平铺',
  transverse: '横向平铺',
  direction: '纵向平铺'
}

const test = () => {
  //console.log(new Date().getMinutes() + '分' + new Date().getSeconds() + '秒' + new Date().getMilliseconds() + '毫秒', '点击')
  const p = {
    ID: ''
  }
  historyAip.setTest(p).then(res => {
    console.log(res)
  })
}
const getData = () => {
  const objects = canvasEditor.canvas.getObjects().filter(v => !(v.id == 'workspace' || v.isMask !== undefined || v.id == 'grid'))
  store.commit('setDisableClipping', true)
  objects.forEach(el => {
    canvasEditor.canvas.remove(el)
  })
  store.commit('setDisableClipping', false)
  canvasEditor.setAllCuts(true)
}
const savaProject = debounce(function () {
  saveBtnValue.value = '处理中'

  store.commit('setSaveBtnDisabled', true)
  // saveBtnDisabled.value = true
  let p = {
    "UserID": userID.value,
    "SizeGUID": sizeGUID.value,
    "Parts": [
    ]
  }
  const objects = canvasEditor.canvas.getObjects().filter(v => !(v.id == 'workspace' || v.isMask !== undefined || v.id == 'grid' || v.tileParentId || v.cutPartsType == '[整体设计]'))
  console.log('objects', objects)
  let Parts = []
  let callback = (p) => {
    Modal.confirm({
      title: '提示',
      content: `<p>保存成功</p>`,
      okText: '确认',
      cancelText: ' ',
      onOk: () => () => { },
    });
    console.log(p)
    historyAip.setSaveProject(p).then((res) => {
      console.log('res', res)
      saveBtnValue.value = '保存'
      store.commit('setSaveBtnDisabled', false)
    })
  }
  cutParts.value.forEach((element, indexP) => {
    const maskRect = canvasEditor.canvas.getObjects().find((item) => item.name == element.Title);
    let Part = {
      "bgc_r": bgColor.value.R,
      "bgc_g": bgColor.value.G,
      "bgc_b": bgColor.value.B,
      "Canvas_zoom": "1",
      "Part_name": element.Title,
      "Images": [
      ]
    }
    const fn = (objects, index, maskRect, indexP = null) => {
      if (objects.length > 0) {
        objects[index].clone(cloned => {
          cloned.rotate(0)
          const oldTop = objects[index].angle == 0 ? objects[index].top - maskRect.top : cloned.top - maskRect.top
          const oldLeft = objects[index].angle == 0 ? objects[index].left - maskRect.left : cloned.left - maskRect.left
          const oldWidth = objects[index].width * objects[index].scaleX
          const oldHeight = objects[index].height * objects[index].scaleY
          const obj = {
            Image_fullName: objects[index].FilePath + '/' + objects[index].FileName,
            Image_width: (oldWidth / 0.07).toFixed(5) + '',
            Image_height: (oldHeight / 0.07).toFixed(5) + '',
            Image_left: (oldLeft / 0.07).toFixed(5) + '',
            Image_top: (oldTop / 0.07).toFixed(5) + '',
            // Image_left: (oldLeft - (oldWidth / 1).toFixed(5) + oldWidth).toFixed(5) + '',
            // Image_top: (oldTop - (oldHeight / 1).toFixed(5) + oldHeight).toFixed(5) + '',
            Image_angle: objects[index].angle.toFixed(5) + '',
            Image_flipX: objects[index].flipX,
            Image_flipY: objects[index].flipY,
            Image_visible: true,
            Image_TileType: objects[index].repeatType ? repeatList[objects[index].repeatType] : ''
          }
          objects[index].customVisible && objects[index].cutPartsType == element.Title && !objects[index].tileParentId && Part.Images.push(obj)
          if (objects[index + 1]) {
            fn(objects, index + 1, maskRect, indexP)
          } else {
            Parts.push(Part)
            if (indexP == (cutParts.value.length - 1)) {
              p.Parts = Parts
              callback(p)
            }
          }
        })
      } else {
        Part.Images = []
        arts.push(Part)
        if (indexP == (cutParts.value.length - 1)) {
          p.Parts = Parts
          callback(p)
        }
      }
    }
    fn(objects, 0, maskRect, indexP)
  })
}, 500);


// 保存步骤
const setSaveData = function (showLoading = false) {
  if (showLoading) store.commit('setPageLoading', showLoading)
  const objects = canvasEditor.canvas.getObjects().filter(v => !(v.id == 'workspace' || v.isMask !== undefined || v.id == 'grid' || v.tileParentId || v.cutPartsType == '[整体设计]' || v.FileName == undefined))
  const objectsCopy = JSON.parse(JSON.stringify(objects))
  objectsCopy.forEach((element, index) => {
    allCustomAttribute.forEach(key => {
      element[key] = objects[index][key]
    })
    element['src'] = ''
  });
  store.commit('setCanvasObjects', objectsCopy)
  console.log('保存', saveData.value)
  historyAip.setHistory([{ 'JsonValue': JSON.stringify(saveData.value), userID: userID.value, SizeGUID: sizeGUID.value }]).then(res => {
    store.commit('setSaveSteps', res.Tag[0].Table[0])

    store.commit('setPageLoading', false)
  })
}

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
