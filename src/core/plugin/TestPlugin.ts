

import { fabric } from 'fabric';
import Editor from '../core';
import { v4 as uuid } from 'uuid';
type IEditor = Editor;

class TestPlugin {
    public canvas: fabric.Canvas;
    public editor: IEditor;
    static pluginName = 'TestPlugin';
    static apis = ['test'];
    constructor(canvas: fabric.Canvas, editor: IEditor) {
        this.canvas = canvas;
        this.editor = editor;
    }
    test() {
        console.log('test')
    }
    contextMenu() {
        const activeObject = this.canvas.getActiveObject();
        if (activeObject) {
            this.test()
        }
      }
}

export default TestPlugin;
