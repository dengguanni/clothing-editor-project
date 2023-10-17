<template>
  <Dialog @closeDailog="closeDailog" v-if="showDailog" :dialogType="dialogType">
    <patternCard v-if="dialogType == 1" @sendGoodsId="sendGoodsId"></patternCard>
    <productDetails v-if="dialogType == 2 || dialogType == 3" :selectedProduct="selectedProduct"
      :goodsId="goodsInfo.GUID"></productDetails>
    <bigPreview v-if="dialogType == 4 || dialogType == 5" :is3D="dialogType"></bigPreview>
  </Dialog>
  <div class="home" v-loading="pageLoading">
    <!-- <Layout> -->
    <!-- 头部区域 -->
    <Header v-if="state.isShowHeader">
      <div class="header-left">
        <div class="logo">
          <img src="http://8.140.206.30:8089/ImageSource/Other/Logo.png" style="height: 54px; width: 180px;" />
        </div>
        <history></history>
      </div>
      <!-- 导入 -->
      <!-- <import-JSON></import-JSON>
          <Divider type="vertical" />
          <import-file></import-file>
          <Divider type="vertical" /> -->
      <!-- 标尺开关 -->
      <!-- <Tooltip :content="$t('grid')">
            <iSwitch v-model="state.ruler" @on-change="rulerSwitch" size="small" class="switch"></iSwitch>
          </Tooltip> -->
      <!-- <Divider type="vertical" /> -->



      <!-- 预览 -->
      <!-- <previewCurrent /> -->
      <save></save>
      <!-- <lang></lang> -->
    </Header>
    <div class="content-navigation-bar" v-show="state.toolsBarShow">
      <div :class="!state.isDesign ? 'active' : 'not-active'" @click="changeMode(false)">版型</div>
      <div :class="state.isDesign ? 'active' : 'not-active'" @click="changeMode(true)">设计</div>
    </div>
    <Content style="display: flex; height: calc(100vh - 64px)">
      <!-- 左侧区域 -->
      <div v-if="state.show" :class="`left-bar ${state.toolsBarShow && 'show-tools-bar'}`">
        <Menu v-show="state.isDesign" :active-name="state.menuActive" accordion @on-select="showToolsBar" width="65px">
          <div>
            <MenuItem :name="3" class="menu-item">
            <!-- <Icon type="md-image" size="30" /> -->
            <common-icon :angle-key="'gallery'"></common-icon>
            <div>图库 </div>
            </MenuItem>
            <MenuItem :name="5" class="menu-item">
            <!-- <Icon type="md-book" size="30" /> -->
            <common-icon :angle-key="'background-1'"></common-icon>
            <div>{{ $t('background') }}</div>
            </MenuItem>
            <MenuItem :name="2" class="menu-item">
            <!-- <Icon type="logo-angular" size="30" /> -->
            <common-icon :angle-key="'text'"></common-icon>
            <div>{{ $t('elements') }}</div>
            </MenuItem>
            <MenuItem :name="6" class="menu-item">
            <!-- <Icon type="ios-cloud-upload-outline" size="30" /> -->
            <common-icon :angle-key="'upload'"></common-icon>
            <div>{{ $t('import_files') }}</div>
            </MenuItem>
            <!-- <MenuItem :name="1" class="menu-item">
                <Icon type="md-book" size="24" />
                <div>{{ $t('templates') }}</div>
              </MenuItem> -->

            <MenuItem :name="4" class="menu-item">
            <!-- <Icon type="md-reorder" size="30" /> -->
            <common-icon :angle-key="'layer'"></common-icon>
            <div>{{ $t('layers') }}</div>
            </MenuItem>
          </div>
        </Menu>

        <div class="content" v-show="state.isDesign">
          <!-- 生成模板 -->
          <div v-show="state.menuActive === 1" class="left-panel">
            <import-tmpl></import-tmpl>
          </div>
          <!-- 常用元素 -->
          <div v-show="state.menuActive === 2" class="left-panel">
            <tools></tools>
            <attribute v-if="state.show" :isText="true"></attribute>
            <!-- <fontTmpl></fontTmpl> -->
          </div>
          <!-- 图库 -->
          <div v-show="state.menuActive === 3" class="left-panel">
            <!-- <importSvgEl></importSvgEl> -->
            <backgroundBar></backgroundBar>
          </div>
          <!-- 图层设置 -->
          <div v-show="state.menuActive === 4" class="left-panel">
            <layer></layer>
          </div>
          <!-- 背景 -->
          <div v-show="state.menuActive === 5" class="left-panel">
            <backgroundBar :is-bg="true"></backgroundBar>
            <!-- <importSvgEl></importSvgEl> -->
          </div>
          <div v-show="state.menuActive === 6" class="left-panel">
            <import-file></import-file>
          </div>
        </div>
        <div v-show="!state.isDesign" class="content">
          <Pattern @openDailog="openDailog" :goodsInfo="goodsInfo" :sizeList="sizeList"></Pattern>
        </div>
        <!-- 关闭按钮 -->
        <div class="close-btn" v-show="state.toolsBarShow" @click="hideToolsBar"></div>
      </div>

      <!-- 画布区域 -->
      <div id="workspace">
        <div class="canvas-box">
          <div class="canvas-menu">
            <canvasMenu :sizeList="sizeList"></canvasMenu>
          </div>
          <div class="inside-shadow"></div>
          <!-- <img src="http://8.140.206.30:8089/ProjectTemplate/58871fa2-4b3a-11ee-b1c4-00163e10d08e/Part/01前片.jpg" style="height: auto;
      width: 793px;
      transform: scale(0.8);
      position: absolute;
      z-index: 9;
      left: 254px;
      top: -58px;
      pointer-events: none;
      opacity: 0.4;"/> -->

          <canvas id="canvas" :class="state.ruler ? 'design-stage-grid' : ''" width="400" height="300"></canvas>
          <!-- <canvas id="canvas2" :class="state.ruler ? 'design-stage-grid' : ''" width="400" height="200"></canvas> -->
          <dragMode v-if="state.show"></dragMode>
          <zoom></zoom>
          <!-- <mouseMenu></mouseMenu> -->
        </div>
      </div>

      <!-- 属性区域 380-->
      <div style="width:230px" v-show="state.attrBarShow"></div>
      <div class="right-bar" v-show="state.attrBarShow">
        <div v-if="state.show">
          <smallPreview @preview="preview"></smallPreview>
          <!-- 新增字体样式使用 -->
          <!-- <Button @click="getFontJson" size="small">获取字体数据</Button> -->
          <set-size></set-size>
          <!-- <bg-bar></bg-bar> -->
          <!-- <group></group> -->
          <!-- <div class="attr-item">
                <dele></dele>
                <clone></clone>
              </div> -->
          <!-- 组对齐方式 -->
          <!-- <align></align> -->
          <!-- 居中对齐 -->
          <!-- <center-align></center-align> -->
          <!-- <lock></lock> -->
          <filters v-show="state.isShowFilters" @goBack="goBack" :singleFilters="state.isContrast"></filters>
          <cropping v-show="state.isShowCropping" @goBack="goBack"></cropping>
          <div style="padding: 0px 20px;" v-show="!state.isShowFilters && !state.isShowCropping">
            <div id="img-width"></div>
            <!-- 替换图片 -->
            <replaceImg></replaceImg>
            <!-- <Button></Button> -->
            <!-- 铺满 -->
            <paving></paving>
            <!-- 翻转 -->
            <flip></flip>
            <attribute v-if="state.show"></attribute>
            <!-- 平铺 -->
            <mapTile @btnClick="mapTileClick"></mapTile>
          </div>
        </div>
      </div>
      <!-- 右侧关闭按钮 -->
      <div :class="`close-btn right-btn ${state.attrBarShow && 'right-btn-open'}`" @click="switchAttrBar"></div>
    </Content>
    <!-- </Layout> -->
  </div>
