<!--
 * @Author: 邓官妮
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 邓官妮
 * @LastEditTime: 2023-07-24 23:13:51
 * @Description: 图层面板
-->

<template>
  <div class="box">
    <Button class="all-design-btn">
      <span v-html="iconType('clothing')" style="margin: 2px 5px 0px 5px;"></span>
      [整体设计]
    </Button>
    <div class="layer-box">
      <div v-for="item in list" :key="item.id" :class="isSelect(item) && 'active'"
        @click="select(item.id, { Title: '[整体设计]' })">
        <div v-if="item.cutPartsType == '[整体设计]' && item.isMask == undefined && item.customVisible !== undefined">
          <Tooltip :content="item.name || item.text || item.type" placement="left">
            <div class="ellipsis">
              <div style="display:flex;">
                <div :class="isSelect(item) && 'active'" v-html="iconType(item.type)" style="margin: 2px 5px 0px 40px;">
                </div>
                <span> {{ textType(item.type, item) }}</span>
              </div>
              <div>
                <Lock v-show="false" :isLock="state.isLock"></Lock>
                <span v-html="iconType(item.isLock ? 'lock' : 'unlock')" style="margin: 0px 10px;" @click="doLock"></span>
                <span v-html="iconType(item.customVisible ? 'display' : 'hide')" style="margin: 0px 10px;"
                  @click="doHide"></span>
              </div>
            </div>
          </Tooltip>
        </div>
      </div>
    </div>

    <template v-if="list.length">
      <Collapse v-model="value1">
        <Panel :name="item1.Title" v-for="(item1, index) in cutParts" :key="item1.Title">
          <div v-html="iconType('clothing')" style="margin: 2px 5px 0px 5px;"></div>
          <div>{{ item1.Title }}</div>
          <template #content>
            <div class="layer-box">
              <div v-for="item in list" :key="item.id" :class="isSelect(item) && 'active'"
                @click="select(item.id, item1)">
                <div
                  v-if="item.cutPartsType == item1.Title && item.isMask == undefined && item.customVisible !== undefined">
                  <Tooltip :content="item.name || item.text || item.type" placement="left">
                    <div class="ellipsis">
                      <div style="display:flex;">
                        <div :class="isSelect(item) && 'active'" v-html="iconType(item.type)"
                          style="margin: 2px 5px 0px 40px;"></div>
                        <span> {{ textType(item.type, item) }}</span>
                      </div>
                      <div>
                        <Lock v-show="false" :isLock="state.isLock"></Lock>
                        <span v-html="iconType(item.isLock ? 'lock' : 'unlock')" style="margin: 0px 10px;"
                          @click="doLock"></span>
                        <span v-html="iconType(item.customVisible ? 'display' : 'hide')" style="margin: 0px 10px;"
                          @click="doHide"></span>
                      </div>
                    </div>
                  </Tooltip>
                </div>
              </div>
            </div>
          </template>
        </Panel>
      </Collapse>

      <!-- 层级调整按钮 -->
      <!-- <div class="btn-box">
        <ButtonGroup v-show="mixinState.mSelectMode === 'one'" size="small">
          <Button @click="up"><span v-html="btnIconType('up')"></span></Button>
          <Button @click="down"><span v-html="btnIconType('down')"></span></Button>
          <Button @click="upTop"><span v-html="btnIconType('upTop')"></span></Button>
          <Button @click="downTop"><span v-html="btnIconType('downTop')"></span></Button>
        </ButtonGroup>
      </div> -->
    </template>
    <template v-else>
      <p class="empty-text">暂无图层</p>
    </template>
  </div>
</template>

