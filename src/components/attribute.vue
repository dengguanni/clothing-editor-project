<template>
  <div class="box-1" v-if="mixinState.mSelectMode === 'one'">
    <!-- 字体属性 -->
    <div v-show="textType.includes(mixinState.mSelectOneType)" v-if="isText">
      <!-- <Divider plain orientation="left">{{ $t('attributes.font') }}</Divider> -->
      <!-- 颜色、字号、字体 -->
      <Row align="middle" justify="space-between">
        <Col>
        <!-- <colorSelector :color="baseAttr.fill" @change="(value) => changeCommon('fill', value)"></colorSelector> -->
        <ElColorPicker v-model="baseAttr.fill" @change="changeCommon('fill', baseAttr.fill)" :disabled="disabled">
        </ElColorPicker>
        </Col>
        <Col>
        <Select v-model="fontAttr.fontFamily" @on-change="changeFontFamily" style="width: 130px;" :disabled="disabled">
          <Option v-for="item in fontFamilyList" :value="item.name" :key="`font-${item.name}`" :disabled="disabled">
            <div class="font-item" v-if="!item.preview">{{ item.name }}</div>
            <div class="font-item" v-else :style="`background-image:url('${item.preview}');`">
              {{ !item.preview ? item : '' }}
              <span style="display: none">{{ item.name }}</span>
            </div>
          </Option>
        </Select>
        </Col>
        <!-- <ElSelect></ElSelect> -->
        <Col>
        <Select v-model="fontAttr.fontSize" @on-change="(value) => changeCommon('fontSize', value)" style="width: 64px;"
          :disabled="disabled">
          <Option :value="item" key="item" v-for="item in fontSizeList"></Option>
        </Select>
        </Col>
      </Row>
      <!-- 间距 -->
      <Row justify="space-between" align="middle">
        <Col span="18">
        <div class="flex-view">
          <div class="flex-item">
            <span class="label">间距</span>
            <div class="content slider-box">
              <Slider v-model="fontAttr.charSpacing" :max="4" :step=0.1
                @on-input="(value) => changeCommon('char_spacing', value)" @mouseup="store.commit('setAllCuts')"
                :disabled="disabled"></Slider>
            </div>
          </div>
        </div>
        </Col>
        <Col span="5">
        <Input v-model="fontAttr.charSpacing" :disabled="disabled"></Input>
        </Col>
        <Col>
        </Col>
      </Row>
      <!-- 行高 -->
      <Row justify="space-between">
        <Col span="18">
        <div class="flex-view">
          <div class="flex-item">
            <span class="label">行高</span>
            <div class="content slider-box">
              <Slider v-model="fontAttr.lineHeight" :max="4" :step=0.1 :disabled="disabled"
                @on-input="(value) => changeCommon('lineHeight', value)" @mouseup="store.commit('setAllCuts')"></Slider>
            </div>
          </div>
        </div>
        </Col>
        <Col span="5">
        <Input v-model="fontAttr.lineHeight" :disabled="disabled"></Input>
        </Col>
        <Col>
        </Col>
      </Row>
      <!-- 描边 -->
      <Row align="center" justify="space-between">
        <Col span="12">
        <div class="flex-view">
          <div class="flex-item">
            <span class="label">描边</span>
            <div class="content slider-box">
              <Slider v-model="baseAttr.strokeWidth" :max="10" :step=1
                @on-input="(value) => changeCommon('strokeWidth', value)" @mouseup="store.commit('setAllCuts')"
                :disabled="disabled"></Slider>
            </div>
          </div>
        </div>
        </Col>
        <Col>
        <Input v-model="baseAttr.strokeWidth" :disabled="disabled"></Input>
        </Col>
        <Col>
        <!-- <colorSelector :color="baseAttr.stroke" @change="(value) => changeCommon('stroke', value)"></colorSelector> -->
        <!-- <ColorPicker v-model="baseAttr.stroke" @on-change="(value) => changeCommon('stroke', value)" /> -->
        <ElColorPicker v-model="baseAttr.stroke" @change="changeCommon('stroke', baseAttr.stroke)" :disabled="disabled">
        </ElColorPicker>
        </Col>
      </Row>
      <!-- 对齐 -->
      <div class="flex-view">
        <div class="flex-item">
          <!-- <ButtonGroup class="button-group"> -->
          <Button @click="changeFontWeight('fontWeight', fontAttr.fontWeight)" shape="circle" :disabled="disabled" style="
              background: #F0F2F5; border: none;height: 40px; width: 40px;">
            <svg viewBox="0 0 1024 1024" width="14" height="14">
              <path
                d="M793.99865 476a244 244 0 0 0 54-130.42C862.75865 192.98 743.01865 64 593.85865 64H195.01865a32 32 0 0 0-32 32v96a32 32 0 0 0 32 32h63.74v576H195.01865a32 32 0 0 0-32 32v96a32 32 0 0 0 32 32h418.64c141.6 0 268.28-103.5 282-244.8 9.48-96.9-32.78-184.12-101.66-239.2zM418.33865 224h175.52a96 96 0 0 1 0 192h-175.52z m175.52 576h-175.52V576h175.52a112 112 0 0 1 0 224z"
                :fill="fontAttr.fontWeight === 'bold' ? '#333333' : '#DDE2EA'"></path>
            </svg>
          </Button>
          <Button @click="changeFontStyle('fontStyle', fontAttr.fontStyle)" shape="circle" :disabled="disabled" style=" 
              background: #F0F2F5; border: none; height: 40px; width: 40px; margin-left: 8px;">
            <svg viewBox="0 0 1024 1024" width="14" height="14">
              <path
                d="M832 96v64a32 32 0 0 1-32 32h-125.52l-160 640H608a32 32 0 0 1 32 32v64a32 32 0 0 1-32 32H224a32 32 0 0 1-32-32v-64a32 32 0 0 1 32-32h125.52l160-640H416a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32h384a32 32 0 0 1 32 32z"
                :fill="fontAttr.fontStyle === 'italic' ? '#333333' : '#DDE2EA'"></path>
            </svg>
          </Button>
          <!-- <Button @click="changeLineThrough('linethrough', fontAttr.linethrough)">
              <svg viewBox="0 0 1024 1024" width="14" height="14">
                <path
                  d="M893.088 501.792H125.344a32 32 0 0 0 0 64h767.744a32 32 0 0 0 0-64zM448 448h112V208h288V96H160v112h288zM448 640h112v288H448z"
                  :fill="fontAttr.linethrough ? '#333333' : '#666'"></path>
              </svg>
            </Button>
            <Button @click="changeUnderline('underline', fontAttr.underline)">
              <svg viewBox="0 0 1024 1024" width="14" height="14">
                <path
                  d="M703.232 67.008h127.488v413.248c0 158.016-142.656 286.016-318.72 286.016-176 0-318.72-128-318.72-286.016V67.008h127.488v413.248c0 39.872 18.176 78.144 51.136 107.776 36.8 32.96 86.528 51.072 140.096 51.072s103.36-18.112 140.032-51.136c33.024-29.632 51.2-67.968 51.2-107.776V67.008zM193.28 871.616h637.44v85.376H193.28v-85.376z"
                  :fill="fontAttr.underline ? '#333333' : '#666'"></path>
              </svg>
            </Button> -->
          <!-- </ButtonGroup> -->
          <RadioGroup class="button-group" v-model="fontAttr.textAlign"
            @on-change="(value) => changeCommon('textAlign', value)" type="button">
            <Radio v-for="(item, i) in textAlignList" :label="item" :key="item" shape="circle" style="margin-left: 8px;"
              :disabled="disabled">
              <span v-html="textAlignListSvg[i]" style="margin: 5px 0px 0px 3px;"></span>
            </Radio>
          </RadioGroup>
        </div>
      </div>
      <!-- 背景颜色 -->
      <!-- <div class="flex-view">
        <div class="flex-item">
          <span class="label">{{ $t('background') }}</span>
          <div class="content">
            <ColorPicker v-model="fontAttr.textBackgroundColor"
              @on-change="(value) => changeCommon('textBackgroundColor', value)" alpha />
          </div>
        </div>
      </div> -->
    </div>

    <!-- 通用属性:侧边右边属性 -->
    <div v-show="baseType.includes(mixinState.mSelectOneType)">
      <!-- <Divider plain orientation="left">{{ $t('attributes.exterior') }}</Divider> -->
      <!-- 多边形边数 -->
      <!-- <Row v-if="mixinState.mSelectOneType === 'polygon'" :gutter="12">
        <Col flex="0.5">
        <InputNumber v-model="baseAttr.points.length" :min="3" :max="30" @on-change="changeEdge" append="边数">
        </InputNumber>
        </Col>
      </Row> -->
      <!-- 颜色 -->
      <!-- <colorSelector :color="baseAttr.fill" @change="(value) => changeCommon('fill', value)"></colorSelector> -->
      <!-- <Row :gutter="12">
        <Col flex="1">
        <InputNumber v-model="baseAttr.left" @on-change="(value) => changeCommon('left', value)"
          :append="$t('attributes.left')"></InputNumber>
        </Col>
        <Col flex="1">
        <InputNumber v-model="baseAttr.top" @on-change="(value) => changeCommon('top', value)"
          :append="$t('attributes.top')"></InputNumber>
        </Col>
      </Row> -->

      <!-- 透明度 -->
      <!-- <div class="flex-view">
        <div class="flex-item">
          <span class="label">{{ $t('attributes.opacity') }}</span>
          <div class="content slider-box">
            <Slider v-model="baseAttr.opacity" @on-input="(value) => changeCommon('opacity', value)"></Slider>
          </div>
        </div>
      </div> -->


      <!-- 阴影 -->
      <!-- <Divider plain orientation="left">{{ $t('attributes.shadow') }}</Divider> -->

      <!-- <Row :gutter="12">
        <Col flex="1">
        <div class="ivu-col__box">
          <span class="label">{{ $t('color') }}</span>
          <div class="content">
            <ColorPicker v-model="baseAttr.shadow.color" @on-change="(value) => changeCommon('color', value)" alpha />
          </div>
        </div>
        </Col>
        <Col flex="1">
        <InputNumber v-model="baseAttr.shadow.blur" :defaultValue="0" @on-change="(value) => changeShadow('blur', value)"
          :append="$t('attributes.blur')" :min="0"></InputNumber>
        </Col>
      </Row> -->
      <!-- 位移 -->

      <!-- <Row :gutter="12">
        <Col flex="1">
        <InputNumber v-model="baseAttr.shadow.offsetX" :defaultValue="0"
          @on-change="(value) => changeShadow('offsetX', value)" :append="$t('attributes.offset_x')"></InputNumber>
        </Col>
        <Col flex="1">
        <InputNumber v-model="baseAttr.shadow.offsetY" :defaultValue="0"
          @on-change="(value) => changeShadow('offsetY', value)" :append="$t('attributes.offset_y')"></InputNumber>
        </Col>
      </Row> -->
    </div>

    <!-- ID属性 -->
    <!-- <div v-if="!isText">
      <Divider plain orientation="left">{{ $t('attributes.id') }}</Divider>
      <div class="flex-view">
        <div class="flex-item">
          <span class="label">{{ $t('attributes.id') }}</span>
          <div class="content slider-box">
            <Input v-model="baseAttr.id" @on-change="changeCommon('id', baseAttr.id)"></Input>
          </div>
        </div>
      </div>
    </div> -->
  </div>
  <Row justify="space-between" align="middle" style="margin: 24px 0px"
    v-show="baseType.includes(mixinState.mSelectOneType) && !props.isText">
    <Col span="4"><span>{{ $t('attributes.angle') }}</span></Col>
    <Col span="12">
    <Slider v-model="baseAttr.angle" :max="360" @on-input="(value) => changeCommon('angle', value)" @mouseup="setAllCuts"
      :disabled="disabled">
    </Slider>
    </Col>
    <Col span="1">
    </Col>
    <Col span="6"><Input v-model="baseAttr.angle" @on-change="setAllCuts" :disabled="disabled"></Input></Col>
  </Row>
