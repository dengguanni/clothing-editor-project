<template>
    <div class="box" v-if="mixinState.mSelectMode === 'one'">
        <div class="menu">
            <div @click="goBack">返回</div>
            <div @click="restore">恢复</div>
        </div>
        <div class="filter-box">
            <div class="filter-item" v-for="(value, key) in imageList" :key="key" @click=addItem(value)>
                <img :src="value.src" />
            </div>
            <!-- <img :src="imageBase64" style=" border-color: black;" /> -->
        </div>
    </div>
</template>
  
<script setup >
import useSelect from '@/hooks/select';
import { v4 as uuid } from 'uuid';
import { uiType, paramsFilters, combinationFilters } from '@/config/constants/filter';
import { reactive } from 'vue'
import picture from '@/api/picture'
import guid from '@/utils/guiId.ts'
import { setUserUploadFile } from '@/core/2D/handleImages.ts'
import baseUrl from '@/config/constants/baseUrl'
import { basicInheritAttribute } from '@/config/customAttributeFabricObj.ts'
import { useStore } from 'vuex'

const store = useStore()
const emit = defineEmits()
const { fabric, mixinState, canvasEditor } = useSelect();
let croppedImage = ref()
const cutPartsType = computed(() => {
    return store.state.cutPartsType
})
watch(croppedImage, (newVal, oldVal) => {
    if (newVal) {
        console.log('croppedImage变了', newVal)
    }
}, { immediate: true, deep: true });
const state = reactive({
    type: '',
    hasCropping: false
});
const imageBase64 = ref('')
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
    canvasEditor.canvas.on('object:moving', function (options) {
        if (state.hasCropping && options?.deselected?.length !== 0) {
            const croppedImageH = croppedImage.value.height * croppedImage.value.scaleY
            const mask = canvasEditor.canvas.getObjects().find(item => item.hasCropping)
            const maskH = mask.height * mask.scaleY
            const croppedImageW = croppedImage.value.width * croppedImage.value.scaleX
            const maskW = mask.width * mask.scaleX
            if (croppedImageH >= maskH) {
                if (options.target.top > croppedImage.value.top + croppedImageH - maskH) {
                    mask.top = croppedImage.value.top + croppedImageH - maskH
                }
                if (options.target.top < croppedImage.value.top) {
                    mask.top = croppedImage.value.top
                }
                if (options.target.left > croppedImage.value.left + croppedImageW - maskW) {
                    mask.left = croppedImage.value.left + croppedImageW - maskW
                }
                if (options.target.left < croppedImage.value.left) {
                    mask.left = croppedImage.value.left
                }
            } else {
                if (options.target.top > croppedImage.value.top) {
                    mask.top = croppedImage.value.top
                }
                if (options.target.top < croppedImage.value.top - (maskH - croppedImageH)) {
                    mask.top = croppedImage.value.top - (maskH - croppedImageH)
                }
                if (options.target.left > croppedImage.value.left) {
                    mask.left = croppedImage.value.left
                }
                if (options.target.left < croppedImage.value.left - (maskW - croppedImageW)) {
                    mask.left = croppedImage.value.left - (maskW - croppedImageW)
                }
            }

        }
    })
    canvasEditor.canvas.on('object:removed', function (options) {
        if (options.target.hasCropping) state.hasCropping = false
    })
    canvasEditor.canvas.on('selection:cleared', function (options) {
        const mask = canvasEditor.canvas.getObjects().find(item => item.hasCropping)
        if (state.hasCropping && options.deselected) {
            options.deselected[0].id == mask.id && handelCutParts(croppedImage.value)
        }
    })
})
onUnmounted(() => {
    const mask = canvasEditor.canvas.getObjects().find(item => item.hasCropping)
    canvasEditor.canvas.remove(mask)
})
// 裁剪
const handelCutParts = (image) => {
    const maskRect = canvasEditor.canvas.getObjects().find((item) => item.isMask);
    const workspace = canvasEditor.canvas.getObjects().find((item) => item.id === 'workspace')
    const objects = canvasEditor.canvas.getObjects();
    const cutMask = objects.find(item => item.hasCropping)
    if (cutMask) {
        const p = {
            Canvas_width: workspace.width,
            Canvas_height: workspace.height,
            Image_fullName: image.FilePath + '/' + image.FileName,
            Image_width: image.width,
            Image_height: image.height,
            Image_scaleX: image.scaleX,
            Image_scaleY: image.scaleY,
            Image_left: image.left,
            Image_top: image.top,
            Image_angle: image.angle,
            Mask_name: cutMask.name,
            Mask_width: cutMask.width * cutMask.scaleX,
            Mask_height: cutMask.height * cutMask.scaleY,
            Mask_left: cutMask.left,
            Mask_top: cutMask.top,
            Mask_angle: cutMask.angle,
            Image_flipX: image.flipX,
            Image_flipY: image.flipY,
            Image_visible: image.visible
        }
        picture.setCutParts(p).then(res => {
            console.log('剪裁参数', p, 'res', res)
            const FileName = guid() + '.png'
            const callback = () => {
                let imgInstance
                const imgEl = document.createElement('img');
                imgEl.src = 'data:image/jpeg;base64,' + res.Tag[0].base64;
                imageBase64.value = imgEl.src
                document.body.appendChild(imgEl);
                imgInstance = new fabric.Image(imgEl, {
                    id: uuid(),
                    name: image.name,
                    width: image.width * image.scaleX,
                    height: image.height * image.scaleY,
                    angle: image.angle,
                    saveScaleX: image.scaleX,
                    saveScaleY: image.scaleY,
                    top: image.top,
                    left: image.left,
                    angle: image.angle,
                })
                imgInstance.name = FileName
                imgInstance.cutPartsType = cutPartsType.value
                imgInstance.FilePath = 'images_temp/' + FileName.substring(0, 1)
                imgInstance.FileName = FileName
                imgInstance.filtersType = image.filtersType
                imgInstance.parentCroppingFilePath = image.FilePath
                imgInstance.parentCroppingFileName = image.FileName
                imgInstance.parentUrl = image.ImageUrl
                imgInstance.visible = true
                imgInstance.ImageUrl = image.ImageUrl
                imgInstance.customVisible = true
                console.log('imgInstance', imgInstance)
                imgEl.onload = () => {
                    const oldObj = canvasEditor.canvas.getObjects().find((item) => image.id == item.id);
                    canvasEditor.canvas.remove(oldObj)
                    // imgInstance.scaleX = image.scaleX
                    // imgInstance.scaleY = image.scaleY
                    store.commit('setDisableClipping', false)
                    canvasEditor.canvas.add(imgInstance);
                    canvasEditor.canvas.bringToFront(maskRect)
                    canvasEditor.canvas.renderAll();
                    imgEl.remove();

                }
                canvasEditor.canvas.remove(croppedImage.value)
                canvasEditor.canvas.remove(cutMask)
                croppedImage.value = null
                state.hasCropping = false
            }
            setUserUploadFile('data:image/jpeg;base64,' + res.Tag[0].base64, FileName, 'images_temp//', callback)

        })

    }

}
const restore = () => {
    store.commit('setDisableClipping', true)
    const activeObjects = canvasEditor.canvas.getActiveObjects()[0]
    const maskRect = canvasEditor.canvas.getObjects().find((item) => item.isMask);
    const scaleX = activeObjects.scaleX
    const scaleY = activeObjects.scaleY

    if (activeObjects.parentCroppingFilePath) {
        const imageURL = baseUrl + '/UserUploadFile/' + activeObjects.parentCroppingFilePath + '/' + activeObjects.parentCroppingFileName
        let callback = (image, isError) => {
            if (!isError) {
                canvasEditor.canvas.remove(activeObjects)
                basicInheritAttribute.forEach(el => image.set(el, activeObjects[el]))
                image.id = uuid()
                image.name = activeObjects.name
                image.height = activeObjects.height / activeObjects.saveScaleY
                image.width = activeObjects.width / activeObjects.saveScaleX
                image.scaleX = activeObjects.saveScaleX
                image.scaleY = activeObjects.saveScaleY
                image.top = activeObjects.top
                image.left = activeObjects.left
                image.angle = activeObjects.angle
                image.FilePath = activeObjects.parentCroppingFilePath
                image.FileName = activeObjects.parentCroppingFileName
                image.oldFileName = activeObjects.parentCroppingFileName
                image.parentCroppingFileName = ''
                image.parentCroppingFilePath = ''
                image.oldFilePath = activeObjects.parentCroppingFilePath
                image.ImageUrl = activeObjects.ImageUrl
                image.cutPartsType = activeObjects.cutPartsType
                image.filtersType = activeObjects.filtersType
                image.Sharpen = activeObjects.Sharpen
                image.isBackground = activeObjects.isBackground
                image.parentUrl = null
                store.commit('setDisableClipping', false)
                canvasEditor.canvas.add(image);
                const info = canvasEditor.canvas.getObjects().find((item) => item.id === image.id);
                canvasEditor.canvas.setActiveObject(info);
                canvasEditor.canvas.bringToFront(maskRect)
                croppedImage.value = info
                image.filtersType ? canvasEditor.changeFilters(image.filtersType, true, null) : ''
                image.Sharpen ? canvasEditor.setSharpening(true) : ''
                canvasEditor.canvas.requestRenderAll();
            }
        };
        const properties = {
            left: 0,
            top: 0
        };
        fabric.Image.fromURL(imageURL, callback, properties);
        const info = canvasEditor.canvas.getObjects().find((item) => {
            if ((item.hasCropping || item.parentUrl && item.id === activeObjects.id)) {
                canvasEditor.canvas.remove(item)
            }
        });
        state.hasCropping = false
    }
}
const addItem = (item) => {
    store.commit('setDisableClipping', true)
    const objects = canvasEditor.canvas.getObjects();
    const activeObjects = canvasEditor.canvas.getActiveObjects()[0]
    const maskRect = canvasEditor.canvas.getObjects().find((item) => item.isMask);
    if (activeObjects.parentUrl) {  //  二次剪裁
        const imageURL = activeObjects.parentUrl;
        let callback = (image, isError) => {
            if (!isError) {
                console.log('初次剪裁结果', activeObjects)
                image.id = uuid()
                image.name = activeObjects.name
                image.scaleX = activeObjects.scaleX
                image.scaleY = activeObjects.scaleY
                image.top = activeObjects.top
                image.left = activeObjects.left - activeObjects.width * activeObjects.scaleX / 2
                image.angle = activeObjects.angle
                image.FileName = activeObjects.parentCroppingFileName
                image.FilePath = activeObjects.parentCroppingFilePath
                image.ImageUrl = activeObjects.ImageUrl
                // image.visible = true
                croppedImage.value = image
                canvasEditor.canvas.remove(activeObjects)
                canvasEditor.canvas.add(image);
                const info = canvasEditor.canvas.getObjects().find((item) => item.id === image.id);
                canvasEditor.canvas.discardActiveObject();
                canvasEditor.canvas.setActiveObject(info);
                canvasEditor.canvas.bringToFront(maskRect)
                canvasEditor.canvas.requestRenderAll();
                console.log('二次剪裁原图', image)
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
    let callback = (image, isError) => {  //添加裁片


        if (!isError) {
            image.hasCropping = true
            image.id = uuid()
            image.name = item.name
            const scale = croppedImage.value.height * croppedImage.value.scaleY / image.height
            image.scaleX = scale
            image.scaleY = scale
            image.top = croppedImage.value.top
            image.angle = croppedImage.value.angle
            const croppedImageW = croppedImage.value.width * croppedImage.value.scaleX
            const imageW = image.width * image.scaleX
            image.left = croppedImageW >imageW ?  croppedImage.value.left+(croppedImageW/2) -(imageW/2) : croppedImage.value.left-(croppedImageW/2)-(imageW/2) 
            canvasEditor.canvas.add(image);
            const info = canvasEditor.canvas.getObjects().find((item) => item.id === image.id);
            canvasEditor.canvas.discardActiveObject();
            canvasEditor.canvas.setActiveObject(info);
            canvasEditor.canvas.bringToFront(maskRect)
            canvasEditor.canvas.requestRenderAll();
            state.hasCropping = true


        }
    };
    const properties = {
        left: 0,
        top: 0
    };
    // 添加裁片蒙版
    fabric.Image.fromURL(imageURL, callback, properties);
    state.hasCropping = true
    // const mask = canvasEditor.canvas.getActiveObjects()[0]

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
  