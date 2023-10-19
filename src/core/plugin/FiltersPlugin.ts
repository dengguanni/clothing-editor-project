/*
 * @Description: 居中对齐插件
 */

import { fabric } from 'fabric';
import Editor from '../core';
import { basicInheritAttribute } from '@/config/customAttributeFabricObj.ts'
import ControlsTile from '@/core/plugin/ControlsTile.ts'
import { setUserUploadFile } from '@/core/2D/handleImages.ts'
import { useStore } from 'vuex'
import guid from '@/utils/guiId.ts'
import { v4 as uuid } from 'uuid';
import { Message } from 'view-ui-plus';
import baseUrl from '@/config/constants/baseUrl'
type IEditor = Editor;
class FiltersPlugin {
    public canvas: fabric.Canvas;
    public editor: IEditor;
    static pluginName = 'FiltersPlugin';
    static apis = ['changeFilters', 'setSharpening'];
    constructor(canvas: fabric.Canvas, editor: IEditor) {
        this.canvas = canvas;
        this.editor = editor;
    }
    store = useStore()

    changeFilters(type, value, noParamsFilters) {
        const activeObject = this.canvas.getActiveObjects()[0];
        noParamsFilters ? noParamsFilters[type] = value : ''
        if (value) {
            const itemFilter = this._getFilter(activeObject, type);
            if (!itemFilter) {
                if (activeObject.filtersType) {
                    this.restoreImage(() => {
                        this._createFilter(activeObject, type, null, noParamsFilters);
                    }, noParamsFilters)
                } else {
                    this._createFilter(activeObject, type, null, noParamsFilters);
                }
            }
        } else {
            this.restoreImage(null, noParamsFilters)
        }
    };
    restoreImage(callback: any, noParamsFilters) {
        const activeObject = this.canvas.getActiveObjects()[0]
        console.log('activeObject.oldFileName', activeObject.oldFileName, 'activeObject.oldFilePath', activeObject.oldFilePath)
        if (!activeObject.oldFileName) return
        const url = baseUrl + 'UserUploadFile/' + activeObject.oldFilePath + '/' + activeObject.oldFileName
        activeObject.setSrc(url, () => {
            activeObject.set('name', activeObject.Title);
            activeObject.set('id', uuid());
            activeObject.set('filters', []);
            activeObject.set('filtersType', null);
            activeObject.set('width', activeObject.width);
            activeObject.set('height', activeObject.height);
            activeObject.set('scaleY', activeObject.scaleY);
            activeObject.set('scaleX', activeObject.scaleX);
            activeObject.set('FileName', activeObject.oldFileName);
            activeObject.set('cutPartsType', activeObject.cutPartsType);
            activeObject.set('FilePath', activeObject.oldFilePath);
            activeObject.set('oldFilePath', null)
            activeObject.applyFilters()
            ControlsTile.setRepeat(activeObject.repeatType, true)
            this.canvas.renderAll();
            noParamsFilters ? this.setCheckBoxList(noParamsFilters, null) : ''
            this.store.commit('setAllCuts')
            callback ? callback() : ''
        });
    }
    _createFilter(sourceImg, type, options = null, noParamsFilters) {
        let filterObj;
        const fabricType = this._getFabricFilterType(type);
        const ImageFilter = fabric.Image.filters[fabricType];
        if (ImageFilter) {
            filterObj = new ImageFilter(options);
            filterObj.options = options;
            sourceImg.filters.push(filterObj);
        }
        // 加滤镜
        sourceImg.applyFilters();
        this.canvas.renderAll();
        const activeObject = this.canvas.getActiveObjects()[0]
        // 变base64
        const scaleX = activeObject.scaleX
        const scaleY = activeObject.scaleY
        activeObject.scaleX = 1
        activeObject.scaleY = 1
        const url = activeObject.toDataURL({
            width: activeObject.width,
            height: activeObject.height,
            angle: activeObject.angle,
            scaleX: activeObject.scaleX,
            scaleY: activeObject.scaleY,
            multiplier: 1,
        });
        activeObject.scaleX = scaleX
        activeObject.scaleY = scaleY
        this.canvas.requestRenderAll();
        this.replaceImage(url, type, noParamsFilters)
        return filterObj;
    }
    _getFilter(sourceImg, type) {
        let imgFilter = null;
        if (sourceImg) {
            const fabricType = this._getFabricFilterType(type);
            const { length } = sourceImg.filters;
            let item, i;

            for (i = 0; i < length; i += 1) {
                item = sourceImg.filters[i];
                if (item.type === fabricType) {
                    imgFilter = item;
                    break;
                }
            }
        }
        return imgFilter;
    }
    _getFabricFilterType(type) {
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
    replaceImage(url, type, noParamsFilters) {
        const activeObject = this.canvas.getActiveObjects()[0]
        console.log('replaceImageactiveObject', activeObject)
        const oldFilePath = activeObject.oldFilePath ? activeObject.oldFilePath : activeObject.FilePath
        const oldFileName = activeObject.oldFileName ? activeObject.oldFileName : activeObject.FileName
        if (!oldFileName) return
        const FileName = guid() + '.png'
        let callback = () => {
            activeObject.setSrc(url, () => {
                basicInheritAttribute.forEach(element => {
                    activeObject.set(element, activeObject[element])
                });
                activeObject.set('name', activeObject.name);
                activeObject.set('id', uuid());
                activeObject.set('width', activeObject.width);
                activeObject.set('filters', []);
                activeObject.set('filtersType', type);
                activeObject.set('FileName', FileName);
                activeObject.set('oldFileName', oldFileName);
                activeObject.set('FilePath', 'images_temp/' + FileName.substring(0, 1));
                activeObject.set('oldFilePath', oldFilePath)
                activeObject.applyFilters()
                ControlsTile.setRepeat(activeObject.repeatType, true)
                this.store.commit('setAllCuts')
                noParamsFilters ? this.setCheckBoxList(noParamsFilters, type) : ''
                this.canvas.renderAll();
            });
        }
        setUserUploadFile(url, FileName, 'images_temp//', callback)
    }
    setCheckBoxList(arr, type) {
        for (let key in arr) {
            if (key == type) {
                arr[key] = true
            } else {
                arr[key] = false
            }
        }
    }
    // 锐化、清晰
    setSharpening(val) {
        const obj = this.canvas.getActiveObjects()[0];
        const goON = obj.filtersType ? (obj.filtersType == 'Sharpen' ? true : false) : true
        let self = this
        if (goON) {
            obj.Sharpen = obj.Sharpen ? false : true
            function applyFilter(index, filter) {
                obj.filters[index] = filter;
                var timeStart = +new Date();
                obj.applyFilters();
                var timeEnd = +new Date();
                var dimString = obj.width + ' x ' +
                    obj.height;
                var $ = function (id) { return document.getElementById(id) };
                self.canvas.renderAll();
            }
            const f = fabric.Image.filters
            applyFilter(12, obj.Sharpen && new f.Convolute({
                matrix: [0, -1, 0,
                    -1, 5, -1,
                    0, -1, 0]
            }));
            const activeObject = this.canvas.getActiveObjects()[0]
            const scaleX = activeObject.scaleX
            const scaleY = activeObject.scaleY
            activeObject.scaleX = 1
            activeObject.scaleY = 1
            const url = activeObject.toDataURL({
                width: activeObject.width,
                height: activeObject.height,
                angle: activeObject.angle,
                scaleX: activeObject.scaleX,
                scaleY: activeObject.scaleY,

                multiplier: 1,
            });
            activeObject.scaleX = scaleX
            activeObject.scaleY = scaleY
            if (val) {
                this.replaceImage(url, 'Sharpen', null)
            } else {
                this.restoreImage(null, null)
            }
        } else {
            Message.error('添加滤镜后不支持清晰化')
        }
    }
    contextMenu() {
        const activeObject = this.canvas.getActiveObject();
        if (activeObject) {

        }
    }
    destroy() {
        console.log('pluginDestroy');
    }
}

export default FiltersPlugin;
