<template>
    <div class="canvas-menu-1" v-if="cutParts.length > 0">
        <!-- <button @click="changeSelection(0)" :class="0 == active ? 'btn-active' : 'btn'">整体设计</button> -->
        <div class="menu-list">
            <div v-for="item in cutParts" :key="item.Title" class="menu-item">
                <div :class="item.Title == active ? 'active-image' : 'image'"
                    @click=" store.commit('setCutPartsType', item.Title)">
                    <div class="thumbnail">
                        <img :src="item.ImageUrl" style="width: 100%; height: auto;">
                    </div>
                </div>
                <div class="text-1">{{ item.Title }} </div>
            </div>
            <img :src="URLbase64" style="width: 200px; height: auto; border: 1px solid black;">
        </div>
    </div>
</template>
  
<script setup >
import useSelect from '@/hooks/select';
import { reactive, } from 'vue'
import { v4 as uuid } from 'uuid';
const { fabric, mixinState, canvasEditor } = useSelect();
import LoadScene from '@/core/3D/loadScene.ts'
import GoodsInfo from '@/core/objects/goods/goodsInfo'
import picture from '@/api/picture'
import mitts from '@/utils/mitts'
import { setUserUploadFile } from '@/core/2D/handleImages.ts'
import guid from '@/utils/guiId.ts'
import baseUrl from '@/config/constants/baseUrl'
import { useStore } from 'vuex'
import { debounce } from 'lodash-es';
const load3DScene = new LoadScene()
const store = useStore()
const props = defineProps({
    sizeList: {
        type: Array,
        default: () => {
            return []
        }
    }
})
const URLbase64 = ref('')
const active = ref('')
const cutParts = computed(() => {
    return store.state.cutParts
})
const isSetSteps = computed(() => {
    return store.state.isSetSteps
})
const cutPartsType = computed(() => {
    return store.state.cutPartsType
})
const bgColor = computed(() => {
    return store.state.bgColor
})
const canvasObjects = computed(() => {
    return store.state.saveData.canvasObjects
})
const sizeGUID = computed(() => {
    return store.state.sizeGUID
})
const handelAllCuts = computed(() => {
    return store.state.handelAllCuts
})
const goodsId = computed(() => {
    return store.state.saveData.commodityInfo.GUID
})

