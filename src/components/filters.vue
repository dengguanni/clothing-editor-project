<!--
 * @Author: 邓官妮
 * @Date: 2023-04-06 23:04:38
 * @LastEditors: 邓官妮
 * @LastEditTime: 2023-07-16 12:48:28
 * @Description: 图片滤镜
-->

<template>
  <div v-if="mixinState.mSelectMode === 'one' && state.type === 'image'" class="box">
    <div class="menu">
      <span @click="goBack">返回</span>
    </div>
    <div class="filter-box">

      <!-- 无参数滤镜 -->
      <div class="filter-item" v-for="(value, key) in state.noParamsFilters" :key="key">
        <img :src="getImageUrl(key)" alt="" @click="changeFilters(key, !noParamsFilters[key])"
          v-if="key !== 'Contrast'" />
        <Checkbox v-model="state.noParamsFilters[key]" @on-change="(val) => changeFilters(key, val)"
          v-if="key !== 'Contrast'">
          {{ $t('filters.' + key) }}
        </Checkbox>
      </div>
      <img :src="url">
    </div>
    <!-- <Collapse>

      <Panel name="2">
        {{ $t('filters.complex') }}
        <template #content>
          <div>
            <div
              class="filter-item has-params"
              v-for="item in [...state.paramsFilters, ...state.combinationFilters]"
              :key="item.type"
            >
              <Checkbox v-model="item.status" @on-change="changeFiltersByParams(item.type)">
                {{ $t('filters.' + item.type) }}
              </Checkbox>
              <div v-if="item.status" class="content">
                <div class="content slider-box" v-for="info in item.params" :key="info">
                  <div v-if="info.uiType === uiType.SELECT">
                    <RadioGroup v-model="info.value" @on-change="changeFiltersByParams(item.type)">
                      <Radio :label="listItem" v-for="listItem in info.list" :key="listItem">
                        {{ $t('filters.' + item.type + 'List.' + listItem) }}
                      </Radio>
                    </RadioGroup>
                  </div>
                  <div v-if="info.uiType === uiType.NUMBER">
                    <Slider
                      v-model="info.value"
                      :max="info.max"
                      :min="info.min"
                      :step="info.step"
                      @on-input="changeFiltersByParams(item.type)"
                    ></Slider>
                  </div>
                  <div v-if="info.uiType === uiType.COLOR">
                    <ColorPicker
                      v-model="info.value"
                      alpha
                      size="small"
                      @on-change="changeFiltersByParams(item.type)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Panel>
    </Collapse> -->
  </div>
</template>

<script name="Filter" setup>
import useSelect from '@/hooks/select';
import guid from '@/utils/guiId.ts'
import { uiType, paramsFilters, combinationFilters } from '@/config/constants/filter';
import mitts from '@/utils/mitts'
import { v4 as uuid } from 'uuid';
const emit = defineEmits()
const { fabric, mixinState, canvasEditor } = useSelect();
const event = inject('event');
const update = getCurrentInstance();

let url = ref('')
// 无参数滤镜
const noParamsFilters = {
  BlackWhite: false,
  Brownie: false,
  Vintage: false,
  Kodachrome: false,
  technicolor: false,
  Polaroid: false,
  Invert: false,
  Sepia: false,
  Contrast: false
};

const state = reactive({
  uiType,
  noParamsFilters,
  paramsFilters: [...paramsFilters],
  combinationFilters: [...combinationFilters],
  type: '',
});
const props = defineProps({
  singleFilters: {
    type: Boolean,
    default: false
  }
})
watch(
  () => props.singleFilters,
  (val) => {
    setSharpening(val)
  }
);
// 锐化
const setSharpening = (val) => {
  const obj = canvasEditor.canvas.getActiveObjects()[0];
  function applyFilter(index, filter) {
    obj.filters[index] = filter;
    var timeStart = +new Date();
    obj.applyFilters();
    var timeEnd = +new Date();
    var dimString = obj.width + ' x ' +
      obj.height;
    var $ = function (id) { return document.getElementById(id) };
    // $('bench').innerHTML = dimString + 'px ' +
    //   parseFloat(timeEnd - timeStart) + 'ms';
    canvasEditor.canvas.renderAll();
  }
  const f = fabric.Image.filters
  applyFilter(12, val && new f.Convolute({
    matrix: [0, -1, 0,
      -1, 5, -1,
      0, -1, 0]
  }));

}

// 无参数滤镜修改状态
const changeFilters = (type, value) => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  console.log(type, value, activeObject)
  state.noParamsFilters[type] = value;
  if (value) {
    const itemFilter = _getFilter(activeObject, type);
    if (!itemFilter) {
      _createFilter(activeObject, type);
    }
  } else {
    _removeFilter(activeObject, type);
  }
};
// 有参数与组合滤镜修改
const changeFiltersByParams = (type) => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  const filtersAll = [...state.paramsFilters, ...state.combinationFilters];
  const moduleInfo = filtersAll.find((item) => item.type === type);
  if (moduleInfo.status) {
    // 组合参数滤镜修改
    if (moduleInfo.handler) {
      _changeAttrByHandler(moduleInfo);
    } else {
      // 有参数滤镜修改
      moduleInfo.params.forEach((paramsItem) => {
        _changeAttr(type, paramsItem.key, paramsItem.value);
      });
    }
  } else {
    _removeFilter(activeObject, type);
  }
};