</template>

<script setup name="AttrBute">
import fontList from '@/assets/fonts/font';
import useSelect from '@/hooks/select';
import FontFaceObserver from 'fontfaceobserver';
import colorSelector from '@/components/colorSelector.vue';
import { getPolygonVertices } from '@/utils/math';
import InputNumber from '@/components/inputNumber';
import { Spin } from 'view-ui-plus';
import { ElColorPicker, ElSelect } from 'element-plus'
import { useStore } from 'vuex'
import { debounce } from 'lodash-es';
import ControlsTile from '@/core/plugin/ControlsTile.ts'
const store = useStore()
const event = inject('event');
const update = getCurrentInstance();
const props = defineProps({
  isText: {
    type: Boolean,
    default: false
  }
})
const { fabric, mixinState, canvasEditor } = useSelect();
let disabled = ref(false)
const selected = computed(() => {
  return store.state.selected
});
const handleLock = computed(() => {
  return store.state.handleLock
});
const objectAttr = computed(() => {
  return store.state.objectAttr
});
watch(objectAttr, (newVal, oldVal) => {
  if (newVal) {
    const activeObject = canvasEditor.canvas.getActiveObject()
    activeObject && getObjectAttr()
  }
}, { deep: true });
watch(selected, (newVal, oldVal) => {
  if (newVal) {
    const activeObject = canvasEditor.canvas.getActiveObject()
    activeObject && (disabled.value = activeObject.isLock !== undefined ? activeObject.isLock : false)
  }
}, { deep: true });
watch(handleLock, (newVal, oldVal) => {
  const activeObject = canvasEditor.canvas.getActiveObject()
  activeObject && (disabled.value = activeObject.isLock !== undefined ? activeObject.isLock : false)
}, { deep: true });

