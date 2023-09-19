<template>
    <div class="background-bar" v-loading="loading">
        <Input prefix="ios-search" placeholder="图片名称/编号/标签" class="input-search" v-model="queryKeyWord"
            @keyup.enter="searchImg" />
        <div class="line"></div>
        <div class="content">
            <img class="item" src="src/assets/png/xingqiu.png" alt="1" @dragend="dragItem" />
            <img class="item" :src="item.ImageUrl" v-for="item in imageList" :key="item.GUID" @click="addItem(item)"
                @dragend="dragItem">
        </div>
        <!-- <div class="page">
            <div class="content">
                <Icon type="ios-arrow-back" size="15" color="#DCE1E9" />
                <div><Input v-model="page" placeholder="1" /></div>
                <div class="all-page">/ {{ 122 }}</div>
                <Icon type="ios-arrow-forward" size="15" color="#3064F2 " />
            </div>
        </div> -->
    </div>
</template>
<script setup>
import { Input } from 'view-ui-plus'
import { reactive, onMounted } from 'vue'
import { getImgStr, selectFiles } from '@/utils/utils';
import useSelect from '@/hooks/select';
import { ElMessage } from 'element-plus';
import { v4 as uuid } from 'uuid';
import getPicture from '@/api/picture.ts'
import mitts from '@/utils/mitts'
import LoadScene from '@/core/3D/loadScene.ts'
const fakeInfo = ref({ ImageUrl: 'http://192.168.1.3/src/assets/png/xingqiu.png', Title: 'xingqiu', FileName: '', FilePath: '' })
const props = defineProps({
    isBg: {
        type: Boolean,
        default: false
    }
})
let loading = ref(true)
const { fabric, canvasEditor } = useSelect();
const page = ref(1)
const imageList = ref([])
let queryKeyWord = ref('')
const cutPartsType = ref('')
onMounted(() => {
    init()
})
const init = () => {
    mitts.on('cutPartsType', (val) => {
        cutPartsType.value = val
    })
    props.isBg ? getImagesBackground('') : getImagesLibrary('')
}
const getImagesBackground = (QueryKeyWord) => {
    loading.value = true
    const p = {
        QueryKeyWord: QueryKeyWord
    }
    getPicture.getImagesBackground(p).then(res => {
        imageList.value = [...res.Tag[0].Table]
        loading.value = false
    }).catch(err => {
        loading.value = false
    })
}
// 搜索
const searchImg = () => {
    props.isBg ? getImagesBackground(queryKeyWord.value) : getImagesLibrary(queryKeyWord.value)
}
// 图库
const getImagesLibrary = (QueryKeyWord) => {
    loading.value = true
    const p = {
        QueryKeyWord: QueryKeyWord
    }
    getPicture.getImagesLibrary(p).then(res => {
        imageList.value = [...res.Tag[0].Table]
        loading.value = false
        console.log('imageList', imageList.value)
    }).catch(err => {
        loading.value = false
    })

}
const upDateTexture = () => {
    const workspace = canvasEditor.canvas.getObjects().find((item) => item.id === 'workspace')
    const mask = canvasEditor.canvas.getObjects().find((item) => item.isMask)
    if (cutPartsType.value) {
        console.log('添加运行')
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

// 点击添加
const addItem = (item) => {
    if (!cutPartsType.value) {
        ElMessage({
            showClose: true,
            message: '请先选择版型',
            type: 'error',
        })
    } else {
        const maskRect = canvasEditor.canvas.getObjects().find((item) => item.isMask);
        const imageURL = 'http://192.168.1.3/' + item.ImageUrl_Path;
        let callback = (image, isError) => {
            if (!isError) {
                image.name = item.Title
                image.cutPartsType = cutPartsType.value
                image.crossOrigin = "anonymous"
                image.id = uuid()
                image.ImageUrl = item.ImageUrl
                image.name = item.FileName
                image.FilePath = item.FilePath
                image.mask = maskRect
                canvasEditor.canvas.add(image);
                const info = canvasEditor.canvas.getObjects().find((item) => item.id === image.id);
                canvasEditor.canvas.bringToFront(maskRect)
                canvasEditor.canvas.discardActiveObject();
                canvasEditor.canvas.setActiveObject(info);
                canvasEditor.canvas.requestRenderAll();

            }
            console.log('isError', isError)
        };
        const properties = {
            left: 100,
            top: 100
        };
        fabric.Image.fromURL(imageURL, callback, properties);
    }

}
// 拖拽添加
const dragItem = (event) => {
    if (!props.isBg) {
        const URL = event.toElement.currentSrc;
        const imageURL = URL.replace('http://8.140.206.30:8089/', 'http://192.168.1.3/')
        // const imageURL = 'http://192.168.1.3/' + 'UploadFile/images_library/654db8d2-4bd2-11ee-b1c4-00163e10d08e.png'
        console.log('imageURL', imageURL)
        console.log('event', event)
        let callback = (image, isError) => {
            if (!isError) {
                const { left, top } = canvasEditor.canvas.getSelectionElement().getBoundingClientRect();
                if (event.x < left || event.y < top || image.width === undefined) return;
                const point = {
                    x: event.x - left,
                    y: event.y - top,
                };
                const pointerVpt = canvasEditor.canvas.restorePointerVpt(point);
                image.id = uuid()
                // image.name = item.FileName
                // image.FilePath = item.FilePath
                image.cutPartsType = cutPartsType.value
                console.log('image.cutPartsType', image.cutPartsType)
                image.left = pointerVpt.x - image.width / 2;
                image.top = pointerVpt.y - image.width / 2;
                canvasEditor.canvas.add(image);
                const info = canvasEditor.canvas.getObjects().find((item) => item.id === image.id);
                canvasEditor.canvas.discardActiveObject();
                canvasEditor.canvas.setActiveObject(info);
                canvasEditor.canvas.requestRenderAll();
                upDateTexture()
            }
        };

        const properties = {
            left: 0,
            top: 0
        };
        if (!cutPartsType.value) {
            ElMessage({
                showClose: true,
                message: '请先选择版型',
                type: 'error',
            })
        } else {
            fabric.Image.fromURL(imageURL, callback, properties);
        }


    }

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
            border-radius: 5%;
            margin-bottom: 10px;
            cursor: pointer;

            &hover {
                border: 1px solid #4E5969;
            }
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