const handleSelectOne = () => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  if (activeObject) {
    state.type = activeObject.type;
    if (state.type === 'image') {
      // 无参数滤镜回显
      Object.keys(noParamsFilters).forEach((type) => {
        state.noParamsFilters[type] = !!_getFilter(activeObject, type);
        update?.proxy?.$forceUpdate();
      });
      // 有参数滤镜回显
      paramsFilters.forEach((filterItem) => {
        const moduleInfo = state.paramsFilters.find((item) => item.type === filterItem.type);
        const filterInfo = _getFilter(activeObject, filterItem.type);
        moduleInfo.status = !!filterInfo;
        moduleInfo.params.forEach((paramsItem) => {
          paramsItem.value = filterInfo ? filterInfo[paramsItem.key] : paramsItem.value;
        });
      });

      // 组合滤镜回显
      combinationFilters.forEach((filterItem) => {
        const moduleInfo = state.combinationFilters.find((item) => item.type === filterItem.type);
        const filterInfo = _getFilter(activeObject, filterItem.type);
        moduleInfo.status = !!filterInfo;
        // 不回显具体参数
      });
    }
    update?.proxy?.$forceUpdate();
  }
};

onMounted(() => {
  event.on('selectOne', handleSelectOne);
});

onBeforeUnmount(() => {
  event.off('selectOne', handleSelectOne);
});

// 图片地址拼接
function getImageUrl(name) {
  return `http://8.140.206.30:8089/ImageSource/Filters/${name}.png`
}
const goBack = () => {
  emit('goBack', 'filters')
}

// 设置滤镜值
function _changeAttr(type, key, value) {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  const itemFilter = _getFilter(activeObject, type);
  if (itemFilter) {
    itemFilter[key] = value;
  } else {
    const imgFilter = _createFilter(activeObject, type);
    imgFilter[key] = value;
  }
  activeObject.applyFilters();
}

function _changeAttrByHandler(moduleInfo) {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  // 删除
  _removeFilter(activeObject, moduleInfo.type);
  // 创建
  const params = moduleInfo.params.map((item) => item.value);
  _createFilter(activeObject, moduleInfo.type, moduleInfo.handler(...params));
}

/**
 * Create filter instance
 * @param {fabric.Image} sourceImg - Source image to apply filter
 * @param {string} type - Filter type
 * @param {Object} [options] - Options of filter
 * @returns {Object} Fabric object of filter
 * @private
 */
function _createFilter(sourceImg, type, options = null) {
  let filterObj;
  const fabricType = _getFabricFilterType(type);
  const ImageFilter = fabric.Image.filters[fabricType];
  if (ImageFilter) {
    filterObj = new ImageFilter(options);
    filterObj.options = options;
    sourceImg.filters.push(filterObj);
  }
  sourceImg.applyFilters();
  canvasEditor.canvas.renderAll();
  const activeObject = canvasEditor.canvas.getActiveObjects()[0]
  url.value = activeObject.toDataURL({
    width: activeObject.width,
    height: activeObject.height,
    angle: activeObject.angle,
    scaleX: activeObject.scaleX,
    scaleY: activeObject.scaleY,
    multiplier: 1,
  });
  canvasEditor.canvas.requestRenderAll();
  // const width = activeObject.get('width');
  // const height = activeObject.get('height');
  // const scaleX = activeObject.get('scaleX');
  // const scaleY = activeObject.get('scaleY');
  // const properties = {
  //   left: 0,
  //   top: 0
  // }
  const FilePath = 'temp//' + guid()
  activeObject.setSrc(url.value, () => {
    activeObject.set('name', activeObject.Title);
    activeObject.set('id', uuid());
    activeObject.set('width', activeObject.width);
    activeObject.set('height', activeObject.height);
    activeObject.set('scaleX', activeObject.scaleX);
    activeObject.set('scaleY', activeObject.scaleY);
    activeObject.set('FileName', activeObject.FileName);
    activeObject.set('FilePath', activeObject.FilePath);
    canvasEditor.canvas.renderAll();
  });
  // mitts.emit('replaceImages', url.value, 'temp//')
  return filterObj;
}
/**
 * Get applied filter instance
 * @param {fabric.Image} sourceImg - Source image to apply filter
 * @param {string} type - Filter type
 * @returns {Object} Fabric object of filter
 * @private
 */
function _getFilter(sourceImg, type) {
  let imgFilter = null;
  if (sourceImg) {
    const fabricType = _getFabricFilterType(type);
    const { length } = sourceImg.filters;
    let item, i;

    for (i = 0; i < length; i += 1) {
      item = sourceImg.filters[i];
      if (item.type === fabricType) {
        imgFilter = item;
        break;
      }
    }
  }
  return imgFilter;
}
/**
 * Remove applied filter instance
 * @param {fabric.Image} sourceImg - Source image to apply filter
 * @param {string} type - Filter type
 * @private
 */
function _removeFilter(sourceImg, type) {
  const fabricType = _getFabricFilterType(type);
  sourceImg.filters = sourceImg.filters.filter((value) => value.type !== fabricType);
  sourceImg.applyFilters();
  canvasEditor.canvas.renderAll();
}
/**
 * Change filter class name to fabric's, especially capitalizing first letter
 * @param {string} type - Filter type
 * @example
 * 'grayscale' -> 'Grayscale'
 * @returns {string} Fabric filter class name
 */
function _getFabricFilterType(type) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}
</script>

<style scoped lang="less">
.menu {
  background-color: #fff;
  width: 100%;
  height: 30px;
  border-bottom: 1px solid #0000001f;
  font-size: 14px;
  color: #4E5969;
  padding-left: 12px;

  span:hover {
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
