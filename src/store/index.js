import { createStore } from 'vuex'
const store = createStore({
  state() {
    return {
      commodityInfo: {
        size: '',
        goodsId: '',

      }
    }
  },
  mutations: {
    setGoodsId(state) {
      // state.commodityInfo.goodsId = goodsId
      console.log('000', state)
    }
  },
  actions: {
    setGoodsId(state) {
      // state.commodityInfo.goodsId = goodsId
      console.log('000', state)
    }
  }
})
export default store