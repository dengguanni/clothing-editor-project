<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-07-16 12:31:25
 * @Description: 回退重做
-->

<template>
  <div class="reserve-line"></div>
  <div style="display: inline-block">
    <!-- 后退 -->
    <Tooltip :content="$t('history.revocation') + `(${undoStack.length})`">
      <Button @click="undo" type="text" size="small" :disabled="undoStack.length === 0">
        <commonIcon angleKey="withdraw"></commonIcon>
      </Button>
    </Tooltip>
    <!-- 重做 -->
    <Tooltip :content="$t('history.redo') + `(${redoStack.length})`">
      <Button @click="redo" type="text" size="small" :disabled="redoStack.length === 0">
        <commonIcon angleKey="redo"></commonIcon>
      </Button>
    </Tooltip>
    <Tooltip :content="'清空'">
      <Button @click="beforeClear" type="text" size="small">
        <commonIcon angleKey="empty"></commonIcon>
      </Button>
    </Tooltip>
    <!-- <span class="time" v-if="history.length">
      {{ useDateFormat(history[0].timestamp, 'HH:mm:ss').value }}
    </span> -->
  </div>
  <div class="reserve-line"></div>
  <Tooltip :content="'网格线'">
    <Button @click="setLine" type="text" size="small">
      <commonIcon angleKey="gridLine"></commonIcon>
    </Button>
  </Tooltip>
  <Tooltip :content="'辅助线'">
    <Button @click="redo" type="text" size="small" :disabled="redoStack.length === 0">
      <commonIcon angleKey="auxiliarylLine"></commonIcon>
    </Button>
  </Tooltip>
</template>

<script setup lang="ts">
import { Modal } from 'view-ui-plus';
import { useDateFormat } from '@vueuse/core';
import useSelect from '@/hooks/select';
import commonIcon from '@/components/commonIcon.vue'
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


const setLine = () => {
  state.line = !state.line
  if (state.line) {
    const line = canvasEditor.canvas.getObjects().find((item) =>
      item.id === '0'
    );
    canvasEditor.canvas.remove(line)
  } else {
    imgToBase64('http://127.0.0.1:3000/src/assets/png/bg-line.png').then(res => {
      if (res) {
        let imgInstance
        const imgEl = document.createElement('img');
        imgEl.src = res;
        document.body.appendChild(imgEl);
        imgInstance = new fabric.Image(imgEl, {
          id: '0',
          name: '网格'
        })
        imgInstance.scaleX = (703 / imgInstance.width) *1.3;
        imgInstance.scaleY = (703 / imgInstance.height) *1.3;
        imgInstance.hasControls = false
        imgInstance.set('selectable', false);
        imgInstance.set('hasControls', false);
        imgInstance.set('isDragging', false);
        imgInstance.hoverCursor = 'default';
        lockAttrs.forEach((key) => {
          imgInstance[key] = true;
        });
        console.log('imgInstance', imgInstance)
        imgEl.onload = () => {
          canvasEditor.canvas.add(imgInstance);
          canvasEditor.canvas.renderAll();
          imgEl.remove();
          canvasEditor.canvas.on('mouse:wheel', opt => {
            const delta = opt.e.deltaY
            let zoom = canvasEditor.canvas.getZoom()
            zoom = 0.999 * delta
            if (zoom > 20) zoom = 20
            if (zoom < 0.01) zoom = 0.01
            if (delta > 0) {
              imgInstance.scaleX = imgInstance.scaleX + 0.1
              imgInstance.scaleY = imgInstance.scaleY + 0.1
            } else {
              imgInstance.scaleX = imgInstance.scaleX - 0.1
              imgInstance.scaleY = imgInstance.scaleY - 0.1
            }
            canvasEditor.canvas.renderAll();
            console.log(opt.e.deltaY, zoom)

          })
        };
      }
    }).catch(err => {
      console.log('这里是错误', err);
    });
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
