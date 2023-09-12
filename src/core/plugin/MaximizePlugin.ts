
class MaximizePlugin {
    static canvasEditor: any
    static activeObject: any
    static workspace: any
    static setMax(type: string) {
        this.activeObject = this.canvasEditor.canvas.getActiveObjects()[0];
        this.workspace = this.canvasEditor.canvas.getObjects().find((item: any) => item.id === 'workspace');
        this.activeObject.angle = 0
        if (type == 'bigFull') {
            this.designMaximization()
        } else if (type == 'full') {
            this.spreadDesignAea()
        } else if (type == 'height') {
            this.heightMaximization()
        } else {
            this.widthMaximization()
        }
        this.canvasEditor.position('Vcenter')
        this.canvasEditor.position('Hcenter')
        this.canvasEditor.canvas.requestRenderAll();

    }
    // 设计最大化
    static designMaximization() {
        if (this.activeObject.width >= this.activeObject.height) {
            this.widthMaximization()
        } else {
            this.heightMaximization()
        }

    }
    //    高度最大化
    static heightMaximization() {
        const scale = this.workspace.height / this.activeObject.height
        this.activeObject.scaleX = scale
        this.activeObject.scaleY = scale
        this.activeObject.top = 0

    }
    //    宽度最大化
    static widthMaximization() {
        const scale = this.workspace.width / this.activeObject.width
        this.activeObject.scaleX = scale
        this.activeObject.scaleY = scale
        this.activeObject.left = 0

    }
    //    铺满设计区
    static spreadDesignAea() {
        const scaleX = this.workspace.width / this.activeObject.width
        const scaleY = this.workspace.height / this.activeObject.height
        this.activeObject.scaleX = scaleX
        this.activeObject.scaleY = scaleY
        this.activeObject.top = 0
        this.activeObject.left = 0
    }
}
export default MaximizePlugin