// 通用元素
const baseType = [
  'text',
  'i-text',
  'textbox',
  'rect',
  'circle',
  'triangle',
  'polygon',
  'image',
  'group',
  'line',
  'arrow',
];
// 文字元素
const textType = ['i-text', 'textbox', 'text'];
// 通用属性
const baseAttr = reactive({
  id: '',
  opacity: 0,
  angle: 0,
  fill: '#fff',
  left: 0,
  top: 0,
  strokeWidth: 0,
  strokeDashArray: [],
  stroke: '#fff',
  shadow: {
    color: '#fff',
    blur: 0,
    offsetX: 0,
    offsetY: 0,
  },
  points: {},
});
// 字体属性
const fontAttr = reactive({
  fontSize: 0,
  fontFamily: '',
  lineHeight: 0,
  charSpacing: 0,
  fontWeight: '',
  textBackgroundColor: '#fff',
  textAlign: '',
  fontStyle: '',
  underline: false,
  linethrough: false,
  overline: false,
});
// 字体下拉列表
const fontFamilyList = ref([...fontList]);
let fontSizeList = reactive([])
const strokeDashList = [
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [],
      strokeLineCap: 'butt',
    },
    label: 'Stroke',
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [1, 10],
      strokeLineCap: 'butt',
    },
    label: 'Dash-1',
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [1, 10],
      strokeLineCap: 'round',
    },
    label: 'Dash-2',
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [15, 15],
      strokeLineCap: 'square',
    },
    label: 'Dash-3',
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [15, 15],
      strokeLineCap: 'round',
    },
    label: 'Dash-4',
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [25, 25],
      strokeLineCap: 'square',
    },
    label: 'Dash-5',
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [25, 25],
      strokeLineCap: 'round',
    },
    label: 'Dash-6',
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [1, 8, 16, 8, 1, 20],
      strokeLineCap: 'square',
    },
    label: 'Dash-7',
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [1, 8, 16, 8, 1, 20],
      strokeLineCap: 'round',
    },
    label: 'Dash-8',
  },
];
// 字体对齐方式
const textAlignList = ['left', 'center', 'right', 'left'];
// 对齐图标
const textAlignListSvg = [
  '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><defs><style>.a{fill:#fff;opacity:0;}.b{fill:none;stroke:#333;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}</style></defs><g transform="translate(-1726 -739)"><rect class="a" width="20" height="20" transform="translate(1726 739)"/><g transform="translate(1728 743)"><g transform="translate(0)"><path class="b" d="M21.5,9H6" transform="translate(-6 -9)"/><path class="b" d="M18.059,19H6" transform="translate(-6 -14.693)"/><path class="b" d="M21.5,29H6" transform="translate(-6 -20.386)"/><path class="b" d="M18.059,39H6" transform="translate(-6 -26.079)"/></g></g></g></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><defs><style>.a{fill:#fff;opacity:0;}.b{fill:none;stroke:#333;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}</style></defs><g transform="translate(-1774 -739)"><rect class="a" width="20" height="20" transform="translate(1774 739)"/><g transform="translate(1776 743)"><g transform="translate(0)"><path class="b" d="M22.336,19H12" transform="translate(-9.416 -14.693)"/><path class="b" d="M21.5,9H6" transform="translate(-6 -9)"/><path class="b" d="M21.5,29H6" transform="translate(-6 -20.386)"/><path class="b" d="M22.336,39H12" transform="translate(-9.416 -26.079)"/></g></g></g></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><defs><style>.a{fill:#fff;opacity:0;}.b{fill:none;stroke:#333;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}</style></defs><g transform="translate(-1822 -739)"><rect class="a" width="20" height="20" transform="translate(1822 739)"/><g transform="translate(1824 743)"><g transform="translate(0)"><path class="b" d="M21.5,9H6" transform="translate(-6 -9)"/><path class="b" d="M26.059,19H14" transform="translate(-10.555 -14.693)"/><path class="b" d="M21.5,29H6" transform="translate(-6 -20.386)"/><path class="b" d="M26.059,39H14" transform="translate(-10.555 -26.079)"/></g></g></g></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><defs><style>.a{fill:#fff;opacity:0;}.b{fill:none;stroke:#333;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}</style></defs><g transform="translate(-1870 -739)"><rect class="a" width="20" height="20" transform="translate(1870 739)"/><g transform="translate(1872 743)"><path class="b" d="M21.5,19H6" transform="translate(-6 -14.693)"/><path class="b" d="M21.5,9H6" transform="translate(-6 -9)"/><path class="b" d="M21.5,29H6" transform="translate(-6 -20.386)"/><path class="b" d="M21.5,39H6" transform="translate(-6 -26.079)"/></g></g></svg>'
];
const getFontSizeList = () => {
  let list = []
  for (let index = 12; index < 100; index++) {
    list.push(index)
  }
  fontSizeList = list
}

