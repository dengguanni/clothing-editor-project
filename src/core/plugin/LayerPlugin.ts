/*
 * @Description: 图层调整插件
 */

import { fabric } from 'fabric';
import Editor from '../core';
type IEditor = Editor;

class LayerPlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  static pluginName = 'LayerPlugin';
  static apis = ['up', 'upTop', 'down', 'downTop', 'fixedLayer'];
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;
  }
  fixedLayer() {
    const mask = this.canvas.getObjects().find((item) => item.isMask)
    // const backgroundImage = this.canvas.getObjects().find((item) => item.isBackground)
    const backgroundImages = this.canvas.getObjects().filter(item => item.isBackground)
    const line = this.canvas.getObjects().find((item) => item.id == 'grid');
    const workspace = this.canvas.getObjects().find((item) => item.id == 'workspace');
    const backgroundRepeats = this.canvas.getObjects().filter((item) => item.isBackgroundRepeat);
    mask ? this.canvas.bringToFront(mask) : ''
    line ? this.canvas.bringToFront(line) : ''
    // console.log('backgroundImage', backgroundImage)
    backgroundImages.forEach(item => {
      this.canvas.sendToBack(item)
    })
    backgroundRepeats.forEach(item => {
      this.canvas.sendToBack(item)
    })
    workspace ? this.canvas.sendToBack(workspace) : ''
  }
  setLayer(up, obj = null) {
    const n = up ? 1 : -1
    let indexD
    const objects = this.canvas.getObjects()
    const actives = obj ? obj : this.canvas.getActiveObjects()[0];
    this.canvas.getObjects().forEach((element, index) => {
      if (element.id == actives.id) {
        indexD = index
      }
    })
    let z
    const fn = (index) => {
      if (!objects[index]) return
      if (objects[index].cutPartsType == actives.cutPartsType && objects[index].isMask == undefined && objects[index].tileParentId !== actives.id) {
        z = index
      } else {
        fn(index + n)
      }
    }
    fn(indexD + n)
    if (actives.repeatType) {
      objects.forEach(element => {
        if (element.tileParentId == actives.id) {
          z && element.moveTo(z)
          z && actives.moveTo(z - 1)
        }
      });
    } else {
      z && actives.moveTo(z)
    }

    this.fixedLayer()
  }
  up(obj = null) {
    this.setLayer(true,obj)
  }

  upTop() {
    const actives = this.canvas.getActiveObjects();
    if (actives && actives.length === 1) {
      const activeObject = this.canvas.getActiveObjects()[0];
      if (activeObject) {
        if (activeObject.repeatType) {
          this.canvas.getObjects().forEach(element => {
            if (element.tileParentId == activeObject.id)
              element.bringToFront()
          });
        }
        activeObject.bringToFront();
      }
      this.fixedLayer()
    }
  }

  down(obj = null) {
    this.setLayer(false, obj)
  }

  downTop() {
    const actives = this.canvas.getActiveObjects();
    if (actives && actives.length === 1) {
      const activeObject = this.canvas.getActiveObjects()[0];
      if (activeObject) {
        if (activeObject.repeatType) {
          this.canvas.getObjects().forEach(element => {
            if (element.tileParentId == activeObject.id)
              element.sendToBack()
          });
        }
        activeObject.sendToBack();
      }
      this.fixedLayer()
      this.canvas.renderAll();
    }
  }

  contextMenu() {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      // return [
      //   {
      //     text: '图层管理',
      //     hotkey: '❯',
      //     subitems: [
      //       {
      //         text: '上一个',
      //         hotkey: 'key',
      //         onclick: () => this.up(),
      //       },
      //       {
      //         text: '下一个',
      //         hotkey: 'key',
      //         onclick: () => this.down(),
      //       },
      //       {
      //         text: '置顶',
      //         hotkey: 'key',
      //         onclick: () => this.upTop(),
      //       },
      //       {
      //         text: '置底',
      //         hotkey: 'key',
      //         onclick: () => this.downTop(),
      //       },
      //     ],
      //   },
      // ];
      // return [{ text: '复制', hotkey: 'Ctrl+V', disabled: false, onclick: () => this.clone() }];
    }
  }

  destroy() {
    console.log('pluginDestroy');
  }
}

export default LayerPlugin;
