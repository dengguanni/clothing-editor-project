import { createStore } from 'vuex'
const store = createStore({
  state() {
    return {
      saveData: {
        // 商品信息
        commodityInfo: {
          sizeGUID: '',
          GUID: '',
          bgColor: {},
          sizeList: [],
          ImageUrl: '',
          Title: '',
          colorList: [],
          cutParts: []
        },
        // 模型信息
        modelInfo: {
          modelName: '',
          modelUrl: '',
          modelUrl_Path: ''
        },
        // 画布内容
        canvasObjects: [],
        // 裁片类型
      },
      bgColor: '',
      sizeGUID: '',
      cutParts: [],
      cutPartsType: '[整体设计]',
      colorList: [],
      goodsId: '',
      // 撤回-回退
      saveSteps: {
        ID: '',
        ID_Next: 0,
        ID_Previous: 0
      },
      handelSave: 0,
      handleLock: 0,
      pageLoading: false,
      isSetSteps: false,
      selected: '',
      screenshotList: {
        big: [],
        small: []
      },
      smallLoad3d: true,
      bigLoad3d: false,
      is3dPreview: true,
      objectAttr: 0,
      previewType: 'small',
      userID: '',
      disableClipping: false,
      isShowCuts: true,
      saveBtnDisabled: true,
      testBase64: ''
    }
  },
  mutations: {
    setCommodityInfo(state, val) {
      state.saveData.commodityInfo.GUID = val.GUID ? val.GUID : state.saveData.commodityInfo.GUID
      state.saveData.commodityInfo.ImageUrl = val.ImageUrl ? val.ImageUrl : state.saveData.commodityInfo.ImageUrl
      state.saveData.commodityInfo.Title = val.Title ? val.Title : state.saveData.commodityInfo.Title
      state.saveData.commodityInfo.colorId = val.Title ? val.Title : state.saveData.commodityInfo.colorId
    },
    setIsShowCuts(state) {
      state.isShowCuts = state.isShowCuts = !state.isShowCuts
    },
    setTestBase64(state, val) {
      state.testBase64 = val
    },
    setDisableClipping(state, val) {
      state.disableClipping = val
    },
    setsLoad3d(state, val) {
      if (state.previewType == 'small') {
        state.smallLoad3d = val
      } else {
        state.bigLoad3d = val
      }

    },
    setUserID(state, val) {
      state.userID = val
    },
    setSaveBtnDisabled(state, val) {
      state.saveBtnDisabled = val
    },
    setIs3dPreview(state, val) {
      state.is3dPreview = val
    },
    setsPreviewTyped(state, val) {
      state.previewType = val
    },
    setObjectAttr(state) {
      state.objectAttr = state.objectAttr + 1
    },
    setScreenshotList(state, val) {
      state.screenshotList.big = val.big ? val.big : state.screenshotList.big
      state.screenshotList.small = val.small ? val.small : state.screenshotList.small
    },
    setAllIsLock(state) {
      state.handleLock = state.handleLock + 1
    },
    setIsSetSteps(state, val) {
      state.isSetSteps = val
    },
    setSave(state) {
      state.handelSave = state.handelSave + 1
    },
    setSelected(state, val) {
      state.selected = val
    },
    setPageLoading(state, val) {
      console.log('setPageLoading', val)
      state.pageLoading = val
    },
    setGoodsId(state, GUID) {
      console.log('切换 id', GUID)
      state.saveData.commodityInfo.GUID = GUID
      state.goodsId = GUID
    },
    setBgColorList(state, val) {
      state.saveData.commodityInfo.colorList = val
      state.colorList = val
    },
    setSizeList(state, val) {
      state.saveData.commodityInfo.sizeList = val
    },
    setGoodsSizeGUID(state, sizeGUID) {
      state.saveData.commodityInfo.sizeGUID = sizeGUID
      state.sizeGUID = sizeGUID
    },
    setBgColor(state, val) {
      console.log('颜色', val)
      state.saveData.commodityInfo.bgColor = val
      state.bgColor = val
    },
    setModelInfo(state, obj) {
      state.saveData.modelInfo = obj
    },
    setCutPartsType(state, val) {
      state.cutPartsType = val
    },
    setCanvasObjects(state, val) {
      state.saveData.canvasObjects = val
    },
    setCutParts(state, val) {
      state.saveData.commodityInfo.cutParts = val
      state.cutParts = val
    },
    setSaveData(state, val) {
      state.saveData = val
    },
    setSaveSteps(state, val) {
      state.saveSteps = val
    }
  },

})
export default store