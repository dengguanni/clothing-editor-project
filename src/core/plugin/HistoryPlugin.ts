/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Author: 邓官妮
 * @Date: 2023-06-20 13:06:31
 * @LastEditors: 邓官妮
 * @LastEditTime: 2023-07-04 23:37:07
 * @Description: 历史记录插件
 */
import { fabric } from 'fabric';
import Editor from '../core';
import { ref } from 'vue';
import { useRefHistory } from '@vueuse/core';
type IEditor = Editor;
import { useStore } from 'vuex'
import historyAip from '@/api/history.ts'
import baseUrl from '@/config/constants/baseUrl';
class HistoryPlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  static pluginName = 'HistoryPlugin';
  static apis = ['undo', 'redo', 'getHistory'];
  static events = ['historyInitSuccess'];
  public hotkeys: string[] = ['ctrl+z'];
  history: any;
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;
    this._init();
  }
  store = useStore()
  saveSteps = computed(() => {
    return this.store.state.saveSteps
  })
  userID = computed(() => {
    return this.store.state.userID
})
  _init() {
    this.history = useRefHistory(ref(), {
      capacity: 50,
    });
    this.canvas.on({
      'object:added': (event) => this._save(event),
      'object:modified': (event) => this._save(event),
      'selection:updated': (event) => this._save(event),
    });
  }

  getHistory() {
    return this.history;
  }
  _save(event) {
    // 过滤选择元素事件
    const isSelect = event.action === undefined && event.e;
    if (isSelect || !this.canvas) return;
    const workspace = this.canvas.getObjects().find((item) => item.id === 'workspace');
    if (!workspace) {
      return;
    }
    if (this.history.isTracking.value) {
      this.history.source.value = this.editor.getJson();
    }
  }

  undo() {
    this.loadCanvasObject(true)
    // if (this.history.canUndo.value) {
    // this.renderCanvas();
    // this.history.undo();
    // }
  }

  redo() {
    // this.history.redo();
    // this.renderCanvas();
    this.loadCanvasObject(false)
  }
  addText(option) {
    const mask = this.canvas.getObjects().find(el => el.isMask)
    const text = new fabric.IText(option.text, {
      type: 'text',
    });
    for (var key in option) {
      text[key] = option[key]
    }
    text.sendBackwards()
    this.canvas.add(text)
  }
  loadObject(canvasObjects) {
    this.store.commit('setIsSetSteps', true)
    const mask = this.canvas.getObjects().find((item) => item.isMask)
    const fn = (obj, index) => {
      if (obj.type == 'image') {
        const imageURL = baseUrl + 'UserUploadFile/' + obj.FilePath + '/' + obj.FileName
        let callback = (image, isError) => {
          if (!isError) {
            for (var key in obj) {
              image[key] = obj[key]
            }
            if (obj.cutPartsType == mask.cutPartsType) {
              image.visible = true
            } else {
              image.visible = false
            }
            if (image.customVisible === false) image.visible = false
            image.sendBackwards()
            this.canvas.add(image)
            if (canvasObjects[index + 1]) {
              fn(canvasObjects[index + 1], index + 1)
            } else {
              const backgroundImage = this.canvas.getObjects().find((item) => item.isBackground)
              this.canvas.bringToFront(mask)
              this.canvas.sendToBack(backgroundImage)
              this.canvas.requestRenderAll();
              // setTimeout(() => { this.store.commit('setIsSetSteps', false) }, 500)
            }
          }
        };
        const properties = {
          left: 100,
          top: 100
        };
        fabric.Image.fromURL(imageURL, callback, properties);
      } else if (obj.type === 'text') {
        this.addText(obj)
        if (canvasObjects[index + 1]) {
          fn(canvasObjects[index + 1], index + 1)
        } else {
          const mask = this.canvas.getObjects().find((item) => item.isMask)
          const backgroundImage = this.canvas.getObjects().find((item) => item.isBackground)
          this.canvas.bringToFront(mask)
          this.canvas.sendToBack(backgroundImage)
          this.canvas.requestRenderAll();
          // setTimeout(() => { this.store.commit('setIsSetSteps', false) }, 500)
        }
      }
    }
    if (canvasObjects[0]) fn(canvasObjects[0], 0)
  }
  loadCanvasObject(isNext) {
    this.store.commit('setIsSetSteps', true)
    const p = {
      ID: isNext ? this.saveSteps.value.ID - 1 : Number(this.saveSteps.value.ID) + 1,
    }
    historyAip.getHistory(p).then(res => {
      const steps = {
        ID: res.Tag[0].Table[0].ID,
        ID_Next: res.Tag[0].Table[0].ID_Next,
        ID_Previous: res.Tag[0].Table[0].ID_Previous,
        userID: this.userID.value
      }
      this.store.commit('setSaveSteps', steps)
      const data = res.Tag[0].Table[0].JsonValue
      const objects = this.canvas.getObjects().filter(v => !(v.id == 'workspace' || v.isMask !== undefined || v.id == 'grid'))
      objects.forEach(element => {
        this.canvas.remove(element)
      });
      const objectsData = JSON.parse(data)

      this.store.commit('setSaveData', JSON.parse(data))
      this.loadObject(JSON.parse(data).canvasObjects)
      this.store.commit('setBgColor', objectsData.commodityInfo.bgColor)
    })
  }

  renderCanvas = () => {
    this.history.pause();
    this.canvas.clear();
    this.canvas.loadFromJSON(this.history.source.value, () => {
      this.canvas.renderAll();
      this.history.resume();
    });
  };

  // 快捷键扩展回调
  hotkeyEvent(eventName: string, e: any) {
    if (eventName === 'ctrl+z' && e.type === 'keydown') {
      this.undo();
    } else if (eventName === 'ctrl+y' && e.type === 'keydown') {
      this.redo()
    }
  }
  destroy() {
    console.log('pluginDestroy');
  }
}

export default HistoryPlugin;
