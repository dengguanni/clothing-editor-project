

import picture from '@/api/picture'
import { ElMessage } from 'element-plus';
import guid from '@/utils/guiId.ts'
// 历史记录
export const getImagesCustom = async (imageList: any, FileName: '', callback) => {
    const p = {
        Page_Index: 0,
        Page_RowCount: 20
    }
    picture.getImagesCustom(p).then(res => {
        imageList.value = [...res.Tag[0].Table]
        if (FileName) {
            imageList.value.forEach(element => {
                if (element.FileName = FileName) {
                    callback ? callback(element) : ''
                }
            });
        }

    })
}
const splitBase64 = (base64String, chunkSize) => {
    var result = [];
    var index = 0;
    while (index < base64String.length) {
        var chunk = base64String.slice(index, index + chunkSize);
        result.push(chunk);
        index += chunkSize;
    }
    return result;
}
const imageSize = (base64Str) => {
    const indexBase64 = base64Str.indexOf('base64,') == -1 ? base64Str : base64Str.indexOf('base64,');
    if (indexBase64 < 0) return -1;
    const str = base64Str.substr(indexBase64 + 6);
    return (str.length * 0.75).toFixed(0);
}
export const setUpLoadFile = (str, imageList, callback) => {
    const result = str.substring(str.indexOf(',') + 1,)
    const splitBase64Str = splitBase64(result, 1048596)
    if (splitBase64Str.length > 30) {
        ElMessage({
            showClose: true,
            message: '上传图片不可超过30M!',
            type: 'error',
        })
        return
    } else {
        // 不分包
        if (splitBase64Str.length == 1) {
            const FileName = guid() + '.png'
            const FilePath = 'images_custom\\' + FileName.substring(0, 1)
            const p = {
                FileName: FileName,
                FilePath: FilePath,
                AppendSize: imageSize(splitBase64Str[0]),
                AppendComplete: 'True',
                base64Str: splitBase64Str[0]
            }
            picture.setUpLoadFile(p).then(res => {
                if (res.OK == 'True') {
                    picture.setImagesCustom({ FileName }).then(e => {
                        if (e.OK == 'True') {
                            callback ? callback(FileName) : ''
                        }
                    })
                }
            })
        } else {
            const FileName2 = guid() + '.png'
            const FilePath = 'images_custom\\' + FileName2.substring(0, 1)
            splitBase64Str.forEach((el, index) => {
                if (index == 0) {
                    const aa = splitBase64Str[index]
                    const p = {
                        FileName: FileName2,
                        FilePath: FilePath,
                        AppendSize: imageSize(aa),
                        AppendComplete: 'False',
                        base64Str: splitBase64Str[index]
                    }
                    picture.setUpLoadFile(p).then(res => {
                        if (res.OK == 'False') {
                            ElMessage({
                                showClose: true,
                                message: res.Message,
                                type: 'error',
                            })
                        }
                    })
                } else {
                    const p = {
                        FileName: FileName2,
                        FilePath: FilePath,
                        AppendSize: imageSize(splitBase64Str[index]),
                        AppendComplete: (index + 1) == splitBase64Str.length ? 'True' : 'False',
                        base64Str: splitBase64Str[index]
                    }
                    picture.setUpLoadFile(p).then(res => {
                        if (res.OK == 'False') {
                            ElMessage({
                                showClose: true,
                                message: res.Message,
                                type: 'error',
                            })
                        } else {
                            if (index + 1 == splitBase64Str.length) {
                                picture.setImagesCustom({ FileName: FileName2 }).then(e => {
                                    if (e.OK == 'True') {
                                        getImagesCustom(imageList)
                                        callback ? callback(FileName2) : ''
                                    } else {
                                        ElMessage({
                                            showClose: true,
                                            message: res.Message,
                                            type: 'error',
                                        })
                                    }
                                })
                            }
                        }
                    })
                }
            })
        }
    }
}
