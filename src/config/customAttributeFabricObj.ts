export const allCustomAttribute = [
    'tileParentFileName',  //平铺父级文件名
    'FileName',//文件名
    'isMask', //判断是否裁片
    'FilePath', //文件路径
    'cutPartsType', //裁片类型
    'name',
    'isRepeat', //是否平铺
    'ImageUrl',  //  图片路径
    'repeatType', //平铺类型
    'filtersList', //滤镜数组
    'oldFileName', //原始文件名
    'oldFilePath', //原始文件路径
    'parentUrl', //父级路径
    'customVisible', //自定义显隐
    'id',
    'isBackground', //是否背景图
    'isLock',
    'lockMovementX',
    'lockMovementY',
    'lockRotation',
    'lockScalingX',
    'lockScalingY',
    'selectable',
    'hasControls',
    'event',
    'hoverCursor',
    'tileParentId',
    'Sharpen',
    'parentCroppingFileName',
    'parentCroppingFilePath',
    'filtersType',
    'saveScaleX',
    'saveScaleY',
    'hasCropping'
]
// copy继承属性
export const basicInheritAttribute = [
    'tileParentFileName',  //平铺父级文件名
    'isMask', //判断是否裁片
    'cutPartsType',
    'name',
    'isRepeat',
    'repeatType',
    'oldFileName',
    'oldFilePath',
    'parentUrl',
    'customVisible',
    'isLock',
    'isBackground',
    'filters',
    'lockMovementX',
    'lockMovementY',
    'lockRotation',
    'lockScalingX',
    'lockScalingY',
    'selectable',
    'hasControls',
    'event',
    'hoverCursor',
    'tileParentId',
    'Sharpen',
    'parentCroppingFileName',
    'parentCroppingFilePath',
    'filtersType',
    'scaleX',
    'scaleY',
    'width',
    'height',
    'left',
    'top',
    'publicControlId'
]
// 初始属性
export const initializationAttribute = {
    Sharpen: null,
    isLock: false,
    filters: [],
    filtersType: null,
    isBackground: false,
    tileParentId: null,
    selectable: true,
    parentCroppingFileName: null,
    parentCroppingFilePath: null,
    isMask: undefined,
    tileParentFileName: null,
    customVisible: true,
    isBackgroundRepeat: false,
    publicControlId: null
}