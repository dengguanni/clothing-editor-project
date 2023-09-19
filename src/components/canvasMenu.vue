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
        </div>
    </div>
</template>
  
<script setup >
import useSelect from '@/hooks/select';
import { reactive, } from 'vue'
import { v4 as uuid } from 'uuid';
const { fabric, mixinState, canvasEditor } = useSelect();
import LoadScene from '@/core/3D/loadScene.ts'
import picture from '@/api/picture'
import mitts from '@/utils/mitts'
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
let cutPartsType = ref('')

onUnmounted(() => {
    mitts.off('changeSize', '')
})
onMounted(() => {
    init()
    setTimeout(() => {
        canvasEditor.canvas.on('mouse:up', () => {
            const workspace = canvasEditor.canvas.getObjects().find((item) => item.id === 'workspace')
            const mask = canvasEditor.canvas.getObjects().find((item) => item.isMask)
            if (cutPartsType.value) {
                // workspace.visible = false
                // mask.visible = false
                // canvasEditor.canvas.requestRenderAll();
                LoadScene.setTexture(cutPartsType.value, 'http://127.0.0.1:3000/src/assets/png/xingqiu.png', () => {
                    // workspace.visible = true
                    // mask.visible = true
                    // canvasEditor.canvas.requestRenderAll();
                })
            }
        })
        canvasEditor.canvas.on('mouse:up', () => {
            // upDateTexture()
        })
        canvasEditor.canvas.on('dragover', () => {
            // upDateTexture()
        })
        canvasEditor.canvas.on('object:removed', () => {
            // upDateTexture()
        })
    }, 1000);

})
const init = () => {
    mitts.on('changeSize', (e) => {
        console.log('on')
        let arr = []
        picture.getCutParts({ SizeGUID: e.GUID }).then(res => {
            console.log('123456', res.Tag[0])
            if (res.Tag[0]) {
                res.Tag[0].Table.forEach(el => {
                    arr.push({
                        Title: el.Title,
                        ImageUrl: el.ImageUrl,
                        ImageUrl_Path: el.ImageUrl_Path
                    })
                    // LoadScene.loadModel('' + res.Tag[0]['3d'], res.Tag[0].modelName)
                })
                LoadScene.loadModel(res.Tag[0].modelUrl, res.Tag[0].modelName)
            }
            cutParts.value = [...arr]
            cutPartsType.value = cutParts.value[0].Title
            mitts.emit('cutPartsType', cutPartsType.value)
            mitts.emit('cutParts', cutParts.value)
            changeSelection(arr[0])
        })

    })
}
const upDateTexture = () => {
    const workspace = canvasEditor.canvas.getObjects().find((item) => item.id === 'workspace')
    const mask = canvasEditor.canvas.getObjects().find((item) => item.isMask)
    if (cutPartsType.value) {
        // workspace.visible = false
        // mask.visible = false
        // canvasEditor.canvas.requestRenderAll();
        LoadScene.setTexture(cutPartsType.value, 'http://127.0.0.1:3000/src/assets/png/xingqiu.png', () => {
            // workspace.visible = true
            // mask.visible = true
            // canvasEditor.canvas.requestRenderAll();
        })
    }
}
const changeSelection = (item) => {
    mitts.emit('cutPartsType', item.Title)
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
    img.src = 'http://192.168.1.3/' + item.ImageUrl_Path
    // img.src = 'src/assets/png/01前片.jpg'
    workspace.clone((cloned) => {
        canvasEditor.canvas.clipPath = cloned;
        canvasEditor.canvas.requestRenderAll();
    });
    img.onload = function () {
        var pattern = new fabric.Pattern({ source: img, repeat: 'repeat' });
        var maskRect = new fabric.Rect(
            {
                scaleX: 0.08,
                scaleY: 0.08,
                width: img.width,
                height: img.height,
                fill: pattern,
                opacity: 0.3,
                hasControls: false,
                selectable: false,
                evented: false,
                left: workspace.width / 2 - (img.width * 0.08) / 2,
                top: workspace.height / 2 - (img.height * 0.08) / 2,
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
        // workspace.visible = false
        // mask.visible = false
        // canvasEditor.canvas.requestRenderAll();
        // const url = canvasEditor.saveImg()
        LoadScene.setTexture(item.Title, 'http://127.0.0.1:3000/src/assets/png/xingqiu.png', () => {

        })
    };

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
  