</template>
  
<script name="Editor" setup>
// 导入元素
import importJSON from '@/components/importJSON.vue';
import importFile from '@/components/importFile.vue';
import fontTmpl from '@/components/fontTmpl.vue';

// 顶部组件
import align from '@/components/align.vue';
import centerAlign from '@/components/centerAlign.vue';
import flip from '@/components/flip.vue';
import previewCurrent from '@/components/previewCurrent';
import save from '@/components/save.vue';
import lang from '@/components/lang.vue';
import clone from '@/components/clone.vue';
import group from '@/components/group.vue';
import zoom from '@/components/zoom.vue';
import dragMode from '@/components/dragMode.vue';
import lock from '@/components/lock.vue';
import dele from '@/components/del.vue';

// 左侧组件
import importTmpl from '@/components/importTmpl.vue';
import tools from '@/components/tools.vue';
import importSvgEl from '@/components/importSvgEl.vue';
import bgBar from '@/components/bgBar.vue';
import setSize from '@/components/setSize.vue';
import replaceImg from '@/components/replaceImg.vue';
import filters from '@/components/filters.vue';
import Pattern from '@/components/pattern.vue';
import backgroundBar from '@/components/backgroundBar.vue'

// 右侧组件
import history from '@/components/history.vue';
import layer from '@/components/layer.vue';
import attribute from '@/components/attribute.vue';
import smallPreview from '@/components/smallPreview.vue'
import paving from '@/components/paving.vue'
import mapTile from '@/components/mapTile.vue'
import cropping from '@/components/cropping.vue'
// 遮罩层
import Dialog from '@/components/dialog'
// 弹窗内容
import patternCard from '@/components/patternCard.vue'
import productDetails from '@/components/productDetails.vue'
import bigPreview from '@/components/bigPreview.vue'

