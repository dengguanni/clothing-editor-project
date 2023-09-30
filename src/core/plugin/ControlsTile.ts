import { fabric } from 'fabric';
import { v4 as uuid } from 'uuid';
import guid from '@/utils/guiId.ts'
import { setUserUploadFile } from '@/core/2D/handleImages.ts'
import baseUrl from '@/config/constants/baseUrl';
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
        this.canvas.on('object:modified', function () {
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
                if (ControlsTile.isRepeat) {
                    if (ControlsTile.repeatType == 'basic') {
                        ControlsTile.newHandelRepeat()
                    } else if (ControlsTile.repeatType == 'mirror') {
                        ControlsTile.newRepeatMirror()
                    } else if (ControlsTile.repeatType == 'transverse') {
                        ControlsTile.newRepeatX()
                    } else if (ControlsTile.repeatType == 'direction') {
                        ControlsTile.newRepeatY()
                    }
                    ControlsTile.canvas.requestRenderAll();
                }
            }

        })
    }
    static setRepeat(repeatType: string, val: boolean = false) {
        const activeObject = this.canvas.getActiveObjects()[0];
        const type = repeatType ? repeatType : this.repeatType
        this.repeatType = type
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
                    this.newHandelRepeat()
                } else if (type == 'mirror') {
                    ControlsTile.newRepeatMirror()
                } else if (type == 'transverse') {
                    ControlsTile.newRepeatX()
                } else if (type == 'direction') {
                    ControlsTile.newRepeatY()
                }
                this.canvas.requestRenderAll();
            }
        });
    }
    static getMaxCount = (cloned: any) => {
        const workspace = this.canvas.getObjects().find((item: any) => item.id === 'workspace');
        let maxXcount, maxYcount
        const left = cloned.left < 0 ? cloned.left * -1 : cloned.left
        const top = cloned.top < 0 ? cloned.top * -1 : cloned.top
        if (left < workspace.width - cloned.width * cloned.scaleX - left) {
            const n = Math.ceil((workspace.width - cloned.width * cloned.scaleX - left) / (cloned.width * cloned.scaleX))
            maxXcount = (2 * n + 3) % 2 == 0 ? 2 * n + 5 : 2 * n + 3
        } else {
            const n = Math.ceil(left / (cloned.width * cloned.scaleX))
            maxXcount = (2 * n + 3) % 2 == 0 ? 2 * n + 5 : 2 * n + 3
        }
        if (top < workspace.height - (cloned.height * cloned.scaleY) - top) {
            const n = Math.ceil((workspace.height - cloned.height - top * cloned.scaleY) / (cloned.height * cloned.scaleY))
            maxYcount = (2 * n + 3) % 2 == 0 ? 2 * n + 5 : 2 * n + 3
        } else {
            const n = Math.ceil(top / (cloned.height * cloned.scaleY))
            maxYcount = (2 * n + 3) % 2 == 0 ? 2 * n + 5 : 2 * n + 3
        }

        return { maxXcount, maxYcount }
    }
    static newHandelRepeat() {
        const self = this
        const activeObject = this.canvas.getActiveObjects()[0];
        this.observeObj(activeObject)
        activeObject.clone(cloned => {
            const { maxXcount, maxYcount } = self.getMaxCount(cloned)
            cloned.rotate(0)
            const left = cloned.left - (cloned.width * cloned.scaleX)
            const top = cloned.top - (cloned.height * cloned.scaleY)
            cloned.set({
                id: uuid(),
                top: 0,
                left: 0,
                width: cloned.width,
                height: cloned.height,
                scaleX: cloned.scaleX,
                scaleY: cloned.scaleY,
            });
            var patternSourceCanvas = new fabric.StaticCanvas();
            patternSourceCanvas.add(cloned);
            patternSourceCanvas.setDimensions({
                width: cloned.getScaledWidth(),
                height: cloned.getScaledHeight(),
            });
            patternSourceCanvas.renderAll();
            var pattern = new fabric.Pattern({
                source: patternSourceCanvas.getElement(),
                repeat: 'repeat',
                hasControls: false,
                ...this.lockObj,

            });
            const rect = new fabric.Rect(
                {
                    width: cloned.width * cloned.scaleX * maxXcount,
                    height: cloned.height * maxYcount * cloned.scaleY,
                    fill: pattern,
                    isRepeat: true,
                    hasControls: false,
                    ...this.lockObj,
                    selectable: false,
                    evented: false,
                },
            )
            const p = {
                rect: rect,
                imageLeft: left - (((maxXcount - 1) / 2) - 1) * activeObject.width * activeObject.scaleX,
                imageTop: top - (((maxYcount - 1) / 2) - 1) * activeObject.height * activeObject.scaleY,
            }
            this.replaceImage(p.rect, p.imageLeft, p.imageTop)
        })
    }
    static replaceImage = (rect: fabric.Rect, imageLeft: number, imageTop: number) => {
        console.log('替换')
        const FileName = guid() + '.png'
        console.log('rect', rect)
        const url = rect.toDataURL({
            width: rect.width,
            height: rect.height,
            angle: rect.angle,
            scaleX: rect.scaleX,
            scaleY: rect.scaleY,
            multiplier: 1,
        });
        // const url =
        let callback1 = () => {
            const activeObject = this.canvas.getActiveObjects()[0];
            const imageURL = baseUrl +'UserUploadFile/images_temp/' + FileName.substring(0, 1) + '/' + FileName
            let callback = (image: any, isError: boolean) => {
                if (!isError) {
                    image.cutPartsType = activeObject.cutPartsType
                    image.set({
                        ...this.lockObj,
                        selectable: false,
                        evented: false,
                        isRepeat: true,
                    })
                    image.cutPartsType = activeObject.cutPartsType
                    image.sendBackwards()
                    image.id = uuid()
                    image.FileName = FileName
                    image.FilePath = 'images_temp/' + FileName.substring(0, 1)
                    image.left = imageLeft
                    image.top = imageTop
                    image.rotate(activeObject.angle)
                    this.canvas.add(image);
                    this.canvas.requestRenderAll();
                }
            };
            const properties = {
                left: 100,
                top: 100
            };
            fabric.Image.fromURL(imageURL, callback, properties);
        }
        setUserUploadFile(url, FileName, 'images_temp//', callback1)
    }
    static newRepeatX = () => {
        const self = this
        let arr1 = []
        const activeObject = this.canvas.getActiveObjects()[0];
        this.observeObj(activeObject)
        const createPattern1 = () => {
            let isOffsetX = false
            activeObject.clone(cloned => {
                let { maxXcount, maxYcount } = self.getMaxCount(cloned)
                cloned.rotate(0)
                const left = cloned.left - (cloned.width * cloned.scaleX)
                const top = cloned.top - (cloned.height * cloned.scaleY)
                cloned.set({
                    id: uuid(),
                    top: 0,
                    left: 0,
                    width: cloned.width,
                    height: cloned.height,
                    scaleX: cloned.scaleX,
                    scaleY: cloned.scaleY,
                });
                var patternSourceCanvas = new fabric.StaticCanvas();
                patternSourceCanvas.add(cloned);
                patternSourceCanvas.setDimensions({
                    width: cloned.getScaledWidth(),
                    height: cloned.getScaledHeight(),
                });
                patternSourceCanvas.renderAll();
                var pattern = new fabric.Pattern({
                    source: patternSourceCanvas.getElement(),
                    repeat: 'repeat',
                    hasControls: false,
                    ...this.lockObj,
                });
                const rect = new fabric.Rect(
                    {
                        width: cloned.width * cloned.scaleX * maxXcount,
                        height: cloned.height * cloned.scaleY,
                        left: 0,
                        top: cloned.height * cloned.scaleY,
                        fill: pattern,
                        isRepeat: true,
                        hasControls: false,
                        ...this.lockObj,
                        selectable: false,
                        evented: false,
                    },
                )
                rect.clone(cloned => {
                    cloned.set(
                        {
                            width: cloned.width * cloned.scaleX * maxXcount,
                            height: cloned.height * cloned.scaleY,
                            left: (cloned.width * cloned.scaleX) / 2,
                            top: 0,
                            fill: pattern,
                        }
                    )
                    arr1.push(rect, cloned)
                })
                rect.clone(cloned => {
                    cloned.set(
                        {
                            width: cloned.width * cloned.scaleX * maxXcount,
                            height: cloned.height * cloned.scaleY,
                            left: (cloned.width * cloned.scaleX) / 2,
                            top: cloned.height * cloned.scaleY * 2,
                            fill: pattern,
                        }
                    )
                    arr1.push(rect)
                    const group = new fabric.Group(...arr1, {
                        top: 0,
                        left: 0,
                        width: activeObject.width * activeObject.scaleX * 3,
                        height: activeObject.height * activeObject.scaleY * 3,
                        isRepeat: true,
                    })
                    group.cutPartsType = activeObject.cutPartsType
                    group.rotate(activeObject.angle)
                    group.sendBackwards()
                    self.canvas.add(group);
                    this.canvas.requestRenderAll();
                })

            })
        }
        const createPattern = () => {
            let isOffsetX = false
            activeObject.clone(cloned => {
                let { maxXcount, maxYcount } = self.getMaxCount(cloned)
                cloned.rotate(0)
                const left = cloned.left - (cloned.width * cloned.scaleX)
                const top = cloned.top - (cloned.height * cloned.scaleY)
                cloned.set({
                    id: uuid(),
                    top: 0,
                    left: 0,
                    width: cloned.width,
                    height: cloned.height,
                    scaleX: cloned.scaleX,
                    scaleY: cloned.scaleY,
                });
                for (let num = 1; num < (maxYcount + 1) / 2; num++) {
                    console.log('maxYcount', maxYcount)
                    var patternSourceCanvas = new fabric.StaticCanvas();
                    const heightNum = num == 1 ? 0 : (num * 2) - 3
                    patternSourceCanvas.add(cloned);
                    patternSourceCanvas.setDimensions({
                        width: cloned.getScaledWidth(),
                        height: cloned.getScaledHeight() + cloned.height * cloned.scaleY * heightNum,
                    });
                    patternSourceCanvas.renderAll();
                    var pattern = new fabric.Pattern({
                        source: patternSourceCanvas.getElement(),
                        repeat: 'repeat',
                        hasControls: false,
                        ...this.lockObj,
                    });
                    pattern.offsetX = isOffsetX ? (cloned.width * cloned.scaleX) / 2 : 0
                    isOffsetX = !isOffsetX
                    const rectTop = num == 1 ? top + cloned.height * cloned.scaleY : top - cloned.height * cloned.scaleY * (num - 2)
                    const rect = new fabric.Rect(
                        {
                            width: cloned.width * cloned.scaleX * maxXcount,
                            height: cloned.height * cloned.scaleY * (2 * num - 1),
                            left: 0,
                            top: 0,
                            fill: pattern,
                            isRepeat: true,
                            hasControls: false,
                            ...this.lockObj,
                            selectable: false,
                            evented: false,

                        },
                    )
                    const p = {
                        rect: rect,
                        imageLeft: left - (((maxXcount - 1) / 2) - 1) * cloned.width * cloned.scaleX,
                        imageTop: rectTop,
                    }
                    this.replaceImage(p.rect, p.imageLeft, p.imageTop)
                    // rect.cutPartsType = activeObject.cutPartsType
                    // rect.rotate(activeObject.angle)
                    // rect.sendBackwards()
                    // self.canvas.add(rect);
                }
            })
        }
        createPattern()
        this.canvas.requestRenderAll();
    }
    static newRepeatY = () => {
        const self = this
        const activeObject = this.canvas.getActiveObjects()[0];
        this.observeObj(activeObject)
        const workspace = this.canvas.getObjects().find((item: any) => item.id === 'workspace');
        let left
        let top
        let arr1 = []
        let maxYcount = (workspace.height / (activeObject.height * activeObject.scaleY))
        maxYcount = (Math.ceil(maxYcount) % 2 == 0 ? Math.ceil(maxYcount) + 1 : Math.ceil(maxYcount)) + 2
        let maxXcount = (workspace.width / (activeObject.width * activeObject.scaleX))
        maxXcount = (Math.ceil(maxXcount) % 2 == 0 ? Math.ceil(maxXcount) + 1 : Math.ceil(maxXcount)) + 2
        const fn3 = () => {
            const group = new fabric.Group(arr1, {
                top: 0,
                left: 0,
                width: activeObject.width * activeObject.scaleX * maxXcount,
                height: activeObject.height * activeObject.scaleY * maxYcount,
                isRepeat: true,
            })
            var patternSourceCanvas = new fabric.StaticCanvas();
            patternSourceCanvas.add(group);
            patternSourceCanvas.setDimensions({
                width: group.getScaledWidth(),
                height: group.getScaledHeight(),
            });
            patternSourceCanvas.renderAll();
            var pattern = new fabric.Pattern({
                source: patternSourceCanvas.getElement(),
                repeat: 'repeat',
                hasControls: false,
                ...this.lockObj,
            });
            const rect = new fabric.Rect(
                {
                    width: activeObject.width * activeObject.scaleX * maxXcount,
                    height: activeObject.height * activeObject.scaleY * maxYcount,
                    left: 0,
                    top: 0,
                    fill: pattern,
                    isRepeat: true,
                    hasControls: false,
                    ...this.lockObj,
                    selectable: false,
                    evented: false,
                }
            )
            const p = {
                rect: rect,
                imageLeft: left - activeObject.width * activeObject.scaleX * ((maxXcount - 1) / 2),
                imageTop: top - activeObject.height * activeObject.scaleY * ((maxYcount - 1) / 2),
            }
            this.replaceImage(p.rect, p.imageLeft, p.imageTop)

        }
        const fn2 = () => {
            activeObject.clone(cloned => {
                cloned.rotate(0)
                left = cloned.left
                top = cloned.top
                cloned.set({
                    id: uuid(),
                    top: 0,
                    left: 0,
                    width: cloned.width,
                    height: cloned.height,
                    scaleX: cloned.scaleX,
                    scaleY: cloned.scaleY,
                });
                var patternSourceCanvas = new fabric.StaticCanvas();
                patternSourceCanvas.add(cloned);
                patternSourceCanvas.setDimensions({
                    width: cloned.getScaledWidth(),
                    height: cloned.getScaledHeight(),
                });
                patternSourceCanvas.renderAll();
                var pattern = new fabric.Pattern({
                    source: patternSourceCanvas.getElement(),
                    repeat: 'repeat-y',
                    hasControls: false,
                    ...this.lockObj,
                });
                pattern.offsetY = (cloned.height * cloned.scaleY) / 2
                const rect = new fabric.Rect(
                    {
                        width: cloned.width * cloned.scaleX,
                        height: cloned.height * cloned.scaleY * maxYcount,
                        left: cloned.width * cloned.scaleX * 2,
                        top: 0,
                        fill: pattern,
                        isRepeat: true,
                        hasControls: false,
                        ...this.lockObj,
                        selectable: false,
                        evented: false,
                    }
                )
                arr1.push(rect)
                fn3()
            })
        }
        const fn1 = () => {
            activeObject.clone(cloned => {
                cloned.rotate(0)
                left = cloned.left
                top = cloned.top
                cloned.set({
                    id: uuid(),
                    top: 0,
                    left: 0,
                    width: cloned.width,
                    height: cloned.height,
                    scaleX: cloned.scaleX,
                    scaleY: cloned.scaleY,
                });
                var patternSourceCanvas = new fabric.StaticCanvas();
                patternSourceCanvas.add(cloned);
                patternSourceCanvas.setDimensions({
                    width: cloned.getScaledWidth(),
                    height: cloned.getScaledHeight(),
                });
                patternSourceCanvas.renderAll();
                var pattern = new fabric.Pattern({
                    source: patternSourceCanvas.getElement(),
                    repeat: 'repeat-y',
                    hasControls: false,
                    ...this.lockObj,
                });
                pattern.offsetY = (cloned.height * cloned.scaleY) / 2
                const rect = new fabric.Rect(
                    {
                        width: cloned.width * cloned.scaleX,
                        height: cloned.height * cloned.scaleY * maxYcount,
                        left: 0,
                        top: 0,
                        fill: pattern,
                        isRepeat: true,
                        hasControls: false,
                        ...this.lockObj,
                        selectable: false,
                        evented: false,
                    }
                )
                arr1.push(rect)
                fn2()
            })
        }
        activeObject.clone(cloned => {
            cloned.rotate(0)
            left = cloned.left
            top = cloned.top
            cloned.set({
                id: uuid(),
                top: 0,
                left: 0,
                width: cloned.width,
                height: cloned.height,
                scaleX: cloned.scaleX,
                scaleY: cloned.scaleY,
            });
            var patternSourceCanvas = new fabric.StaticCanvas();
            patternSourceCanvas.add(cloned);
            patternSourceCanvas.setDimensions({
                width: cloned.getScaledWidth(),
                height: cloned.getScaledHeight(),
            });
            patternSourceCanvas.renderAll();
            var pattern = new fabric.Pattern({
                source: patternSourceCanvas.getElement(),
                repeat: 'repeat-y',
                hasControls: false,
                ...this.lockObj,
            });
            const rect = new fabric.Rect(
                {
                    width: cloned.width * cloned.scaleX,
                    height: cloned.height * cloned.scaleY * maxYcount,
                    left: cloned.width * cloned.scaleX,
                    top: 0,
                    fill: pattern,
                    isRepeat: true,
                    hasControls: false,
                    ...this.lockObj,
                    selectable: false,
                    evented: false,
                }
            )
            arr1.push(rect)
            fn1()
        })





    }
    // 镜像
    static newRepeatMirror = () => {
        const self = this
        const activeObject = this.canvas.getActiveObjects()[0];
        this.observeObj(activeObject)
        const workspace = this.canvas.getObjects().find((item: any) => item.id === 'workspace');
        let newObjArr1 = []
        let newObjArr2 = []
        let left
        let top
        activeObject.clone(cloned => {
            cloned.rotate(0)
            left = cloned.left
            top = cloned.top
            console.log('left', left)
            cloned.set({
                id: uuid(),
                top: 0,
                left: 0,
                width: cloned.width,
                height: cloned.height,
                scaleX: cloned.scaleX,
                scaleY: cloned.scaleY,
                flipX: true,
            });
            newObjArr1.push(cloned)
            activeObject.clone(cloned => {
                cloned.rotate(0)
                cloned.set({
                    id: uuid(),
                    top: 0,
                    left: cloned.width * cloned.scaleX,
                    width: cloned.width,
                    height: cloned.height,
                    scaleX: cloned.scaleX,
                    scaleY: cloned.scaleY,
                });
                newObjArr1.push(cloned)
                activeObject.clone(cloned => {
                    cloned.rotate(0)
                    cloned.set({
                        id: uuid(),
                        top: 0,
                        left: cloned.width * 2 * cloned.scaleX,
                        width: cloned.width,
                        height: cloned.height,
                        scaleX: cloned.scaleX,
                        scaleY: cloned.scaleY,
                        flipX: true,
                        flipY: true
                    });
                    newObjArr1.push(cloned)
                    const group1: fabric.Group = new fabric.Group(newObjArr1, {
                        left: 0,
                        id: uuid(),
                        top: activeObject.height * activeObject.scaleY,
                        width: activeObject.width * 3 * activeObject.scaleX,
                        height: activeObject.height * activeObject.scaleY,
                    })
                    group1.clone(cloned => {
                        cloned.set({
                            id: uuid(),
                            left: 0,
                            top: activeObject.height * activeObject.scaleY * 2,
                            width: activeObject.width * 3 * activeObject.scaleX,
                            height: activeObject.height * activeObject.scaleY,
                            flipY: true,
                            angle: 0,
                        })
                        newObjArr2.push(group1, cloned)
                        console.log('4')
                    })
                    group1.clone(cloned => {
                        cloned.rotate(0)
                        cloned.set({
                            id: uuid(),
                            left: 0,
                            top: 0,
                            angle: 0,
                            width: activeObject.width * 3 * activeObject.scaleX,
                            height: activeObject.height * activeObject.scaleY,
                            flipY: true
                        })
                        newObjArr2.push(cloned)
                        console.log('5')
                        const group2: fabric.Group = new fabric.Group(newObjArr2, {
                            left: 0,
                            top: 0,
                            angle: 0,
                            width: activeObject.width * 3 * activeObject.scaleX,
                            height: activeObject.height * 3 * activeObject.scaleY,
                        })
                        var patternSourceCanvas = new fabric.StaticCanvas();
                        patternSourceCanvas.add(group2);
                        patternSourceCanvas.setDimensions({
                            width: group2.getScaledWidth(),
                            height: group2.getScaledHeight(),
                        });
                        patternSourceCanvas.renderAll();
                        var pattern = new fabric.Pattern({
                            source: patternSourceCanvas.getElement(),
                            repeat: 'repeat',
                            hasControls: false,
                            ...this.lockObj,
                        });
                        const numX = workspace.width / (group2.width * group2.scaleX)
                        const numY = workspace.width / (group2.height * group2.scaleY)
                        let num = Math.ceil(numX > numY ? numX : numY)
                        num = (num % 2 == 0 ? num + 1 : num) + 2
                        let rectLeft
                        let rectTop
                        if (num == 1) {
                            rectLeft = left - activeObject.width * activeObject.scaleX
                            rectTop = top - activeObject.height * activeObject.scaleY
                        } else {
                            rectLeft = left - ((num * 3 - 1) / 2) * activeObject.width * activeObject.scaleX
                            rectTop = top - ((num * 3 - 1) / 2) * activeObject.height * activeObject.scaleY
                        }

                        const rect = new fabric.Rect(
                            {
                                width: group2.width * group2.scaleX * num,
                                height: group2.height * group2.scaleY * num,
                                left: 0,
                                top: 0,
                                fill: pattern,
                                isRepeat: true,
                                hasControls: false,
                                ...this.lockObj,
                                selectable: false,
                                evented: false,
                            },
                        )
                        const p = {
                            rect: rect,
                            imageLeft: rectLeft,
                            imageTop: rectTop
                        }
                        this.replaceImage(p.rect, p.imageLeft, p.imageTop)
                        // rect.cutPartsType = activeObject.cutPartsType
                        // rect.rotate(activeObject.angle)
                        // rect.sendBackwards()
                        // self.canvas.add(rect);
                        // this.canvas.requestRenderAll();
                    })
                })
            })
        })
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
        obj.on('rotating', function () {
            console.log('rotating');
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