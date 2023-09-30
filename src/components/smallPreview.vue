<template>
    <div class="bg" v-show="cutPartsType">
        <div class="small-preview">
            <div class="change-mode">
                <div class="btn-box">
                    <button :class="is3D ? 'btn-active' : 'btn'" @click="changeMode()">3D</button>
                    <button :class="!is3D ? 'btn-active' : 'btn'" @click="changeMode()">2D</button>
                </div>
            </div>
            <!-- <div class="content"> -->
            <Carousel v-model="carousel" :radius-dot="true" loop dots="outside" :height="280" arrow="always" v-if="!is3D">
                <CarouselItem v-for="(item, index ) in screenshotList" :key="item.id" style="height: 280px; width: 280px;"
                    v-loading="loadScreenshotList">
                    <img :src="item.src" style="height: 280px; width: 280px;" />
                </CarouselItem>
            </Carousel>
            <div v-show="is3D" class="preview-3d" id="small-3d" v-loading="load3d"></div>
            <!-- </div> -->
            <button class="preview" @click="preview">预览</button>
        </div>
    </div>
    <div class="shadow"></div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, reactive, onBeforeMount } from 'vue'
import { Carousel } from 'view-ui-plus'
import LoadScene from '@/core/3D/loadScene.ts'
import GoodsInfo from '@/core/objects/goods/goodsInfo'
import mitts from '@/utils/mitts.js';
import { useStore } from 'vuex'
const store = useStore()
const cutPartsType = computed(() => {
    return store.state.saveData.cutPartsType
})
const load3DScene = new LoadScene()
let screenshotList = reactive([])
let scene, renderer, camera
const emit = defineEmits()
let is3D = ref(true)
let carousel = ref(0)
const load3d = ref(true)
const loadScreenshotList = ref(true)
const changeMode = () => {
    is3D.value = !is3D.value
    if (!is3D.value) {
        screenshotList = []
        let arr = LoadScene.getImages()
        arr.forEach(element => {
            screenshotList.push(element)
        });
    }
}
const preview = () => {
    emit('preview', is3D.value)
}

onMounted(() => {
    // const modelColor = GoodsInfo.modelColorList[0]
    // load3DScene.setModelColor('rgb(' + modelColor.R + ',' + modelColor.G + ',' + modelColor.B + ')', () => {
    //     screenshotList = []
    //     let arr = LoadScene.getImages()
    //     arr.forEach(element => {
    //         screenshotList.push(element)
    //     });
    // })
    load3DScene.init(scene, camera, renderer, 'small-3d', () => {
        screenshotList = []
        let arr = LoadScene.setCameraAngle()
        arr.forEach(element => {
            screenshotList.push(element)
        });
        load3d.value = false
        loadScreenshotList.value = false
    })

})
onUnmounted(() => {
    load3DScene.destroyScene()
})

// 截图
const saveAsPNG = () => {
    let image = new Image();
    renderer.render(scene, camera);//renderer为three.js里的渲染器，scene为场景 camera为相机
    let imgData = renderer.domElement.toDataURL("image/jpeg");
    image.src = imgData;
    img.value = imgData
    // document.getElementById('aaa').appendChild(image)
    console.log('imgData', imgData)
    //return canvas.toDataURL('image/bmp');//bmp有些浏览器不支持
}
const downLoad = (url) => {
    let fd = document.createElement('a');
    fd.download = '截图文件';//默认名是下载
    fd.href = url;
    document.body.appendChild(fd);
    fd.click();
    fd.remove();
}


</script>
<style lang="less" scoped>
.bg {
    height: 311px;
    padding: 0px 20px;

    /deep/.ivu-carousel-active {
        margin: 0px 8px;
    }

    /deep/.ivu-carousel-dots li {
        margin: 0px 8px;
    }

    /deep/.radius {
        height: 8px;
        width: 8px;
    }

    /deep/.ivu-carousel-dots li.ivu-carousel-active>button.radius {
        width: 8px;
        height: 8px;
        background-color: #3064F2;
    }

    /deep/.ivu-carousel-arrow.left {
        border-radius: inherit;
        width: 18px;
        height: 50px;
        background: #FFFFFF;
        box-shadow: 2px 0px 2px 1px rgba(0, 0, 0, 0.05);
        border-radius: 0px 5px 5px 0px;
        left: 0px;
    }

    /depp/.ivu-carousel-arrow.left :before {
        opacity: 0.1;
    }

    /deep/.ivu-carousel-arrow.right {
        border-radius: inherit;
        right: 0px;
        width: 18px;
        height: 50px;
        background: #FFFFFF;
        box-shadow: -2px 0px 2px 1px rgba(0, 0, 0, 0.05);
        border-radius: 5px 0px 0px 5px;
    }

    /deep/.ivu-carousel-arrow {
        color: #B6B6B6;
        width: 8px;
        height: 8px;
    }

    /depp/.ivu-carousel-item {
        position: absolute;
    }

    // /deep/.radius{
    //     width: 8px;
    //     height: 8px;
    // background-color: #3064F2;
    // }
}

.shadow {
    width: 100%;
    height: 20px;
    background: linear-gradient(180deg, #F0F2F5 0%, #FFFFFF 100%);
    border-radius: 0px 0px 0px 0px;
}

.small-preview {
    width: 280px;
    height: 280px;
    background: #F5F5F5;
    border-radius: 10px 10px 10px 10px;
    position: relative;
    font-family: Source Han Sans CN-Medium, Source Han Sans CN;
    font-weight: 500;

    .preview-3d {
        height: 200px;
        width: 200px;
    }

    .preview {
        width: 72px;
        height: 32px;
        background: #000000;
        border-radius: 10px 0px 10px 0px;
        opacity: 0.3;
        border: none;
        position: absolute;
        bottom: 0px;
        right: 0px;
        font-size: 14px;
        color: #FFFFFF;
        cursor: pointer;

    }

    .content {
        height: 203px;
        width: 171px;
        border: 1px solid #3064F2;
        margin-left: 55px;
        margin-top: 5px;
    }

    .change-mode {
        display: flex;
        width: 100%;
        justify-content: flex-end;
        position: absolute;
        z-index: 99;


        .btn-box {
            display: flex;
            height: 24px;
            width: 80px;
            border-radius: 5px;
            overflow: hidden;
            font-size: 14px;
            margin: 10px 10px 0px 0px;
            cursor: pointer;

            .btn-active {
                width: 40px;
                height: 24px;
                background: #3064F2;
                border: none;
                color: #FFFFFF;
                cursor: pointer;

            }

            .btn {
                width: 40px;
                height: 24px;
                background: #FFFFFF;
                border: none;
                color: #3064F2;
                cursor: pointer;
            }


        }
    }
}
</style>