// 功能
import { CanvasEventEmitter } from '@/utils/event/notifier';
import { createRouter, useRouter, useRoute } from 'vue-router';
import crypto from '@/utils/crypto.js'

import canvasMenu from '@/components/canvasMenu.vue'
// import { downFile } from '@/utils/utils';
import { fabric } from 'fabric';
import { useStore } from 'vuex'

// api
import getLeftClassificationList from '@/api/commodity.ts'
import historyAip from '@/api/history.ts'

// 3D
import LoadScene from '@/core/3D/loadScene.ts'

// icon
import commonIcon from '@/components/commonIcon.vue'
import Editor, {
  DringPlugin,
  AlignGuidLinePlugin,
  ControlsPlugin,
  ControlsRotatePlugin,
  CenterAlignPlugin,
  LayerPlugin,
  CopyPlugin,
  MoveHotKeyPlugin,
  DeleteHotKeyPlugin,
  GroupPlugin,
  DrawLinePlugin,
  GroupTextEditorPlugin,
  GroupAlignPlugin,
  WorkspacePlugin,
  DownFontPlugin,
  HistoryPlugin,
  FlipPlugin,
  RulerPlugin,
  TestPlugin,
  FiltersPlugin
  // MaterialPlugin,
} from '@/core';
let selectedProduct = ref(0)
const dialogType = ref(0)
const showDailog = ref(false)
const sizeList = ref([])
let goodsInfo = ref({
  GUID: '',
  ImageUrl: '',
  Title: ''
})
const store = useStore()
const route = useRoute()
const router = useRouter()
// 创建编辑器
const canvasEditor = new Editor();

const event = new CanvasEventEmitter();

const state = reactive({
  menuActive: 3,
  show: false,
  toolsBarShow: true,
  attrBarShow: true,
  select: null,
  ruler: false,
  isDesign: false,
  isShowHeader: false,
  isShowFilters: false,
  isShowCropping: false,
  isContrast: false
});
const saveData = computed(() => {
  return store.state.saveData
})
const goodsGUID = computed(() => {
  return store.state.saveData.commodityInfo.GUID
})
const pageLoading = computed(() => {
  return store.state.pageLoading
})