<script setup name="Layer">
import { Collapse, Panel, Button } from 'view-ui-plus';
import Lock from '@/components/lock.vue'
import useSelect from '@/hooks/select';
import { ref } from 'vue'
import { useStore } from 'vuex'
import { debounce } from 'lodash-es';
const store = useStore()
const value1 = [1, 2]
const { canvasEditor, fabric, mixinState } = useSelect();
const list = ref([]);
const state = reactive({
  isLock: false,
  isHide: true
})
const lockAttrs = [
  'lockMovementX',
  'lockMovementY',
  'lockRotation',
  'lockScalingX',
  'lockScalingY',
];
const cutParts = computed(() => {
  return store.state.cutParts
})
const cutPartsType = computed(() => {
  return store.state.cutPartsType
})
const selected = computed(() => {
  return store.state.selected
})
// watch(selected, (newVal, oldVal) => {
//   if (newVal) {
//     setSaveData()
//   }
// }, { immediate: true, deep: true })

// 是否选中元素
const isSelect = (item) => {
  return item.id === mixinState.mSelectId || mixinState.mSelectIds.includes(item.id);
};

// 图层类型图标
const iconType = (type) => {
  const iconType = {
    group:
      '<svg t="1650855307397" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2503" width="16" height="16"><path d="M839.036 130.458h-654.072c-30.102 0-54.506 24.404-54.506 54.506v654.072c0 30.102 24.404 54.506 54.506 54.506h654.072c30.102 0 54.506-24.404 54.506-54.506v-654.072c0-30.102-24.404-54.506-54.506-54.506zM839.036 811.786c0 15.050-12.196 27.249-27.249 27.249h-598.721c-15.050 0-27.249-12.196-27.249-27.249v-598.721c0-15.050 12.196-27.249 27.249-27.249h598.721c15.049 0 27.249 12.196 27.249 27.249v598.721zM730.028 421.639h-127.324v-126.817c0-30.091-24.402-54.499-54.501-54.499h-252.755c-30.098 0-54.501 24.401-54.501 54.499v253.89c0 30.091 24.402 54.499 54.501 54.499h127.324v126.817c0 30.091 24.402 54.499 54.501 54.499h252.755c30.098 0 54.501-24.401 54.501-54.499v-253.89c0-30.091-24.402-54.499-54.501-54.499zM323.36 548.137c-15.050 0-27.251-12.207-27.251-27.26v-197.694c0-15.055 12.201-27.26 27.251-27.26h196.928c15.051 0 27.251 12.207 27.251 27.26v98.458h-70.267c-30.098 0-54.501 24.401-54.501 54.499v71.998h-99.411zM547.539 477.24v43.638c0 15.055-12.202 27.26-27.251 27.26h-42.353v-43.638c0-15.055 12.202-27.26 27.251-27.26h42.353zM729.365 702.193c0 15.055-12.201 27.26-27.251 27.26h-196.928c-15.050 0-27.251-12.207-27.251-27.26v-98.981h70.267c30.098 0 54.501-24.401 54.501-54.499v-71.474h99.411c15.050 0 27.251 12.207 27.251 27.26v197.693z" p-id="2504"></path></svg>',
    'i-text':
      '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"><defs><style>.a{fill:#fff;opacity:0;}.b{fill:none;stroke:#4e5969;stroke-linecap:square;}</style></defs><g transform="translate(-10056 496)"><rect class="a" width="15" height="15" transform="translate(10056 -496)"/><g transform="translate(10237.286 265.632)"><g transform="translate(-176.409 -757.278)"><path class="b" d="M-174.834-754.272v-.937h6.075v.937" transform="translate(174.834 755.209)"/><path class="b" d="M-170.414-755.209v6.835" transform="translate(173.452 755.209)"/><path class="b" d="M-172.624-745.264h3.038" transform="translate(174.143 752.099)"/></g><rect class="b" width="13" height="13" rx="2.25" transform="translate(-180.287 -760.632)"/></g></g></svg>',
    image:
      '<svg t="1650855321307" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2701" width="16" height="16"><path d="M813.752 223.168H209.584a25.168 25.168 0 0 0-25.168 25.176v528.648a25.16 25.16 0 0 0 25.168 25.168h604.168a25.152 25.152 0 0 0 25.168-25.168V248.344a25.168 25.168 0 0 0-25.168-25.176z m-8.08 544.168H217.664V258h588.008v509.336z" p-id="2702"></path><path d="M406.752 454.168a44.24 44.24 0 1 0-0.008-88.48 44.24 44.24 0 0 0 0.008 88.48zM474.72 611.368l-67.968-94.376-110.584 158.336h442.328L605.8 426.52z" p-id="2703"></path></svg>',
    rect: '<svg t="1650855811131" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="18499" width="16" height="16"><path d="M864 896H160a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h704a32 32 0 0 1 32 32v704a32 32 0 0 1-32 32zM192 832h640V192H192v640z" p-id="18500"></path></svg>',
    circle:
      '<svg t="1650855860236" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="19440" width="16" height="16"><path d="M512 928C282.624 928 96 741.376 96 512S282.624 96 512 96s416 186.624 416 416-186.624 416-416 416z m0-768C317.92 160 160 317.92 160 512s157.92 352 352 352 352-157.92 352-352S706.08 160 512 160z" p-id="19441"></path></svg>',
    triangle:
      '<svg t="1650874633978" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2032" width="16" height="16"><path d="M928.64 896a2.144 2.144 0 0 1-0.64 0H96a32.032 32.032 0 0 1-27.552-48.288l416-704c11.488-19.456 43.552-19.456 55.104 0l413.152 699.2A31.936 31.936 0 0 1 928.64 896zM152.064 832h719.84L512 222.912 152.064 832z" p-id="2033"></path></svg>',
    unlock: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"><defs><style>.a,.b{fill:#4e5969;}.a{opacity:0;}.b,.c{stroke:#4e5969;}.b,.c,.d{stroke-linejoin:round;}.c,.d{fill:none;stroke-linecap:round;}.d{stroke:#fff;}</style></defs><g transform="translate(-10056 496)"><rect class="a" width="15" height="15" transform="translate(10056 -496)"/><g transform="translate(10051.989 -498.108)"><rect class="b" width="9.523" height="6.162" rx="2" transform="translate(7 9.055)"/><path class="c" d="M14,9.041V6.8a2.832,2.832,0,0,1,5.6-.56" transform="translate(-5.039)"/><path class="d" d="M24,30v1.68" transform="translate(-12.239 -18.718)"/></g></g></svg>',
    polygon:
      '<svg t="1650874633978" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2032" width="16" height="16"><path d="M161.152 398.016l134.016 412.416h433.664l134.016-412.416L512 143.104 161.152 398.08zM512 64l426.048 309.568-162.752 500.864H248.704L85.952 373.568 512 64z" p-id="2033"></path></svg>',
    display: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"><defs><style>.a{fill:#fff;opacity:0;}.b{fill:none;stroke:#4e5969;stroke-linejoin:round;}</style></defs><g transform="translate(-10056 496)"><rect class="a" width="15" height="15" transform="translate(10056 -496)"/><g transform="translate(10052.966 -504.221)"><path class="b" d="M10.493,19.791c3.586,0,6.493-3.9,6.493-3.9S14.079,12,10.493,12,4,15.9,4,15.9,6.907,19.791,10.493,19.791Z"/><path class="b" d="M20.623,22.246A1.623,1.623,0,1,0,19,20.623,1.623,1.623,0,0,0,20.623,22.246Z" transform="translate(-10.13 -4.728)"/></g></g></svg>',
    hide: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"><defs><style>.a{fill:#fff;opacity:0;}.b{fill:none;stroke:#4e5969;stroke-linecap:round;stroke-linejoin:round;}</style></defs><g transform="translate(-10056 496)"><rect class="a" width="15" height="15" transform="translate(10056 -496)"/><g transform="translate(10053.033 -500.108)"><path class="b" d="M5.882,13.928A12.622,12.622,0,0,0,4,15.855s2.877,3.855,6.426,3.855a5.288,5.288,0,0,0,1.285-.163m-2.56-7.387A5.284,5.284,0,0,1,10.426,12c3.549,0,6.426,3.855,6.426,3.855a12.622,12.622,0,0,1-1.882,1.928" transform="translate(0 -4.072)"/><path class="b" d="M19.422,20.621a1.606,1.606,0,0,0,2.309,2.233" transform="translate(-10.181 -9.924)"/><path class="b" d="M17.566,17.566,6,6" transform="translate(-1.357)"/></g></g></svg>',
    clothing: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"><defs><style>.a{fill:#fff;opacity:0;}.b{fill:none;stroke:#4e5969;stroke-linejoin:round;}</style></defs><g transform="translate(-10056 496)"><rect class="a" width="15" height="15" transform="translate(10056 -496)"/><path class="b" d="M10.225,6A2.112,2.112,0,0,0,14.45,6h1.92l2.3,3.457-2.016,1.728v7.49H8.016v-7.49L6,9.457,8.3,6Z" transform="translate(10051.5 -500.5)"/></g></svg>',
    lock: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"><defs><style>.a,.b{fill:#4e5969;}.a{opacity:0;}.b,.c{stroke:#4e5969;}.b,.c,.d{stroke-linejoin:round;}.c,.d{fill:none;stroke-linecap:round;}.d{stroke:#fff;}</style></defs><g transform="translate(-10056 496)"><rect class="a" width="15" height="15" transform="translate(10056 -496)"/><g transform="translate(10052 -499)"><rect class="b" width="11" height="6" rx="2" transform="translate(6 10)"/><path class="c" d="M14,9.364V6.98a2.98,2.98,0,0,1,5.96,0V9.364" transform="translate(-5.616)"/><path class="d" d="M24,30v1.788" transform="translate(-12.636 -18.253)"/></g></g></svg>'
  };
  const defaultIcon =
    '<svg t="1650855578257" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17630" width="16" height="16"><path d="M620.606061 0a62.060606 62.060606 0 0 1 62.060606 62.060606v188.943515C874.945939 273.997576 1024 437.651394 1024 636.121212c0 214.217697-173.661091 387.878788-387.878788 387.878788-198.469818 0-362.123636-149.054061-385.117091-341.333333H62.060606a62.060606 62.060606 0 0 1-62.060606-62.060606V62.060606a62.060606 62.060606 0 0 1 62.060606-62.060606h558.545455z m62.060606 297.937455V620.606061a62.060606 62.060606 0 0 1-62.060606 62.060606H297.937455C320.636121 849.159758 463.39103 977.454545 636.121212 977.454545c188.509091 0 341.333333-152.824242 341.333333-341.333333 0-172.730182-128.294788-315.485091-294.787878-338.183757zM620.606061 46.545455H62.060606a15.515152 15.515152 0 0 0-15.406545 13.699878L46.545455 62.060606v558.545455a15.515152 15.515152 0 0 0 13.699878 15.406545L62.060606 636.121212h186.181818c0-214.217697 173.661091-387.878788 387.878788-387.878788V62.060606a15.515152 15.515152 0 0 0-13.699879-15.406545L620.606061 46.545455z m15.515151 248.242424c-188.509091 0-341.333333 152.824242-341.333333 341.333333h325.818182a15.515152 15.515152 0 0 0 15.406545-13.699879L636.121212 620.606061V294.787879z" p-id="17631"></path></svg>';
  return iconType[type] || defaultIcon;
};

