/*
 * @Description: 画布区域插件
 */

import { fabric } from 'fabric';
import Editor from '../core';
import { throttle } from 'lodash-es';
type IEditor = Editor;

class WorkspacePlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  static pluginName = 'WorkspacePlugin';
  static events = ['sizeChange'];
  static apis = ['big', 'small', 'auto', 'one', 'setSize'];
  static hasCut = false
  workspaceEl: HTMLElement;
  workspace: null | fabric.Rect;
  newWorkspace: null | fabric.Rect;
  option: any;
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;
    this.init({
      width: 900,
      height: 2000,
    });
  }

  init(option) {
    const workspaceEl = document.querySelector('#workspace') as HTMLElement;
    if (!workspaceEl) {
      throw new Error('element #workspace is missing, plz check!');
    }
    this.workspaceEl = workspaceEl;
    this.workspace = null;
    this.option = option;
    this._initBackground();
    this._initWorkspace();
    this._initResizeObserve();
    this._bindWheel();
  }

  // hookImportBefore() {
  //   return new Promise((resolve, reject) => {
  //     resolve();
  //   });
  // }

  hookImportAfter() {
    return new Promise((resolve) => {
      const workspace = this.canvas.getObjects().find((item) => item.id === 'workspace');
      const bg = this.canvas.getObjects().find((item) => item.id === '0');
      if (bg) {
        bg.set('selectable', false);
        bg.set('hasControls', false);
      }
      if (workspace) {
        workspace.set('selectable', false);
        workspace.set('hasControls', false);
        this.setSize(workspace.width, workspace.height);
        this.editor.emit('sizeChange', workspace.width, workspace.height);
      }
      resolve();
    });
  }

  hookSaveAfter() {
    return new Promise((resolve) => {
      this.auto();
      resolve(true);
    });
  }

  // 初始化背景
  _initBackground() {
    this.canvas.backgroundImage = '';
    this.canvas.setWidth(703);
    this.canvas.setHeight(703);
  }

  // 初始化画布
  _initWorkspace() {
    // const { width, height } = this.option;
    // console.log('width, height', width, height)
    const width = 703
    const height = 703
    const workspace = new fabric.Rect({
      fill: 'rgba(255,255,255,1)',
      width,
      height,
      id: 'workspace',
    });
    workspace.set('selectable', false);
    workspace.set('hasControls', false);
    workspace.hoverCursor = 'default';
    this.canvas.add(workspace);

    this.canvas.renderAll();
    this.workspace = workspace;
    this.auto();
  }
  /**
   * 设置画布中心到指定对象中心点上
   * @param {Object} obj 指定的对象
   */
  setCenterFromObject(obj: fabric.Rect) {
    const { canvas } = this;
    const objCenter = obj.getCenterPoint();
    const viewportTransform = canvas.viewportTransform;
    if (canvas.width === undefined || canvas.height === undefined || !viewportTransform) return;
    viewportTransform[4] = canvas.width / 2 - objCenter.x * viewportTransform[0];
    viewportTransform[5] = 0;
    canvas.setViewportTransform(viewportTransform);
    canvas.renderAll();
  }

  // 初始化监听器
  _initResizeObserve() {
    const resizeObserver = new ResizeObserver(
      throttle(() => {
        this.auto();
      }, 500)
    );
    resizeObserver.observe(this.workspaceEl);
  }

  setSize(width: number, height: number) {
    this._initBackground();
    this.option.width = width;
    this.option.height = height;
    // 重新设置workspace
    this.workspace = this.canvas
      .getObjects()
      .find((item) => item.id === 'workspace') as fabric.Rect;
    this.workspace.set('width', width);
    this.workspace.set('height', height);
    // this.auto();
  }

  setZoomAuto(scale: number, cb?: (left?: number, top?: number) => void) {
    const { workspaceEl } = this;
    const width = workspaceEl.offsetWidth;
    const height = workspaceEl.offsetHeight;
    this.canvas.setWidth(width);
    this.canvas.setHeight(height);
    const center = this.canvas.getCenter();
    this.canvas.setViewportTransform(fabric.iMatrix.concat());
    this.canvas.zoomToPoint(new fabric.Point(center.left, center.top), scale);
    if (!this.workspace) return;
    this.workspace.visible = true
    this.setCenterFromObject(this.workspace);

    // 超出画布不展示

    const maskRect = this.canvas.getObjects().find((item: any) => item.isMask)
    let path: any
    if (maskRect) path = new fabric.Rect({ width: maskRect.width, height: maskRect.height, top: maskRect.top, left: maskRect.left })
    maskRect ? maskRect.clone((cloned: any) => {
      cloned.visible = true
      this.canvas.clipPath = maskRect ? path : cloned;
      this.canvas.renderAll()
      this.canvas.requestRenderAll();
    }) : this.workspace.clone((cloned: fabric.Rect) => {
      this.canvas.clipPath = maskRect ? path : cloned
      this.canvas.requestRenderAll();
    });
    if (cb) cb(this.workspace.left, this.workspace.top);
  }
  _getScale() {
    const viewPortWidth = this.workspaceEl.offsetWidth;
    const viewPortHeight = this.workspaceEl.offsetHeight;
    // 按照宽度
    if (viewPortWidth / viewPortHeight < this.option.width / this.option.height) {
      return viewPortWidth / this.option.width;
    } // 按照宽度缩放
    return viewPortHeight / this.option.height;
  }

  // 放大
  big() {
    let zoomRatio = this.canvas.getZoom();
    zoomRatio += 0.05;
    const center = this.canvas.getCenter();
    this.canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoomRatio);
  }

  // 缩小
  small() {
    let zoomRatio = this.canvas.getZoom();
    zoomRatio -= 0.05;
    const center = this.canvas.getCenter();
    this.canvas.zoomToPoint(
      new fabric.Point(center.left, center.top),
      zoomRatio < 0 ? 0.01 : zoomRatio
    );
  }

  // 自动缩放
  auto() {
    if (!WorkspacePlugin.hasCut) {
      const scale = this._getScale();
      this.setZoomAuto(scale - 0.07);
    }

  }

  // 1:1 放大
  one() {
    // this.setZoomAuto(0.8 - 0.08);
    this.canvas.requestRenderAll();
  }

  _bindWheel() {
    // this.canvas.on('mouse:wheel', function (this: fabric.Canvas, opt) {
    //   const delta = opt.e.deltaY;
    //   let zoom = this.getZoom();
    //   zoom *= 0.999 ** delta;
    //   if (zoom > 20) zoom = 20;
    //   if (zoom < 0.01) zoom = 0.01;
    //   const center = this.getCenter();
    //   this.zoomToPoint(new fabric.Point(center.left, center.top), zoom);
    //   opt.e.preventDefault();
    //   opt.e.stopPropagation();
    // });
  }

  destroy() {
    console.log('pluginDestroy');
  }


}

export default WorkspacePlugin;