onMounted(() => {
  window.localStorage.userInfo = route.query.key
  // store.commit('setPageLoading', true)
  // 初始化fabric
  const canvas = new fabric.Canvas('canvas', {
    fireRightClick: true, // 启用右键，button的数字为3
    stopContextMenu: true, // 禁止默认右键菜单
    controlsAboveOverlay: true, // 超出clipPath后仍然展示控制条
    preserveObjectStacking: true,
  });

  // 初始化编辑器
  canvasEditor.init(canvas);
  canvasEditor.use(DringPlugin);
  canvasEditor.use(AlignGuidLinePlugin);
  canvasEditor.use(ControlsPlugin);
  canvasEditor.use(ControlsRotatePlugin);
  canvasEditor.use(CenterAlignPlugin);
  canvasEditor.use(LayerPlugin);
  canvasEditor.use(CopyPlugin);
  canvasEditor.use(MoveHotKeyPlugin);
  canvasEditor.use(DeleteHotKeyPlugin);
  canvasEditor.use(GroupPlugin);
  canvasEditor.use(DrawLinePlugin);
  canvasEditor.use(GroupTextEditorPlugin);
  canvasEditor.use(GroupAlignPlugin);
  canvasEditor.use(WorkspacePlugin);
  canvasEditor.use(DownFontPlugin);
  canvasEditor.use(HistoryPlugin);
  canvasEditor.use(FlipPlugin);
  canvasEditor.use(RulerPlugin);
  canvasEditor.use(TestPlugin);
  canvasEditor.use(FiltersPlugin);
  // canvasEditor.use(MaterialPlugin);
  event.init(canvas);
  state.show = true;
  state.isShowHeader = true;
  getSaveData()
});

// 获取字体数据 新增字体样式使用
// getFontJson() {
//   const activeObject = this.canvas.getActiveObject();
//   if (activeObject) {
//     const json = activeObject.toJSON(['id', 'gradientAngle', 'selectable', 'hasControls']);
//     console.log(json);
//     const fileStr = `data:text/json;charset=utf-8,${encodeURIComponent(
//       JSON.stringify(json, null, '\t')
//     )}`;
//     downFile(fileStr, 'font.json');
//     const dataUrl = activeObject.toDataURL();
//     downFile(dataUrl, 'font.png');
//   }
// },
const getSaveData = () => {
  store.commit('setIsSetSteps', true)
  const p = {
    ID: ''
  }
  historyAip.getHistory(p).then(res => {
    const data = res.Tag[0].Table[0].JsonValue
    const dataJson = JSON.parse(data)
    if (dataJson.commodityInfo.GUID) {
      sendGoodsId(dataJson.commodityInfo)
    }
    store.commit('setSaveData', dataJson)
    store.commit('setCutPartsType', dataJson.commodityInfo.cutParts[0].Title)
    store.commit('setCutParts', dataJson.commodityInfo.cutParts)
    store.commit('setGoodsSizeGUID', dataJson.commodityInfo.sizeGUID)
    store.commit('setBgColor', dataJson.commodityInfo.bgColor)
    store.commit('setBgColorList', dataJson.commodityInfo.colorList)
  })
}

const mapTileClick = (val) => {
  switch (val) {
    case 'filter':
      state.isShowFilters = true
      break;
    case 'cropping':
      state.isShowCropping = true
      break;
    case 'clearness':
      changeFilters()
      break;
    default:
  }
  return 0;
}
const changeFilters = () => {
  state.isContrast = !state.isContrast
  // const type = 'Contrast'
  // const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  // state.noParamsFilters[type] = state.isContrast;
  // if (state.isContrast) {
  //   const itemFilter = _getFilter(activeObject, type);
  //   if (!itemFilter) {
  //     _createFilter(activeObject, type);
  //   }
  // } else {
  //   _removeFilter(activeObject, type);
  // }
};

