<template>
    <div class="canvas-menu-1" v-if="cutParts.length > 0">
        <!-- <button @click="changeSelection(0)" :class="0 == active ? 'btn-active' : 'btn'">整体设计</button> -->
        <div class="menu-list">
            <div v-for="item in cutParts" :key="item.Title" class="menu-item">
                <div :class="item.Title == active ? 'active-image' : 'image'" @click="changeSelection(item)">
                    <div class="thumbnail">
                        <img :src="item.ImageUrl" style="width: 100%; height: auto;">
                    </div>
                </div>
                <div class="text-1">{{ item.Title }} </div>
            </div>
            <img :src="URLbase64" style="width: 200px; height: 200px; border: 1px solid black;">
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
const store = useStore()
const cutPartsType = computed(() => {
    return store.state.saveData.cutPartsType
})
// import { setAllCuts } from '@/core/2D/handleImages.ts'
const props = defineProps({
    sizeList: {
        type: Array,
        default: () => {
            return []
        }
    }
})
const URLbase64 = ref('')
const load3DScene = new LoadScene()
const active = ref('')
let cutParts = ref([])
// let bgColor = ref('')
const bgColor = computed(() => {
    return store.state.saveData.commodityInfo.bgColor
})
const canvasObjects = computed(() => {
    return store.state.saveData.canvasObjects
})
const sizeGUID = computed(() => {
    return store.state.saveData.commodityInfo.sizeGUID
})
const handelAllCuts = computed(() => {
    return store.state.handelAllCuts
})
watch(handelAllCuts, (newVal, oldVal) => {
    if (newVal) {
        setAllCuts()
        console.log('变了')
    }
}, { immediate: true, deep: true });
watch(bgColor, (newVal, oldVal) => {
    if (newVal) {
        bgColor.value = { ...newVal }
        setTimeout(() => {
            setAllCuts()
        }, 100);
    }
}, { immediate: true, deep: true });
watch(sizeGUID, (newVal, oldVal) => {
    if (newVal) {
        init(newVal)
    }
}, { immediate: true, deep: true });
onUnmounted(() => {
})

onMounted(() => {
    watchCanvas()

})
const watchCanvas = () => {
    const fn = () => {
        const workspace = canvasEditor.canvas.getObjects().find((item) => item.id === 'workspace')
        const mask = canvasEditor.canvas.getObjects().find((item) => item.isMask)
        const objects = canvasEditor.canvas.getObjects()
        let hasText = false
        objects.forEach(el => {
            if (el.type == 'text' && el.cutPartsType == cutPartsType.value) {
                hasText = true
                const FileName = guid() + '.png'
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
                    let callback = () => {
                        if (cutPartsType.value) {
                            setAllCuts()
                        }
                    }
                    setUserUploadFile(url, FileName, 'images_temp/', callback)
                })


            }
        })
        if (cutPartsType.value && !hasText) {
            setAllCuts()
        }
    }
    setTimeout(() => {
        canvasEditor.canvas.on('object:added', () => {
            console.log('added')
            fn()
        })
        canvasEditor.canvas.on('object:modified', () => {
            console.log('modified')
            fn()
        })
        canvasEditor.canvas.on('object:removed', () => {
            console.log('removed')
            fn()
        })
    }, 1500);
    // canvasEditor.canvas.on('object:removed', () => {
    //     // upDateTexture()
    // })
}
const setAllCuts = () => {
    const objects = canvasEditor.canvas.getObjects().filter(el => el.cutPartsType == cutPartsType.value && !el.isMask && el.id !== 'workspace' && el.id !== 'grid')
    console.log('objects', objects)
    if (cutPartsType.value) {
        const maskRect = canvasEditor.canvas.getObjects().find((item) => item.isMask);
        const workspace = canvasEditor.canvas.getObjects().find((item) => item.id === 'workspace')
        const mask = canvasEditor.canvas.getActiveObjects()[0]
        let p = {
            SizeGUID: sizeGUID.value,
            Canvas_zoom: '0.07',
            Part_name: cutPartsType.value,
            Images: [],
            bgc_r: bgColor.value.R,
            bgc_g: bgColor.value.G,
            bgc_b: bgColor.value.B
        }
        if (objects.length > 0) {
            objects.forEach(image => {
                if (image.id !== 'workspace') {
                    console.log('image', image)
                    image.clone(cloned => {
                        cloned.rotate(0)
                        console.log('cloned', cloned)
                        console.log('maskRect.top', maskRect.top, 'top', top)
                        const obj = {
                            Image_fullName: image.FilePath + '/' + image.FileName,
                            Image_width: (image.width * image.scaleX).toFixed(5) + '',
                            Image_height: (image.height * image.scaleY).toFixed(5) + '',
                            Image_left: (cloned.left - maskRect.left).toFixed(5) + '',
                            Image_top: (cloned.top - maskRect.top).toFixed(5) + '',
                            Image_angle: image.angle.toFixed(5) + ''
                        }
                        p.Images.push(obj)
                        setCutAllParts(p)
                    })
                }
            })
        } else {
            setCutAllParts(p)
        }


    }
}

