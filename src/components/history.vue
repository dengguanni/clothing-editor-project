
<template>
  <div class="reserve-line"></div>
  <div style="display: inline-block">
    <!-- 后退 -->
    <Tooltip :content="$t('history.revocation') + `(${saveSteps.ID_Previous})`">
      <Button @click="canvasEditor.undo" type="text" size="small" :disabled="saveSteps.ID_Previous < 1" class="item">
        <!-- <commonIcon angleKey="withdraw"></commonIcon> -->
        <commonIconfont type="chehui" size="23" v-show="saveSteps.ID_Previous > 0"></commonIconfont>
        <commonIconfont type="chehui-copy" size="23" v-show="saveSteps.ID_Previous < 1"></commonIconfont>
      </Button>
    </Tooltip>
    <!-- 重做 -->
    <Tooltip :content="$t('history.redo') + `(${saveSteps.ID_Next == -1 ? 0 : saveSteps.ID_Next})`">
      <Button @click="canvasEditor.redo" type="text" size="small" :disabled="saveSteps.ID_Next < 1" class="item">
        <!-- <commonIcon angleKey="redo"></commonIcon> -->
        <commonIconfont type="zhongzuo" size="23" v-show="saveSteps.ID_Next > 0"></commonIconfont>
        <commonIconfont type="zhongzuo-copy" size="23" v-show="saveSteps.ID_Next < 1"></commonIconfont>
        <!-- <commonIcon angleKey="prohibitRedo" v-show="saveSteps.ID_Next < 1"></commonIcon> -->
      </Button>
    </Tooltip>
    <Tooltip :content="'清空'">
      <Button @click="beforeClear" type="text" size="small" class="item">
        <!-- <commonIcon angleKey="empty"></commonIcon> -->
        <commonIconfont type="qingkongbiao" size="23"></commonIconfont>
      </Button>
    </Tooltip>
    <!-- <span class="time" v-if="history.length">
      {{ useDateFormat(history[0].timestamp, 'HH:mm:ss').value }}
    </span> -->
  </div>
  <div class="reserve-line"></div>
  <Tooltip :content="'网格线'">
    <Button @click="setLine" type="text" size="small" class="item">
      <!-- <commonIcon angleKey="gridLine"></commonIcon> -->
      <commonIconfont type="wangge" size="23"></commonIconfont>
    </Button>
  </Tooltip>
  <Tooltip :content="'辅助线'">
    <Button @click="setAuxiliaryLine" type="text" size="small" class="item">
      <!-- <commonIcon angleKey="auxiliarylLine"></commonIcon>icon- -->
      <commonIconfont :type="lineActive ? 'fuzhuxianshuxingshuju-copy' : 'fuzhuxianshuxingshuju'" size="25"
        @mouseenter="lineActive = true" @mouseleave="lineActive = false"></commonIconfont>
      <!-- <commonIconfont type="fuzhuxianshuxingshuju-copy" size="25" ></commonIconfont> -->
    </Button>
  </Tooltip>
</template>

<script setup lang="ts">
import { Modal } from 'view-ui-plus';
import { useDateFormat } from '@vueuse/core';
import useSelect from '@/hooks/select';
import commonIcon from '@/components/commonIcon.vue'
import baseUrl from '@/config/constants/baseUrl';
import { debounce } from 'lodash-es';
import { useStore } from 'vuex'
import historyAip from '@/api/history.ts'
import commonIconfont from '@/components/fontClass/commonIconfont.vue'
const store = useStore()
const { canvasEditor, fabric } = useSelect();
const { history, redoStack, undoStack } = reactive(canvasEditor.getHistory());
const lockAttrs = [
  'lockMovementX',
  'lockMovementY',
  'lockRotation',
  'lockScalingX',
  'lockScalingY',
];
const cutPartsType = computed(() => {
  return store.state.cutPartsType
})
const saveSteps = computed(() => {
  return store.state.saveSteps
})
const bgColor = computed(() => {
  return store.state.bgColor
})
const line = ref(false)
let lineActive = ref(false)
// 清空
const beforeClear = () => {
  Modal.confirm({
    title: '提示',
    content: `<p>是否清空当前画布内容？</p>`,
    okText: '确认',
    cancelText: '取消',
    onOk: () => clear(),
  });
};
const clear = () => {
  store.commit('setDisableClipping', true)
  canvasEditor.canvas.getObjects().forEach(el => {
    if (el.id !== 'grid' && el.id !== 'workspace' && el.isMask == undefined && el.cutPartsType == cutPartsType.value) {
      canvasEditor.canvas.remove(el)
    }
  })
 store.commit('setDisableClipping', false)
 canvasEditor.setAllCuts()
}
const setAuxiliaryLine = () => {
  const maskRect = canvasEditor.canvas.getObjects().find((item) => item.isMask);
  if (maskRect) {
    maskRect.visible = !maskRect.visible
    canvasEditor.canvas.renderAll();
  }
}
const setLine = debounce(() => {
  store.commit('setDisableClipping', true)
  line.value = !line.value
  const imageURL = 'http://8.140.206.30:8099/ImageSource/Other/Grid.png'
  if (!line.value) {
    const line = canvasEditor.canvas.getObjects().find((item) => item.id == 'grid');
    canvasEditor.canvas.remove(line)
  } else {
    let callback = (image, isError) => {
      if (!isError) {
        // image.name = item.Title
        // image.cutPartsType = cutPartsType.value
        image.id = 'grid'
        image.ImageUrl = imageURL
        image.opacity = 0.5
        image.scaleX = (703 / image.width);
        image.scaleY = (703 / image.height);
        image.hasControls = false
        image.set('selectable', false);
        image.set('hasControls', false);
        image.set('isDragging', false);
        image.set('evented', false);
        image.hoverCursor = 'default';
        lockAttrs.forEach((key) => {
          image[key] = true;
        });
        canvasEditor.canvas.add(image);
        const line = canvasEditor.canvas.getObjects().find((item) =>
          item.id === 'grid'
        );
        const workspace = canvasEditor.canvas.getObjects().find((item) => item.id === 'workspace')
        line.bringToFront()
        workspace.sendToBack()
        canvasEditor.canvas.requestRenderAll();
        store.commit('setDisableClipping', false)
      }
    };
    const properties = {
      left: 0,
      top: 0
    };
    fabric.Image.fromURL(imageURL, callback, properties);
  }
}, 300)

async function imgToBase64(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.src = url
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = image.naturalWidth // 使用 naturalWidth 为了保证图片的清晰度
      canvas.height = image.naturalHeight
      canvas.style.width = `${canvas.width / window.devicePixelRatio}px`
      canvas.style.height = `${canvas.height / window.devicePixelRatio}px`
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        return null
      }
      ctx.drawImage(image, 0, 0)
      const base64 = canvas.toDataURL('image/png')
      return resolve(base64)
    }
    image.onerror = (err) => {
      return reject(err);
    }
  })
}

</script>

<style scoped lang="less">
span.active {
  svg.icon {
    fill: #2d8cf0;
  }

  background: #F0F2F5;
}

.time {
  color: #c1c1c1;
}

.item {
  height: 36px;
  width: 36px;

  border-radius: 10%;
  margin-right: 20px;

  &:hover {
    background-color: #F0F2F5;
  }

  // display: flex;
  // align-items: center;
  // justify-content: center;
}

.reserve-line {
  width: 0px;
  height: 30px;
  border: 1px solid #DCE1E9;
  display: inline-block;
  margin-right: 20px;
}
</style>

<script lang="ts">
export default {
  name: 'ToolBar',
};
</script>
