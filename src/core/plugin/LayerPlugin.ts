/*
 * @Author: 邓官妮
 * @Date: 2023-06-15 23:23:18
 * @LastEditors: 邓官妮
 * @LastEditTime: 2023-06-27 23:07:57
 * @Description: 图层调整插件
 */
 
import { fabric } from 'fabric';
import Editor from '../core';
type IEditor = Editor;

class LayerPlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  static pluginName = 'LayerPlugin';
  static apis = ['up', 'upTop', 'down', 'downTop'];
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;
  }

  _getWorkspace() {
    return this.canvas.getObjects().find((item) => item.id === 'workspace');
  }

  _workspaceSendToBack() {
    const backgroundImage = this.canvas.getObjects().find((item) => item.isBackground);
    const workspace = this._getWorkspace();
    backgroundImage && backgroundImage.sendToBack();
    workspace && workspace.sendToBack();

  }
  _lineSendToBack() {
    const line = this.canvas.getObjects().find((item) => item.id === '0');
    line && line.sendToBack();
  }
  _maskBringToFront() {
    const mask = this.canvas.getObjects().find((item) => item.isMask);
    mask && mask.bringToFront();

  }

  up() {
    const actives = this.canvas.getActiveObjects();
    if (actives && actives.length === 1) {
      const activeObject = this.canvas.getActiveObjects()[0];
      activeObject && activeObject.bringForward();
      this.canvas.renderAll();
      this._lineSendToBack()
      this._workspaceSendToBack();
      this._maskBringToFront()
    }
  }

  upTop() {
    const actives = this.canvas.getActiveObjects();
    if (actives && actives.length === 1) {
      const activeObject = this.canvas.getActiveObjects()[0];
      activeObject && activeObject.bringToFront();
      this.canvas.renderAll();
      this._lineSendToBack()
      this._workspaceSendToBack();
      this._maskBringToFront()
    }
  }

  down() {
    const actives = this.canvas.getActiveObjects();
    if (actives && actives.length === 1) {
      const activeObject = this.canvas.getActiveObjects()[0];
      activeObject && activeObject.sendBackwards();
      this.canvas.renderAll();
      this._lineSendToBack()
      this._workspaceSendToBack();
      this._maskBringToFront()
    }
  }

  downTop() {
    const actives = this.canvas.getActiveObjects();
    if (actives && actives.length === 1) {
      const activeObject = this.canvas.getActiveObjects()[0];
      activeObject && activeObject.sendToBack();
      this.canvas.renderAll();
      this._lineSendToBack()
      this._workspaceSendToBack();
      this._maskBringToFront()
    }
  }

  contextMenu() {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      return [
        {
          text: '图层管理',
          hotkey: '❯',
          subitems: [
            {
              text: '上一个',
              hotkey: 'key',
              onclick: () => this.up(),
            },
            {
              text: '下一个',
              hotkey: 'key',
              onclick: () => this.down(),
            },
            {
              text: '置顶',
              hotkey: 'key',
              onclick: () => this.upTop(),
            },
            {
              text: '置底',
              hotkey: 'key',
              onclick: () => this.downTop(),
            },
          ],
        },
      ];
      // return [{ text: '复制', hotkey: 'Ctrl+V', disabled: false, onclick: () => this.clone() }];
    }
  }

  destroy() {
    console.log('pluginDestroy');
  }
}

export default LayerPlugin;
