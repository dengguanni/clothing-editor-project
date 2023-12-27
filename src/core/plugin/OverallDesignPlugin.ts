/*
[整体设计]
 */

import { fabric } from 'fabric';
import Editor from '../core';
import { useStore } from 'vuex'
import { v4 as uuid } from 'uuid';
import { setUserUploadFile } from '@/core/2D/handleImages.ts'
import guid from '@/utils/guiId.ts'
const lockAttrs = [
    'lockMovementX',
    'lockMovementY',
    'lockRotation',
    'lockScalingX',
    'lockScalingY',
];
type IEditor = Editor;
class OverallDesignPlugin {
    public canvas: fabric.Canvas;
    public editor: IEditor;
    static pluginName = 'OverallDesignPlugin';
    static apis = ['overallDesignPluginInit', 'handleOverallObjs'];
    constructor(canvas: fabric.Canvas, editor: IEditor) {
        this.canvas = canvas;
        this.editor = editor;
    }
    store = useStore()
    cutPartsType = computed(() => {
        return this.store.state.cutPartsType
    })
    cutParts = computed(() => {
        return this.store.state.cutParts
    })
    overallDesignPluginInit() {
        this.canvas.on('object:added', (option) => {
            this.handleOverallObjs(option.target, 'added')
        })
        this.canvas.on('object:removed', (option) => {
            this.handleOverallObjs(option.target, 'removed')
        })
        this.canvas.on('object:modified', (option) => {
            this.handleOverallObjs(option.target, 'modified')
        })
        // this.canvas.on('object:scaling', (option) => {
        //     this.handleOverallObjs(option.target, 'scaling')
        // })
        // this.canvas.on('object:rotating', (option) => {
        //     this.handleOverallObjs(option.target, 'rotating')
        // })
    }
    addHandle(activeObject: any) {
                if (activeObject.tileParentId) return
                this.store.commit('setDisableClipping', true)
        let n = 0
        this.cutParts.value.forEach(el => {
            if (el.Title !== this.cutPartsType.value) {
                                activeObject.clone(c => {
                    c.set({
                        id: uuid(),
                        cutPartsType: el.Title,
                        visible: false,
                        FileName: activeObject.FileName,
                        FilePath: activeObject.FilePath,
                        customVisible: true,
                        isBackground: activeObject.isBackground,
                        publicControlId: activeObject.id,
                        repeatType: activeObject.repeatType
                    })
                    if (c.isBackground) {
                        const mask = this.canvas.getObjects().find((item) => (item.isMask !== undefined && item.cutPartsType == c.cutPartsType))
                        const bg = this.canvas.getObjects().find((item) => (item.isBackground && item.cutPartsType == c.cutPartsType))
                        this.canvas.remove(bg)
                        // MaximizePlugin.setMax('full', c, mask)
                    }
                    this.canvas.add(c)
                    n++
                    if (n == this.cutParts.value.length) {
                        this.store.commit('setDisableClipping', false)
                        this.editor.setAllCuts(true)
                    }
                })
            }
        })
    }
    handelModified(activeObject: any) {
        if (!activeObject.isBackground) {
            const children = this.canvas.getObjects().filter((item) => (item.publicControlId == activeObject.id))
            children && children.forEach(el => {
                activeObject.clone(c => {
                    el.scaleX = activeObject.scaleX
                    el.scaleY = activeObject.scaleY
                    c.rotate(0)
                    el.top = c.top
                    el.left = c.left
                    el.rotate(activeObject.angle)
                    el.flipX = activeObject.flipX
                    el.flipY = activeObject.flipY
                    el.visible = el.cutPartsType == '[整体设计]' ? activeObject.visible : false
                    el.customVisible = activeObject.customVisible
                })

            })
            this.editor.setAllCuts(true)
        }
    }
    handelRotating(activeObject: any) {
        if (!activeObject.isBackground) {
            const children = this.canvas.getObjects().filter((item) => (item.publicControlId == activeObject.id))
            children && children.forEach(el => {
                el.rotate(activeObject.angle)

            })
            this.editor.setAllCuts(true)
        }
    }
    handelRemove(activeObject: any) {
        this.store.commit('setDisableClipping', true)
        const objects = this.canvas.getObjects().filter((item) => (item.publicControlId == activeObject.id && item.id!=='workspace'))
        let n = 0
        let m = 0
        objects.forEach((item) => {
            n++
            console.log('删除', item)
            const repeatObjs = this.canvas.getObjects().filter((item) => (item.tileParentId == activeObject.id && item.id!=='workspace'))
            console.log('repeatObjs', repeatObjs, 'm', m)
            repeatObjs.forEach(e => {
                m++
                this.canvas.remove(e)

            })
           this.canvas.remove(item)

            console.log('object', objects, 'n', n, 'this.canvas.getObjects()', this.canvas.getObjects())
            if (n == objects.length) {
                this.store.commit('setDisableClipping', false)
                setTimeout(() => {
                    this.editor.setAllCuts(true)
                }, 1000);

            }
        })
    }
    handelLock(activeObject: any) {
        const doLock = () => {
            this.canvas.getObjects().forEach((item) => {
                if (item.publicControlId == activeObject.id) {
                    item.hasControls = false;
                    item.selectable = false;
                    item.isLock = true
                    item.hoverCursor = 'default'
                    lockAttrs.forEach((key) => {
                        item[key] = true;
                    });
                }
            })
        }
        const doUnlock = () => {
            this.canvas.getObjects().forEach((item) => {
                if (item.publicControlId == activeObject.id) {
                    item.hasControls = true;
                    // 修改默认属性
                    lockAttrs.forEach((key) => {
                        item[key] = false;
                    });
                    item.selectable = true;
                    item.isLock = false
                    item.hoverCursor = null
                }
            })
        }
        activeObject.isLock ? doLock() : doUnlock()
        this.editor.setAllCuts(true)

    }
    handelRepeat(activeObject) {
        console.log('handelRepeat', activeObject)
        console.log(new Date().getMinutes() + '分' + new Date().getSeconds() + '秒' + new Date().getMilliseconds() + '毫秒', '整体平铺开始')
        const obj = {
            basic: '基础平铺',
            mirror: '镜像平铺',
            transverse: '横向平铺',
            direction: '纵向平铺'
        }
        if (!activeObject.isBackground) {
            this.store.commit('setDisableClipping', true)
            const children = this.canvas.getObjects().filter((item) => (item.publicControlId == activeObject.id)) //整体对对应的子级
            console.log('平铺children', children)
            children && children.forEach(el => {
                const repeatObjs = this.canvas.getObjects().filter((item) => (item.tileParentId == el.id)) //子级对应的平铺图
                console.log('级对应的平铺图repeatObjsb', repeatObjs)
                el.repeatType = activeObject.repeatType
                repeatObjs.forEach(e => this.canvas.remove(e))
            })
            if (activeObject.repeatType) {
                let n = 0
                children && children.forEach(el => {
                    this.editor.handelRepeat(obj[activeObject.repeatType], el, true, () => {
                        n++
                        if (n == children.length) {
                            this.store.commit('setDisableClipping', false)
                            this.editor.setAllCuts(true)
                           console.log(new Date().getMinutes() + '分' + new Date().getSeconds() + '秒' + new Date().getMilliseconds() + '毫秒', '整体平铺结束')
                        }
                    })
                })
            } else {
                this.store.commit('setDisableClipping', false)
                this.editor.setAllCuts(true)
                console.log('删除剩下的')
            }

        }
    }
    handelReplace(activeObject: any) {
        const oldObject = this.canvas.getObjects().filter((item) => (item.publicControlId == activeObject.id))
        if (activeObject.type == 'text') {
            let n = 0
            this.store.commit('setDisableClipping', true)
            const FileName = guid() + '.png'
            activeObject.clone(clone => {
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
                activeObject.FileName = FileName
                activeObject.FilePath = 'images_temp/' + FileName.substring(0, 1)

                const callback = () => {
                    oldObject.forEach(element => {
                        activeObject.clone(c => {
                            c.set({
                                id: uuid(),
                                cutPartsType: element.cutPartsType,
                                visible: false,
                                FileName: activeObject.FileName,
                                FilePath: activeObject.FilePath,
                                customVisible: true,
                                isBackground: activeObject.isBackground,
                                publicControlId: activeObject.id,
                                repeatType: activeObject.repeatType
                            })
                            this.canvas.remove(element)
                            this.canvas.add(c)

                            n++
                            if (n == oldObject.length) {
                                this.store.commit('setDisableClipping', false)
                                this.editor.setAllCuts(true)
                            }
                        })
                    });
                }
                setUserUploadFile(url, FileName, 'images_temp/', callback, null)
            })
        } else if (!activeObject.isBackground && activeObject.type !== 'text') {

            let n = 0
            this.store.commit('setDisableClipping', true)
            oldObject.forEach(element => {
                activeObject.clone(c => {
                    c.set({
                        id: uuid(),
                        cutPartsType: element.cutPartsType,
                        visible: false,
                        FileName: activeObject.FileName,
                        FilePath: activeObject.FilePath,
                        customVisible: true,
                        isBackground: activeObject.isBackground,
                        publicControlId: activeObject.id
                    })
                    this.canvas.remove(element)
                    this.canvas.add(c)
                    n++
                    if (n == oldObject.length) {
                        this.store.commit('setDisableClipping', false)
                        activeObject.repeatType ? this.handelRepeat(activeObject) : this.editor.setAllCuts(true)

                    }
                })
            });

        }
    }
    handelTop(activeObject: any) {
        const children = this.canvas.getObjects().filter((item) => (item.publicControlId == activeObject.id))
        children.forEach(el => {
            this.editor.up(el)
        })
        this.editor.setAllCuts(true)
    }
    handelDown(activeObject: any) {
        console.log('handelDown2',)
        const children = this.canvas.getObjects().filter((item) => (item.publicControlId == activeObject.id))
        children.forEach(el => {
            this.editor.down(el)
        })
        this.editor.setAllCuts(true)
    }
    handleOverallObjs(activeObject: any, type: string) {
        // console.log('activeObject', activeObject, type,activeObject.cutPartsType )
        activeObject.cutPartsType =  activeObject.cutPartsType ? activeObject.cutPartsType : '[整体设计]'
        if (activeObject && activeObject.cutPartsType == '[整体设计]' && activeObject.id !== 'grid' && !activeObject.hasCropping) {
            console.log('[整体设计]',type)
            switch (type) {
                case 'added':
                    this.addHandle(activeObject)
                    break;
                case 'modified':
                    this.handelReplace(activeObject)
                    break;
                case 'removed':
                    this.handelRemove(activeObject)
                    break;
                case 'rotating':
                    this.handelRotating(activeObject)
                    break;
                case 'lock':
                    this.handelLock(activeObject)
                    break;
                case 'replace':
                    this.handelReplace(activeObject)
                    break;
                case 'top':
                    this.handelTop(activeObject)
                    break;
                case 'down':
                    this.handelDown(activeObject)
                    break;
                case 'repeat':
                    this.handelRepeat(activeObject)
                    break;
                default:
            }
        } else {
            switch (type) {
                case 'added':
                    if (!activeObject.publicControlId && !activeObject.tileParentId) {
                        this.canvas.getObjects().forEach((item) => {
                            if (activeObject.cutPartsType == item.cutPartsType) {
                                item.publicControlId = null
                            }
                        })
                    }
                    break;
                case 'modified':
                    // if (!activeObject.publicControlId) {
                        this.canvas.getObjects().forEach((item) => {
                            if (activeObject.cutPartsType == item.cutPartsType) {
                                item.publicControlId = null
                            }
                        })
                    // }
                    break;
                case 'removed':
                    // console.log(' item.publicControlId = null', type, activeObject)
                    const repeatObjs = this.canvas.getObjects().filter((item) => (item.tileParentId == activeObject.id))
                    this.store.commit('setDisableClipping', true)
                    repeatObjs.forEach(e =>{ 
                        if(e.id!=='workspace') this.canvas.remove(e)
                    })
                    this.store.commit('setDisableClipping', false)
                    break;
                case 'rotating':
                    activeObject.publicControlId = null
                    break;
                case 'lock':
                    activeObject.publicControlId = null
                    break;
                case 'replace':
                    activeObject.publicControlId = null
                    break;
                default:
            }
            console.log('type  activeObject.publicControlId', type, activeObject)
        }

    }

    destroy() {
        console.log('OverallDesignPlugin');
    }
}

export default OverallDesignPlugin;
