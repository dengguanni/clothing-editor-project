<template>
    <div class="canvas-menu-1" v-if="cutParts.length > 0">
        <button @click="store.commit('setCutPartsType', '[整体设计]')"
            :class="active == '[整体设计]' ? 'btn-active' : 'btn'">整体设计</button>
        <div class="menu-list">
            <div v-for="item in cutParts" :key="item.Title" class="menu-item">
                <div :class="item.Title == active ? 'active-image' : 'image'"
                    @click="store.commit('setCutPartsType', item.Title)">
                    <div class="thumbnail">
                        <img :src="item.ImageUrl" style=" width: 40%;">
                    </div>
                </div>
                <div class="text-1">{{ item.Title }} </div>
            </div>
        </div>
        <!-- <img :src="testBase64" style="width: 300px;height: auto;"> -->
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
import guid from '@/utils/guiId.ts'
import baseUrl from '@/config/constants/baseUrl'
import MaximizePlugin from '@/core/plugin/MaximizePlugin.ts'
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
const repeatList = {
    basic: '基础平铺',
    mirror: '镜像平铺',
    transverse: '横向平铺',
    direction: '纵向平铺'
}
const overallDesignImage = 'http://8.140.206.30:8089/ImageSource/Other/WhiteBox.png'
let listenCanvas = false
const URLbase64 = ref('')
const active = ref('')
const isLoadAll = ref(false)
const testBase64 = computed(() => {
    return store.state.testBase64
})

