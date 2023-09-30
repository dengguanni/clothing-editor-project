<!--
 * @Author: 邓官妮
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 邓官妮
 * @LastEditTime: 2023-07-16 12:39:51
 * @Description: 锁定元素
-->

<template>
  <Tooltip :content="$t('quick.lock')" v-if="mixinState.mSelectMode === 'one'">
    <Button v-if="isLock" @click="doLock(false)" icon="md-lock" type="text"></Button>
    <Button v-else @click="doLock(true)" icon="md-unlock" type="text"></Button>
  </Tooltip>
</template>

<script setup name="Lock">
import useSelect from '@/hooks/select';
import { onBeforeUnmount, onMounted, watch } from 'vue';
const props = defineProps({
  isLock: {
    type: Boolean,
    default: false,
  }
});

const event = inject('event');
const { mixinState, canvasEditor } = useSelect();
const lockAttrs = [
  'lockMovementX',
  'lockMovementY',
  'lockRotation',
  'lockScalingX',
  'lockScalingY',
];
const isLock = ref(false);
watch(
  () => props.isLock,
  (val) => {
    isLock.value = val
    isLock.value ? lock() : unLock()
  }
);
const lock = () => {
  // console.log('lock', )
  // // 修改自定义属性
  // mixinState.mSelectActive.hasControls = false;
  // // 修改默认属性
  // lockAttrs.forEach((key) => {
  //   mixinState.mSelectActive[key] = true;
  // });
  // mixinState.mSelectActive.selectable = false;
  // isLock.value = true;
  // canvasEditor.canvas.renderAll();
  const activeObject = canvasEditor.canvas.getActiveObjects()[0]
  activeObject.hasControls = false;
  activeObject.selectable = false;
  activeObject.isLock = false
  lockAttrs.forEach((key) => {
    activeObject[key] = true;
  });
  canvasEditor.canvas.discardActiveObject();
  canvasEditor.canvas.renderAll();

};
const unLock = () => {
  console.log('unLock',)
  const activeObject = canvasEditor.canvas.getActiveObjects()[0]
  // 修改自定义属性
  activeObject.hasControls = true;
  // 修改默认属性
  lockAttrs.forEach((key) => {
    activeObject[key] = false;
  });
  activeObject.selectable = true;
  activeObject.isLock = true
  isLock.value = false;
  canvasEditor.canvas.renderAll();
};

const doLock = (isLock) => {
  isLock ? lock() : unLock();
};

const handleSelected = (items) => {
  isLock.value = !items[0].hasControls;
  // eslint-disable-next-line prefer-destructuring
  mixinState.mSelectActive = items[0];
};

onMounted(() => {
  event.on('selectOne', handleSelected);
});

onBeforeUnmount(() => {
  event.off('selectOne', handleSelected);
});
</script>

<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