const rulerSwitch = (val) => {
  if (val) {
    canvasEditor.rulerEnable();
  } else {
    canvasEditor.rulerDisable();
  }
};
const closeDailog = () => {
  showDailog.value = false
}
const sendGoodsId = (val) => {
  showDailog.value = false
  goodsInfo.value = { ...val }
  store.commit('setGoodsId', val.GUID)
  getLeftClassificationList.getGoodsSizeDetails({ GUID: goodsInfo.value.GUID }).then(res => {
    let arr = []
    res.Tag[0].Table.forEach(el => {
      arr.push({
        Title: el.Title,
        GUID: el.GUID
      })
    })
    sizeList.value = [...arr]
    store.commit('setSizeList', arr)
  })
}
// 点击滤镜或者剪裁时候返回
const goBack = (val) => {
  if (val == 'filters') {
    state.isShowFilters = false
  } else if (val == 'cropping') {
    state.isShowCropping = false
  }
}
// 隐藏工具条
const hideToolsBar = () => {
  state.menuActive = 100;
  state.toolsBarShow = false;
  state.isDesign = true
};
// 展示工具条
const showToolsBar = (val) => {
  state.menuActive = val;
  state.toolsBarShow = true;
};
// 属性面板开关
const switchAttrBar = () => {
  state.attrBarShow = !state.attrBarShow;
};
const openDailog = (val) => {
  dialogType.value = val
  if (dialogType.value == 3) {
    selectedProduct.value = 1
  } else {
    selectedProduct.value = 0
  }
  showDailog.value = true
}

const changeMode = (val) => {
  state.isDesign = val;
  if (state.isDesignn) {
    state.menuActive = 1
  } else {
    state.toolsBarShow = true
  }
  // state.show = !state.show;
};
const preview = (is3D) => {
  dialogType.value = is3D ? 4 : 5
  showDailog.value = true
}

provide('fabric', fabric);
provide('event', event);
provide('canvasEditor', canvasEditor);
</script>
<style lang="less" scoped>
.header-left {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .logo {
    width: 365px;
    display: flex;
    align-items: center;
  }
}

// 左侧容器
.left-bar {
  width: 65px;
  height: 100%;
  background: #fff;
  display: flex;
  position: relative;

  &.show-tools-bar {
    width: 388px;
  }
}

// 右侧容器
.right-bar {
  width: 320px;
  height: 100%;
  padding-top: 20px;
  overflow-y: auto;
  background: #fff; // width: 240px;
  position: absolute;
  right: 0px;
  top: 54px;
  // height: 100%;
  // padding: 10px;
  // overflow-y: auto;
  // background: #fff;
}

