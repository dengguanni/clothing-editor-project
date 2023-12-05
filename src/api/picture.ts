
import http from '@/api/request'

// web-设计-背景-获取列表 
// 文档地址：http://8.140.206.30:8011/SqlCmdDocument?GUID=4b43af6f-afa8-4a91-9877-bea9d0dba297
const getImagesBackground = function (params: any = {}) {
    return http.get(`/QueryData?SqlCmdName=Web\\get_images_background&DBC=d1`, params)
}
// web-设计-图库-获取列表
// 文档地址：http://8.140.206.30:8011/SqlCmdDocument?GUID=e40d945f-4929-44ea-a396-3f47475b21e4
const getImagesLibrary = function (params: any = {}) {
    return http.get(`/QueryData?SqlCmdName=Web\\get_images_library&DBC=d1`, params)
}

// web-设计-上传-获取上传记录
// 文档地址：http://8.140.206.30:8011/SqlCmdDocument?GUID=2ff141fa-ff93-4f23-9fc4-09bdb0fe752c
const getImagesCustom = function (params: any = {}) {
    return http.get(`/QueryData?SqlCmdName=Web\\get_images_custom&DBC=d1`, params)
}

//web-设计-文件上传
// http://8.140.206.30:8011/UserUploadFile?FileName=pfe32383-4bdc-11ee-b1c4-00163e10d08e.png&FilePath=images_temp\p&AppendSize=1048596&AppendComplete=false
const setUserUploadFile = function (params: any = {}) {
    return http.post(`/UpLoadFile?FileName=${params.FileName}&FilePath=${params.FilePath}&AppendSize=${params.AppendSize}&AppendComplete=${params.AppendComplete}`, params.base64Str)
}
//web-设计-文件上传-入库
// 文档地址：http://8.140.206.30:8011/SqlCmdDocument?GUID=b1e73c7e-63ac-4764-9043-61ca033f53a2
const setImagesCustom = function (params: any = {}) {
    return http.get(`/Plugin_Text?ClassName=Plug_in_ofs.UploadImage.new_images_custom&DBC=d1`, params)
}
//web-设计-上传-删除已上传的图片
// 文档地址：http://8.140.206.30:8011/SqlCmdDocument?GUID=b1e73c7e-63ac-4764-9043-61ca033f53a2
const delImagesCustom = function (params: any = {}) {
    return http.get(`/ExSql?SqlCmdName=Web\\del_images_custom&DBC=d1`, params)
}

//web-画布-获取裁片列表 
// 文档地址：http://8.140.206.30:8011/SqlCmdDocument?GUID=1814ca28-719c-40de-aee8-4b5643117068
const getCutParts = function (params: any = {}) {
    return http.get(`/Plugin_Text?ClassName=Plug_in_ofs.ProjectTemplate.GetPartList`, params)
}

// web-画布-剪裁元素
// 文档地址：http://8.140.206.30:8011/SqlCmdDocument?GUID=b41451ac-4512-483b-bfd8-eaf44ec96927
const setCutParts = function (params: any = {}) {
    return http.get(`/Plugin_Text?ClassName=Plug_in_ofs.DrawTools.Cut`, params)
}
//web-画布-剪裁所有元素到裁片
// 文档地址：http://8.140.206.30:8011/SqlCmdDocument?GUID=be775ae6-28a7-4a7c-bfc4-f42d0c40948f
const setCutAllParts = function (params: any = {}) {
    return http.post(`/Plugin_Text?ClassName=Plug_in_ofs.DrawTools.DrawPart`, params)
}
//web-画布-基础平铺
// 文档地址：http://8.140.206.30:8011/SqlCmdDocument?GUID=32a53437-0b26-48ce-a767-8813d154d89a
const setBasicRepeat = function (params: any = {}) {

    return http.get(`/Plugin_Text?ClassName=Plug_in_ofs.DrawTools.Tile`, params)
}


const getPicture = {
    getImagesBackground,
    getImagesLibrary,
    getImagesCustom,
    setUserUploadFile,
    setImagesCustom,
    delImagesCustom,
    getCutParts,
    setCutParts,
    setCutAllParts,
    setBasicRepeat
}
export default getPicture