watch(handelAllCuts, (newVal, oldVal) => {
    if (newVal) {
        setAllCuts(false)
    }
}, { immediate: true, deep: true });
watch(cutPartsType, (newVal, oldVal) => {
    if (newVal) {
        changeSelection()
    }
}, { immediate: true, deep: true });
watch(cutParts, (newVal, oldVal) => {
    if (newVal.length > 0) {
        loadCuts()
        changeSelection()
    }
}, { immediate: true, deep: true });
watch(bgColor, (newVal, oldVal) => {
    if (newVal.GUID) {
        setTimeout(() => {
            setAllCuts(true)
        }, 200);
    }
}, { immediate: true, deep: true });
watch(sizeGUID, (newVal, oldVal) => {
    if (newVal) {
        init(newVal)
    }
}, { immediate: true, deep: true });
const watchCanvas = () => {
    const fn = () => {
        const workspace = canvasEditor.canvas.getObjects().find((item) => item.id === 'workspace')
        const mask = canvasEditor.canvas.getObjects().find((item) => item.isMask)
        const objects = canvasEditor.canvas.getObjects()
        if (cutPartsType.value) {
            setAllCuts(false)
        }
    }
    canvasEditor.canvas.on('object:added', () => {
        console.log('added')
        fn()
    })
    canvasEditor.canvas.on('object:modified', () => {
        console.log('modified')
        fn()
    })
    canvasEditor.canvas.on('selection:created', (val) => {
        console.log('selection:created', val.selected[0])
        store.commit('setSelected', {})
        isSetSteps.value ? store.commit('setIsSetSteps', false) : ''
        if (val) store.commit('setSelected', val.selected[0])

    })
    canvasEditor.canvas.on('before:transform', (val) => {
        if (val.transform.target.tileParentId) {
            const obj = canvasEditor.canvas.getObjects().find(el => el.id == val.transform.target.tileParentId)
            canvasEditor.canvas.discardActiveObject();
            canvasEditor.canvas.setActiveObject(obj);
        }
        store.commit('setSelected', val.transform.target)
    })
    canvasEditor.canvas.on('object:removed', (val) => {
        canvasEditor.canvas.getObjects().forEach((el) => {
            if (val.target.isRepeat && el.tileParentId == val.target.id) {
                canvasEditor.canvas.remove(el)
            }
        })
        fn(isSetSteps.value)
    })
}
const setAllCuts = debounce((isColorChange) => {
    const objects = canvasEditor.canvas.getObjects().filter(el => el.isMask == undefined && el.id !== 'workspace' && el.id !== 'grid')
    if (cutPartsType.value) {
        let maskRect = canvasEditor.canvas.getObjects().find((item) => item.isMask);
        let ImagesList = {}
        cutParts.value.forEach(el => {
            ImagesList[el.Title] = {}
            ImagesList[el.Title].Images = []
        })
        isSetSteps ? '' : objects.forEach(el => {
            if (el.type == 'text' && el.cutPartsType == cutPartsType.value) {
                const FileName = guid() + '.png'
                console.log('FileName', FileName)
                el.clone(clone => {
                    clone.rotate(0);
                    clone.set({
                        angle: 0
                    })
                    const url = clone.toDataURL({
                        width: clone.width,
                        height: clone.height,
                        scaleX: clone.scaleX,
                        scaleY: clone.scaleY,
                        multiplier: 1,
                    })
                    el.FileName = FileName
                    el.FilePath = 'images_temp/' + FileName.substring(0, 1)
                    setUserUploadFile(url, FileName, 'images_temp/', null)
                })
            }
        });

        const fn = (objects, index, p, indexP = null) => {
            if (objects.length > 0) {
                objects[index].clone(cloned => {
                    cloned.rotate(0)
                    maskRect = canvasEditor.canvas.getObjects().find((item) => item.isMask);
                    const obj = {
                        Image_fullName: objects[index].FilePath + '/' + objects[index].FileName,
                        Image_width: (objects[index].width * objects[index].scaleX).toFixed(5) + '',
                        Image_height: (objects[index].height * objects[index].scaleY).toFixed(5) + '',
                        Image_left: (cloned.left - maskRect.left).toFixed(5) + '',
                        Image_top: (cloned.top - maskRect.top).toFixed(5) + '',
                        Image_angle: objects[index].angle.toFixed(5) + '',
                        Image_flipX: objects[index].flipX,
                        Image_flipY: objects[index].flipY,
                        Image_visible: objects[index].cutPartsType == p.Part_name
                    }
                    if (objects[index].customVisible === false) obj.Image_visible = false
                    ImagesList[p.Part_name].Images.push(obj)
                    if (objects[index + 1]) {
                        fn(objects, index + 1, p)
                    } else {
                        p.Images = ImagesList[p.Part_name].Images
                        setCutAllParts(p, p.Part_name.Title, indexP)
                    }
                })

            } else {
                p.Images = []
                setCutAllParts(p, p.Part_name.Title,indexP)
            }
        }
        if (!isColorChange) {
            let p = {
                SizeGUID: sizeGUID.value,
                Canvas_zoom: '0.07',
                Part_name: cutPartsType.value,
                Images: [],
                bgc_r: bgColor.value.R,
                bgc_g: bgColor.value.G,
                bgc_b: bgColor.value.B
            }
            fn(objects, 0, p)
        } else {
            store.commit('setsSmallLoad3d', true)
            console.log('setsSmallLoad3d', true)
            cutParts.value.forEach((element, indexP) => {
                let p = {
                    SizeGUID: sizeGUID.value,
                    Canvas_zoom: '0.07',
                    Part_name: element.Title,
                    Images: [],
                    bgc_r: bgColor.value.R,
                    bgc_g: bgColor.value.G,
                    bgc_b: bgColor.value.B
                }
                fn(objects, 0, p, indexP)

            })
        }
    }
}, 100)
const setCutAllParts = (p, Title, indexP = null) => {
    canvasEditor.fixedLayer()
    picture.setCutAllParts(p).then(res => {
        // console.log('总的剪裁参数', p)
        isSetSteps.value ? '' : store.commit('setSave')
        const color = 'rgb(' + bgColor.value.R + ',' + bgColor.value.G + ',' + bgColor.value.B + ')'
        const url = 'data:image/jpeg;base64,' + res.Tag[0].base64
        URLbase64.value = url
        load3DScene.setTexture(p.Part_name, url, () => {
            if (indexP) {
                if (!cutParts.value[indexP + 1]) {
                    store.commit('setsSmallLoad3d', false)
                    // console.log('store.commit('', false)')
                    console.log('false')
                }
            } else {
                store.commit('setsSmallLoad3d', false)
                // console.log('store.commit('', false)')
                console.log('false2')
            }
        })

    })
}

