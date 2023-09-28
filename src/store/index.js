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
          Title: ''
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
        cutPartsType: '',
        // 裁片
        cutParts: []
      },
      test: '11',
      // 撤回-回退
      saveSteps: {
        ID: '',
        ID_Next: '',
        ID_Previous: ''
      }
    }
  },
  mutations: {
    text(state) {
      state.test = '333'+ state.test
    },
    setCommodityInfo(state, val) {
      state.saveData.commodityInfo.GUID = val.GUID ? val.GUID : state.saveData.commodityInfo.GUID
      state.saveData.commodityInfo.ImageUrl = val.ImageUrl ? val.ImageUrl : state.saveData.commodityInfo.ImageUrl
      state.saveData.commodityInfo.Title = val.Title ? val.Title : state.saveData.commodityInfo.Title
      state.saveData.commodityInfo.colorId = val.Title ? val.Title : state.saveData.commodityInfo.colorId
    },
    setGoodsId(state, GUID) {
      state.saveData.commodityInfo.GUID = GUID
    },
    setSizeList(state, val) {
      state.saveData.commodityInfo.sizeList = val
    },
    setGoodsSizeGUID(state, sizeGUID) {
      state.saveData.commodityInfo.sizeGUID = sizeGUID
    },
    setBgColor(state, val) {
      state.saveData.commodityInfo.bgColor = val
    },
    setModelInfo(state, obj) {
      state.saveData.modelInfo = obj
    },
    setCutPartsType(state, val) {
      state.saveData.cutPartsType = val
    },
    setCanvasObjects(state, val) {
      state.saveData.canvasObjects = val
    },
    setCutParts(state, val) {
      state.saveData.cutParts = val
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