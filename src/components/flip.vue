<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-07-24 23:12:09
 * @Description: 元素翻转
-->

<template>
  <div v-if="mixinState.mSelectMode === 'one'" class="filp">
    <!-- <ButtonGroup size="small" v-if="mSelectMode === 'one'"> -->
    <Tooltip :content="$t('flip.x')">
      <Button :disabled="notSelectOneMode()" @click="flip('X')" type="text" class="bg-sq-01">
        <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27">

          <g transform="translate(-1509.5 1469.5)">
            <rect class="a" width="26" height="26" transform="translate(1510 -1469)" />
            <path class="b" d="M1523-1465v18" />
            <path class="c" d="M1513-1451l6-11v11Z" />
            <path class="d" d="M1533-1451h-6v-11Z" />
          </g>
        </svg>
      </Button>
    </Tooltip>
    <Tooltip :content="$t('flip.y')">
      <Button :disabled="notSelectOneMode()" @click="flip('Y')" type="text" class="bg-sq-01">
        <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27">
          <g transform="translate(-1581.5 1469.5)">
            <rect class="a" width="26" height="26" transform="translate(1582 -1469)" />
            <path class="b" d="M1604-1456h-18" />
            <path class="c" d="M1590-1466l11,6h-11Z" />
            <path class="d" d="M1590-1446v-6h11Z" />
          </g>
        </svg>
      </Button>
    </Tooltip>
    <Tooltip :content="$t('flip.y')">
      <Button :disabled="notSelectOneMode()" @click="flip('Y')" type="text" class="bg-sq-01">
        <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" class="icon-3">
          <g transform="translate(-1653.841 1470.472)">
            <rect class="a" width="26" height="26" transform="translate(1654.341 -1469.972)" />
            <path class="b"
              d="M1658.022-1464.61a1,1,0,0,1,1,1v1.239c.541-.6,1.161-1.267,1.566-1.672a9.936,9.936,0,0,1,7.071-2.929,10.011,10.011,0,0,1,10,10,10.011,10.011,0,0,1-10,10,9.933,9.933,0,0,1-7.071-2.93,1,1,0,0,1,0-1.414,1,1,0,0,1,1.414,0,7.946,7.946,0,0,0,5.657,2.344,8.009,8.009,0,0,0,8-8,8.008,8.008,0,0,0-8-8,7.949,7.949,0,0,0-5.657,2.343c-.42.421-1.109,1.171-1.673,1.794h1.468a1,1,0,0,1,1,1,1,1,0,0,1-1,1h-3.775a1,1,0,0,1-1-1v-3.775A1,1,0,0,1,1658.022-1464.61Z" />
            <path class="b"
              d="M1666.47-1452.819v-1.919h.879v-1.12h-.879v-4.357h-1.759l-2.759,4.477v1h3.149v1.919Zm-3.089-3.039,1.15-1.839c.209-.4.41-.809.589-1.2h.04c-.019.43-.059,1.1-.059,1.53v1.508Z" />
            <path class="b"
              d="M1670.2-1453.879a2.3,2.3,0,0,1-1.628-.749l-.68.939a3.371,3.371,0,0,0,2.5,1.01,2.5,2.5,0,0,0,2.588-2.6,2.147,2.147,0,0,0-2.279-2.348,1.923,1.923,0,0,0-.889.209l.139-1.569h2.689v-1.229h-3.957l-.2,3.588.67.44a1.766,1.766,0,0,1,1.109-.39,1.2,1.2,0,0,1,1.249,1.339A1.242,1.242,0,0,1,1670.2-1453.879Z" />
          </g>
        </svg>
      </Button>
    </Tooltip>
    <Tooltip :content="$t('flip.y')">
      <Button :disabled="notSelectOneMode()" @click="flip('Y')" type="text" class="bg-sq-01">
        <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" class="icon-3">

          <g transform="translate(-1725.341 1470.472)">
            <rect class="a" width="26" height="26" transform="translate(1725.841 -1469.972)" />
            <path class="b"
              d="M1748.159-1464.61a1,1,0,0,0-1,1v1.239c-.541-.6-1.16-1.267-1.566-1.672a9.934,9.934,0,0,0-7.071-2.929,10.011,10.011,0,0,0-10,10,10.011,10.011,0,0,0,10,10,9.931,9.931,0,0,0,7.071-2.93,1,1,0,0,0,0-1.414,1,1,0,0,0-1.414,0,7.946,7.946,0,0,1-5.657,2.344,8.009,8.009,0,0,1-8-8,8.009,8.009,0,0,1,8-8,7.949,7.949,0,0,1,5.657,2.343c.42.421,1.109,1.171,1.673,1.794h-1.468a1,1,0,0,0-1,1,1,1,0,0,0,1,1h3.775a1,1,0,0,0,1-1v-3.775A1,1,0,0,0,1748.159-1464.61Z" />
            <path class="b"
              d="M1736.72-1452.819v-1.919h.879v-1.12h-.879v-4.357h-1.759l-2.759,4.477v1h3.149v1.919Zm-3.089-3.039,1.15-1.839c.209-.4.41-.809.589-1.2h.04c-.019.43-.059,1.1-.059,1.53v1.508Z" />
            <path class="b"
              d="M1740.45-1453.879a2.3,2.3,0,0,1-1.628-.749l-.68.939a3.371,3.371,0,0,0,2.5,1.01,2.5,2.5,0,0,0,2.588-2.6,2.147,2.147,0,0,0-2.279-2.348,1.923,1.923,0,0,0-.889.209l.139-1.569h2.689v-1.229h-3.957l-.2,3.588.67.44a1.766,1.766,0,0,1,1.109-.39,1.2,1.2,0,0,1,1.249,1.339A1.242,1.242,0,0,1,1740.45-1453.879Z" />
          </g>
        </svg>
      </Button>
    </Tooltip>
  </div>
  <!-- <Row justify="space-between" align="center" style="margin: 24px 0px">
    <Col span="4"><span>{{ $t('attributes.angle') }}</span></Col>
    <Col span="12">
    <Slider v-model="baseAttr.angle" :max="360" @on-input="(value) => changeCommon('angle', value)"></Slider>
    </Col>
    <Col span="1">
    </Col>
    <Col span="6"><Input v-model="baseAttr.angle"></Input></Col>
  </Row> -->
</template>

<script setup name="Flip">
import useSelect from '@/hooks/select';

const { mixinState, canvasEditor } = useSelect();

// 非单选时，禁止镜像操作
const notSelectOneMode = () => {
  return mixinState.mSelectMode !== 'one';
};
const flip = (type) => {
  const activeObject = canvasEditor.canvas.getActiveObject();
  activeObject.set(`flip${type}`, !activeObject[`flip${type}`]).setCoords();
  canvasEditor.canvas.requestRenderAll();
};
</script>

<style scoped lang="less">
.icon-3 {

  .a,
  .b {
    fill: #4e5969;
    stroke: rgba(0, 0, 0, 0);
  }

  .a {
    opacity: 0;
  }
}

.filp {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .ivu-tooltip {
    text-align: center;
    flex: 1;
  }
}

.box {
  display: flex;
  align-items: center;

}

:deep(.ivu-btn) {
  &[disabled] {
    svg {
      opacity: 0.2;
    }
  }
}

.a,
.b,
.c {
  fill: #4e5969;
}

.a,
.b,
.c,
.d {
  stroke: #4e5969;
}

.a {
  opacity: 0;
}

.b {
  stroke-linecap: round;
}

.b,
.c,
.d {
  stroke-linejoin: round;
  stroke-width: 2px;
}

.d {
  fill: none;
}
</style>