const getFreeFontList = () => {
  fontFamilyList.value = [
    ...fontFamilyList.value,
  ];

};

const setAllCuts = debounce(() => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0]
  if (baseAttr.angle == NaN || !baseAttr.angle) {
    baseAttr.angle = 0
    activeObject.rotate(baseAttr.angle)
  }
  ControlsTile.setRepeat(activeObject.repeatType, true)
  // if (activeObject.isRepeat) {
  //   const obj = canvasEditor.canvas.getObjects().find(el => el.tileParentId == activeObject.id)
  //   obj.rotate(baseAttr.angle)
  //   canvasEditor.canvas.renderAll();
  // }
  store.commit('setAllCuts')
}, 400)
const getObjectAttr = (e) => {
  const activeObject = canvasEditor.canvas.getActiveObject();
  // 不是当前obj，跳过
  if (e && e.target && e.target !== activeObject) return;
  if (activeObject) {
    // base
    baseAttr.id = activeObject.get('id');
    baseAttr.opacity = activeObject.get('opacity') * 100;
    baseAttr.fill = activeObject.get('fill');
    baseAttr.left = activeObject.get('left');
    baseAttr.top = activeObject.get('top');
    baseAttr.stroke = activeObject.get('stroke');
    baseAttr.strokeWidth = activeObject.get('strokeWidth');
    baseAttr.shadow = activeObject.get('shadow') || {};
    baseAttr.angle = activeObject.get('angle') || 0;
    baseAttr.points = activeObject.get('points') || {};

    const textTypes = ['i-text', 'text', 'textbox'];
    if (textTypes.includes(activeObject.type)) {
      fontAttr.fontSize = activeObject.get('fontSize');
      fontAttr.fontFamily = activeObject.get('fontFamily');
      fontAttr.lineHeight = activeObject.get('lineHeight');
      fontAttr.textAlign = activeObject.get('textAlign');
      fontAttr.underline = activeObject.get('underline');
      fontAttr.linethrough = activeObject.get('linethrough');
      fontAttr.charSpacing = activeObject.get('charSpacing');
      fontAttr.overline = activeObject.get('overline');
      fontAttr.fontStyle = activeObject.get('fontStyle');
      fontAttr.textBackgroundColor = activeObject.get('textBackgroundColor');
      fontAttr.fontWeight = activeObject.get('fontWeight');
    }

  }
};

