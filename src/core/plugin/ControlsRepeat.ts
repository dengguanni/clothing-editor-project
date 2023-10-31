import { fabric } from 'fabric';
import { v4 as uuid } from 'uuid';
import guid from '@/utils/guiId.ts'
import { setUserUploadFile } from '@/core/2D/handleImages.ts'
import baseUrl from '@/config/constants/baseUrl';
import { Message } from 'view-ui-plus';
import picture from '@/api/picture.ts'
import { useStore } from 'vuex'

import Editor from '../core';
type IEditor = Editor;

class ControlsRepeat {
    public canvas: fabric.Canvas;
    public editor: IEditor;
    public defautOption = {};
    static pluginName = 'ControlsRepeat';
    static events = [];
    static apis = ['setRepeat', 'setCanvasObserve', 'handelRepeat'];
    public hotkeys: string[] = [''];
    static lockObj = {
        'lockMovementX': false,
        'lockMovementY': false,
        'lockRotation': false,
        'lockScalingX': false,
        'lockScalingY': false,
        selectable: false
    }
    constructor(canvas: fabric.Canvas, editor: IEditor) {
        this.canvas = canvas;
        this.editor = editor;
    }
    store = useStore()
    setCanvasObserve() {
        const self = this
        this.canvas.on('object:modified', function () {
            const activeObject = self.canvas.getActiveObjects()[0];
            self.setRepeat(activeObject.repeatType, true)
        })
    }
    setButtonActive = (arr, type) => {
        const obj = this.canvas.getActiveObjects()[0]
        if (type) {
            if (obj.repeatType) {
                if (obj.repeatType == type) {
                    arr.forEach(element => {
                        element.isSelected = false
                    });
                } else {
                    arr.forEach(el => {
                        if (el.type == type) {
                            el.isSelected = true
                        } else {
                            el.isSelected = false
                        }
                    })
                }

            } else {
                arr.forEach(el => {
                    if (el.type == type) {
                        el.isSelected = true
                    } else {
                        el.isSelected = false
                    }
                })
            }
        } else {
            arr.forEach(element => {
                element.isSelected = false
            });
        }
    }
    setRepeat(repeatType: string, val: boolean = false, arr: any = []) {
        const activeObject = this.canvas.getActiveObjects()[0];
        if (!val) {
            if (repeatType) {
                if (activeObject.repeatType == repeatType) {
                    activeObject.isRepeat = activeObject.isRepeat == undefined ? true : !activeObject.isRepeat
                } else {
                    activeObject.isRepeat = true
                }
            } else {
                activeObject.isRepeat = false
            }
        }
        activeObject.repeatType = repeatType

        if (activeObject.isRepeat && activeObject.repeatType) {
            if (activeObject.parentCroppingFileName) {
                Message.error('裁剪后不支持平铺，请移除剪裁后再试试');
                return
            }
            arr.length > 0 ? this.setButtonActive(arr, activeObject.repeatType) : ''
            if (activeObject.repeatType == 'basic') {
                this.handelRepeat('基础平铺')
            } else if (activeObject.repeatType == 'mirror') {
                this.handelRepeat('镜像平铺')
            } else if (activeObject.repeatType == 'transverse') {
                this.handelRepeat('横向平铺')
            } else if (activeObject.repeatType == 'direction') {
                this.handelRepeat('纵向平铺')
            }
            this.canvas.requestRenderAll();
        } else {
            activeObject.repeatType = null
            this.canvas.getObjects().forEach((el: any) => {
                if (el.tileParentId == activeObject.id) {
                    this.canvas.remove(el)
                }
            })
            console.log('平铺setAllCuts')
            // this.editor.setAllCuts()
        }
    }

