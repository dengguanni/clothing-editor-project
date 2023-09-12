<template>
    <div class="canvas-menu-1">
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
        </div>
    </div>
</template>
  
<script setup >
import useSelect from '@/hooks/select';
import { reactive } from 'vue'
import { v4 as uuid } from 'uuid';
const { fabric, mixinState, canvasEditor } = useSelect();
import LoadScene from '@/core/3D/loadScene.ts'
import picture from '@/api/picture'
import mitts from '@/utils/mitts'
let cutPartsType = ref('')
const baseUrl = 'http://8.140.206.30:8089/'
const props = defineProps({
    sizeList: {
        type: Array,
        default: () => {
            return []
        }
    }
})
const load3DScene = new LoadScene()
const active = ref('')
let cutParts = ref([])
onMounted(() => {
    mitts.on('changeSize', (e) => {
        console.log('on')
        let arr = []
        picture.getCutParts({ SizeGUID: e.GUID }).then(res => {
            if (res.Tag[0]) {
                res.Tag[0].Table.forEach(el => {
                    arr.push({
                        Title: el.Title,
                        ImageUrl: baseUrl + el.ImageUrl
                    })
                    // LoadScene.loadModel('' + res.Tag[0]['3d'], res.Tag[0].modelName)
                    LoadScene.loadModel(res.Tag[0].modelUrl, res.Tag[0].modelName)
                })
            }
            cutParts.value = [...arr]
            cutPartsType.value = cutParts.value[0].Title
            mitts.emit('cutPartsType', cutPartsType.value)
            mitts.emit('cutParts', cutParts.value)
        })
    })
})
const changeSelection = (item) => {
    const workspace = canvasEditor.canvas.getObjects().find((item) => item.id === 'workspace')
    active.value = item.Title
    console.log('canvasEditor.canvas.getObjects()', canvasEditor.canvas.getObjects())
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
    let callback = (image, isError) => {
        if (!isError) {

            // 超出画布不展示
            workspace.clone((cloned) => {
                canvasEditor.canvas.clipPath = cloned;
                canvasEditor.canvas.requestRenderAll();
            });
            image.hasCropping = true
            image.id = uuid()
            image.name = item.Title
            image.cutPartsType = item.Title
            image.isCutPart = true
            canvasEditor.canvas.add(image);
            const info = canvasEditor.canvas.getObjects().find((item) => item.id === image.id);
            canvasEditor.canvas.discardActiveObject();
            canvasEditor.canvas.setActiveObject(info);
            canvasEditor.canvas.requestRenderAll();
            canvasEditor.position('center')
            cutPartsType.value = item.Title
            // CutParts.cutPartsType = item.Title
            console.log('item.Title', item.Title)
            mitts.emit('cutPartsType', item.Title)

            image.clone((cloned) => {
                const path = new fabric.Rect({ width: workspace.width, height: image.height, top: image.top, left: image.left })
                console.log('image.clipPath', image.clipPath)
                console.log('workspace', workspace.clipPath)
                canvasEditor.canvas.clipPath = cloned;
                canvasEditor.canvas.renderAll()
                canvasEditor.canvas.requestRenderAll();
            });
        }
    };
    const properties = {
        left: 0,
        top: 0,
        "scaleX": 0.0761,
        "scaleY": 0.0761,
    };
    fabric.Image.fromURL(item.ImageUrl, callback, properties);
    // load3DScene.setModelCamera()
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
  