const selectCancel = () => {
  baseAttr.fill = '';
  update?.proxy?.$forceUpdate();
};

const init = () => {
  // 获取字体数据
  getFreeFontList();

  event.on('selectCancel', selectCancel);
  event.on('selectOne', getObjectAttr);
  canvasEditor.canvas.on('object:modified', getObjectAttr);
  getFontSizeList()
};

// 修改字体
const changeFontFamily = (fontName) => {
  if (!fontName) return;
  // 跳过加载的属性;
  const skipFonts = ['arial', 'Microsoft YaHei'];
  if (skipFonts.includes(fontName)) {
    const activeObject = canvasEditor.canvas.getActiveObjects()[0];
    activeObject && activeObject.set('fontFamily', fontName);
    canvasEditor.canvas.renderAll();
    store.commit('setAllCuts')
    return;
  }
  Spin.show();
  // 字体加载
  const font = new FontFaceObserver(fontName);
  font
    .load(null, 150000)
    .then(() => {
      const activeObject = canvasEditor.canvas.getActiveObjects()[0];
      activeObject && activeObject.set('fontFamily', fontName);
      canvasEditor.canvas.renderAll();
      Spin.hide();
      store.commit('setAllCuts')
    })
    .catch((err) => {
      Spin.hide();
    });
};