const doLock = debounce(() => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0]
  console.log('activeObject', activeObject.isLock)
  if (activeObject.isLock) {
    activeObject.hasControls = true;
    activeObject.selectable = true;
    activeObject.isLock = false
    activeObject.hoverCursor = null
    lockAttrs.forEach((key) => {
      activeObject[key] = false;
    });
  } else {
    activeObject.hoverCursor = 'default'
    activeObject.hasControls = false;
    // 修改默认属性
    lockAttrs.forEach((key) => {
      activeObject[key] = true;
    });
    activeObject.selectable = false;
    activeObject.isLock = true

  }
  canvasEditor.handleOverallObjs(activeObject, 'lock')
  canvasEditor.canvas.renderAll();
  store.commit('setAllIsLock')
}, 200)
const doHide = debounce(() => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  activeObject.visible = !activeObject.visible
  activeObject.visible ? '' : canvasEditor.canvas.discardActiveObject()
  activeObject.customVisible = activeObject.visible
  canvasEditor.canvas.renderAll();
  canvasEditor.setAllCuts(false)
  canvasEditor.handleOverallObjs(activeObject, 'modified')
}, 500)
const textType = (type, item) => {
  if (type.includes('text')) {
    return item.name || item.text;
  }
  const typeText = {
    group: '组合',
    image: '图片',
    rect: '矩形',
    circle: '圆形',
    triangle: '三角形',
    polygon: '多边形',
    path: '路径',
  };
  return typeText[type] || '默认元素';
};
// 选中元素
const select = (id, obj) => {
  console.log('id, obj', id, obj)
  if (obj) {

    store.commit('setCutPartsType', obj.Title)
    const info = canvasEditor.canvas.getObjects().find((item) => item.id === id);
    canvasEditor.canvas.setActiveObject(info);
    canvasEditor.canvas.requestRenderAll();
  }


};