const cutParts = computed(() => {
    return store.state.cutParts
})
const isShowCuts = computed(() => {
    return store.state.isShowCuts
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
const goodsId = computed(() => {
    return store.state.saveData.commodityInfo.GUID
})
const modelInfo = computed(() => {
    return store.state.saveData.modelInfo
})
const disableClipping = computed(() => {
    return store.state.disableClipping
})

watch(cutPartsType, (newVal, oldVal) => {
    if (newVal) {
        changeSelection()
    }
}, { deep: true });
watch(cutParts, (newVal, oldVal) => {
    if (newVal.length > 0) {
        loadCuts()
        changeSelection()
    }
}, { immediate: true, deep: true });
watch(sizeGUID, (newVal, oldVal) => {
    if (newVal) {
        init(newVal)
    }
}, { immediate: true, deep: true });

const watchCanvas = () => {
    console.log('监听')
    if (listenCanvas) return
    listenCanvas = true
    const fn = (ops, type) => {
        if (cutPartsType.value && !disableClipping.value && cutPartsType.value !== '[整体设计]' && !ops.tileParentId) {
            canvasEditor.setAllCuts(false)
        }

    }
    canvasEditor.canvas.on('object:added', (option) => {
        console.log('added', option)
        fn(option, 'add')
        canvasEditor.fixedLayer()
    })
    canvasEditor.canvas.on('object:modified', (option) => {
        console.log('modified')
        fn(option, 'modified')
    })
    canvasEditor.canvas.on('selection:created', (val) => {
        console.log('selection:created', val.selected[0])
        store.commit('setSelected', {})
        isSetSteps.value ? store.commit('setIsSetSteps', false) : ''
        if (val) store.commit('setSelected', val.selected[0])
    })
    canvasEditor.canvas.on('before:transform', (val) => {
        console.log('transform')
        if (val.transform.target.tileParentId) {
            const obj = canvasEditor.canvas.getObjects().find(el => el.id == val.transform.target.tileParentId)
            canvasEditor.canvas.discardActiveObject();
            obj && canvasEditor.canvas.setActiveObject(obj);
        }
        store.commit('setSelected', val.transform.target)
    })
    canvasEditor.canvas.on('object:removed', (val) => {
        console.log('removed')
        canvasEditor.canvas.getObjects().forEach((el) => {
            if (val.target.isRepeat && el.tileParentId == val.target.id) {
                canvasEditor.canvas.remove(el)
            }
        })
        fn(val, 'removed')
    })
}
// 获取裁片 模型信息 
const init = (newVal) => {
    const objects = canvasEditor.canvas.getObjects().filter((item) => item.id !== 'workspace')
    objects.forEach(el => canvasEditor.canvas.remove(el))
    let arr = []
    picture.getCutParts({ SizeGUID: newVal }).then(res => {
        if (res.Tag[0]) {
            const modelInfo = {
                modelName: res.Tag[0].modelName,
                modelUrl: res.Tag[0].modelUrl,
                modelUrl_Path: res.Tag[0].modelUrl_Path,
                MaskUrl_Path: res.Tag[0].MaskUrl_Path
            }
            store.commit('setModelInfo', modelInfo)
            res.Tag[0].Table.forEach(el => {
                arr.push({
                    Title: el.Title,
                    ImageUrl: el.ImageUrl,
                    ImageUrl_Path: el.ImageUrl_Path,
                    MaskUrl_Path: el.MaskUrl_Path
                })
            })
            let callback = () => {
                arr && store.commit('setCutParts', arr)
                cutParts.value[0] && store.commit('setCutPartsType', cutParts.value[0].Title)

            }
            LoadScene.loadModel(modelInfo.modelUrl, modelInfo.modelName, callback)
            GoodsInfo.SizeGUID = newVal
        }
        console.log('获取新裁片', arr)
        if (arr.length == 0) {
            ElMessage({
                showClose: true,
                message: '该尺码暂无裁片',
                type: 'error',
            })
            store.commit('setPageLoading', false)
        } else {
            canvasEditor.setAllCuts(true)
        }

    })
}
// 加载裁片
const loadCuts = debounce(() => {
    store.commit('setDisableClipping', true)
    store.commit('setSaveBtnDisabled', false)
    const workspace = canvasEditor.canvas.getObjects().find((item) => item.id === 'workspace')
    console.log(new Date().getMinutes() + '分' + new Date().getSeconds() + '秒' + new Date().getMilliseconds() + '毫秒', '开始加载裁片')
    const objects = canvasEditor.canvas.getObjects().filter(v => !(v.id == 'workspace' || v.isMask !== undefined || v.id == 'grid'))
    if (objects.length !== 0) store.commit('setPageLoading', false)
    store.commit('setIsSetSteps', true)
    objects.forEach(el => {
        canvasEditor.canvas.remove(el)
    })
    const properties1 = {
        left: 0,
        top: 0
    };
    let callback1 = (image, isError) => {
        image.opacity = 0
        image.cutPartsType = '[整体设计]'
        image.name = '[整体设计]'
        image.isMask = false
        image.isLock = true
        image.visible = false
        image.set({
            hasControls: false,
            selectable: false,
            evented: false,
            width: 703,
            height: 703,
            left: workspace.width / 2 - (image.width * 1) / 2,
            top: workspace.height / 2 - (image.height * 1) / 2,
        })
        canvasEditor.canvas.add(image)
    }
    fabric.Image.fromURL(overallDesignImage, callback1, properties1);
    let i = 0
    const fn = (index) => {

        const time = Date.parse(new Date())
        // const path = new fabric.Rect({ width: 703, height: 703, top: 0, left: 0 })

        const imageURL = baseUrl + cutParts.value[index].MaskUrl_Path
        let callback = (image, isError) => {
            image.set({
                scaleX: 1,
                scaleY: 1,
                width: image.width,
                height: image.height,
                opacity: 0.3,
                hasControls: false,
                selectable: false,
                evented: false,
                left: workspace.width / 2 - (image.width * 1) / 2,
                top: workspace.height / 2 - (image.height * 1) / 2,
            })
            image.name = cutParts.value[index].Title
            image.cutPartsType = cutParts.value[index].Title
            image.objectCaching = false
            image.isMask = cutParts.value[index].Title == cutPartsType.value
            image.visible = cutParts.value[index].Title == cutPartsType.value
            if (cutParts.value[index].Title == cutPartsType.value) {
                image.clone((cloned) => {
                    const path = new fabric.Rect({ width: image.width, height: image.height, top: image.top, left: image.left })
                    canvasEditor.canvas.clipPath = path;
                    canvasEditor.canvas.renderAll()
                    canvasEditor.canvas.requestRenderAll();
                });
            }
            canvasEditor.canvas.add(image)
            canvasEditor.canvas.requestRenderAll();
            i++
            if (i == cutParts.value.length) {
                console.log(new Date().getMinutes() + '分' + new Date().getSeconds() + '秒' + new Date().getMilliseconds() + '毫秒', '裁片加载结束')
                loadCanvasObject()
            }
        };
        const properties = {
            left: 100,
            top: 100
        };
        fabric.Image.fromURL(imageURL, callback, properties);

    }
    cutParts.value.forEach((el, index) => {
        fn(index)
    })
}, 1000)

// 切换裁片
const changeSelection = () => {
    canvasEditor.canvas.getObjects().forEach(el => {
        if (el.hasCropping) canvasEditor.canvas.remove(el)
    })
    const activeObject = canvasEditor.canvas.getActiveObjects()[0]
    activeObject ? activeObject.cutPartsType == cutPartsType.value ? '' : canvasEditor.canvas.discardActiveObject() : ''
    load3DScene.setModelCamera(cutPartsType.value)
    const workspace = canvasEditor.canvas.getObjects().find((item) => item.id === 'workspace')

    active.value = cutPartsType.value
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
                const path = new fabric.Rect({ width: maskRect.width, height: maskRect.height, top: maskRect.top, left: maskRect.left })
                canvasEditor.canvas.clipPath = path;
                isShowCuts.value ? el.visible = true : el.visible = false
                canvasEditor.canvas.renderAll()
                canvasEditor.canvas.requestRenderAll();

            }
        }
    })
    // !maskRect && (canvasEditor.canvas.clipPath = workspace);
    workspace.cutPartsType = ''
    canvasEditor.fixedLayer()
}
// 刷新加载对象
const loadCanvasObject = () => {
    store.commit('setIsSetSteps', true)
    store.commit('setDisableClipping', true)
    const objects = canvasEditor.canvas.getObjects().filter(v => !(v.id == 'workspace' || v.isMask !== undefined || v.id == 'grid'))
    objects.forEach(el => {
        canvasEditor.canvas.remove(el)
    })
    const fnEnd = () => {
        console.log('fnEnd', fnEnd)
        if (bgColor.value) {
            store.commit('setDisableClipping', false)
            canvasEditor.setAllCuts(true, () => {
                watchCanvas()
                setTimeout(() => {
                    store.commit('setSaveBtnDisabled', false)
                    store.commit('setIsSetSteps', false)
                    store.commit('setPageLoading', false)
                    canvasEditor.overallDesignPluginInit()
                }, 1000)
                console.log(new Date().getMinutes() + '分' + new Date().getSeconds() + '秒' + new Date().getMilliseconds() + '毫秒', '刷新加载对象添加完毕')
            })
        } else {
            console.log(new Date().getMinutes() + '分' + new Date().getSeconds() + '秒' + new Date().getMilliseconds() + '毫秒', '刷新加载对象(没有对象)')
            store.commit('setDisableClipping', false)
            watchCanvas()
            store.commit('setPageLoading', false)
            canvasEditor.overallDesignPluginInit()
        }

    }
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
                    image.filters = []
                    image.repeatType && canvasEditor.handelRepeat(repeatList[image.repeatType], image, true)
                    if (image.customVisible === false) image.visible = false
                    try {
                        canvasEditor.canvas.add(image)
                    } catch (error) {
                        if (canvasObjects.value[index + 1]) {
                            fn(canvasObjects.value[index + 1], index + 1)
                        } else {
                            fnEnd()
                        }
                    }

                    if (canvasObjects.value[index + 1]) {
                        fn(canvasObjects.value[index + 1], index + 1)
                    } else {
                        fnEnd()
                    }
                }
            };
            const properties = {
                left: 100,
                top: 100
            };
            obj.FilePath && fabric.Image.fromURL(imageURL, callback, properties);
        } else if (obj.type === 'text') {
            addText(obj)
            if (canvasObjects.value[index + 1]) {
                fn(canvasObjects.value[index + 1], index + 1)
            } else {
                fnEnd()
            }
        }
    }
    // store.commit('setPageLoading', false)
    console.log('(canvasObjects.value.length', canvasObjects.value.length, canvasObjects.value)
    if (canvasObjects.value.length > 0) {
        fn(canvasObjects.value[0], 0)
    } else {
        fnEnd()
    }


}
const addText = (option) => {
    const mask = canvasEditor.canvas.getObjects().find(el => el.isMask)
    const text = new fabric.IText(option.text, {
        type: 'text',
    });
    for (var key in option) {
        text[key] = option[key]
    }
    console.log('text option', option)
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
        height: 526px;
        overflow-x: hidden;
        overflow-y: scroll;
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
            width: 55px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .text-1 {
            margin: 10px 0px;
        }
    }
}
</style>
  