const init = (newVal) => {
    let arr = []
    picture.getCutParts({ SizeGUID: newVal }).then(res => {
        if (res.Tag[0]) {
            const modelInfo = {
                modelName: res.Tag[0].modelName,
                modelUrl: res.Tag[0].modelUrl,
                modelUrl_Path: res.Tag[0].modelUrl_Path,
            }
            store.commit('setModelInfo', modelInfo)
            res.Tag[0].Table.forEach(el => {
                arr.push({
                    Title: el.Title,
                    ImageUrl: el.ImageUrl,
                    ImageUrl_Path: el.ImageUrl_Path
                })
            })
            GoodsInfo.SizeGUID = newVal
            const color = 'rgb(' + bgColor.value.R + ',' + bgColor.value.G + ',' + bgColor.value.B + ')'
            LoadScene.loadModel(res.Tag[0].modelUrl, res.Tag[0].modelName, color)
        }
        store.commit('setCutParts', arr)
        store.commit('setCutPartsType', cutParts.value[0].Title)
        loadCanvasObject()
        setAllCuts(true)
        watchCanvas()
    })

}
// 加载裁片
const loadCuts = debounce(() => {
    console.log('loadCuts加载裁片')
    const objects = canvasEditor.canvas.getObjects().filter((item) => item.isMask !== undefined)
    store.commit('setIsSetSteps', true)
    objects.forEach(el => {
        canvasEditor.canvas.remove(el)
    })
    canvasEditor.canvas.requestRenderAll();
    const fn = (index) => {
        const workspace = canvasEditor.canvas.getObjects().find((item) => item.id === 'workspace')
        var img = new Image();
        const ImageUrl_Path = cutParts.value[index].ImageUrl_Path
        img.src = baseUrl + ImageUrl_Path
        img.onload = function () {
            var pattern = new fabric.Pattern({ source: img, repeat: 'repeat' });
            var maskRect = new fabric.Rect(
                {
                    scaleX: 0.07,
                    scaleY: 0.07,
                    width: img.width,
                    height: img.height,
                    fill: pattern,
                    opacity: 0.3,
                    hasControls: false,
                    selectable: false,
                    evented: false,
                    left: workspace.width / 2 - (img.width * 0.07) / 2,
                    top: workspace.height / 2 - (img.height * 0.07) / 2,
                });
            maskRect.name = cutParts.value[index].Title
            maskRect.cutPartsType = cutParts.value[index].Title
            maskRect.objectCaching = false
            maskRect.isMask = cutParts.value[index].Title == cutPartsType.value
            maskRect.visible = cutParts.value[index].Title == cutPartsType.value
            if (cutParts.value[index].Title == cutPartsType.value) {
                maskRect.clone((cloned) => {
                    const path = new fabric.Rect({ width: workspace.width, height: maskRect.height, top: maskRect.top, left: maskRect.left })
                    canvasEditor.canvas.clipPath = cloned;
                    canvasEditor.canvas.renderAll()
                    canvasEditor.canvas.requestRenderAll();
                });
            }
            canvasEditor.canvas.add(maskRect);
            canvasEditor.canvas.requestRenderAll();
            if (cutParts.value[index + 1] == undefined) {
                setAllCuts(true)
                store.commit('setPageLoading', false)
            } else {
                fn(index + 1)
            }
        };
    }
    fn(0)
}, 1000)
// 切换裁片
const changeSelection = () => {
    const activeObject = canvasEditor.canvas.getActiveObjects()[0]
    activeObject ? activeObject.cutPartsType == cutPartsType.value ? '' : canvasEditor.canvas.discardActiveObject() : ''
    load3DScene.setModelCamera(cutPartsType.value)
    const workspace = canvasEditor.canvas.getObjects().find((item) => item.id === 'workspace')
    active.value = cutPartsType.value
    cutPartsType.value = cutPartsType.value
    let maskRect
    const oldMask = canvasEditor.canvas.getObjects().find((item) => item.isMask)
    oldMask ? oldMask.isMask = false : ''
    canvasEditor.canvas.getObjects().forEach(el => {
        {
            if (el.cutPartsType == cutPartsType.value || el.id == 'grid') {
                el.visible = true
            } else if (el.id !== 'workspace') {
                el.visible = false
            }
            if (el.isMask !== undefined && el.cutPartsType == cutPartsType.value) {
                el.visible = true
                el.isMask = true
                maskRect = el
                maskRect.clone((cloned) => {
                    const path = new fabric.Rect({ width: workspace.width, height: maskRect.height, top: maskRect.top, left: maskRect.left })
                    canvasEditor.canvas.clipPath = cloned;
                    canvasEditor.canvas.renderAll()
                    canvasEditor.canvas.requestRenderAll();
                });
                // canvasEditor.canvas.requestRenderAll();
                // canvasEditor.canvas.remove(el)
            }
        }
    })
    // setAllCuts(true)
}
// 刷新加载对象
const loadCanvasObject = () => {
    console.log('刷新加载对象')
    store.commit('setIsSetSteps', true)
    console.log('setIsSetSteps', true)
    const fn = (obj, index) => {
        if (obj.type == 'image') {
            const imageURL = baseUrl + 'UserUploadFile/' + obj.FilePath + '/' + obj.FileName
            let callback = (image, isError) => {
                if (!isError) {
                    for (var key in obj) {
                        image[key] = obj[key]
                    }
                    if (obj.cutPartsType == cutPartsType.value) {
                        image.visible = true
                    } else {
                        image.visible = false
                    }
                    if (image.customVisible === false) image.visible = false
                    image.sendBackwards()
                    canvasEditor.canvas.add(image)
                    if (canvasObjects.value[index + 1]) {
                        fn(canvasObjects.value[index + 1], index + 1)
                    }

                }
            };
            const properties = {
                left: 100,
                top: 100
            };
            fabric.Image.fromURL(imageURL, callback, properties);
        } else if (obj.type === 'text') {
            addText(obj)
            if (canvasObjects.value[index + 1]) {
                fn(canvasObjects.value[index + 1], index + 1)
            }
        }
    }
    if (canvasObjects.value[0]) fn(canvasObjects.value[0], 0)
    const mask = canvasEditor.canvas.getObjects().find((item) => item.isMask)
    const backgroundImage = canvasEditor.canvas.getObjects().find((item) => item.isBackground)
    canvasEditor.canvas.bringToFront(mask)
    canvasEditor.canvas.sendToBack(backgroundImage)
    canvasEditor.canvas.requestRenderAll();
}
const addText = (option) => {
    const mask = canvasEditor.canvas.getObjects().find(el => el.isMask)
    const text = new fabric.IText(option.text, {
        type: 'text',
    });
    for (var key in option) {
        text[key] = option[key]
    }
    text.sendBackwards()
    canvasEditor.canvas.add(text)
};
</script>
<style lang="less">
.canvas-menu-1 {
    width: 70px;

    .btn {
        width: 70px;
        height: 30px;
        background: #FFFFFF;
        border-radius: 5px 5px 5px 5px;
        border: none;
        font-size: 14px;
        font-family: Source Han Sans CN-Medium, Source Han Sans CN;
        font-weight: 500;
        color: #3064F2;
        margin-bottom: 10px;
        cursor: pointer;

    }

    .btn-active {
        width: 70px;
        height: 30px;
        background: #FFFFFF;
        border-radius: 5px 5px 5px 5px;
        border: none;
        font-size: 14px;
        font-family: Source Han Sans CN-Medium, Source Han Sans CN;
        font-weight: 500;
        color: #3064F2;
        margin-bottom: 10px;
        cursor: pointer;
        border: 2px solid #3064F2;
    }

    .menu-list {
        width: 70px;
        background: #FFFFFF;
        border-radius: 5px 5px 5px 5px;
        padding: 10px 5px;
        text-align: center;
        font-size: 14px;
        font-family: Source Han Sans CN-Medium, Source Han Sans CN;
        font-weight: 500;
        color: #4E5969;

        .menu-item {
            cursor: pointer;
        }

        .image {
            width: 60px;
            height: 60px;
            background: #666661;
            border-radius: 5px 5px 5px 5px;
            border: 2px solid #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .active-image {
            border: 2px solid #3064F2;
            width: 60px;
            height: 60px;
            background: #DCE1E9;
            border-radius: 5px 5px 5px 5px;
            background: #666661;
            display: flex;
            align-items: center;
            justify-content: center;

        }

        .thumbnail {
            height: 37px;
            width: 30px;
            display: flex;
            align-items: center;
        }

        .text-1 {
            margin: 10px 0px;
        }
    }
}
</style>
  