<!--
 * @Author: 邓官妮
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 邓官妮
 * @LastEditTime: 2023-07-16 12:51:11
 * @Description: 插入SVG元素
-->

<template>
  <div style="display: inline-block" class="import-file">
    <div class="btn-box">
      <input id="myInput" class="input-file" type="file" placeholder="上传图片">
      <Button class="btn-1">
        <Icon type="md-add" size="15" color="#4E5969 " />上传图片
      </Button>

    </div>
    <p class="tips">
    <ul> 1.仅支持30M以内JPG、JPEG、PNG格式的图片</ul>
    <ul>2.请勿上传涉政、涉黄、侵权等违法行为，情节严重的将给予封号处理</ul>
    <ul> 3.上传代表已阅读并同意 <a>《法律声明》</a></ul>
    </p>
    <div class="title">最近上传记录 </div>
    <div class="image-list">
      <div v-for="item in imageList" :key="item.GUID" style="position: relative;">
        <img class="item" :id="item.GUID" :src="item.ImageUrl" @click="addItem(item)" @mouseenter="showIcon(item)"
          @mouseleave="closeIcon(item)" />
        <!-- <Icon type="ios-close" size="30" @click="delImage(item)" style="cursor: pointer;" class="icon"/> -->
        <Icon type="md-trash" class="icon" size="27" v-show="showDelIcon == item.GUID" @mouseenter="showIcon(item)"
          @click="delImage(item)" />

      </div>


      <!-- <img class="item" id="myImage" @click="addItem" /> -->
    </div>

  </div>
</template>

<script name="ImportFile" setup>
import { getImgStr, selectFiles } from '@/utils/utils';
import useSelect from '@/hooks/select';
import { v4 as uuid } from 'uuid';
import { reactive, ref, onMounted } from 'vue';
import { Upload } from 'view-ui-plus';
import picture from '@/api/picture'
import guid from '@/utils/guiId.ts'
import { ElMessage } from 'element-plus';
const { fabric, canvasEditor } = useSelect();
const state = reactive({
  showModal: false,
  svgStr: '',
  showDelIcon: ''
});
let showDelIcon = ref('')
onMounted(() => {
  document.getElementById("myInput").addEventListener("change", getFile, true)
  getImagesCustom()
})
const closeIcon = (item) => {
  showDelIcon.value = ''
}

const imageList = ref([])
onMounted(() => {
  getImagesCustom()
})
const showIcon = (item) => {
  showDelIcon.value = item.GUID
}
const delImage = (item) => {
  picture.delImagesCustom({ GUID: item.GUID }).then(res => {
    if (res.OK == 'True') {
      ElMessage({
        showClose: true,
        message: '删除成功',
        type: 'success',
      })
    }
  })
  console.log('删除图片')
}
// 上传记录
const getImagesCustom = () => {
  const p = {
    Page_Index: 0,
    Page_RowCount: 20
  }
  picture.getImagesCustom(p).then(res => {
    imageList.value = [...res.Tag[0].Table]
  })
}

