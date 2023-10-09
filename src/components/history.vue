
<template>
  <div class="reserve-line"></div>
  <div style="display: inline-block">
    <!-- 后退 -->
    <Tooltip :content="$t('history.revocation') + `(${saveSteps.ID_Previous})`">
      <Button @click="undo" type="text" size="small" :disabled="saveSteps.ID_Previous <1" class="item">
        <commonIcon angleKey="withdraw"></commonIcon>
      </Button>
    </Tooltip>
    <!-- 重做 -->
    <Tooltip :content="$t('history.redo') + `(${saveSteps.ID_Next == -1 ? 0 : saveSteps.ID_Next})`">
      <Button @click="redo" type="text" size="small" :disabled="saveSteps.ID_Next < 1" class="item">
        <commonIcon angleKey="redo"></commonIcon>
        <!-- <commonIcon angleKey="prohibitRedo" v-show="saveSteps.ID_Next < 1"></commonIcon> -->
      </Button>
    </Tooltip>
    <Tooltip :content="'清空'">
      <Button @click="beforeClear" type="text" size="small" class="item">
        <commonIcon angleKey="empty"></commonIcon>
      </Button>
    </Tooltip>
    <!-- <span class="time" v-if="history.length">
      {{ useDateFormat(history[0].timestamp, 'HH:mm:ss').value }}
    </span> -->
  </div>
  <div class="reserve-line"></div>
  <Tooltip :content="'网格线'">
    <Button @click="setLine" type="text" size="small" class="item">
      <commonIcon angleKey="gridLine"></commonIcon>
    </Button>
  </Tooltip>
  <Tooltip :content="'辅助线'">
    <Button @click="setAuxiliaryLine" type="text" size="small" class="item">
      <commonIcon angleKey="auxiliarylLine"></commonIcon>
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
const line = ref(false)
// 后退
const undo = () => {
  loadCanvasObject(true)

  // store.commit('setAllCuts')
};

// 重做
const redo = () => {
  loadCanvasObject(false)
};
const loadCanvasObject = (isNext) => {
  store.commit('setIsSetSteps', true)
  console.log('saveSteps.value.ID', saveSteps.value.ID)
  const p = {
    ID: isNext ? saveSteps.value.ID - 1 : Number(saveSteps.value.ID) + 1,
  }
  historyAip.getHistory(p).then(res => {
    const steps = {
      ID: res.Tag[0].Table[0].ID,
      ID_Next: res.Tag[0].Table[0].ID_Next,
      ID_Previous: res.Tag[0].Table[0].ID_Previous,
    }
    store.commit('setSaveSteps', steps)
    console.log('steps', steps)
    const data = res.Tag[0].Table[0].JsonValue
    const objects = canvasEditor.canvas.getObjects().filter(v => !(v.id == 'workspace' || v.isMask !== undefined || v.id == 'grid'))
    objects.forEach(element => {
      canvasEditor.canvas.remove(element)
    });
    store.commit('setSaveData', JSON.parse(data))
  })

}
const clear = () => {
  canvasEditor.clear();
  store.commit('setAllCuts')
};
// 清空
const beforeClear = () => {
  Modal.confirm({
    title: '提示',
    content: `<p>确认清空此画布吗？</p>`,
    okText: '确认',
    cancelText: '取消',
    onOk: () => clear(),
  });
};
const setAuxiliaryLine = () => {
  const maskRect = canvasEditor.canvas.getObjects().find((item) => item.isMask);
  if (maskRect) {
    maskRect.visible = !maskRect.visible
    canvasEditor.canvas.renderAll();
  }
}


const setLine = debounce(() => {
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
        image.scaleX = (703 / image.width);
        image.scaleY = (703 / image.height);
        image.hasControls = false
        image.set('selectable', false);
        image.set('hasControls', false);
        image.set('isDragging', false);
        image.hoverCursor = 'default';
        lockAttrs.forEach((key) => {
          image[key] = true;
        });
        // image.name = item.FileName
        // image.FilePath = item.FilePath
        // canvasEditor.workspaceSendToBack()
        canvasEditor.canvas.add(image);

        const line = canvasEditor.canvas.getObjects().find((item) =>
          item.id === 'grid'
        );
        const workspace = canvasEditor.canvas.getObjects().find((item) => item.id === 'workspace')
        // canvasEditor.canvas.sendBackwards(line)
        line.sendToBack()
        workspace.sendToBack()
        // canvasEditor.canvas.moveTo(line, 3)
        canvasEditor.canvas.requestRenderAll();
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

  &hover {
    background-color: #c1c1c1;
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
}
</style>

<script lang="ts">
export default {
  name: 'ToolBar',
};
</script>
