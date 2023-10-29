import { Canvas } from 'fabric/fabric-impl';

// 最大化
// import this.canvasEditor from '@/core/plugin/this.canvasEditor.ts'
class MaximizePlugin {
    static canvasEditor: any
    static activeObject: any
    static mask: any
    static setMax(type: string, mask: any) {
        this.activeObject = this.canvasEditor.canvas.getActiveObjects()[0];
        this.mask = this.canvasEditor.canvas.getObjects().find((item) => item.isMask);
        this.activeObject.rotate(0);
        if (type == 'bigFull') {
            this.designMaximization()
        } else if (type == 'full') {
            this.spreadDesignAea()
        } else if (type == 'height') {
            this.heightMaximization()
        } else {
            this.widthMaximization()
        }
        this.canvasEditor.setRepeat(this.activeObject.repeatType, true)
        this.canvasEditor.canvas.requestRenderAll();

    }
    // 设计最大化
    static designMaximization() {
        this.activeObject = this.canvasEditor.canvas.getActiveObjects()[0];
        console.log(' this.activeObject',  this.activeObject)
        if (this.activeObject.width >= this.activeObject.height) {
            this.widthMaximization()
        } else {
            this.heightMaximization()
        }

    }
    //    高度最大化
    static heightMaximization() {
        const scale = (this.mask.height * this.mask.scaleY) / this.activeObject.height
        this.activeObject.scaleX = scale
        this.activeObject.scaleY = scale
        this.activeObject.top = this.mask.top
        const left = this.mask.left + (this.mask.width * this.mask.scaleX) / 2 - (this.activeObject.width *scale / 2)
        this.activeObject.left = left
    }
    //    宽度最大化
    static widthMaximization() {
        const scale = (this.mask.width * this.mask.scaleX) / this.activeObject.width
        this.activeObject.scaleX = scale
        this.activeObject.scaleY = scale
        this.activeObject.left = this.mask.left
        const top = this.mask.top + (this.mask.height * this.mask.scaleY) / 2 - (this.activeObject.height *scale / 2)
        this.activeObject.top = top
    }
    //    铺满设计区
    static spreadDesignAea() {
        const scaleX = (this.mask.width * this.mask.scaleX) / this.activeObject.width
        const scaleY = (this.mask.height * this.mask.scaleY) / this.activeObject.height
        this.activeObject.scaleX = scaleX
        this.activeObject.scaleY = scaleY
        this.activeObject.top = this.mask.top
        this.activeObject.left = this.mask.left
    }
}
export default MaximizePlugin