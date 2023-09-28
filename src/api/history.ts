import http from '@/api/request'

// web-操作数据-获取 Name:Web\get_order_one
//http://8.140.206.30:8011/SqlCmdDocument?GUID=356d4a31-0442-4a43-9253-679221c371aa
const getHistory = function (params: any = '') {
    return http.post(`QueryData?SqlCmdName=Web\\get_order_one&DBC=d1`, params)
}
// web-操作数据-新增 Name:Web\new_order_list
//http://8.140.206.30:8011/SqlCmdDocument?GUID=68196698-0731-4ab3-9c18-8ff0d4997ab5
const setHistory = function (params: any = '') {
    return http.post(`QueryData?SqlCmdName=Web\\new_order_list&DBC=d1`, params)
}
const historyAip = {
    getHistory,
    setHistory
}
export default historyAip