const setCutAllParts = debounce((p) => {
    picture.setCutAllParts(p).then(res => {
        console.log('总的剪裁参数', p)
        const color = 'rgb(' + bgColor.value.R + ',' + bgColor.value.G + ',' + bgColor.value.B + ')'
        load3DScene.setModelColor(color, null)
        const url = 'data:image/jpeg;base64,' + res.Tag[0].base64
        URLbase64.value = url
        LoadScene.setTexture(cutPartsType.value, url)
    })
}, 500)
const init = (newVal) => {
    let arr = []
    picture.getCutParts({ SizeGUID: newVal }).then(res => {
        if (res.Tag[0]) {
            const modelInfo = {
                modelName: res.Tag[0].modelName,
                modelUrl: res.Tag[0].modelUrl,
                modelUrl_Path: res.Tag[0].modelUrl_Path
            }
            store.commit('setModelInfo', modelInfo)
            res.Tag[0].Table.forEach(el => {
                arr.push({
                    Title: el.Title,
                    ImageUrl: el.ImageUrl,
                    ImageUrl_Path: el.ImageUrl_Path
                })
                // LoadScene.loadModel('' + res.Tag[0]['3d'], res.Tag[0].modelName)
            })
            GoodsInfo.SizeGUID = newVal
            const color = 'rgb(' + bgColor.value.R + ',' + bgColor.value.G + ',' + bgColor.value.B + ')'
            LoadScene.loadModel(res.Tag[0].modelUrl, res.Tag[0].modelName, color)
        }
        cutParts.value = [...arr]
        store.commit('setCutPartsType', cutParts.value[0].Title)
        store.commit('setCutParts', arr)
        changeSelection(arr[0])
    })

}
const upDateTexture = () => {
    const workspace = canvasEditor.canvas.getObjects().find((item) => item.id === 'workspace')
    const mask = canvasEditor.canvas.getObjects().find((item) => item.isMask)
    if (cutPartsType.value) {
        // workspace.visible = false
        // mask.visible = false
        // canvasEditor.canvas.requestRenderAll();
        LoadScene.setTexture(cutPartsType.value, '', () => {
            // workspace.visible = true
            // mask.visible = true
            // canvasEditor.canvas.requestRenderAll();
        })
    }
}
const changeSelection = (item) => {
    store.commit('setCutPartsType', item.Title)
    load3DScene.setModelCamera(item.Title)
    const workspace = canvasEditor.canvas.getObjects().find((item) => item.id === 'workspace')
    active.value = item.Title
    cutPartsType.value = item.Title
    canvasEditor.canvas.getObjects().map(el => {
        {
            if (el.isCutPart) {
                canvasEditor.canvas.remove(el)
            }
            if (el.cutPartsType == cutPartsType.value) {
                el.visible = true
            } else if (el.id !== 'workspace') {
                el.visible = false
            }
        }
    })
    var img = new Image();
    img.src = baseUrl + item.ImageUrl_Path
    workspace.clone((cloned) => {
        canvasEditor.canvas.clipPath = cloned;
        canvasEditor.canvas.requestRenderAll();
    });
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
        maskRect.name = item.Title
        maskRect.cutPartsType = item.Title
        maskRect.isCutPart = true
        maskRect.objectCaching = false
        maskRect.isMask = true
        // maskRect.hasCropping = true
        canvasEditor.canvas.add(maskRect);
        canvasEditor.canvas.discardActiveObject();

        // const info = canvasEditor.canvas.getObjects().find((item) => item.isMask);
        // canvasEditor.canvas.centerObject(info)
        canvasEditor.canvas.requestRenderAll();
        maskRect.clone((cloned) => {
            const path = new fabric.Rect({ width: workspace.width, height: maskRect.height, top: maskRect.top, left: maskRect.left })
            canvasEditor.canvas.clipPath = cloned;
            canvasEditor.canvas.renderAll()
            canvasEditor.canvas.requestRenderAll();
        });
        const mask = canvasEditor.canvas.getObjects().find((item) => item.isMask)
        // loadCanvasObject()
        LoadScene.setTexture(item.Title, '', () => {

        })
    };
    const loadCanvasObject = () => {
        canvasObjects.value.forEach(el => {
            console.log('el', el)
            canvasEditor.canvas.add(el)
        })
        canvasEditor.canvas.requestRenderAll();
    }

}
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
  