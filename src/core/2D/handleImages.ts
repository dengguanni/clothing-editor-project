

import picture from '@/api/picture'
import { ElMessage } from 'element-plus';
import guid from '@/utils/guiId.ts'
import useSelect from '@/hooks/select';
import LoadScene from '@/core/3D/loadScene.ts'
import GoodsInfo from '@/core/objects/goods/goodsInfo'
const { fabric, mixinState, canvasEditor } = useSelect();
const load3DScene = new LoadScene()
// 获取历史记录
export const getImagesCustom = async (imageList: any, Page_Index: number | String = 0, callback) => {
    const p = {
        Page_Index: Page_Index,
        Page_RowCount: 18
    }
    picture.getImagesCustom(p).then(res => {
        imageList.value = [...res.Tag[0].Table]
        callback ? callback() : ''
        console.log('历史记录', res)
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
// 多图片剪裁
export const setAllCuts = (SizeGUID) => {
    const maskRect = canvasEditor.canvas.getObjects().find((item) => item.isMask);
    let p = {
        SizeGUID: SizeGUID,
        Canvas_zoom: '0.07',
        Part_name: maskRect.cutPartsType,
        Images: []
    }
    canvasEditor.canvas.getObjects().forEach(image => {
        if (image.id !== 'workspace' && !image.isMask) {
            const obj = {
                Image_fullName: image.FilePath + '/' + image.FileName,
                Image_width: image.width * image.scaleX + '',
                Image_height: image.height * image.scaleY + '',
                Image_left: image.left + '',
                Image_top: image.top + '',
                Image_angle: image.angle + '',
                bgc_r: '0',
                bgc_g: '0',
                bgc_b: "0",
            }
            p.Images.push(obj)
        }

    })
    console.log('总的剪裁参数', p)
    picture.setCutAllParts(p).then(res => {
        const url = 'data:image/jpeg;base64,' + res.Tag[0].base64
        LoadScene.setTexture(maskRect.cutPartsType, url, null)
            })
}
const imageSize = (base64Str) => {
    const indexBase64 = base64Str.indexOf('base64,') == -1 ? base64Str : base64Str.indexOf('base64,');
    if (indexBase64 < 0) return -1;
    const str = base64Str.substr(indexBase64 + 6);
    return (str.length * 0.75).toFixed(0);
}

export const setUserUploadFile = (str, FileName, fileFirstName, callback) => {
    const result = str.substring(str.indexOf(',') + 1,)
    const splitBase64Str = splitBase64(result, 1048596)
    const FilePath = fileFirstName + FileName.substring(0, 1)
    if (splitBase64Str.length > 30 && fileFirstName == 'images_custom\\') {
        ElMessage({
            showClose: true,
            message: '上传图片不可超过30M!',
            type: 'error',
        })
        return
    } else {
        // 不分包
        if (splitBase64Str.length == 1) {
            const p = {
                FileName: FileName,
                FilePath: FilePath,
                AppendSize: imageSize(splitBase64Str[0]),
                AppendComplete: 'True',
                base64Str: splitBase64Str[0]
            }
            picture.setUserUploadFile(p).then(res => {
                console.log('上传', res)
                if (res.OK == 'True') {
                    callback ? callback(FileName) : ''
                }
            }).catch(err => {
                console.log(err)
            })
        } else {
            // const FilePath = fileFirstName + FileName.substring(0, 1)
            let index = 0
            const fn = () => {
                const size = splitBase64Str[index]
                console.log('index', index, (index + 1) == splitBase64Str.length)
                const p = {
                    FileName: FileName,
                    FilePath: FilePath,
                    AppendSize: imageSize(size),
                    AppendComplete: (index + 1) == splitBase64Str.length ? 'True' : 'False',
                    base64Str: splitBase64Str[index]
                }
                picture.setUserUploadFile(p).then(res => {
                    if (res.OK == 'True') {
                        if (index + 1 < splitBase64Str.length) {
                            index = index + 1
                            fn()
                        } else {
                            callback ? callback(FileName) : ''
                        }

                    }
                }).catch(err => {
                    console.log(err)
                    ElMessage({
                        showClose: true,
                        message: err.Message,
                        type: 'error',
                    })
                })
            }
            fn()
        }
    }
}
// 替换图片
const replaceImage = () => {

}
