
<template>
    <div class="paving" v-if="mixinState.mSelectMode === 'one' && !selected.hasCropping">
        <Tooltip :content="item.label" v-for="(item, i ) in svgList" :key="item.type">
            <greyButton @buttonClick="changeSelection(item)" :width="64" :disabled="item.disabled" :type="item.iconType"
                :svg="item.svg">
            </greyButton>
            <!-- <commonIconfont type="background" size="26"></commonIconfont> -->
        </Tooltip>
    </div>
</template>
  
<script lang="ts" setup>
import { reactive } from 'vue'
import useSelect from '@/hooks/select';
import MaximizePlugin from '@/core/plugin/MaximizePlugin.ts'
import greyButton from '@/components/common/greyButton.vue'
import buttonLimitions from '@/core/limitations/buttonLimitions'
import commonIconfont from '@/components/fontClass/commonIconfont.vue'
import { useStore } from 'vuex'
const store = useStore()
const { mixinState, canvasEditor }: any = useSelect();
const handleLock = computed(() => {
    return store.state.handleLock
});

const selected = computed(() => {
    return store.state.selected
});

watch(handleLock, (newVal, oldVal) => {
    if (newVal) {
        const activeObject = canvasEditor.canvas.getActiveObject()
        buttonLimitions(svgList, activeObject)
    }
}, { immediate: true, deep: true });
onMounted(() => {
    MaximizePlugin.canvasEditor = canvasEditor
})
const svgList = reactive([
    {
        label: '设计最大化',
        type: 'bigFull',
        disabled: false,
        iconType: 'fangda',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27"><defs><style>.a{fill:#fff;opacity:0;}.a,.b{stroke:#4e5969;}.b{fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}</style></defs><g transform="translate(-1509.681 1523.472)"><path class="a" d="M0,0H26V26H0Z" transform="translate(1510.181 -1522.972)"/><path class="b" d="M1514.181-1518.972l5,4.949"/><path class="b" d="M1514.181-1501.023l5-4.949"/><path class="b" d="M1532.181-1501.023l-4.95-4.949"/><path class="b" d="M1532.131-1518.972l-4.95,4.949"/><path class="b" d="M1527.681-1518.972h4.5v4.5"/><path class="b" d="M1532.181-1505.472v4.5h-4.5"/><path class="b" d="M1518.681-1500.972h-4.5v-4.5"/><path class="b" d="M1514.181-1514.472v-4.5h4.5"/></g></svg>'
    },
    {
        label: '铺满设计区域',
        disabled: false,
        type: 'full',
        iconType: 'fangda-copy',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27"><defs><style>.a{fill:#fff;opacity:0;}.a,.b{stroke:#4e5969;}.b{fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}</style></defs><g transform="translate(-1581.681 1523.472)"><rect class="a" width="26" height="26" transform="translate(1582.181 -1522.972)"/><path class="b" d="M1586.181-1501.023l5-4.949"/><path class="b" d="M1604.131-1518.972l-4.95,4.949"/><path class="b" d="M1599.681-1518.972h4.5v4.5"/><path class="b" d="M1590.681-1500.972h-4.5v-4.5"/></g></svg>',
    },
    {
        label: '高度最大化',
        disabled: false,
        type: 'height',
        iconType: 'chuizhifangda',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27"><defs><style>.a{fill:#fff;opacity:0;}.a,.b{stroke:#4e5969;}.b{fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}</style></defs><g transform="translate(-1653 1523.032)"><rect class="a" width="26" height="26" transform="translate(1653.5 -1522.532)"/><path class="b" d="M1666.668-1504.158l.035-7.035"/><path class="b" d="M1666.686-1514.905v7"/><path class="b" d="M1663.5-1512.8l2.144-2.144,2.144,2.144" transform="translate(1.038 -0.481)"/><path class="b" d="M1663.5-1512.8l2.144-2.144,2.144,2.144" transform="translate(3332.334 -3019.099) rotate(180)"/><line class="b" x2="14" transform="translate(1659.5 -1518.032)"/><line class="b" x2="14" transform="translate(1659.5 -1501.032)"/></g></svg>'
    },
    {
        label: '宽度最大化',
        disabled: false,
        iconType: 'huizhifangda-copy',
        type: 'width',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27"><defs><style>.a{fill:#fff;opacity:0;}.a,.b{stroke:#4e5969;}.b{fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}</style></defs><g transform="translate(-1496.032 -1653) rotate(90)"><rect class="a" width="26" height="26" transform="translate(1653.5 -1522.532)"/><path class="b" d="M1666.668-1504.158l.035-7.035"/><path class="b" d="M1666.686-1514.905v7"/><path class="b" d="M1663.5-1512.8l2.144-2.144,2.144,2.144" transform="translate(1.038 -0.481)"/><path class="b" d="M1663.5-1512.8l2.144-2.144,2.144,2.144" transform="translate(3332.334 -3019.099) rotate(180)"/><line class="b" x2="14" transform="translate(1659.5 -1518.032)"/><line class="b" x2="14" transform="translate(1659.5 -1501.032)"/></g></svg>'
    }
]
)
const changeSelection = (item) => {
    MaximizePlugin.setMax(item.type)
    canvasEditor.setAllCuts(false)
}

</script>
  
<style scoped lang="less">
.paving {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}
</style>
  