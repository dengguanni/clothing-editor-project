
import { fabric } from 'fabric';
import Editor from '../core';
import { useStore } from 'vuex'
import LoadScene from '@/core/3D/loadScene.ts'
import picture from '@/api/picture'
import { setUserUploadFile } from '@/core/2D/handleImages.ts'
import guid from '@/utils/guiId.ts'
type IEditor = Editor;
class CutPartsPlugin {
    public canvas: fabric.Canvas;
    public editor: IEditor;
    static pluginName = 'CutPartsPlugin';
    static apis = ['setAllCuts', 'getIsLoadAll'];
    public hotkeys: string[] = [];
    constructor(canvas: fabric.Canvas, editor: IEditor) {
        this.canvas = canvas;
        this.editor = editor;
    }
    static repeatList = {
        basic: '基础平铺',
        mirror: '镜像平铺',
        transverse: '横向平铺',
        direction: '纵向平铺'
    }
    static num = 2
    isLoadAll = false
    getIsLoadAll() {
        return this.isLoadAll
    }
    store = useStore()
    load3DScene = new LoadScene()
    cutParts = computed(() => {
        return this.store.state.cutParts
    })
    isSetSteps = computed(() => {
        return this.store.state.isSetSteps
    })
    cutPartsType = computed(() => {
        return this.store.state.cutPartsType
    })
    bgColor = computed(() => {
        return this.store.state.bgColor
    })
    canvasObjects = computed(() => {
        return this.store.state.saveData.canvasObjects
    })

    modelInfo = computed(() => {
        return this.store.state.saveData.modelInfo
    })
    sizeGUID = computed(() => {
        return this.store.state.sizeGUID
    })
    disableClipping = computed(() => {
        return this.store.state.disableClipping
    })

    setAllCuts(isColorChange: Boolean) {
        CutPartsPlugin.num = 1
        if (this.disableClipping.value) return
        this.editor.fixedLayer()
        //console.log(new Date().getMinutes() + '分' + new Date().getSeconds() + '秒' + new Date().getMilliseconds() + '毫秒', '截图准备')
        const objects = this.canvas.getObjects().filter(el => el.isMask == undefined && el.id !== 'workspace' && el.id !== 'grid' && !el.tileParentId)
        if (this.cutPartsType.value) {
            let ImagesList: any = {}
            this.cutParts.value.forEach(el => {
                ImagesList[el.Title] = {}
                ImagesList[el.Title].Images = []
            })
            objects.forEach(el => {
                if (el.type == 'text' && el.cutPartsType == this.cutPartsType.value) {
                    const FileName = guid() + '.png'
                    el.clone(clone => {
                        clone.rotate(0);
                        clone.set({
                            angle: 0
                        })
                        const url = clone.toDataURL({
                            width: clone.width * clone.zoomX,
                            height: clone.height * clone.zoomY,
                            scaleX: 1,
                            scaleY: 1,
                            multiplier: 1,
                        })
                        el.FileName = FileName
                        el.FilePath = 'images_temp/' + FileName.substring(0, 1)
                        setUserUploadFile(url, FileName, 'images_temp/', null)
                    })
                }
            });

            const fn = (objects, index, p, maskRect, indexP = null) => {
                if (objects.length > 0) {
                    objects[index].clone(cloned => {
                        cloned.rotate(0)
                        const top = objects[index].angle == 0 ? objects[index].top - maskRect.top : cloned.top - maskRect.top
                        const left = objects[index].angle == 0 ? objects[index].left - maskRect.left : cloned.left - maskRect.left
                        const obj = {
                            Image_fullName: objects[index].FilePath + '/' + objects[index].FileName,
                            Image_width: (objects[index].width * objects[index].scaleX).toFixed(5) + '',
                            Image_height: (objects[index].height * objects[index].scaleY).toFixed(5) + '',
                            Image_left: (left).toFixed(5) + '',
                            Image_top: (top).toFixed(5) + '',
                            Image_angle: objects[index].angle.toFixed(5) + '',
                            Image_flipX: objects[index].flipX,
                            Image_flipY: objects[index].flipY,
                            Image_visible: objects[index].cutPartsType == p.Part_name,
                            Image_TileType: objects[index].repeatType ? CutPartsPlugin.repeatList[objects[index].repeatType] : ''
                        }
                        if (objects[index].customVisible === false) obj.Image_visible = false
                        ImagesList[p.Part_name].Images.push(obj)
                        if (objects[index + 1]) {
                            fn(objects, index + 1, p, maskRect, indexP)
                        } else {
                            p.Images = ImagesList[p.Part_name].Images
                            this.setCutAllParts(p, p.Part_name.Title, indexP)
                        }
                    })

                } else {
                    p.Images = []
                    this.setCutAllParts(p, p.Part_name.Title, indexP)
                }
            }
            console.log('isColorChange', isColorChange)
            if (!isColorChange) {
                const maskRect = this.canvas.getObjects().find((item) => item.isMask);
                let p = {
                    SizeGUID: this.sizeGUID.value,
                    Canvas_zoom: '0.07',
                    Part_name: this.cutPartsType.value,
                    Images: [],
                    bgc_r: this.bgColor.value.R,
                    bgc_g: this.bgColor.value.G,
                    bgc_b: this.bgColor.value.B
                }
                fn(objects, 0, p, maskRect)
            } else {
                this.store.commit('setsLoad3d', true)
                this.isLoadAll = true
                this.cutParts.value.forEach((element, indexP) => {
                    const maskRect = this.canvas.getObjects().find((item) => item.name == element.Title);
                    let p = {
                        SizeGUID: this.sizeGUID.value,
                        Canvas_zoom: '0.07',
                        Part_name: element.Title,
                        Images: [],
                        bgc_r: this.bgColor.value.R,
                        bgc_g: this.bgColor.value.G,
                        bgc_b: this.bgColor.value.B
                    }
                    fn(objects, 0, p, maskRect, indexP)
                })
            }
        }
    }