// 关闭按钮
.close-btn {
  width: 20px;
  height: 64px;
  cursor: pointer;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAACACAMAAABOb9vcAAAAhFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAADHx8cODg50dHTx8fF2dnZ1dXWWlpZHR0c4ODhQpkZ5AAAAIXRSTlMA9t+/upkRAnPq5NXDfDEsKQjMeGlRThkMsquljTwzIWhBHpjgAAABJElEQVRYw+3YyW7CQBCEYbxig8ELGJyQkJRJyPb+75dj3zy/lD7kMH3+ZEuzSFO1mlZwhjOE2uwhVHJYMygNVwilhz2EUvNaMigledUFoE1anKYAtA9nVRuANpviOQBt0t2ZQSnZ9QxK6Qih9LSGUHkJobYlhGp6CPW4hlAVhckLhMop1InCjEK1FBYU1hSqo/BI4YXCjMIthTWFijDCCB3g7fuO4O1t/rkvQXPz/LUIzX0oAM0tQHOfCkBzC9DcuwLQXACao9Dv1yb9lsek2xaaxMcMH1x6Ff79dY0wwgj/DGv3p2tG4cX9wd55h4rCO/hk3uEs9w6QlXPIbXrfIJ6XrmVBOtJCA1YkXqVLkh1aUgyNk1fV1BxLxzpsuNLKzrME/AWr0ywwvyj83AAAAABJRU5ErkJggg==);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50%;
  position: absolute;
  right: -20px;
  z-index: 1;
  top: 50%;
  margin-top: -10px;

  &.right-btn {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAACACAYAAAB5sSvuAAAAAXNSR0IArs4c6QAAAFBlWElmTU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAKKADAAQAAAABAAAAgAAAAAAobJzlAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgoZXuEHAAADf0lEQVR4Ae2cvYsTQRjGE7FQkICFB1pZRyzEJkUKmzOpBEHwX9DCQkmChf4JahewsLpWFOQUzwMRPEgEy0PLpPADvEISDrVyfZ6cK0tIZrI7u7MPMi+8mb35uPnlmXczyeXmrURRdKyibAB8Dz8pywg42if4OUnIGd7Bww8Ut+GHpEATgPEll/y8DGRMtaB8hrryl30B2HzVW1Rcgx8vQ9UqaVac+Cf67cC34C+q1erHFcc5dUsDOD/RGBWv4M/hrwG8jzJ3cwFMwlDdd/BN+BZgd5ONLtd5Ac4zfEYFld0ALMMisxUFmAQa44dHdMB+TTasdM2bxJNxI7gDP7ISWNzJE1xymhF+uBzPbyvL2NZOA+oJIO/BrfP7iEGTSNtovIrY/L6sU9mA5PoAby6DtEq87JnlWF/H7+K+v/DmUQDkc23CNxbFpAogIa/Ab/IiaQoxmOThlnkG8TiKK5UUJNNR+MMYjqUaIJnWEYuXeEFTBCTXv1hUi0HCxXYWsbirqiAhb/BBWcE9KLimDEgB68pLTMAL6oBNdcBT6oBr6oAn1O9i2a2Od/DM1Jc4KBivVOYyLHFm6f4ODAoGBV0VcB0fYjAo6KqA6/gQg0FBVwVcx4cYDAq6KuA6/v+Mwel0Wmm325XhcOgqkH08/h6cyiaTSdRoNPhvBFGtVosGg0Gq8Wk7V9IO6Pf7MzgC+oBMDcgn1Ov1vEFmAvQJmRmQkN1ut3AlnQB9QDoDErLT6RSmZC6ARULmBlgUpPxWl5uCRcVhLoBFwTFsnAGLfi10AiwazklBX/txJgV9wWVSUP7tlvwbVspOyFarVfi7ac4Vvquzfyoy95DfiwOgeQHtrUFBu0bmHkFBsz721qCgXSNzj6CgWR97a1DQrpG5R1DQrI+9NSho18jcIyho1sfauqeuoDzgN3UFv6gD7qh/cK8rA84OGygv8VO+CCkrKH3g5Q1P41BB1SV+QDia4hJvQ72LB3h6gPIH/+5CvVGsntoSPwYQzxr/VgRkJoF1wP1KwvFa4SaRPgDNI+RLT2dTwTJfB+9j/jaWden5dgIe5oNnG2O+WwCb7bXWuflliSfLlAjCh4JULHMqjaIAc0tGkhdgnM6FyXI2EV+5pXNxAeTSMSHOSzg3+H2UuVsaQKq0A/eaUmiVb9yZlOk6vJSkTCZA2bRWsonBpFOrySan+wNoJmOM0LyBGwAAAABJRU5ErkJggg==);
    transform: rotateY(180deg);
    right: 0px;
  }

  &.right-btn-open {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAACACAMAAABOb9vcAAAAhFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAADHx8cODg50dHTx8fF2dnZ1dXWWlpZHR0c4ODhQpkZ5AAAAIXRSTlMA9t+/upkRAnPq5NXDfDEsKQjMeGlRThkMsquljTwzIWhBHpjgAAABJElEQVRYw+3YyW7CQBCEYbxig8ELGJyQkJRJyPb+75dj3zy/lD7kMH3+ZEuzSFO1mlZwhjOE2uwhVHJYMygNVwilhz2EUvNaMigledUFoE1anKYAtA9nVRuANpviOQBt0t2ZQSnZ9QxK6Qih9LSGUHkJobYlhGp6CPW4hlAVhckLhMop1InCjEK1FBYU1hSqo/BI4YXCjMIthTWFijDCCB3g7fuO4O1t/rkvQXPz/LUIzX0oAM0tQHOfCkBzC9DcuwLQXACao9Dv1yb9lsek2xaaxMcMH1x6Ff79dY0wwgj/DGv3p2tG4cX9wd55h4rCO/hk3uEs9w6QlXPIbXrfIJ6XrmVBOtJCA1YkXqVLkh1aUgyNk1fV1BxLxzpsuNLKzrME/AWr0ywwvyj83AAAAABJRU5ErkJggg==);
    right: 318px;
  }
}