    handelRepeat(type, obj = null) {
        console.log('平铺')

        // this.store.commit('setsLoad3d', false)
        // const store = useStore()
        // //console.log(new Date().getMinutes() + '分' + new Date().getSeconds() + '秒' + new Date().getMilliseconds() + '毫秒', '开始平铺准备')
        this.store.commit('setDisableClipping', true)
        const activeObject = obj ? obj : this.canvas.getActiveObjects()[0];
        const Mask = this.canvas.getObjects().find((item: any) => item.isMask);
        console.log('activeObject', activeObject.left - Mask.left)
        
        activeObject.clone(c => {
            c.rotate(0)
            console.log('clone', c.left - Mask.left)
            const p = {
                Type: type,
                Canvas_width: Mask.width * Mask.scaleX,
                Canvas_height: Mask.height * Mask.scaleY,
                Image_fullName: activeObject.FilePath + '/' + activeObject.FileName,
                Image_width: activeObject.width * activeObject.scaleX,
                Image_height: activeObject.height * activeObject.scaleY,
                Image_left: c.left - Mask.left,
                Image_top: c.top - Mask.top,
                Image_flipX: activeObject.flipX,
                Image_flipY: activeObject.flipY,
                Image_angle: activeObject.angle
            }
            console.log('平铺参数', p)
            //console.log(new Date().getMinutes() + '分' + new Date().getSeconds() + '秒' + new Date().getMilliseconds() + '毫秒', '拿到平铺参数')
            
            picture.setBasicRepeat(p).then(res => {
                //console.log(new Date().getMinutes() + '分' + new Date().getSeconds() + '秒' + new Date().getMilliseconds() + '毫秒', '平铺请求结束')
                console.log('res', res)
                res.Tag[0].base64 ? this.replaceImage(res.Tag[0].base64, activeObject) : ''
            })
        })
    }
    // 更新图片
    replaceImage = (url, obj = null) => {
        //console.log(new Date().getMinutes() + '分' + new Date().getSeconds() + '秒' + new Date().getMilliseconds() + '毫秒', '上传图片')
        const FileName = guid() + '.png'
        const URL = 'data:image/jpeg;base64,' + url
        let callback1 = () => {
            let z: number
            const activeObject = obj ? obj : this.canvas.getActiveObjects()[0];
            const imageURL = baseUrl + 'UserUploadFile/images_temp/' + FileName.substring(0, 1) + '/' + FileName
            const Mask = this.canvas.getObjects().find((item: any) => item.isMask);
            let callback = (image: any, isError: boolean) => {
                if (!isError) {
                    this.canvas.getObjects().forEach((el: any) => {
                        if (el.tileParentId == activeObject.id ) {
                            this.canvas.remove(el)
                        }
                    })

                    image.cutPartsType = activeObject.cutPartsType
                    image.set({
                        ...this.lockObj,
                        selectable: false,
                        // evented: false,
                        isRepeat: true,
                    })
                    activeObject.isBackground ? image.isBackgroundRepeat = true : image.isBackgroundRepeat = false
                    image.tileParentFileName = activeObject.FileName
                    image.tileParentId = activeObject.id
                    image.cutPartsType = activeObject.cutPartsType
                    image.id = uuid()
                    // image.FileName = FileName
                    // image.FilePath = 'images_temp/' + FileName.substring(0, 1)
                    image.hoverCursor = null
                    image.left = Mask.left
                    image.top = Mask.top
                    image.rotate(0)
                   
                    //console.log(new Date().getMinutes() + '分' + new Date().getSeconds() + '秒' + new Date().getMilliseconds() + '毫秒', '上传图片结束并添加图片')
                    this.canvas.add(image);
                    this.store.commit('setDisableClipping', false)
                    this.editor.setAllCuts()
                    const mask = this.canvas.getObjects().find((item) => item.isMask)
                    const backgroundImage = this.canvas.getObjects().find((item) => item.isBackground)
                    this.canvas.bringToFront(mask)
                    this.canvas.sendToBack(backgroundImage)
                    const objects = this.canvas.getObjects()
                    objects.forEach((element, index) => {
                        if (element.id == activeObject.id) z = index
                    });
                    image.moveTo(z);
                    this.canvas.requestRenderAll();
                    // const store = useStore()

                }
            };
            const properties = {
                left: 0,
                top: 0
            };
            fabric.Image.fromURL(URL, callback, properties);
        }
        callback1()
        // setUserUploadFile(URL, FileName, 'images_temp//', callback1)
    }
    destroy() {
        console.log('pluginDestroy');
    }

    // 快捷键扩展回调
    hotkeyEvent(eventName: string, e: any) {

    }
}

export default ControlsRepeat;
