import { v4 as uuid } from 'uuid';
class ControlsTile {
    static lockObj = {
        'lockMovementX': false,
        'lockMovementY': false,
        'lockRotation': false,
        'lockScalingX': false,
        'lockScalingY': false,
        selectable: false
    }
    static repeatType = ''
    static isRepeat: boolean = false
    static canvas: any
    static stateRepeat: any = {
        basic: false,
        mirror: false,
        transverse: false,
        direction: false
    }
    static activeObject: any
    static activeInfo = {
        angle: 0,
        width: 0,
        height: 0,
        scaleX: 0,
        scaleY: 0
    }
    static groupRepeat: any
    static setCanvasObserve(canvas) {
        // this.canvas = canvas
        // this.activeInfo = {
        //     angle: 0,
        //     width: 0,
        //     height: 0,
        //     scaleX: 0,
        //     scaleY: 0
        // }
        this.canvas.on('mouse:up', function () {
            let type = ''
            const activeObject = ControlsTile.canvas.getActiveObjects()[0];
            if (ControlsTile.isRepeat && activeObject && activeObject.id === ControlsTile.activeObject.id) {
                for (let key in ControlsTile.stateRepeat) {
                    if (ControlsTile.stateRepeat[key]) {
                        type = key
                    }
                }
                ControlsTile.canvas.getObjects().forEach(el => {
                    if (el.isRepeat) {
                        ControlsTile.canvas.remove(el)
                    }
                })
                ControlsTile.setRepeat(type, true)
            }

        })
    }
    static setRepeat(repeatType: string, val: boolean = false) {
        const activeObject = this.canvas.getActiveObjects()[0];
        const type = repeatType ? repeatType : this.repeatType
        this.repeatType = type
        // var Rect = new fabric.Rect({//绘制圆形
        //     fill: 'grba(0,0,0,0)',
        //     height: 703,
        //     width: 703,
        //     opacity: 0,


        // });
        // var text = new fabric.Text('Hello World', {//绘制文本
        //     fontSize: 30,
        //     originX: 'center',
        //     originY: 'center'
        // })


        // this.groupRepeat = new fabric.Group([], {
        //     // left: activeObject.left - 351.5 +activeObject.width/2,
        //     // top: activeObject.top -351.5 +activeObject.height/2,

        //     height: 703,
        //     width: 703,
        //     evented: true,
        //     id: uuid(),
        //     isRepeat: true,

        // });
        // activeObject?.clone(c => {
        //     c.set({
        //         left: -351 + 100,
        //         top: -351,

        //         evented: true,
        //         id: uuid(),
        //     });
        //     this.groupRepeat.add(c)
        // })
        // activeObject?.clone(c => {
        //     c.set({
        //         left: -351 + 100,
        //         top: -351 + 100,
        //         evented: true,
        //         id: uuid(),


        //         // flipX: flipX,
        //         isRepeat: true,
        //         // hasControls: false,
        //         // ...this.lockObj,
        //         opacity: 1
        //     });
        //     this.groupRepeat.add(c)
        //     this.canvas.add(this.groupRepeat)
        //     this.canvas.requestRenderAll();
        // })

        //         // this.canvas.add(group);
        //         this.canvas.requestRenderAll();

        this.activeObject = activeObject
        activeObject?.clone((cloned: any) => {
            if (cloned.left === undefined || cloned.top === undefined) return;
            for (let key in this.stateRepeat) {
                if (type == key) {
                    this.stateRepeat[key] = val ? val : !this.stateRepeat[key]
                } else {
                    this.stateRepeat[key] = false
                }
            }
            this.isRepeat = this.stateRepeat[type]
            this.canvas.getObjects().forEach(el => {
                if (el.isRepeat) {
                    this.canvas.remove(el)
                }
            })
            if (this.isRepeat) {
                if (type == 'basic') {
                    this.handelRepeat(cloned, false, false, 0, 0)
                } else if (type == 'mirror') {
                    this.handelRepeat(cloned, true, true, 0, 0)
                } else if (type == 'transverse') {
                    this.handelRepeat(cloned, false, false, (cloned.width * cloned.scaleX) / 2, 0)
                } else if (type == 'direction') {
                    this.handelRepeat(cloned, false, false, 0, (cloned.height * cloned.scaleY) / 2)
                }
                // this.canvas.add(group);
                this.canvas.requestRenderAll();
            }
        });
    }
    static handelRepeat(clonedObj, flipY, flipX, offsetX, offsetY) {
        const activeObject = this.canvas.getActiveObjects()[0];
        this.observeObj(activeObject)
        const seft = this

        activeObject.clone(cloned => {
            cloned.set({
                id: uuid(),
                top: 0,
                left: 0,
                width: cloned.width,
                height: cloned.height,
                scaleX: cloned.scaleX,
                scaleY: cloned.scaleY
            });
            var patternSourceCanvas = new fabric.StaticCanvas();
            patternSourceCanvas.add(cloned);
            patternSourceCanvas.setDimensions({
                width: cloned.getScaledWidth() + 1,
                height: cloned.getScaledHeight() + 1,
            });
            patternSourceCanvas.renderAll();
            var pattern = new fabric.Pattern({
                source: patternSourceCanvas.getElement(),
                repeat: 'repeat',
                left: cloned.left,
                top: cloned.top,
                hasControls: false,
                ...this.lockObj,
            });
            const rect = new fabric.Rect(
                {
                    width: 703,
                    height: 703,
                    left: 0,
                    top: 0,
                    fill: pattern,
                    isRepeat: true,
                    hasControls: false,
                    ...this.lockObj,
                    // objectCaching: false,
                },
            )
            rect.sendBackwards()
            seft.canvas.add(rect);
        })



        // let { topCount,
        //     bottomCount,
        //     leftCount,
        //     rightCount,
        //     width,
        //     height } = this.getCount(clonedObj)


        // this.setUpDownCloned(clonedObj, topCount, bottomCount, height, width, flipY, offsetX, 0)
        // for (let i = 1; i < leftCount + 1; i++) {
        //     clonedObj.clone((cloned: any) => {
        //         cloned.set({
        //             left: cloned.left - width * i,
        //             top: cloned.top + offsetY,
        //             evented: true,
        //             id: uuid(),
        //             flipX: flipX,
        //             isRepeat: true,
        //             hasControls: false,
        //             ...this.lockObj
        //         });
        //         this.canvas.add(cloned);
        //         this.setUpDownCloned(cloned, topCount, bottomCount, height, width, flipY, offsetX, offsetY)
        //     })
        // }
        // for (let i = 1; i < rightCount + 1; i++) {
        //     clonedObj.clone((cloned: any) => {
        //         cloned.set({
        //             left: cloned.left + width * i,
        //             top: cloned.top + offsetY,
        //             evented: true,
        //             id: uuid(),
        //             flipX: flipX,
        //             isRepeat: true,
        //             hasControls: false,
        //             ...this.lockObj
        //         });
        //         this.canvas.add(cloned);
        //         this.setUpDownCloned(cloned, topCount, bottomCount, height, width, flipY, offsetX, offsetY)
        //     })
        // }
        this.canvas.requestRenderAll();
    }

