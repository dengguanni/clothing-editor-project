
<template>
  <div class="reserve-line"></div>
  <div style="display: inline-block">
    <!-- 后退 -->
    <Tooltip :content="$t('history.revocation') + `(${undoStack.length})`">
      <Button @click="undo" type="text" size="small" :disabled="undoStack.length === 0" class="item">
        <commonIcon angleKey="withdraw"></commonIcon>
      </Button>
    </Tooltip>
    <!-- 重做 -->
    <Tooltip :content="$t('history.redo') + `(${redoStack.length})`">
      <Button @click="redo" type="text" size="small" :disabled="redoStack.length === 0" class="item">
        <commonIcon angleKey="redo"></commonIcon>
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
const { canvasEditor, fabric } = useSelect();
const { history, redoStack, undoStack } = reactive(canvasEditor.getHistory());
const lockAttrs = [
  'lockMovementX',
  'lockMovementY',
  'lockRotation',
  'lockScalingX',
  'lockScalingY',
];
const state = reactive({
  line: false
})
// 后退
const undo = () => {
  canvasEditor.undo();
};
// 重做
const redo = () => {
  canvasEditor.redo();
};
const clear = () => {
  canvasEditor.clear();
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
  console.log('maskRect', maskRect)
  if (maskRect) {
    maskRect.visible = !maskRect.visible
    canvasEditor.canvas.renderAll();
  }
}


const setLine = () => {
  state.line = !state.line
  const imageURL = 'http://192.168.1.3/ImageSource/Other/Grid.png'
  if (!state.line) {
    const line = canvasEditor.canvas.getObjects().find((item) =>
      item.id === '0'
    );
    canvasEditor.canvas.remove(line)
  } else {
    let callback = (image, isError) => {
      if (!isError) {
        // image.name = item.Title
        // image.cutPartsType = cutPartsType.value
        image.id = '0'
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
          item.id === '0'
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

};

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
