import { fabric } from 'fabric';
import { v4 as uuid } from 'uuid';
import guid from '@/utils/guiId.ts'
import { setUserUploadFile } from '@/core/2D/handleImages.ts'
import baseUrl from '@/config/constants/baseUrl';
import { Message } from 'view-ui-plus';
import picture from '@/api/picture.ts'
class ControlsTile {
    static lockObj = {
        'lockMovementX': false,
        'lockMovementY': false,
        'lockRotation': false,
        'lockScalingX': false,
        'lockScalingY': false,
        selectable: false
    }
    static repeatType = ''
    static isRepeat: boolean = false
    static canvas: any
    static stateRepeat: any = {
        basic: false,
        mirror: false,
        transverse: false,
        direction: false
    }
    static activeObject: any
    static activeInfo = {
        angle: 0,
        width: 0,
        height: 0,
        scaleX: 0,
        scaleY: 0
    }
    static groupRepeat: any
    static setCanvasObserve() {
        this.canvas.on('object:modified', function () {
            const activeObject = ControlsTile.canvas.getActiveObjects()[0];
            ControlsTile.setRepeat(activeObject.repeatType, true)
        })
    }
    static setButtonActive = (arr, type) => {
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
    static setRepeat(repeatType: string, val: boolean = false, arr: any = []) {
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
        ControlsTile.canvas.getObjects().forEach((el: any) => {
            if (el.tileParentId == activeObject.id) {
                ControlsTile.canvas.remove(el)
            }
        })

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
        }
    }

    // 基础平铺
    static handelRepeat(type) {
        const activeObject = this.canvas.getActiveObjects()[0];
        const Mask = this.canvas.getObjects().find((item: any) => item.isMask);
        activeObject.clone(c => {
            c.rotate(0)
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
            picture.setBasicRepeat(p).then(res => {
                console.log('res', res)
                res.Tag[0].base64 ? this.replaceImage(res.Tag[0].base64) : ''
            })
        })
    }
    // 更新图片
    static replaceImage = (url) => {
        const FileName = guid() + '.png'
        const URL = 'data:image/jpeg;base64,' + url
        let callback1 = () => {
            let z: number
            const activeObject = this.canvas.getActiveObjects()[0];
            const imageURL = baseUrl + 'UserUploadFile/images_temp/' + FileName.substring(0, 1) + '/' + FileName
            const Mask = this.canvas.getObjects().find((item: any) => item.isMask);
            let callback = (image: any, isError: boolean) => {
                if (!isError) {
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
                    image.FileName = FileName
                    image.FilePath = 'images_temp/' + FileName.substring(0, 1)
                    image.hoverCursor = null
                    image.left = Mask.left
                    image.top = Mask.top
                    image.rotate(0)
                    this.canvas.add(image);
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
                }
            };
            const properties = {
                left: 0,
                top: 0
            };
            fabric.Image.fromURL(imageURL, callback, properties);
        }
        setUserUploadFile(URL, FileName, 'images_temp//', callback1)
    }

    static setUpDownCloned(cloned, topCount, bottomCount, height, width, flipY, offsetX, offsetY) {
        for (let i = 1; i < topCount + 1; i++) {
            cloned.clone((cloned2: any) => {
                cloned2.set({
                    left: cloned2.left + offsetX,
                    top: cloned2.top - height * i,
                    evented: true,
                    id: uuid(),
                    flipY: flipY,
                    isRepeat: true,
                    hasControls: false,
                    ...this.lockObj,
                });
                this.canvas.add(cloned2);
            })
        }
        for (let i = 1; i < bottomCount + 1; i++) {
            cloned.clone((cloned3: any) => {
                cloned3.set({
                    left: cloned3.left + offsetX,
                    top: cloned3.top + height * i,
                    evented: true,
                    id: uuid(),
                    flipY: flipY,
                    isRepeat: true,
                    hasControls: false,
                    ...this.lockObj,
                });
                this.canvas.add(cloned3);
            })
        }
    }
}
export default ControlsTile