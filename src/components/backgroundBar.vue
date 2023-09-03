<template>
    <div class="background-bar">
        <Input prefix="ios-search" placeholder="图片名称/编号/标签" class="input-search" />
        <div class="line"></div>
        <div class="content">
            <!-- <img class="item" src="src\assets\png\bg-01.png" alt="1" @click="addItem" @dragend="dragItem"> -->
            <!-- <img class="item" src="src\assets\png\bg-o2.png" alt="2"> -->
            <!-- <div class="item" v-for="item in imageList" :key="item"></div> -->
        </div>
        <div class="page">
            <div class="content">
                <Icon type="ios-arrow-back" size="15" color="#DCE1E9" />
                <div><Input v-model="page" placeholder="1" /></div>
                <div class="all-page">/ {{ 122 }}</div>
                <Icon type="ios-arrow-forward" size="15" color="#3064F2 " />
            </div>
        </div>
    </div>
</template>
<script setup>
import { Input } from 'view-ui-plus'
import { reactive } from 'vue'
import { getImgStr, selectFiles } from '@/utils/utils';
import useSelect from '@/hooks/select';
import { v4 as uuid } from 'uuid';
const props = defineProps({
    isBg: {
        type: Boolean,
        default: false
    }
})
const { fabric, canvasEditor } = useSelect();
const page = ref(1)
const imageList = reactive([1, 23, 4, 5, 6, 67, 8, 9, 0, 27])
const addItem = () => {

    imgToBase64('http://127.0.0.1:3000/src/assets/png/bg-01.png').then(res => {
        if (res) {
            console.log('生成的base64图片', res)
            insertImgFile(res);
        }
    }).catch(err => {
        console.log('这里是错误', err);
    });
}
const dragItem = (e) => {
    if (!props.isBg) {
        imgToBase64('http://127.0.0.1:3000/src/assets/png/bg-01.png').then(res => {
            if (res) {
                console.log('生成的base64图片', res)
                const imgEl = document.createElement('img');
                imgEl.src = res;
                // 插入页面
                document.body.appendChild(imgEl);
                imgEl.onload = () => {
                    // 创建图片对象
                    const imgInstance = new fabric.Image(imgEl, {
                        id: uuid(),
                        name: '图片1'
                    });
                    canvasEditor.dragAddItem(e, imgInstance);
                    imgEl.remove();
                };
            }
        }).catch(err => {
            console.log('这里是错误', err);
        });
    }

}
const insertImg = () => {
    selectFiles({ accept: 'image/*', multiple: true }).then((fileList) => {
        Array.from(fileList).forEach((item) => {
            getImgStr(item).then((file) => {
                insertImgFile(file);
            });
        });
    });
}
const imageLoad = () => {
    const canvas = new fabric.Canvas("canvas");
    canvas.setBackgroundColor("rgb(100,200,200)");
    const imgElement = document.getElementById("img");
    const imgInstance = new fabric.Image(imgElement, {
        left: 100,
        top: 100,
        angle: 45,
    });
    console.log(imgInstance);
    canvas.add(imgInstance);
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

// 插入图片文件
function insertImgFile(file) {
    if (!file) throw new Error('file is undefined');
    let imgInstance
    const imgEl = document.createElement('img');
    imgEl.src = file;
    // 插入页面
    document.body.appendChild(imgEl);
    if (props.isBg) {
        // 创建图片对象
        imgInstance = new fabric.Image(imgEl, {
            id: 1,
            name: '背景图'
        })
        // 设置缩放
        imgInstance.scaleX = 703 / imgInstance.width;
        // 设置图片背景在竖直方向上的缩放比例
        imgInstance.scaleY = 703 / imgInstance.height;
    } else {
        imgInstance = new fabric.Image(imgEl, {
            id: uuid(),
            name: '图片1',
            left: 250,
            top: 250,
        })
    }
    imgEl.onload = () => {
        canvasEditor.canvas.add(imgInstance);
       
        canvasEditor.canvas.setActiveObject(imgInstance);
        canvasEditor.canvas.renderAll();
        // 删除页面中的图片元素
        imgEl.remove();
        
    };
}
</script>
<style lang="less" scoped>
.background-bar {
    height: 100%;
    width: 100%;
    padding: 10px 20px 0px 20px;
    overflow: hidden;

    .page {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 44px;
        position: absolute;
        bottom: 29px;
        left: 20px;

        .content {
            display: flex;
            align-items: center;
            font-size: 12px;
            color: #4E5969;
            font-weight: 500;

            .all-page {
                margin: 0px 4px 0px 5px;
            }

            /deep/.ivu-input {
                width: 50px;
                height: 24px;
                background: #FFFFFF;
                border-radius: 12px 12px 12px 12px;
                border: 1px solid #DCE1E9;
                padding-left: 20px;
                margin-left: 4px;
            }
        }
    }

    .content {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        .item {
            height: 135px;
            width: 135px;
            border: 1px solid #DCE1E9;
            border-radius: 5%;
            margin-bottom: 10px;
        }
    }



    .line {
        width: 100%;
        height: 0px;
        border: 1px solid #DCE1E9;
        margin: 10px 0px;
    }

    .input-search {
        height: 32px;
        background: #FFFFFF;
        border-radius: 16px 16px 16px 16px;
        border: 1px solid #DCE1E9;

        /deep/.ivu-input {
            height: 32px;
            background: #FFFFFF;
            border-radius: 16px 16px 16px 16px;
            border: 1px solid #DCE1E9;
        }
    }
}
</style>