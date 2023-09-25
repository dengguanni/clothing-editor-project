<template>
    <div class="box" v-if="mixinState.mSelectMode === 'one'">
        <div class="menu">
            <div @click="goBack">返回</div>
            <div @click="restore">恢复</div>
        </div>
        <!-- <div @click="text" style="height: 100px; width: 100px; background-color: aqua;"> 剪切</div> -->
        <div class="filter-box">
            <div class="filter-item" v-for="(value, key) in imageList" :key="key" @click=addItem(value)>
                <img :src="value.src" />
            </div>
            <!-- <img :src="imagebase64" style=" border-color: black;" /> -->
        </div>
    </div>
</template>
  
<script setup >
import useSelect from '@/hooks/select';
import { v4 as uuid } from 'uuid';
import { uiType, paramsFilters, combinationFilters } from '@/config/constants/filter';
import { reactive } from 'vue'
import picture from '@/api/picture'
const emit = defineEmits()
const { fabric, mixinState, canvasEditor } = useSelect();
let croppedImage = ref()
const state = reactive({
    type: '',
    hasCropping: false
});
const imagebase64 = ref('')
const imageList = reactive([
    {
        id: uuid(),
        src: 'http://8.140.206.30:8089/ImageSource/Masks/01.png',
        name: '01.png'

    }, {
        id: uuid(),
        src: 'http://8.140.206.30:8089/ImageSource/Masks/02.png',
        name: '02.png'

    },
    {
        id: uuid(),
        src: 'http://8.140.206.30:8089/ImageSource/Masks/03.png',
        name: '03.png'

    },
    {
        id: uuid(),
        src: 'http://8.140.206.30:8089/ImageSource/Masks/04.png',
        name: '04.png'

    },
    {
        id: uuid(),
        src: 'http://8.140.206.30:8089/ImageSource/Masks/05.png',
        name: '05.png'

    }
])
onMounted(() => {
    canvasEditor.canvas.on('mouse:up', function (options) {
        if (state.hasCropping) {
            // canvasEditor.canvas.overlayColor = null
            const mask = canvasEditor.canvas.getActiveObjects()[0]
            if (mask) {
                handelCutParts(croppedImage.value)
                const objects = canvasEditor.canvas.getObjects();
                canvasEditor.canvas.remove(croppedImage.value)
                croppedImage.value.visible = false
                croppedImage.value = null
                objects.map((item) => {
                    if (item.hasCropping) {
                        canvasEditor.canvas.remove(item)
                        canvasEditor.upTop()
                    }
                })
            }
            state.hasCropping = false

        }

    })
})
const handelCutParts = (image) => {
    const maskRect = canvasEditor.canvas.getObjects().find((item) => item.isMask);
    const workspace = canvasEditor.canvas.getObjects().find((item) => item.id === 'workspace')
    const mask = canvasEditor.canvas.getActiveObjects()[0]
    if (mask) {
        const p = {
            Canvas_width: workspace.width,
            Canvas_height: workspace.height,
            Image_fullName: image.FilePath + '/' + image.FileName,
            Image_width: image.width * image.scaleX,
            Image_height: image.height * image.scaleY,
            Image_left: image.left,
            Image_top: image.top,
            Image_angle: image.angle,
            Mask_name: mask.name,
            Mask_width: mask.width * mask.scaleX,
            Mask_height: mask.height * mask.scaleY,
            Mask_left: mask.left,
            Mask_top: mask.top,
            Mask_angle: mask.angle
        }
        console.log('剪裁参数', p)
        picture.setCutParts(p).then(res => {
            let imgInstance
            const imgEl = document.createElement('img');
            imgEl.src = 'data:image/jpeg;base64,' + res.Tag[0].base64;
            imagebase64.value = imgEl.src
            document.body.appendChild(imgEl);
            imgInstance = new fabric.Image(imgEl, {
                id: uuid(),
                name: image.name,
                width: image.width,
                height: image.height,
                // width: 703,
                // height: 703,
                angle: image.angle,
                top: image.top,
                left: image.left,
                angle: image.angle
            })
            // console.log('剪裁', res)

            imgInstance.cutPartsType = image.cutPartsType
            imgInstance.FilePath = image.FilePath
            imgInstance.parentUrl = image.ImageUrl
            imgInstance.ImageUrl = image.ImageUrl
            imgInstance.skewX = image.skewX
            imgInstance.skewY = image.skewY
            console.log('maskRect', maskRect)

            imgEl.onload = () => {
                canvasEditor.canvas.add(imgInstance);
                canvasEditor.canvas.bringToFront(maskRect)
                canvasEditor.canvas.renderAll();
                imgEl.remove();
            }
        })

    }

    // const properties = {
    //     left: 0,
    //     top: 0
    // };
    // let callback = (image, isError) => {
    //     if (!isError) {
    //         image.id = uuid()
    //         // const info = canvasEditor.canvas.getObjects().find((item) => item.id === image.id);
    //         // canvasEditor.canvas.discardActiveObject();
    //         // canvasEditor.canvas.setActiveObject(info);
    //         canvasEditor.canvas.requestRenderAll();
    //     }
    // }
    // const imageURL = 'data:image/jpeg;base64,' + res.Tag[0].base64;
    // fabric.Image.fromURL(imageURL, callback, properties);

}
const restore = () => {
    const activeObjects = canvasEditor.canvas.getActiveObjects()[0]
    const maskRect = canvasEditor.canvas.getObjects().find((item) => item.isMask);
    if (activeObjects.parentUrl) {
        const imageURL = activeObjects.parentUrl;
        let callback = (image, isError) => {
            if (!isError) {
                canvasEditor.canvas.remove(activeObjects)
                image.id = uuid()
                image.name = activeObjects.name
                image.scaleX = activeObjects.scaleX
                image.scaleY = activeObjects.scaleY
                image.top = activeObjects.top
                image.left = activeObjects.left
                image.angle = activeObjects.angle
                image.FilePath = activeObjects.FilePath
                image.ImageUrl = activeObjects.ImageUrl
                image.cutPartsType = activeObjects.cutPartsType
                image.visible = true
                croppedImage.value = image
                canvasEditor.canvas.add(image);
                const info = canvasEditor.canvas.getObjects().find((item) => item.id === image.id);
                canvasEditor.canvas.discardActiveObject();
                canvasEditor.canvas.setActiveObject(info);
                canvasEditor.canvas.bringToFront(maskRect)
                canvasEditor.canvas.requestRenderAll();
            }
        };
        const properties = {
            left: 0,
            top: 0
        };
        fabric.Image.fromURL(imageURL, callback, properties);
        const info = canvasEditor.canvas.getObjects().find((item) => {
            if (item.hasCropping || item.parentUrl) {
                canvasEditor.canvas.remove(item)
            }
        });
        state.hasCropping = false
    }
}
const addItem = (item) => {
    // const workspace = canvasEditor.canvas.getObjects().find((item) => item.id === 'workspace')
    // canvasEditor.canvas.setOverlayColor({ source: 'src/assets/png/01.png', repeat: 'no-repeat' }, canvasEditor.canvas.renderAll.bind(canvasEditor.canvas), { width: 100, height: 100 })
    // state.hasCropping = true
    // clipImage()
    const objects = canvasEditor.canvas.getObjects();
    const activeObjects = canvasEditor.canvas.getActiveObjects()[0]
    const maskRect = canvasEditor.canvas.getObjects().find((item) => item.isMask);
    if (activeObjects.parentUrl) {
        const imageURL = activeObjects.parentUrl;
        let callback = (image, isError) => {
            if (!isError) {
                canvasEditor.canvas.remove(activeObjects)
                image.id = uuid()
                image.name = activeObjects.name
                image.scaleX = activeObjects.scaleX
                image.scaleY = activeObjects.scaleY
                image.top = activeObjects.top
                image.left = activeObjects.left
                image.angle = activeObjects.angle
                image.FilePath = activeObjects.FilePath
                image.ImageUrl = activeObjects.ImageUrl
                image.visible = true
                croppedImage.value = image
                canvasEditor.canvas.add(image);
                const info = canvasEditor.canvas.getObjects().find((item) => item.id === image.id);
                canvasEditor.canvas.discardActiveObject();
                canvasEditor.canvas.setActiveObject(info);
                canvasEditor.canvas.bringToFront(maskRect)
                canvasEditor.canvas.requestRenderAll();

            }
        };
        const properties = {
            left: 0,
            top: 0
        };
        fabric.Image.fromURL(imageURL, callback, properties);
    } else {
        croppedImage.value = state.hasCropping ? croppedImage.value : activeObjects
    }
    objects.map((item) => {
        if (item.hasCropping) {
            canvasEditor.canvas.remove(item)
            canvasEditor.upTop()
        }
    })
    const imageURL = item.src;
    let callback = (image, isError) => {
        if (!isError) {
            image.hasCropping = true
            image.id = uuid()
            image.name = item.name
            const scale = croppedImage.value.height * croppedImage.value.scaleY / image.height
            image.scaleX = scale
            image.scaleY = scale
            image.top = croppedImage.value.top
            image.left = croppedImage.value.left
            image.angle = croppedImage.value.angle
            canvasEditor.canvas.add(image);
            const info = canvasEditor.canvas.getObjects().find((item) => item.id === image.id);
            canvasEditor.canvas.discardActiveObject();
            canvasEditor.canvas.setActiveObject(info);
            canvasEditor.canvas.bringToFront(maskRect)
            canvasEditor.canvas.requestRenderAll();
            state.hasCropping = true
            info.on('remove', () => {
                console.log('删除')
            })
        }
    };
    const properties = {
        left: 0,
        top: 0
    };
    // 添加裁片蒙版
    fabric.Image.fromURL(imageURL, callback, properties);
    // const mask = canvasEditor.canvas.getActiveObjects()[0]

}