// 通用属性改变
const changeCommon = (key, value) => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  // 透明度特殊转换
  if (key === 'opacity') {
    activeObject && activeObject.set(key, value / 100);
    canvasEditor.canvas.renderAll();
    return;
  }
  // 旋转角度适配
  if (key === 'angle') {
   
    activeObject.rotate(value);
    value === 0 ? activeObject.angle = 0 : ''
    canvasEditor.canvas.renderAll();
    return;
  }
  activeObject && activeObject.set(key, value);
  canvasEditor.canvas.renderAll();
  console.log('key', key, value)
  setTimeout(() => {
    store.commit('setAllCuts')
  }, 300);
};

// 边框设置
const borderSet = (key) => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  if (activeObject) {
    const stroke = strokeDashList.find((item) => item.label === key);
    activeObject.set(stroke.value);
    canvasEditor.canvas.renderAll();
  }
  store.commit('setAllCuts')
};

// 阴影设置
const changeShadow = () => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  activeObject && activeObject.set('shadow', new fabric.Shadow(baseAttr.shadow));
  canvasEditor.canvas.renderAll();
};

// 加粗
const changeFontWeight = (key, value) => {
  const nValue = value === 'normal' ? 'bold' : 'normal';
  fontAttr.fontWeight = nValue;
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  activeObject && activeObject.set(key, nValue);
  canvasEditor.canvas.renderAll();
  store.commit('setAllCuts')
};

// 斜体
const changeFontStyle = (key, value) => {
  const nValue = value === 'normal' ? 'italic' : 'normal';
  fontAttr.fontStyle = nValue;
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  activeObject && activeObject.set(key, nValue);
  canvasEditor.canvas.renderAll();
  store.commit('setAllCuts')
};

// 中划
const changeLineThrough = (key, value) => {
  const nValue = value === false;
  fontAttr.linethrough = nValue;
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  activeObject && activeObject.set(key, nValue);
  canvasEditor.canvas.renderAll();
};

// 下划
const changeUnderline = (key, value) => {
  const nValue = value === false;
  fontAttr.underline = nValue;
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  activeObject && activeObject.set(key, nValue);
  canvasEditor.canvas.renderAll();
};

// 修改边数
const changeEdge = (value) => {
  const activeObjects = canvasEditor.canvas.getActiveObjects();
  if (!activeObjects || !activeObjects.length) return;
  activeObjects[0].set(
    'points',
    getPolygonVertices(value, Math.min(activeObjects[0].width, activeObjects[0].height) / 2)
  );
  canvasEditor.canvas.requestRenderAll();
};

onMounted(init);

onBeforeUnmount(() => {
  event.off('selectCancel', selectCancel);
  event.off('selectOne', getObjectAttr);
  canvasEditor.canvas.off('object:modified', getObjectAttr);
});
</script>

<style scoped lang="less">
// @import url('vue-color-gradient-picker/dist/index.css');
:deep(.ivu-color-picker) {
  // display: block;
}

:deep(.ivu-input-number) {
  display: block;
  width: 100%;
}

:deep(.ivu-input) {
  width: 64px;
  height: 40px;
  background: #FFFFFF;
  border-radius: 20px 20px 20px 20px;
  border: 1px solid #DCE1E9;
  text-align: center;

  font-size: 16px;
  color: #86909C;
}

:deep(.ivu-divider-plain) {
  &.ivu-divider-with-text-left {
    margin: 10px 0;
    font-weight: bold;
    font-size: 16px;
    color: #000000;
  }
}

