<template>
    <div v-show="mixinState.mSelectMode === 'one' && !selected.hasCropping">
        <div class="box-01" v-if="mixinState.mSelectOneType !== 'text'">
            <!-- <greyButton></greyButton> -->
            <greyButton v-for="item in menuList1" :key="item.type" @buttonClick="menuList1Click(item.type)"
                :disabled="item.disabled" :content="item.label" :isSelected="item.isSelected">
            </greyButton>
        </div>
        <div class="box-01" v-if="mixinState.mSelectOneType !== 'text'">
            <greyButton v-for="item in filterList" :key="item.type" :width="87" :disabled="item.disabled"
                @buttonClick="btnClick(item.type)" :id="item.type" :content="item.label">
            </greyButton>
        </div>
        <div class="menu-box">
            <div style="display: flex;justify-content: space-evenly; width: 100%; ">
                <Tooltip :content="item.label" v-for="(item, i ) in  menuList3 " :key="item" style="width: 25px;">
                    <!-- <el-button text='plain' type='' @mousedown="menu3Click(item.type)" :id="item.type"
                        style="border-radius: 50%; width: 25px;" :disabled="item.disabled">
                        <span v-html="item.svg" style="margin: 0px;"></span>
                    </el-button> -->
                    <el-button text='plain' type='' @mousedown="menu3Click(item.type)" :id="item.type"
                        style="border-radius: 50%; width: 25px;" :disabled="item.disabled">
                        <span v-html="item.type == 'lock' ? (selected.isLock ? item.svg : item.svg1) : item.svg"
                            style="margin: 0px;"></span>
                    </el-button>
                    <div v-show="item.type == 'copyTo' && state.copyTo" class="scale-menu">
                        <div class="item" id="scale-big" @click.stop="setCopyTo({ Title: 'all' })">所有片</div>
                        <div class="item" id="scale-big" @click.stop="setCopyTo(item1)" v-for=" item1  in  cutParts "
                            :key="item.Title">{{ item1.Title }}</div>
                    </div>
                    <div v-show="item.type == 'scale' && state.isScale" class="scale-menu">
                        <div class="item" id="scale-big" @click.stop="menu3Click('scale-big')">放大</div>
                        <div class="item" id="scale-small" @click.stop="menu3Click('scale-small')">缩小</div>
                    </div>
                    <div v-show="item.type == 'layer' && state.isLayer" class="scale-menu" @click.stop id="layer">
                        <div id="layer-up" class="item" @click.stop="menu3Click('layer-up')">上移</div>
                        <div class="item" id='layer-top' @click.stop="menu3Click('layer-top')"
                            v-show="selected.cutPartsType !== '[整体设计]'">置顶</div>
                        <div class="item" id="layer-bottom" @click.stop="menu3Click('layer-bottom')"
                            v-show="selected.cutPartsType !== '[整体设计]'">置底</div>
                        <div class="item" id="layer-down" @click.stop="menu3Click('layer-down')">下移</div>
                    </div>
                </Tooltip>
            </div>
        </div>
        <Lock v-show="false" :isLock="state.isLock"></Lock>
    </div>
</template>
<script setup >

