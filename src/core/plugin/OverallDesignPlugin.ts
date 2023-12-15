/*
整体设计
 */

import { fabric } from 'fabric';
import Editor from '../core';
import { useStore } from 'vuex'
import { v4 as uuid } from 'uuid';
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
                        publicControlId: activeObject.id
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
                    el.visible = el.cutPartsType == '整体设计' ? activeObject.visible : false
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
        this.canvas.getObjects().forEach((item) => {
            if (item.publicControlId == activeObject.id) {
                this.canvas.remove(item)
            }
        })
        this.store.commit('setDisableClipping', false)
        this.editor.setAllCuts(true)
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
    handelReplace(activeObject: any) {
        if (!activeObject.isBackground) {
            let n = 0
            this.store.commit('setDisableClipping', true)
            const oldObject = this.canvas.getObjects().filter((item) => (item.publicControlId == activeObject.id))
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
                        this.editor.setAllCuts(true)
                    }
                })
            });


        }
    }
    handelTop(activeObject: any) {
        console.log('handelTop1',)
        const children = this.canvas.getObjects().filter((item) => (item.publicControlId == activeObject.id))
        console.log('children', children)
        children.forEach(el => {
            // this.canvas.bringForward(el)
            this.editor.up(el)
            console.log('handelTop',)
        })
        this.editor.setAllCuts(true)
    }
    handelDown(activeObject: any) {
        console.log('handelDown2',)
        const children = this.canvas.getObjects().filter((item) => (item.publicControlId == activeObject.id))
        console.log('children', children)
        children.forEach(el => {
            // this.canvas.sendBackwards(el)
            this.editor.down(el)
            console.log('handelDown',)
        })
        this.editor.setAllCuts(true)
    }
    handleOverallObjs(activeObject: any, type: string) {
        console.log('activeObject', activeObject, type)
        if (activeObject && activeObject.cutPartsType == '整体设计') {
            console.log('整体设计')
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
                default:
            }
        } else {
            switch (type) {
                case 'added':
                    if (!activeObject.publicControlId) {
                        this.canvas.getObjects().forEach((item) => {
                            if (activeObject.cutPartsType == item.cutPartsType) {
                                item.publicControlId = null
                            }
                        })
                    }
                    break;
                case 'modified':
                    if (!activeObject.publicControlId) {
                        this.canvas.getObjects().forEach((item) => {
                            if (activeObject.cutPartsType == item.cutPartsType) {
                                item.publicControlId = null
                            }
                        })
                    }
                    break;
                case 'removed':
                    activeObject.publicControlId = null
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
        }

    }

    destroy() {
        console.log('OverallDesignPlugin');
    }
}

export default OverallDesignPlugin;
