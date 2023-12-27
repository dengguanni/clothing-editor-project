/*
 * @Author: 邓官妮
 * @Date: 2023-06-20 12:38:37
 * @LastEditors: 邓官妮
 * @LastEditTime: 2023-06-20 13:34:21
 * @Description: 复制插件
 */

import { fabric } from 'fabric';
import Editor from '../core';
type IEditor = Editor;
import { v4 as uuid } from 'uuid';
import { basicInheritAttribute } from '@/config/customAttributeFabricObj.ts'
import { useStore } from 'vuex'
import guid from '@/utils/guiId';
import { Message } from 'view-ui-plus';
import { setUserUploadFile } from '@/core/2D/handleImages.ts'
class CopyPlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  static pluginName = 'CopyPlugin';
  static apis = ['clone'];
  public hotkeys: string[] = ['ctrl+v', 'ctrl+c'];
  private cache: null | fabric.ActiveSelection | fabric.Object;
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;
    this.cache = null;
  }
  store = useStore()
  cutPartsType = computed(() => {
    return this.store.state.cutPartsType
  })
  // 多选对象复制
  _copyActiveSelection(activeObject: fabric.Object) {
    // 间距设置
    const grid = 10;
    const canvas = this.canvas;
    activeObject?.clone((cloned: fabric.Object) => {
      // 再次进行克隆，处理选择多个对象的情况
      cloned.clone((clonedObj: fabric.ActiveSelection) => {
        canvas.discardActiveObject();
        if (clonedObj.left === undefined || clonedObj.top === undefined) return;
        // 将克隆的画布重新赋值
        clonedObj.canvas = canvas;
        // 设置位置信息
        clonedObj.set({
          left: clonedObj.left + grid,
          top: clonedObj.top + grid,
          evented: true,
          id: uuid(),
        });
        clonedObj.forEachObject((obj: fabric.Object) => {
          obj.id = uuid();
          canvas.add(obj);
        });
        // 解决不可选择问题
        clonedObj.setCoords();
        canvas.setActiveObject(clonedObj);
        canvas.requestRenderAll();
      });
    });
  }

  // 单个对象复制
  _copyObject(activeObject: any) {
    console.log('复制_copyObject')
    this.cache = activeObject
    if (this.cache && !this.cache.tileParentId) {
      // this.clone(this.cache);
      if (this.cache.isBackground && this.cutPartsType.value == this.cache.cutPartsType) {
        Message.error('粘贴失败，一个裁片只能有一张背景图，请粘贴至别的裁片试试')
        return
      }
      if (this.cache.type == 'text') {
        this.cache.clone(c => {
          const grid = this.cutPartsType.value == this.cache.cutPartsType ? 10 : 0
          basicInheritAttribute.forEach(el => {
            c[el] = this.cache[el]
          })
          this.addText(c, null)
        })

      } else {
        this.cache.clone(c => {
          const grid = this.cutPartsType.value == this.cache.cutPartsType ? 10 : 0
          basicInheritAttribute.forEach(el => {
            c[el] = this.cache[el]
          })
          c.set({
            cutPartsType: this.cutPartsType.value,
            FileName: this.cache.FileName,
            FilePath: this.cache.FilePath,
            id: guid(),
            left: this.cache.left + grid,
            top: this.cache.top + grid,
            visible: true,
            repeatType: this.cache.repeatType,
            filters: [],
            scaleX: this.cache.scaleX,
            scaleY: this.cache.scaleY
          })
          this.canvas.add(c)
          this.editor.fixedLayer()
          this.canvas.setActiveObject(c)
          this.editor.setRepeat(c.repeatType, true)
        })
      }


    }
    // 间距设置
    // let info: any = {}
    // const grid = 10;
    // const canvas = this.canvas;
    // const cutPartsType = activeObject.cutPartsType
    // const FileName = activeObject.FileName
    // const FilePath = activeObject.FilePath
    // const isBackground = activeObject.isBackground
    // const repeatType = activeObject.repeatType
    // const isRepeat = activeObject.isRepeat
    // activeObject?.clone((cloned: fabric.Object) => {
    //   if (cloned.left === undefined || cloned.top === undefined) return;
    //   // cloned.set({
    //   //   ...info
    //   // });
    //   // 设置位置信息

    //   cloned.set({
    //     left: cloned.left + grid,
    //     top: cloned.top + grid,
    //     evented: true,
    //     id: uuid(),
    //     cutPartsType: cutPartsType,
    //     FileName: FileName,
    //     FilePath: FilePath,
    //     filters: [],
    //     isBackground: isBackground,
    //     repeatType: repeatType,
    //     isRepeat: isRepeat
    //   });
    //   if (cloned.type == 'text') {
    //     this.addText(cloned, null)
    //   } else {
    //     canvas.discardActiveObject();
    //     canvas.add(cloned);
    //     canvas.setActiveObject(cloned);
    //     canvas.requestRenderAll();
    //     this.editor.setRepeat(repeatType, true)
    //   }

    // });
  }

  // 复制元素
  clone(paramsActiveObeject: fabric.ActiveSelection | fabric.Object) {
    const activeObject = paramsActiveObeject || this.canvas.getActiveObject();
    if (!activeObject) return;
    if (activeObject?.type === 'activeSelection') {
      this._copyActiveSelection(activeObject);
    } else {
      this._copyObject(activeObject);
    }
  }
  addText(c, callback) {
    const grid = this.cutPartsType.value == c.cutPartsType ? 10 : 0
    const active = this.canvas.getActiveObjects()[0]
    const mask = this.canvas.getObjects().find(el => el.isMask)
    const FileName = guid() + '.png'
    // const text = new fabric.IText(t('everything_is_fine'), {
    //   ...defaultPosition,
    //   // ...option,
    //   fontSize: 80,
    //   id: uuid(),
    //   cutPartsType: cutPartsType.value,
    //   type: 'text',
    //   FileName: FileName,
    //   FilePath: 'images_temp/' + FileName.substring(0, 1),
    // });
    c.set({
      cutPartsType: this.cutPartsType.value,
      FileName: FileName,
      FilePath: 'images_temp/' + FileName.substring(0, 1),
      id: guid(),
      left: c.left + grid,
      top: c.top + grid,
      visible: true,
      repeatType: c.repeatType,
      filters: [],
      fill: c.fill
    })
    c.customVisible = c.customVisible
    this.canvas.add(c);
    this.canvas.setActiveObject(c);
    this.editor.setRepeat(c.repeatType, true)
    this.editor.fixedLayer()
    const activeObject = this.canvas.getActiveObjects()[0]
    const url = activeObject.toDataURL({
      width: activeObject.width,
      height: activeObject.height,
      angle: activeObject.angle,
      scaleX: activeObject.scaleX,
      scaleY: activeObject.scaleY,
      multiplier: 1,
    })
    setUserUploadFile(url, FileName, 'images_temp/', callback)
  };
  // 快捷键扩展回调
  hotkeyEvent(eventName: string, e: any) {
    if (eventName === 'ctrl+c' && e.type === 'keydown') {
      const activeObject = this.canvas.getActiveObject();
      this.cache = activeObject;
      this.cache.FileName = activeObject.FileName
      this.cache.FilePath = activeObject.FilePath
      this.cache.repeatType = activeObject.repeatType
      this.cache.filters = []
      basicInheritAttribute.forEach(el => {
        this.cache[el] = activeObject[el]
      })

    }
    if (eventName === 'ctrl+v' && e.type === 'keydown') {
      if (this.cache) {
        // this.clone(this.cache);
        if (this.cache.isBackground && this.cutPartsType.value == this.cache.cutPartsType) {
          Message.error('粘贴失败，一个裁片只能有一张背景图，请粘贴至别的裁片试试')
          return
        }
        if (this.cache.type == 'text') {
          this.cache.clone(c => {
            const grid = this.cutPartsType.value == this.cache.cutPartsType ? 10 : 0
            basicInheritAttribute.forEach(el => {
              c[el] = this.cache[el]
              c.publicControlId = null
            })
            this.addText(c, null)
          })

        } else {
          this.cache.clone(c => {
            const grid = this.cutPartsType.value == this.cache.cutPartsType ? 10 : 0
            basicInheritAttribute.forEach(el => {
              c[el] = this.cache[el]
            })
            c.set({
              cutPartsType: this.cutPartsType.value,
              FileName: this.cache.FileName,
              FilePath: this.cache.FilePath,
              id: guid(),
              left: this.cache.left + grid,
              top: this.cache.top + grid,
              visible: true,
              repeatType: this.cache.repeatType,
              filters: [],
              publicControlId: null
            })
            this.canvas.add(c)
            this.editor.fixedLayer()
            this.canvas.setActiveObject(c)
            this.editor.setRepeat(c.repeatType, true)
          })
        }


      }
    }
  }

  contextMenu() {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      return [{ text: '复制', hotkey: 'Ctrl+V', disabled: false, onclick: () => this.clone() }];
    }
  }

  destroy() {
    console.log('pluginDestroy');
  }
}

export default CopyPlugin;