// 属性面板样式
:deep(.attr-item) {
  position: relative;
  margin-bottom: 12px;
  height: 40px;
  padding: 0 10px;
  background: #f6f7f9;
  border: none;
  border-radius: 4px;
  display: flex;
  align-items: center;

  .ivu-tooltip {
    text-align: center;
    flex: 1;
  }
}

.ivu-menu-vertical .menu-item {
  text-align: center;
  padding: 10px 2px;
  box-sizing: border-box;
  font-size: 12px;

  &>i {
    margin: 0;
  }
}

:deep(.ivu-layout-header) {
  --height: 54px;
  padding: 0 20px;
  border-bottom: 1px solid #eef2f8;
  background: #fff;
  height: var(--height);
  line-height: var(--height);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.content-navigation-bar {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0);


  .active,
  .not-active {
    width: 194px;
    height: 47px;
    cursor: pointer;
    font-size: 18px;
    font-family: Source Han Sans CN-Medium, Source Han Sans CN;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .active {
    background: #FFFFFF;
    font-size: 18px;
    font-weight: bold;
    color: #3064F2;
  }

  .not-active {
    font-weight: 500;
    color: #86909C;
    background: #F7F7F7;
  }
}

.home,
.ivu-layout {
  height: 100vh;
  background-color: rgb(241, 241, 241) !important;
}

.icon {
  display: block;
}

.canvas-box {
  position: relative;

  .canvas-menu {
    position: absolute;
    top: 0px;
    left: 141px;
    z-index: 99;
  }
}

// 画布内阴影
.inside-shadow {
  position: absolute;
  width: 100%;
  height: 100%;
  // box-shadow: inset 0 0 9px 2px #0000001f;
  z-index: 2;
  pointer-events: none;
}

#canvas {
  width: 300px;
  height: 300px;
  margin: 0 auto;


}

#workspace {
  flex: 1;
  width: 100%;
  position: relative;
  background: #f1f1f1;
  overflow: hidden;

}

.content {
  flex: 1;
  width: 320px;
  // padding: 10px;
  padding-top: 0;
  height: 100%;
  overflow-y: hidden;

}

.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
  background: none;
}

// 标尺
.switch {
  margin-right: 10px;
}

// 网格背景
.design-stage-grid {
  --offsetX: 0px;
  --offsetY: 0px;
  --size: 16px;
  background: -webkit-linear-gradient(top, transparent 39px, blue 39px, blue 41px, transparent 41px, transparent 79px, red 80px),
    -webkit-linear-gradient(left, transparent 39px, yellow 39px, yellow 41px, transparent 41px, transparent 79px, green);
  background-size: 81px 81px;
  // --color: #dedcdc;
  // background-image: linear-gradient(45deg,
  //     var(--color) 25%,
  //     transparent 0,
  //     transparent 75%,
  //     var(--color) 0),
  //   linear-gradient(45deg, var(--color) 25%, transparent 0, transparent 75%, var(--color) 0);
  // background-position: var(--offsetX) var(--offsetY),
  //   calc(var(--size) + var(--offsetX)) calc(var(--size) + var(--offsetY));
  // background-size: calc(var(--size) * 2) calc(var(--size) * 2);
}
</style>
  