import { ref } from 'vue'
import { Tooltip, } from 'view-ui-plus';
import { ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus'
import useSelect from '@/hooks/select';
import { debounce } from 'lodash-es';
import { Message } from 'view-ui-plus';
import Lock from '@/components/lock.vue'
import { v4 as uuid } from 'uuid';
import MouseEventEventListener from '@/utils/event/mouse.ts'
import { useStore } from 'vuex'
import greyButton from '@/components/common/greyButton.vue'
import buttonLimitions from '@/core/limitations/buttonLimitions'
const store = useStore()
const update = getCurrentInstance();
const { mixinState, canvasEditor } = useSelect();
const cutPartsType = computed(() => {
    return store.state.cutPartsType
})
const cutParts = computed(() => {
    return store.state.cutParts
})
let mSelectMode = computed(() => {
    mixinState.mSelectMode
});
const selected = computed(() => {
    return store.state.selected
});
const handleLock = computed(() => {
    return store.state.handleLock
});
// import clone from '@/components/clone.vue'
// import { Slider } from 'element-plus'
const lockAttrs = [
    'lockMovementX',
    'lockMovementY',
    'lockRotation',
    'lockScalingX',
    'lockScalingY',
];
const event = inject('event');
const emit = defineEmits()
const state = reactive({
    isLock: false,
    isScale: false,
    firstClickScale: false,
    isLayer: false,
    firstClickLayer: false,
    copyTo: false
})
let stateRepeat = reactive({
    isRepeat: false,
    basic: false,
    mirror: false,
    transverse: false,
    direction: false,

})
let layerNum = ref(0)
let type = ref('')
let activeInfo = reactive({
    angle: 0,
    width: 0,
    height: 0,
    scaleX: 0,
    scaleY: 0
})
let activeObject = ref()
let menuList1 = reactive([
    {
        type: 'basic',
        label: '基础平铺',
        disabled: false,
        isSelected: false
    },
    {
        type: 'mirror',
        label: '镜像平铺',
        disabled: false,
        isSelected: false
    },
    {
        type: 'transverse',
        label: '横向平铺',
        disabled: false,
        isSelected: false
    },
    {
        type: 'direction',
        label: '纵向平铺',
        disabled: false,
        isSelected: true
    },
    // {
    //     type: 'matting',
    //     label: '抠头',
    //     disabled: false,
    //     isSelected: false
    // }
])
let filterList = reactive([
    {
        type: 'clearness',
        label: '清晰',
        disabled: false
    },
    {
        type: 'filter',
        label: '滤镜',
        disabled: false
    },
    {
        type: 'cropping',
        label: '裁剪',
        disabled: false
    }
])
const menuList3 = reactive([
    {
        type: 'scale',
        label: '缩放',
        disabled: false,
        svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><defs><style>.a{fill:#fff;opacity:0;}.b,.c{fill:none;stroke:#4e5969;stroke-linejoin:round;stroke-width:1.5px;}.c{stroke-linecap:round;}</style></defs><g transform="translate(-95 -178)"><rect class="a" width="20" height="20" transform="translate(95 178)"/><g transform="translate(93.695 176.695)"><path class="b" d="M10.587,17.173A6.587,6.587,0,1,0,4,10.587,6.587,6.587,0,0,0,10.587,17.173Z"/><path class="c" d="M33.222,33.222l3.288,3.288" transform="translate(-17.9 -17.9)"/></g></g></svg>'
    },
    {
        type: 'layer',
        label: '图层',
        disabled: false,
        svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><defs><style>.a{fill:#fff;opacity:0;}.b,.c{fill:none;stroke:#4e5969;stroke-linejoin:round;stroke-width:1.5px;}.c{stroke-linecap:round;}.d{fill:#4e5969;}</style></defs><g transform="translate(-3616 202)"><rect class="a" width="20" height="20" transform="translate(3616 -202)"/><g transform="translate(-0.492 -1.025)"><g transform="translate(3613.885 -203.86)"><path class="b" d="M4,7.813,12.138,10.7l8.138-2.883L12.138,5Z"/><path class="c" d="M4,20l8.138,2.848,3.147-.92" transform="translate(0 -6.896)"/><path class="c" d="M4,36l8.138,2.848s1.906-.467,3.941-1.179" transform="translate(0 -18.386)"/></g><path class="d" d="M2019.542-1368.653l-.25.25.021-4.164.229.229a.655.655,0,0,0,.467.193.655.655,0,0,0,.466-.193.66.66,0,0,0,0-.933l-1.368-1.368a.659.659,0,0,0-.933,0l-1.368,1.368a.66.66,0,0,0,0,.933.659.659,0,0,0,.933,0l.255-.254-.021,4.173-.234-.234a.66.66,0,0,0-.933,0,.66.66,0,0,0,0,.933l1.368,1.368a.655.655,0,0,0,.467.193.657.657,0,0,0,.466-.193l1.368-1.368a.66.66,0,0,0,0-.933A.66.66,0,0,0,2019.542-1368.653Z" transform="translate(1614.433 1183.069)"/></g></g></svg>'
    },
    {
        type: 'createCopy',
        label: '创建副本',
        disabled: false,
        svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><defs><style>.a{fill:#fff;opacity:0;}.b{fill:none;stroke:#4e5969;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;}</style></defs><g transform="translate(-3662 203)"><rect class="a" width="20" height="20" transform="translate(3662 -203)"/><g transform="translate(3658 -205)"><path class="b" d="M8.757,19.146h10.6a.757.757,0,0,0,.757-.757V7.787H16.33V4H8.757A.757.757,0,0,0,8,4.757V18.389A.757.757,0,0,0,8.757,19.146Z"/><path class="b" d="M30,4l3.787,3.787" transform="translate(-13.67)"/></g></g></svg>'
    },
    {
        type: 'copyTo',
        label: '复制至其他印刷面',
        disabled: false,
        svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><defs><style>.a{fill:#fff;opacity:0;}.b{fill:none;stroke:#4e5969;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;}</style></defs><g transform="translate(-3708 203)"><rect class="a" width="20" height="20" transform="translate(3708 -203)"/><g transform="translate(3703 -205)"><path class="b" d="M20.117,11.194V7.787L16.709,4H8.757A.757.757,0,0,0,8,4.757V18.389a.757.757,0,0,0,.757.757h9.626"/><path class="b" d="M26,35h5.3" transform="translate(-9.184 -20.262)"/><path class="b" d="M30,4V7.787h3.787" transform="translate(-13.67)"/><path class="b" d="M18.76,13.031l1.574,1.884L18.76,16.488" transform="translate(2)"/></g></g></svg>'
    },
    {
        type: 'lock',
        label: '锁定/解锁',
        disabled: false,
        svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 15 15"><defs><style>.a,.b{fill:#4e5969;}.a{opacity:0;}.b,.c{stroke:#4e5969;}.b,.c,.d{stroke-linejoin:round;}.c,.d{fill:none;stroke-linecap:round;}.d{stroke:#fff;}</style></defs><g transform="translate(-10056 496)"><rect class="a" width="15" height="15" transform="translate(10056 -496)"/><g transform="translate(10052 -499)"><rect class="b" width="11" height="6" rx="2" transform="translate(6 10)"/><path class="c" d="M14,9.364V6.98a2.98,2.98,0,0,1,5.96,0V9.364" transform="translate(-5.616)"/><path class="d" d="M24,30v1.788" transform="translate(-12.636 -18.253)"/></g></g></svg>',
        svg1: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><defs><style>.a{fill:#fff;opacity:0;}.b,.c{fill:none;stroke:#4e5969;stroke-linejoin:round;stroke-width:1.5px;}.c{stroke-linecap:round;}</style></defs><g transform="translate(-3754 203)"><rect class="a" width="20" height="20" transform="translate(3754 -203)"/><g transform="translate(3750 -205)"><rect class="b" width="13.595" height="8.797" rx="2" transform="translate(7 11.216)"/><path class="c" d="M14,11.2V8a4.043,4.043,0,0,1,8-.8" transform="translate(-4.201)"/><path class="c" d="M24,30v2.4" transform="translate(-10.202 -15.604)"/></g></g></svg>'
    },
    {
        type: 'delete',
        label: '删除',
        disabled: false,
        svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><defs><style>.a{fill:#fff;opacity:0;}.b,.c,.d{fill:none;stroke:#4e5969;stroke-width:1.5px;}.b,.d{stroke-linejoin:round;}.c,.d{stroke-linecap:round;}.d{fill-rule:evenodd;}</style></defs><g transform="translate(-3803 203)"><rect class="a" width="20" height="20" transform="translate(3803 -203)"/><g transform="translate(3799.506 -205.522)"><path class="b" d="M15,7.787,15.478,5h6.211l.478,2.787" transform="translate(-5.417)"/><path class="c" d="M6,12H20.334" transform="translate(0 -4.213)"/><path class="d" d="M21.352,12l-.8,12.343H11.8L11,12Z" transform="translate(-3.009 -4.213)"/><path class="c" d="M19,35h3.982" transform="translate(-7.824 -18.055)"/></g></g></svg>'

    }
])

watch(handleLock, (newVal, oldVal) => {
    if (newVal) {
        const activeObject = canvasEditor.canvas.getActiveObject()
        buttonLimitions(menuList3, activeObject)
        buttonLimitions(filterList, activeObject)
        buttonLimitions(menuList1, activeObject)
    }
}, { immediate: true, deep: true });
watch(selected, (newVal, oldVal) => {
    if (newVal) {
        buttonLimitions(menuList3, newVal)
        buttonLimitions(filterList, newVal)
        buttonLimitions(menuList1, newVal)
        setButtonActive ? setButtonActive(menuList1, null) : ''
    }
}, { immediate: true, deep: true });
onMounted(() => {
    MouseEventEventListener.setMouseup()
    event.on('selectOne', init);
    MouseEventEventListener.setMouseupFn = () => { }
    canvasEditor.setCanvasObserve(canvasEditor.canvas)
    MouseEventEventListener.rmMouseup()
    event.off('selectOne', init);

})
const init = () => {
    const activeObject = canvasEditor.canvas.getActiveObjects()[0];
    if (activeObject) {
        type.value = activeObject.type;
        update?.proxy?.$forceUpdate();
    }
}
const changeLockIcon = (item) => {
    if (item.type == 'lock' || item.type == 'unlock') {
        if (selected.value.isLock && item.type == 'lock') {
            return true
        } else if (!selected.value.isLock && item.type == 'unlock') {
            return true
        } else {
            return false
        }
    } else {
        return true
    }
}
const setButtonActive = (arr, type) => {
    const obj = canvasEditor.canvas.getActiveObjects()[0]
    if (type) {
        if (obj.repeatType) {
            if (obj.repeatType == type) {
                arr.forEach(element => {
                    element.isSelected = false
                });
            } else {
                arr.forEach(el => {
                    if (el.type == type) {
                        el.isSelected = true
                    } else {
                        el.isSelected = false
                    }
                })
            }

        } else {
            arr.forEach(el => {
                if (el.type == type) {
                    el.isSelected = true
                } else {
                    el.isSelected = false
                }
            })
        }
    } else {
        arr.forEach(element => {
            element.isSelected = false
        });

    }

}
const setCopyTo = (item) => {
    store.commit('setDisableClipping', true)
    const activeObject = canvasEditor.canvas.getActiveObjects()[0];
    if (item.Title == 'all') {
        let n = 0
        cutParts.value.forEach(el => {
            if (el.Title !== cutPartsType.value) {
                const mask = canvasEditor.canvas.getObjects().find((item) => (item.isMask !== undefined && item.cutPartsType == el.cutPartsType))
                console.log('mask', mask)
                activeObject.clone(c => {
                    c.set({
                        id: uuid(),
                        cutPartsType: el.Title,
                        visible: false,
                        FileName: activeObject.FileName,
                        FilePath: activeObject.FilePath,
                        customVisible: true,
                        publicControlId: null
                    })
                    n++

                    if (c.isBackground) {
                        const bg = canvasEditor.canvas.getObjects().find((item) => (item.isBackground && item.cutPartsType == c.cutPartsType))
                        canvasEditor.canvas.remove(bg)
                        // canvasEditor.setMax('full', c, mask)
                    }
                    canvasEditor.canvas.add(c)
                    if (n == cutParts.value.length - 1) {
                        store.commit('setDisableClipping', false)
                        canvasEditor.setAllCuts(true)
                    }
                })
            }
        })
    } else {
        activeObject.clone(c => {
            c.set({
                id: uuid(),
                cutPartsType: item.Title,
                visible: false,
                FileName: activeObject.FileName,
                FilePath: activeObject.FilePath,
                customVisible: true
            })
            if (c.repeatType) {
                canvasEditor.canvas.getObjects().forEach(element => {
                    if (element.tileParentId == c.id) {
                        element.clone((cloned) => {
                            cloned.set({
                                id: uuid(),
                                ImageUrl: element.ImageUrl,
                                FileName: element.FileName,
                                FilePath: element.FilePath,
                                tileParentFileName: c.FileName,
                                tileParentId: c.id,
                                cutPartsType: c.cutPartsType,
                                customVisible: true
                            })
                            canvasEditor.canvas.add(cloned)
                            store.commit('setDisableClipping', false)
                            canvasEditor.setAllCuts(true)

                        })
                    }
                });
            } else {
                canvasEditor.canvas.add(c)
                store.commit('setDisableClipping', false)
                canvasEditor.setAllCuts(true)
            }

        })
    }
    // canvasEditor.setRepeat(repeatType, true)
    canvasEditor.canvas.renderAll();
    state.copyTo = false
    Message.success('复制成功');
}
const menuList1Click = (type) => {
    const activeObject = canvasEditor.canvas.getActiveObjects()[0];
    switch (type) {
        case 'basic':
            // canvasEditor.setRepeat('basic', false, menuList1)
            console.log(new Date().getMinutes() + '分' + new Date().getSeconds() + '秒' + new Date().getMilliseconds() + '毫秒', '点击平铺')
            canvasEditor.setRepeat('basic', false, menuList1)
            canvasEditor.handleOverallObjs(activeObject,'repeat')

            break;
        case 'cropping':
            //   state.isShowCropping = true
            break;
        case 'clearness':
            break;
        case 'mirror':
            canvasEditor.setRepeat('mirror', false, menuList1)
            canvasEditor.handleOverallObjs(activeObject,'repeat')
            break;
        case 'transverse':
            canvasEditor.setRepeat('transverse', false, menuList1)
            canvasEditor.handleOverallObjs(activeObject,'repeat')
            break;
        case 'direction':
            canvasEditor.setRepeat('direction', false, menuList1)
            canvasEditor.handleOverallObjs(activeObject,'repeat')
            break;
        default:
    }
}

const del = debounce(function () {
    canvasEditor.del();
    canvasEditor.setAllCuts(false)
}, 300);
const btnClick = (item) => {
    const activeObject = canvasEditor.canvas.getActiveObject()
    if (activeObject && activeObject.Sharpen && item == 'filter') {
        Message.error('添加清晰后不支持滤镜');
        return
    }
    if (activeObject && activeObject.repeatType && item == 'cropping') {
        Message.error('平铺后不支持裁剪，请移除平铺后再试试')
        return
    }
    emit('btnClick', item);
};
const setIsScale = () => {
    const event = MouseEventEventListener.event
    setTimeout(() => {
        if (event && state.isScale && !event.target?.id) {
            if (!state.firstClickScale) {
                state.firstClickScale = true
            } else {
                state.isScale = false
                state.firstClickScale = false
            }
        }
    }, 100);
}
// 复制
const clone = debounce(function () {
    canvasEditor.clone();
}, 300);
const setLayer = () => {
    const event = MouseEventEventListener.event
    setTimeout(() => {
        if (event && state.isLayer && !event.target?.id) {
            if (!state.firstClickLayer) {
                state.firstClickLayer = true
            } else {
                state.isLayer = false
                state.firstClickLayer = false
            }
        }
    }, 100);
}
// 元素缩小
const scaleSmall = debounce((obj) => {
    const activeObject = canvasEditor.canvas.getActiveObjects()[0];
    const oldW = activeObject.scaleX * activeObject.width
    const oldH = activeObject.scaleY * activeObject.height
    activeObject.scaleX = activeObject.scaleX - 0.1
    activeObject.scaleY = activeObject.scaleY - 0.1
    const newW = activeObject.scaleX * activeObject.width
    const newH = activeObject.scaleY * activeObject.height
    const left = (oldW - newW) / 2
    const top = (oldH - newH) / 2
    activeObject.left = activeObject.left + left
    activeObject.top = activeObject.top + top
    canvasEditor.setRepeat(activeObject.repeatType, true)
    canvasEditor.canvas.renderAll()
    canvasEditor.setAllCuts(false)
    canvasEditor.handleOverallObjs(activeObject, 'modified')
}, 300);

// 元素变大
const scaleBig = debounce((obj) => {
    const activeObject = canvasEditor.canvas.getActiveObjects()[0];
    const oldW = activeObject.scaleX * activeObject.width
    const oldH = activeObject.scaleY * activeObject.height
    activeObject.scaleX = activeObject.scaleX + 0.1
    activeObject.scaleY = activeObject.scaleY + 0.1
    const newW = activeObject.scaleX * activeObject.width
    const newH = activeObject.scaleY * activeObject.height
    const left = (newW - oldW) / 2
    const top = (newH - oldH) / 2
    activeObject.left = activeObject.left - left
    activeObject.top = activeObject.top - top
    canvasEditor.setRepeat(activeObject.repeatType, true)
    canvasEditor.canvas.renderAll()
    canvasEditor.setAllCuts(false)
    canvasEditor.handleOverallObjs(activeObject, 'modified')

}, 300);
const lock = () => {
    const activeObject = canvasEditor.canvas.getActiveObjects()[0]
    if (activeObject.isLock == undefined || !activeObject.isLock) {
        activeObject.hasControls = false;
        activeObject.selectable = false;
        activeObject.isLock = true
        activeObject.hoverCursor = 'default'
        lockAttrs.forEach((key) => {
            activeObject[key] = true;
        });
        store.commit('setAllIsLock')
        canvasEditor.handleOverallObjs(activeObject, 'lock')
    } else if (activeObject.isLock) {
        activeObject.hasControls = true;
        // 修改默认属性
        lockAttrs.forEach((key) => {
            activeObject[key] = false;
        });
        activeObject.selectable = true;
        activeObject.isLock = false
        activeObject.hoverCursor = null
        store.commit('setAllIsLock')
        canvasEditor.handleOverallObjs(activeObject, 'lock')

    }
    canvasEditor.canvas.renderAll();
}
const menu3Click = (type) => {
    const activeObject = canvasEditor.canvas.getActiveObjects()[0];
    switch (type) {
        case 'delete':
            del()
            break
        case 'lock':
            lock()
            break
        case 'unlock':
            lock()
            break
        case 'scale':
            state.isScale = !state.isScale
            MouseEventEventListener.setMouseupFn = setIsScale
            break
        case 'scale-big':
            scaleBig()
            break
        case 'scale-small':
            scaleSmall()
            break
        case 'layer':
            state.isLayer = !state.isLayer
            MouseEventEventListener.setMouseupFn = setLayer
            break
        case 'layer-up':
            console.log('top')
            canvasEditor.up();
            canvasEditor.setAllCuts(false)
            canvasEditor.handleOverallObjs(activeObject, 'top')
            break
        case 'layer-down':
            console.log('down')
            canvasEditor.down();
            canvasEditor.setAllCuts(false)
            canvasEditor.handleOverallObjs(activeObject, 'down')
            break
        case 'layer-top':
            canvasEditor.upTop();
            canvasEditor.setAllCuts(false)
            break
        case 'layer-bottom':
            canvasEditor.downTop();
            canvasEditor.setAllCuts(false)
            break
        case 'createCopy':
            clone();
            break
        case 'copyTo':
            state.copyTo = !state.copyTo
            break
        default:
    }
}


</script>
<style lang="less" scoped>
.box-01 {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.layer-menu {
    background: #fff;
    position: absolute;
    bottom: 38px;
    left: -71px;
    box-shadow: 0 5px 12px 4px rgba(0, 0, 0, .09), 0 3px 6px 0 rgba(0, 0, 0, .12), 0 1px 2px -2px rgba(0, 0, 0, .16);
    overflow: hidden;
    z-index: 88;
    height: 200px;
    width: 80px;
    display: flex;
    flex-direction: column;

    /depp/.ivu-slider-wrap {
        position: absolute;
    }
}

.menu-box {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #F0F2F5;
    border-radius: 20px;
}

.scale-menu {

    position: absolute;
    bottom: 38px;
    box-sizing: border-box;
    width: 86px;
    // height: 80px;
    background: #fff;
    box-shadow: 0 5px 12px 4px rgba(0, 0, 0, .09), 0 3px 6px 0 rgba(0, 0, 0, .12), 0 1px 2px -2px rgba(0, 0, 0, .16);
    border-radius: 5px;
    z-index: 88;
    overflow: hidden;
    left: -41px;

    & {
        color: #333;
    }

    .item {
        cursor: pointer;
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #d8d8d8;
        order-radius: 5px;
    }

    .item:hover {
        background-color: #2d8cf0;
        color: #fff;
    }
}
</style>