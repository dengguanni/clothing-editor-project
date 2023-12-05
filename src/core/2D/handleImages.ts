

import picture from '@/api/picture'
import { ElMessage } from 'element-plus';
import useSelect from '@/hooks/select';
import LoadScene from '@/core/3D/loadScene.ts'
const { canvasEditor } = useSelect();
// 获取历史记录
export const getImagesCustom = async (userID: any, imageList: any, Page_Index: number | String = 0, callback) => {
    const p = {
        Page_Index: Page_Index,
        Page_RowCount: 18,
        userID: userID
    }
    picture.getImagesCustom(p).then(res => {
        console.log('获取历史记录', res)
        res.Tag.length > 0 ? imageList.value = [...res.Tag[0].Table] : ''
        callback ? callback() : ''
    })
}



// 多图片剪裁
export const setAllCuts = (SizeGUID) => {
    const maskRect = canvasEditor.canvas.getObjects().find((item) => item.isMask);
    let p = {
        SizeGUID: SizeGUID,
        Canvas_zoom: '1',
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
    // console.log('总的剪裁参数', p)
    picture.setCutAllParts(p).then(res => {
        const url = 'data:image/jpeg;base64,' + res.Tag[0].base64
        LoadScene.setTexture(maskRect.cutPartsType, url, null)
    })
}
const base64ToBlob = (base64) => {
    let binary = atob(base64.substring(base64.indexOf(',') + 1,));
    let array = [];
    for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: "image/png" });
}

const splitFile = (files, size, callback) => {
    let arr = []
    const n = files.size > size ? Math.ceil(files.size / size) : 1
    let start = 0
    let end = files.size > size ? size : files.size
    const fn = (index) => {
        const fileReader = new FileReader();
        console.log(start, end)
        fileReader.readAsDataURL(files.slice(start, end));
        fileReader.onload = (event) => {
            try {
                const {
                    result
                } = event.target;

                const obj = {
                    file: files.slice(start, end),
                    size: files.slice(start, end).size,
                    AppendComplete: index == n ? 'True' : 'False',
                    base64: result.replace('data:application/octet-stream;base64,', '')
                }
                arr.push(obj)
                start = end
                if (files.slice(end, files.size).size > size) {
                    end = (index + 1) * size
                    fn(index + 1)
                } else {
                    end = size + end
                    index == n ? callback(arr) : fn(index + 1)
                }
            } catch (e) {
                console.log(e);
            }
        };
    }
    fn(1)
}
export const setUserUploadFile = (str = null, FileName, fileFirstName, callback, file) => {
    const files = str ? base64ToBlob(str) : file
    const callbackFn = (arr) => {
        const fn = (index) => {
            const FilePath = fileFirstName + FileName.substring(0, 1)
            const p = {
                FileName: FileName,
                FilePath: FilePath,
                AppendSize: arr[index].size,
                AppendComplete: arr[index].AppendComplete,
                base64Str: arr[index].base64
            }
            picture.setUserUploadFile(p).then(res => {
                if (res.OK == 'True') {
                    if (index + 1 == arr.length) {
                        callback ? callback(FileName) : ''
                    } else {
                        fn(index + 1)
                    }
                }
            }).catch(err => {
                console.log(err)
            })
        }
        fn(0)
    }
    splitFile(files, 1048596, callbackFn)
}