const setUpLoadFile = (str) => {
  const result = str.substring(str.indexOf(',') + 1,)
  console.log('大小', imageSize(result))
  console.log('分包', splitBase64(result, 1048596))
  const splitBase64Str = splitBase64(result, 1048596)
  if (splitBase64Str.length > 30) {
    ElMessage({
      showClose: true,
      message: '上传图片不可超过30M!',
      type: 'error',
    })
    return
  } else {
    // 不分包
    if (splitBase64Str.length == 1) {
      const FileName = guid() + '.png'
      const FilePath = 'images_custom\\' + FileName.substring(0, 1)
      const p = {
        FileName: FileName,
        FilePath: FilePath,
        AppendSize: imageSize(splitBase64Str[0]),
        AppendComplete: 'True',
        base64Str: splitBase64Str[0]
      }
      picture.setUpLoadFile(p).then(res => {
        if (res.OK == 'True') {
          picture.setImagesCustom({ FileName }).then(e => {
            if (e.OK == 'True') {
              ElMessage({
                showClose: true,
                message: '上传成功',
                type: 'success',
              })
            } else {
              ElMessage({
                showClose: true,
                message: res.Message,
                type: 'error',
              })
            }
          })
        } else {
          ElMessage({
            showClose: true,
            message: res.Message,
            type: 'error',
          })
        }
      })
    } else {
      const FileName2 = guid() + '.png'
      const FilePath = 'images_custom\\' + FileName2.substring(0, 1)
      splitBase64Str.forEach((el, index) => {
        if (index == 0) {
          const aa = splitBase64Str[index]
          const p = {
            FileName: FileName2,
            FilePath: FilePath,
            AppendSize: imageSize(aa),
            AppendComplete: 'False',
            base64Str: splitBase64Str[index]
          }
          picture.setUpLoadFile(p).then(res => {
            if (res.OK == 'False') {
              ElMessage({
                showClose: true,
                message: res.Message,
                type: 'error',
              })
            }
          })
        } else {
          const p = {
            FileName: FileName2,
            FilePath: FilePath,
            AppendSize: imageSize(splitBase64Str[index]),
            AppendComplete: (index + 1) == splitBase64Str.length ? 'True' : 'False',
            base64Str: splitBase64Str[index]
          }
          picture.setUpLoadFile(p).then(res => {
            if (res.OK == 'False') {
              ElMessage({
                showClose: true,
                message: res.Message,
                type: 'error',
              })
            } else {
              if (index + 1 == splitBase64Str.length) {
                picture.setImagesCustom({ FileName: FileName2 }).then(e => {
                  if (e.OK == 'True') {
                    ElMessage({
                      showClose: true,
                      message: '上传成功',
                      type: 'success',
                    })
                  } else {
                    ElMessage({
                      showClose: true,
                      message: res.Message,
                      type: 'error',
                    })
                  }
                })
              }
            }
          })
        }
      })
    }
  }

  // setTimeout(() => {
  //   document.getElementById(id).src = result;
  // }, 10);
  // setUpLoadFile()
}
// 获取选取图片
const getFile = (file) => {
  if (!file) {
    return;
  }
  const {
    files
  } = file.target;
  if (files.length <= 0) return;
  const fileReader = new FileReader();
  fileReader.readAsDataURL(files[0]);
  fileReader.onload = (event) => {
    try {
      const {
        result
      } = event.target;
      setUpLoadFile(result)
      // imageList.push({
      //   id: id,
      //   src: result,
      //   name: '图片' + uuid(),
      // })
      // console.log('result', result)

    } catch (e) {
      console.log(e);
    }
  };
}
const imageSize = (base64Str) => {
  const indexBase64 = base64Str.indexOf('base64,') == -1 ? base64Str : base64Str.indexOf('base64,');
  if (indexBase64 < 0) return -1;
  const str = base64Str.substr(indexBase64 + 6);
  return (str.length * 0.75).toFixed(0);
}
const splitBase64 = (base64String, chunkSize) => {
  var result = [];
  var index = 0;

  while (index < base64String.length) {
    var chunk = base64String.slice(index, index + chunkSize);
    result.push(chunk);
    index += chunkSize;
  }
  return result;
}
const HANDLEMAP = {
  // 插入图片
  insertImg: function () {
    selectFiles({ accept: 'image/*', multiple: true }).then((fileList) => {
      Array.from(fileList).forEach((item) => {
        getImgStr(item).then((file) => {
          // console.log('item', item)
          insertImgFile(file);
        });
      });
    });
  },
  // 插入Svg
  insertSvg: function () {
    selectFiles({ accept: '.svg', multiple: true }).then((fileList) => {
      Array.from(fileList).forEach((item) => {
        getImgStr(item).then((file) => {
          insertSvgFile(file);
        });
      });
    });
  },
  // 插入SVG元素
  insertSvgStrModal: function () {
    state.svgStr = '';
    state.showModal = true;
  },
  // 插入字符串元素
  insertSvgStr: function () {
    fabric.loadSVGFromString(state.svgStr, (objects, options) => {
      const item = fabric.util.groupSVGElements(objects, {
        ...options,
        name: 'defaultSVG',
        id: uuid(),
      });
      canvasEditor.canvas.add(item).centerObject(item).renderAll();
    });
  },
};
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
const addItem = (item) => {
  const imageURL = item.ImageUrl;
  let callback = (image, isError) => {
    if (!isError) {
      image.name = item.Title
      image.id = uuid()
      canvasEditor.canvas.add(image);
      const info = canvasEditor.canvas.getObjects().find((item) => item.id === image.id);
      canvasEditor.canvas.discardActiveObject();
      canvasEditor.canvas.setActiveObject(info);
      canvasEditor.canvas.requestRenderAll();
    }
  };
  const properties = {
    left: 0,
    top: 0
  };
  fabric.Image.fromURL(imageURL, callback, properties);
}

const insertTypeHand = (type) => {
  console.log('type', type)
  const cb = HANDLEMAP[type];
  cb && typeof cb === 'function' && cb();
};
// 插入图片文件
const insertImgFile = (file) => {
  if (!file) throw new Error('file is undefined');
  const imgEl = document.createElement('img');
  imgEl.src = file;
  // 插入页面
  document.body.appendChild(imgEl);
  imgEl.onload = () => {
    // 创建图片对象
    const imgInstance = new fabric.Image(imgEl, {
      id: uuid(),
      name: '图片' + uuid(),
      left: 100,
      top: 100,
    });
    // 设置缩放
    canvasEditor.canvas.add(imgInstance);
    canvasEditor.canvas.setActiveObject(imgInstance);
    canvasEditor.canvas.renderAll();
    // 删除页面中的图片元素
    imgEl.remove();
  };
}

// 插入文件元素
function insertSvgFile(svgFile) {
  if (!svgFile) throw new Error('file is undefined');
  fabric.loadSVGFromURL(svgFile, (objects, options) => {
    const item = fabric.util.groupSVGElements(objects, {
      ...options,
      name: 'defaultSVG',
      id: uuid(),
    });
    canvasEditor.canvas.add(item).centerObject(item).renderAll();
  });
}
</script>

<style scoped lang="less">
:deep(.ivu-select-dropdown) {
  z-index: 999;
}

.btn-box {
  position: reactive;

  .input-file {
    position: absolute;
    top: 27px;
    left: 129px;
    opacity: 0;
    cursor: pointer;
  }
}

.import-file {
  font-family: Source Han Sans CN-Normal, Source Han Sans CN;
  font-weight: 400;
  padding: 20px;
  width: 100%;

  .title {
    font-size: 16px;
    font-weight: 500;
    color: #4E5969;
    margin: 10px 0px;
  }

  .tips {
    margin-top: 20px;
    width: 280px;
    height: 92px;
    font-size: 12px;
    color: #86909C;

    ul {
      margin-bottom: 10px;
    }

  }

  .image-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .icon {
      position: absolute;
      right: -1px;
      top: 0px;
      cursor: pointer;
      z-index: 8888;
    }

    .item {
      height: 85px;
      width: 85px;
      background-color: #b2b4b6;
      border-radius: 3%;
      cursor: pointer;
      margin-bottom: 15px;
      // position: absolute;
      // top: 0px;
      // left: 0px;
      // z-index: 9;

    }
  }


}
</style>
