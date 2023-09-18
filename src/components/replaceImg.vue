<!--
 * @Author: 邓官妮
 * @Date: 2023-04-06 22:26:57
 * @LastEditors: 邓官妮
 * @LastEditTime: 2023-07-05 01:04:30
 * @Description: 图片替换
-->

<template>
  <div v-if="mixinState.mSelectMode === 'one' && type === 'image'">
    <Button @click="replace" type="text" long class="btn-02">图片替换 </Button>
  </div>
</template>

<script setup name="ReplaceImg">
import useSelect from '@/hooks/select';
import { getImagesCustom, setUpLoadFile } from '@/core/2D/handleImages.ts'
import { getImgStr, selectFiles, insertImgFile } from '@/utils/utils';
import mitts from '@/utils/mitts'

const update = getCurrentInstance();
const event = inject('event');
const { mixinState, canvasEditor } = useSelect();
const type = ref('');

// 替换图片
const replace = async () => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  if (activeObject && activeObject.type === 'image') {
    // 图片
    const [file] = await selectFiles({ accept: 'image/*', multiple: false });
    // 转字符串
    const fileStr = await getImgStr(file);
    // 字符串转El
    const imgEl = await insertImgFile(fileStr);
    // console.log('上传图片', imgEl)
    // insertImgFile(imgEl)
    mitts.emit('replaceImages', imgEl.src)
    imgEl.remove();
  }
};

const init = () => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  if (activeObject) {
    type.value = activeObject.type;
    update?.proxy?.$forceUpdate();
  }
};

onMounted(() => {
  event.on('selectOne', init);
});

onBeforeUnmount(() => {
  event.off('selectOne', init);
});
</script>