/deep/.ivu-radio-default::after {
  display: none;
}

/deep/.ivu-radio-default::before {
  display: none;
}

.box-1 {
  width: 100%;
  padding: 0px 20px;
}

.button-group {
  display: flex;
  // width: 100%;
  border: none;
  height: 40px;

  .ivu-radio-wrapper-checked {
    box-shadow: none;

  }

  .ivu-btn,
  .ivu-radio-wrapper {
    height: 40px;
    width: 40px !important;
    border: none;
    background-color: #F0F2F5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.flex-view {
  width: 100%;
  margin-bottom: 5px;
  padding: 5px;
  display: inline-flex;
  justify-content: space-between;
  border-radius: 5px;
}

// /depp/.ivu-select-dropdown{
//   left: -158px;
// }

.flex-item {
  display: inline-flex;
  flex: 1;

  .label {
    width: 32px;
    height: 32px;
    line-height: 32px;
    display: inline-block;
    font-size: 14px;
    // color: #333333;
  }

  .content {
    width: 60px;
  }

  .slider-box {
    width: calc(100% - 50px);
    margin-left: 10px;
  }

  .left {
    flex: 1;
  }

  .right {
    flex: 1;
    margin-left: 10px;

    :deep(.ivu-input-number) {
      display: block;
      width: 100%;
    }
  }

  :deep(.ivu-slider-wrap) {
    margin: 13px 0;
  }

  :deep(.ivu-radio-group-button) {
    & .ivu-radio-wrapper {
      width: 48px;
      line-height: 40px;
      text-align: center;

      svg {
        vertical-align: baseline;
      }
    }
  }

  :deep(.ivu-btn-group-large) {
    &>.ivu-btn {
      font-size: 24px;
    }
  }

  :deep(.ivu-radio-group-button) {
    &.ivu-radio-group-large .ivu-radio-wrapper {
      font-size: 24px;
    }
  }
}

.btn-1 {
  background: #F0F2F5;
  // border: none;
}

.ivu-row {
  margin-bottom: 8px;

  // .ivu-col {
  //   position: inherit;

  //   &__box {
  //     display: flex;
  //     align-items: center;
  //     background: #f8f8f8;
  //     border-radius: 4px;
  //     gap: 8px;
  //   }
  // }

  // .label {
  //   padding-left: 8px;
  // }

  // .content {
  //   flex: 1;

  //   // :deep(.--input),
  //   // :deep(.ivu-select-selection) {
  //   //   background-color: transparent;
  //   //   border: none !important;
  //   //   box-shadow: none !important;
  //   //   height: 40px;
  //   // }
  // }
}

/deep/.ivu-input-icon {
  right: 15px;
  color: #DCE1E9;
  font-size: 10px;
}

/deep/.ivu-color-picker-color div {
  height: 24px;
  width: 24px;
  border-radius: 5px 5px 5px 5px;
  margin-left: 3px;
}

/deep/.ivu-color-picker-color {
  height: 24px;
  width: 24px;
  border-radius: 5px 5px 5px 5px;
  margin-left: 10px;
  background: #FFFFFF;
}


:deep(.ivu-select-selection) {
  // background-color: transparent;
  // border: none !important;
  // box-shadow: none !important;
  height: 40px;
  border-radius: 20px;
}

/deep/.ivu-select-arrow {
  right: 10px;
  color: #bbbfc8;
}

/deep/.ivu-select-placeholder {
  height: 40px;
  font-size: 16px;
  font-family: zcoolqingkehuangyouti-Regular, zcoolqingkehuangyouti;
  font-weight: 400;
  color: #86909C;
}


/deep/.ivu-select-selected-value {
  height: 40px;
  font-size: 16px;
  font-family: zcoolqingkehuangyouti-Regular, zcoolqingkehuangyouti;
  font-weight: 400;
  color: #86909C;
  padding-top: 2px;
  padding-left: 10px;
}

/depp/.ivu-btn-default {
  border: none;
  width: 40px;
  height: 40px;
  background: #F0F2F5;
  border-radius: 50%;

}

.font-selector {
  :deep(.ivu-select-item) {
    padding: 1px 4px;
  }

  .font-item {
    background-color: #000;
    background-size: cover;
    background-position: center center;
    height: 40px;
    width: 200px;
    color: #fff;
    font-size: 27px;
    text-align: center;
    filter: invert(100%);
  }
}
</style>