// 按钮类型
const btnIconType = (type) => {
  const iconType = {
    up: '<svg t="1650442206559" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1799" width="12" height="12"><path d="M876.2 434.3L536.7 94.9c-6.6-6.6-15.5-10.3-24.7-10.3-9.3 0-18.2 3.7-24.7 10.3L147.8 434.3c-13.7 13.7-13.7 35.8 0 49.5 13.7 13.7 35.8 13.7 49.5 0L477 204.1v700.2c0 19.3 15.7 35 35 35s35-15.7 35-35V204.1l279.7 279.7c6.8 6.8 15.8 10.3 24.7 10.3s17.9-3.4 24.7-10.3c13.7-13.7 13.7-35.8 0.1-49.5z" p-id="1800"></path></svg>',
    down: '<svg t="1650442229022" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1997" width="12" height="12"><path d="M876.2 589.7L536.7 929.1c-6.6 6.6-15.5 10.3-24.7 10.3-9.3 0-18.2-3.7-24.7-10.3L147.8 589.7c-13.7-13.7-13.7-35.8 0-49.5 13.7-13.7 35.8-13.7 49.5 0L477 819.9V119.6c0-19.3 15.7-35 35-35s35 15.7 35 35v700.2l279.7-279.7c6.8-6.8 15.8-10.3 24.7-10.3s17.9 3.4 24.7 10.3c13.7 13.8 13.7 35.9 0.1 49.6z" p-id="1998" ></path></svg>',
    upTop:
      '<svg t="1650442106652" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1839" width="11" height="11"><path d="M548.352 219.648a58.88 58.88 0 0 0-16.896-10.752 51.2 51.2 0 0 0-38.912 0 58.88 58.88 0 0 0-16.896 10.752l-256 256a51.2 51.2 0 0 0 72.704 72.704L460.8 379.392V972.8a51.2 51.2 0 0 0 102.4 0V379.392l168.448 168.96a51.2 51.2 0 0 0 72.704-72.704zM972.8 0H51.2a51.2 51.2 0 0 0 0 102.4h921.6a51.2 51.2 0 0 0 0-102.4z" p-id="1840" ></path></svg>',
    downTop:
      '<svg t="1650442146918" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2045" width="11" height="11"><path d="M548.352 804.352a58.88 58.88 0 0 1-16.896 10.752 51.2 51.2 0 0 1-38.912 0 58.88 58.88 0 0 1-16.896-10.752l-256-256a51.2 51.2 0 0 1 72.704-72.704L460.8 644.608V51.2a51.2 51.2 0 0 1 102.4 0v593.408l168.448-168.96a51.2 51.2 0 0 1 72.704 72.704zM972.8 1024H51.2a51.2 51.2 0 0 1 0-102.4h921.6a51.2 51.2 0 0 1 0 102.4z" p-id="2046"></path></svg>',
  };
  return iconType[type];
};
const up = () => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  console.log('1up')
  canvasEditor.up();
  canvasEditor.handleOverallObjs(activeObject, 'top')
  console.log('up')
 
};
const upTop = () => {
  canvasEditor.upTop();
};
const down = () => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  canvasEditor.handleOverallObjs(activeObject, 'down')
  canvasEditor.down();
 
};
const downTop = () => {
  canvasEditor.downTop();
};

