<template>
    <div class="box">
        <div class="menu">
            <div @click="goBack">返回</div>
            <div @click="">恢复</div>
        </div>
        <div @click="text" style="height: 100px; width: 100px; background-color: aqua;"> 剪切</div>
        <div class="filter-box">
            <div class="filter-item" v-for="(value, key) in imageList" :key="key" @click=addItem(value.src)>
                <img :src="value.src" />
            </div>
        </div>
    </div>
</template>
  
<script setup >
import useSelect from '@/hooks/select';
import { v4 as uuid } from 'uuid';
import { uiType, paramsFilters, combinationFilters } from '@/config/constants/filter';
import { reactive } from 'vue'
const emit = defineEmits()
const { fabric, mixinState, canvasEditor } = useSelect();

const state = reactive({
    type: ''
});
const imageList = reactive([
    {
        id: '1',
        src: 'http://127.0.0.1:3000/src/assets/croping/未标题-1.jpg'

    }, {
        id: '2',
        src: 'http://127.0.0.1:3000/src/assets/croping/未标题-2.jpg'

    },
    {
        id: '3',
        src: 'http://127.0.0.1:3000/src/assets/croping/未标题-3.jpg'

    },
    {
        id: '4',
        src: 'http://127.0.0.1:3000/src/assets/croping/未标题-4.jpg'

    },
    {
        id: '5',
        src: 'http://127.0.0.1:3000/src/assets/croping/未标题-5.jpg'

    }
])
onMounted(() => {
    // console.log('mixinState', mixinState)
    // console.log('activeObject', activeObject)
})
const addItem = (src) => {
    mixinState.setIsClipping(true)
    clipImage()
    // console.log(activeObject)
    // imgToBase64(src).then(res => {
    //     if (res) {
    //         console.log('生成的base64图片', res)
    //         insertImgFile(res);
    //     }
    // }).catch(err => {
    //     console.log('这里是错误', err);
    // });
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
        let url = 'http://127.0.0.1:3000/src/assets/png/bg-01.png'

        fabric.util.loadImage(url, function (img) {
            clipBox.fill = new fabric.Pattern({
                source: img,
                repeat: 'no-repeat',
                offsetX: 0,
                offsetY: 0,

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
            mixinState.clipBox.on({
                'moving': () => {
                    console.log(999)
                    if (!mixinState.isClipping) {
                        clipBox.clipClone.left = clipBox.left - mixinState.clipLeft
                        clipBox.clipClone.top = clipBox.top - mixinState.clipTop
                        canvasEditor.canvas.renderAll()
                        return
                    }
                    let left = clipBox.left - clipBox.clipClone.left;
                    let top = clipBox.top - clipBox.clipClone.top;
                    mixinState.clipLeft = left
                    mixinState.clipTop = top
                    clipBox.fill.offsetX = -left / clipBox.clipClone.scaleX
                    clipBox.fill.offsetY = -top / clipBox.clipClone.scaleY
                    canvasEditor.canvas.renderAll();
                },
                'scaling': () => {
                    if (!mixinState.isClipping) {
                        clipBox.clipClone.left = clipBox.left - mixinState.clipLeft
                        clipBox.clipClone.top = clipBox.top - mixinState.clipTop
                        clipBox.clipClone.scaleX = clipBox.scaleX
                        clipBox.clipClone.scaleY = clipBox.scaleY
                        canvasEditor.canvas.renderAll()
                        return
                    }
                    // let _width = clipBox.width / clipBox.
                    let _width = clipBox.width * clipBox.scaleX / clipBox.clipClone.scaleX
                    let _height = clipBox.height * clipBox.scaleY / clipBox.clipClone.scaleY
                    let left = clipBox.left - clipBox.clipClone.left;
                    let top = clipBox.top - clipBox.clipClone.top;
                    mixinState.clipLeft = clipBox.left
                    mixinState.clipTop = clipBox.top
                    clipBox.fill.offsetX = -left / clipBox.clipClone.scaleX
                    clipBox.fill.offsetY = -top / clipBox.clipClone.scaleX
                    clipBox.scaleX = clipBox.clipClone.scaleX
                    clipBox.scaleY = clipBox.clipClone.scaleY
                    clipBox.width = _width
                    clipBox.height = _height
                    canvasEditor.canvas.renderAll();
                }
            })
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
  