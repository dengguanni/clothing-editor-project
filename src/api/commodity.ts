
// 版型信息

import http from '@/api/request'

// web-版型-选择版型-获取左侧分类
// 文档地址：http://8.140.206.30:8011/SqlCmdDocument?GUID=28da401f-b46f-44b5-866c-4b5c32e31726
const getLeftClassificationList = function (params: any = {}) {
    return http.get(`/QueryData?SqlCmdName=Web\\get_goods_category_tree&DBC=d1`, params)
}
// 右侧缩略图
// http://8.140.206.30:8011/SqlCmdDocument?GUID=48c5178f-9eec-4dca-a5de-2abbaab17355
const getGoodsImageListByTreeNode = function (params: any= {}) {
    return http.get(`/QueryData?SqlCmdName=Web\\get_goodsImageListByTreeNode&DBC=d1`, params)
}
// web-版型-产品详情-选项卡获取数据之产品详情 Name:Web\get_goods
// http://8.140.206.30:8011/SqlCmdDocument?GUID=91c2ee82-51b6-4dfd-890e-f9948bfca86a
const getGoodsDetails = function (params: any= {}) {
    return http.get(`/QueryData?SqlCmdName=Web\\get_goods&DBC=d1`, params)
}

// // web-版型-产品详情-选项卡获取数据之：尺码说明&包装规格
// http://8.140.206.30:8011/SqlCmdDocument?GUID=e4e46b2d-3520-4d22-9b12-468131e9d724
const getGoodsSizeDetails = function (params: any= {}) {
    return http.get(`/QueryData?SqlCmdName=Web\\get_sizeListByGoodGUID&DBC=d1`, params)
}
// // web-版型-颜色
//http://8.140.206.30:8011/SqlCmdDocument?GUID=a235545a-7c6c-42e6-9603-8b49f3c5c3c6
const getColorListByGoodGUID = function (params: any= {}) {
    return http.get(`/QueryData?SqlCmdName=Web\\get_colorListByGoodGUID `, params)
}

const commodityApi = {
    getLeftClassificationList,
    getGoodsImageListByTreeNode,
    getGoodsDetails,
    getGoodsSizeDetails,
    getColorListByGoodGUID
}


export default commodityApi