    setCutAllParts(p, Title, indexP = null) {
        this.editor.fixedLayer()
       console.log(new Date().getMinutes() + '分' + new Date().getSeconds() + '秒' + new Date().getMilliseconds() + '毫秒', '开始剪裁')
        picture.setCutAllParts(p).then(res => {
            console.log(new Date().getMinutes() + '分' + new Date().getSeconds() + '秒' + new Date().getMilliseconds() + '毫秒', '剪裁请求完毕')
            console.log('总的剪裁参数', p, res)
            const url = 'data:image/jpeg;base64,' + res.Tag[0].base64
            console.log(new Date().getMinutes() + '分' + new Date().getSeconds() + '秒' + new Date().getMilliseconds() + '毫秒', '开始贴模型')
            this.load3DScene.setTexture(p.Part_name, url, () => {
                console.log(new Date().getMinutes() + '分' + new Date().getSeconds() + '秒' + new Date().getMilliseconds() + '毫秒', '贴模型完毕')
                if (indexP !== null) {
                    if (this.cutParts.value.length == CutPartsPlugin.num) {
                        console.log('保存', !this.isSetSteps.value)
                        this.store.commit('setsLoad3d', false)
                        this.isSetSteps.value ? '' : this.store.commit('setSave')
                        this.store.commit('setIsSetSteps', false)
                    }
                    CutPartsPlugin.num++
                } else {
                    console.log('保存', !this.isSetSteps.value)
                    this.isSetSteps.value ? '' : this.store.commit('setSave')
                    this.store.commit('setsLoad3d', false)
                    this.store.commit('setIsSetSteps', false)
                }
            })
        })
    }
    contextMenu() {
        const activeObject = this.canvas.getActiveObject();
        if (activeObject) {
            // return [null, { text: '删除', hotkey: 'Ctrl+V', disabled: false, onclick: () => this.del() }];
        }
    }

    destroy() {
        console.log('pluginDestroy');
    }
}

export default CutPartsPlugin;