    static getCount(cloned: any) {
        let topCount = 0
        let bottomCount = 0
        let leftCount = 0
        let rightCount = 0
        const workspace = this.canvas.getObjects().find((item: any) => item.id === 'workspace');
        const width = cloned.scaleX * cloned.width
        const height = cloned.scaleY * cloned.height
        if (cloned.top > 0 && cloned.left > 0) {
            topCount = Math.ceil(cloned.top / height)
            bottomCount = Math.ceil((workspace.height - cloned.top - height) / height)
            leftCount = Math.ceil(cloned.left / width)
            rightCount = Math.ceil((workspace.width - width - cloned.left) / width)
            console.log('(workspace.width - width - cloned.left) / width', (workspace.width - width - cloned.left) / width)
        } else if (cloned.top > 0 && cloned.left < 0) {
            topCount = Math.ceil(cloned.top / height)
            bottomCount = Math.ceil((workspace.height - cloned.top - height) / height)
            leftCount = 0
            rightCount = Math.ceil((workspace.width - width + cloned.left) / width)
        } else if (cloned.top < 0 && cloned.left > 0) {
            topCount = 0
            bottomCount = Math.ceil((workspace.height + cloned.top - height) / height)
            leftCount = Math.ceil(cloned.left / width)
            rightCount = Math.ceil((workspace.width - width - cloned.left) / width)
        } else {
            topCount = 0
            bottomCount = Math.ceil((workspace.height + cloned.top - height) / height)
            leftCount = 0
            rightCount = Math.ceil((workspace.width - width + cloned.left) / width)
        }
        return {
            topCount: topCount + 1,
            bottomCount: bottomCount + 1,
            leftCount: leftCount,
            rightCount: rightCount,
            width,
            height
        }
    }
    static setUpDownCloned(cloned, topCount, bottomCount, height, width, flipY, offsetX, offsetY) {
        for (let i = 1; i < topCount + 1; i++) {
            cloned.clone((cloned2: any) => {
                cloned2.set({
                    left: cloned2.left + offsetX,
                    top: cloned2.top - height * i,
                    evented: true,
                    id: uuid(),
                    flipY: flipY,
                    isRepeat: true,
                    hasControls: false,
                    ...this.lockObj,
                });
                this.canvas.add(cloned2);
                // this.canvas.requestRenderAll();
            })
        }
        for (let i = 1; i < bottomCount + 1; i++) {
            cloned.clone((cloned3: any) => {
                cloned3.set({
                    left: cloned3.left + offsetX,
                    top: cloned3.top + height * i,
                    evented: true,
                    id: uuid(),
                    flipY: flipY,
                    isRepeat: true,
                    hasControls: false,
                    ...this.lockObj,


                });
                this.canvas.add(cloned3);
            })
        }
    }
    static observeObj(obj: any) {
        const Canvas = this.canvas
        //对象被加入监听事件
        obj.on('mouseup', function () {
            // let type = ''
            // const activeObject = ControlsTile.canvas.getActiveObjects()[0];
            // if (ControlsTile.isRepeat && activeObject && activeObject.id === ControlsTile.activeObject.id) {
            //     for (let key in ControlsTile.stateRepeat) {
            //         if (ControlsTile.stateRepeat[key]) {
            //             type = key
            //         }
            //     }
            //     ControlsTile.canvas.getObjects().forEach(el => {
            //         if (el.isRepeat) {
            //             ControlsTile.canvas.remove(el)
            //         }
            //     })
            //     ControlsTile.setRepeat(type, true)
            // }
        });
        // rotated
        //对象被移除监听事件
        obj.on('removed', function () {
            Canvas.getObjects().forEach(el => {
                if (el.isRepeat) {
                    Canvas.remove(el)
                    ControlsTile.isRepeat = false
                }
            })
        });

    }
}
export default ControlsTile