const text = () => {
    const activeObject = canvasEditor.canvas.getActiveObjects()[0];
    mixinState.isClipping = false
    activeObject.clipClone.visible = false
    canvasEditor.canvas.remove(mixinState.clipActiveObj);
}
const clipImage = () => {
    const activeObject = canvasEditor.canvas.getActiveObjects()[0];
    if (activeObject.type === 'image') {
        let clipBox = new fabric.Rect({
            left: activeObject.left,
            top: activeObject.top,
            width: activeObject.width - 20,
            height: activeObject.height - 20,
            stroke: '#F5A623',
            strokeWidth: 1,
            fill: 'rgba(1,1,1,0.5)',
            objectCaching: false,
            scaleX: activeObject.scaleX,
            scaleY: activeObject.scaleY,
            selectionBackgroundColor: 'rgba(255, 255, 255, 0.5)',
            padding: 0,
            angle: activeObject.angle
        });
        mixinState.clipBox = clipBox
        mixinState.clipActiveObj = activeObject;
        // 区分是svg的img还是普通img
        let url = 'http://127.0.0.1:3000/src/assets/png/01.png'

        fabric.util.loadImage(url, function (img) {
            clipBox.fill = new fabric.Pattern({
                source: img,
                repeat: 'no-repeat',
                offsetX: 0,
                offsetY: 0,
                height: 100,
                width: 100

            });
            canvasEditor.canvas.add(clipBox);

            activeObject.set({
                selectable: false,
                hoverCursor: 'default',
                event: false,
                hasControls: false,
                perPixelTargetFind: false,
            })
            activeObject.clone(function (clonedObj) {
                canvasEditor.canvas.discardActiveObject();
                clonedObj.set({
                    left: clonedObj.left,
                    top: clonedObj.top,
                    evented: false,
                    opacity: 0.8
                });
                clipBox.clipClone = clonedObj;
                canvasEditor.canvas.add(clonedObj);

            });
            activeObject.visible = false;
            canvasEditor.canvas.renderAll();
            // mixinState.clipBox.on({
            //     'moving': () => {
            //         if (!mixinState.isClipping) {
            //             clipBox.clipClone.left = clipBox.left - mixinState.clipLeft
            //             clipBox.clipClone.top = clipBox.top - mixinState.clipTop
            //             canvasEditor.canvas.renderAll()
            //             returnd
            //         }
            //         let left = clipBox.left - clipBox.clipClone.left;
            //         let top = clipBox.top - clipBox.clipClone.top;
            //         mixinState.clipLeft = left
            //         mixinState.clipTop = top
            //         clipBox.fill.offsetX = -left / clipBox.clipClone.scaleX
            //         clipBox.fill.offsetY = -top / clipBox.clipClone.scaleY
            //         canvasEditor.canvas.renderAll();
            //     },
            //     'scaling': () => {
            //         if (!mixinState.isClipping) {
            //             clipBox.clipClone.left = clipBox.left - mixinState.clipLeft
            //             clipBox.clipClone.top = clipBox.top - mixinState.clipTop
            //             clipBox.clipClone.scaleX = clipBox.scaleX
            //             clipBox.clipClone.scaleY = clipBox.scaleY
            //             canvasEditor.canvas.renderAll()
            //             return
            //         }
            //         // let _width = clipBox.width / clipBox.
            //         let _width = clipBox.width * clipBox.scaleX / clipBox.clipClone.scaleX
            //         let _height = clipBox.height * clipBox.scaleY / clipBox.clipClone.scaleY
            //         let left = clipBox.left - clipBox.clipClone.left;
            //         let top = clipBox.top - clipBox.clipClone.top;
            //         mixinState.clipLeft = clipBox.left
            //         mixinState.clipTop = clipBox.top
            //         clipBox.fill.offsetX = -left / clipBox.clipClone.scaleX
            //         clipBox.fill.offsetY = -top / clipBox.clipClone.scaleX
            //         clipBox.scaleX = clipBox.clipClone.scaleX
            //         clipBox.scaleY = clipBox.clipClone.scaleY
            //         clipBox.width = _width
            //         clipBox.height = _height
            //         canvasEditor.canvas.renderAll();
            //     }
            // })
            setTimeout(() => {
                canvasEditor.canvas.setActiveObject(mixinState.clipBox);
                canvasEditor.canvas.renderAll();
            }, 400)
        })

    } else {
        activeObject.clipClone.visible = true;
        canvasEditor.canvas.renderAll();
    }



}
// 插入图片文件
const insertImgFile = (file) => {
    if (!file) throw new Error('file is undefined');
    let imgInstance
    const imgEl = document.createElement('img');
    imgEl.src = file;
    // 插入页面
    document.body.appendChild(imgEl);
    // 创建图片对象
    imgInstance = new fabric.Image(imgEl, {
        id: 3,
        name: '剪裁图'
    })
    // 设置缩放
    imgInstance.scaleX = 703 / imgInstance.width;
    // 设置图片背景在竖直方向上的缩放比例
    imgInstance.scaleY = 703 / imgInstance.height;
    imgInstance = new fabric.Image(imgEl, {
        id: uuid(),
        name: '图片1',
        left: 250,
        top: 250,
    })
    imgEl.onload = () => {
        canvasEditor.canvas.add(imgInstance);
        canvasEditor.canvas.setActiveObject(imgInstance);
        canvasEditor.canvas.renderAll();
        // 删除页面中的图片元素
        imgEl.remove();

    };
}
async function imgToBase64(url) {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.src = url
        image.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = image.naturalWidth // 使用 naturalWidth 为了保证图片的清晰度
            canvas.height = image.naturalHeight
            canvas.style.width = `${canvas.width / window.devicePixelRatio}px`
            canvas.style.height = `${canvas.height / window.devicePixelRatio}px`
            const ctx = canvas.getContext('2d')
            if (!ctx) {
                return null
            }
            ctx.drawImage(image, 0, 0)
            const base64 = canvas.toDataURL('image/png')
            return resolve(base64)
        }
        image.onerror = (err) => {
            return reject(err);
        }
    })
}


// if (activeObject) {
//     state.type = activeObject.type;
// }
const goBack = () => {
    emit('goBack', 'cropping')
    state.hasCropping = false
}
</script>
<style lang="less" scoped>
.menu {
    background-color: #fff;
    width: 100%;
    height: 30px;
    border-bottom: 1px solid #0000001f;
    font-size: 14px;
    color: #4E5969;
    padding: 0px 12px;
    display: flex;
    justify-content: space-between;

    div:hover {
        color: #2777ff;
        cursor: pointer;
    }
}

.filter-box {
    overflow: hidden;
    padding: 20px;

    .filter-item {
        float: left;
        cursor: pointer;
        width: 50%;
        margin-bottom: 10px;

        img {
            width: 90%;
            height: auto;
        }
    }
}

.has-params {
    display: inline-block;
    margin-bottom: 10px;
    width: 50%;

    .content {
        width: 90%;
    }

    cursor: none;
}

.box {
    margin-bottom: 12px;
}
</style>
  