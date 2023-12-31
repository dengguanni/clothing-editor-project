/*
 * @Descripttion: useSelect(原mixin)  类型待优化
 * @version:
 * @Author: June
 * @Date: 2023-04-23 21:10:05
 * @LastEditors: 邓官妮
 * @LastEditTime: 2023-07-05 00:47:52
 */
import { inject, onBeforeMount, onMounted, reactive } from 'vue';
import { SelectEvent, SelectMode, SelectOneType } from '@/utils/event/types';

interface Selector {
  mSelectMode: SelectMode;
  mSelectOneType: SelectOneType;
  mSelectOneIsBackground: boolean | undefined;
  mSelectId: string[] | '';
  mSelectIds: string[];
  mSelectActive: unknown[];
  isClipping: boolean,
  clipBox: any,
  clipActiveObj: object,
  clipLeft: number | string,
  clipRight: number | string,
  setIsClipping: Function
}

export default function useSelect() {
  const setIsClipping = (val: boolean) => {
    state.isClipping = val
  }
  const state = reactive<Selector>({
    mSelectMode: SelectMode.EMPTY,
    mSelectOneType: SelectOneType.EMPTY,
    mSelectId: '', // 选择id
    mSelectIds: [], // 选择id
    mSelectActive: [],
    isClipping: false,
    clipBox: {},
    clipActiveObj: {},
    clipLeft: 0,
    clipRight: 0,
    mSelectOneIsBackground: undefined,
    setIsClipping: setIsClipping
  });

  const fabric = inject('fabric');
  // const canvas = inject('canvas');
  const canvasEditor = inject('canvasEditor');
  const event = inject('event');

  const selectOne = (e) => {
    state.mSelectMode = SelectMode.ONE;
    state.mSelectId = e[0].id;
    state.mSelectOneType = e[0].type;
    state.mSelectOneIsBackground = e[0].isBackground;
    state.mSelectIds = e.map((item) => item.id);
  };

  const selectMulti = (e) => {
    state.mSelectMode = SelectMode.MULTI;
    state.mSelectId = '';
    state.mSelectIds = e.map((item) => item.id);
  };

  const selectCancel = () => {
    state.mSelectId = '';
    state.mSelectIds = [];
    state.mSelectMode = SelectMode.EMPTY;
    state.mSelectOneType = SelectOneType.EMPTY;
  };

  onMounted(() => {
    event.on(SelectEvent.ONE, selectOne);
    event.on(SelectEvent.MULTI, selectMulti);
    event.on(SelectEvent.CANCEL, selectCancel);
  });

  onBeforeMount(() => {
    event.off(SelectEvent.ONE, selectOne);
    event.off(SelectEvent.MULTI, selectMulti);
    event.off(SelectEvent.CANCEL, selectCancel);
  });

  return {
    fabric,
    // canvas,
    canvasEditor,
    mixinState: state,
  };
}