const getList = () => {

  // 不改原数组 反转
  list.value = [
    ...canvasEditor.canvas.getObjects().filter((item) => {
      // return item;
      // 过滤掉辅助线
      return !(item instanceof fabric.GuideLine || item.id === 'workspace' || item.isMask !== undefined);
    }),
  ]
    .reverse()
    .map((item) => {
      const { type, id, name, text, cutPartsType, isMask, customVisible, isLock } = item;
      return {
        type,
        id,
        name,
        text,
        cutPartsType,
        isMask,
        customVisible,
        isLock
      };
    });
};

onMounted(() => {
  // 当选择画布中的对象时，该对象不出现在顶层。
  canvasEditor.canvas.preserveObjectStacking = true;
  canvasEditor.canvas.on('after:render', getList);
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.a {
  fill: #fff;
  opacity: 0;
}

.b {
  fill: none;
  stroke: #4e5969;
  stroke-linecap: square;
}

:deep(.ivu-tooltip-inner) {
  white-space: normal;
}

:deep(.ivu-tooltip) {
  display: block;
}

:deep(.ivu-tooltip-rel) {
  display: block;
}

.box {
  width: 100%;
  padding: 20px 15px;
}

.layer-box {
  // height: calc(100vh - 170px);
  overflow-y: auto;
  // margin-bottom: 5px;

  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align: center;
    margin: 12px 0px;
  }

  &>div {
    // padding: 0px 5px;
    // margin: 3px 0;
    font-size: 14px;
    font-family: Source Han Sans CN-Medium, Source Han Sans CN;
    font-weight: 500;
    color: #4E5969;


    &.active {
      color: #2d8cf0;
      background: #f0faff;
      font-weight: bold;
    }
  }
}

.all-design-btn {
  width: 100%;
  height: 38px;
  background: #F5F7FA;
  border-radius: 5px 5px 5px 5px;
  border: 1px solid #F0F2F5;
  font-size: 14px;
  font-family: Source Han Sans CN-Medium, Source Han Sans CN;
  font-weight: 500;
  color: #4E5969;
}

.btn-box {
  width: 100%;
  margin-bottom: 20px;
  background: #f3f3f3;

  .ivu-btn-group {
    display: flex;
  }

  .ivu-btn-group>.ivu-btn {
    flex: 1;
  }
}

svg {
  vertical-align: text-top;
}

:deep(.ivu-divider-plain) {
  &.ivu-divider-with-text-left {
    margin: 10px 0;
    font-size: 16px;
    font-weight: bold;
    color: #000000;
  }
}

.empty-text {
  width: 100%;
  text-align: center;
  padding-top: 10px;
  color: #999;
}
</style>

<style lang="less" scoped>
span {
  svg {
    vertical-align: middle;
  }

  &.active {
    svg.icon {
      fill: #2d8cf0;
    }
  }
}

/deep/.ivu-collapse-header {
  border: none !important;
  border-bottom: none !important;
  display: flex;
  align-items: center;
}

/deep/.ivu-collapse {
  border: none !important;
  border-bottom: none !important;
}

/deep/.ivu-collapse-item-active {
  border: none !important;
  border-bottom: none !important;
}

/deep/.ivu-collapse-item {
  border: none !important;
  border-bottom: none !important;
}
</style>
