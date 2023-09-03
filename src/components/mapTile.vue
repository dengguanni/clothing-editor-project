<template>
    <div class="box-01">
        <div class="bg-sq-02" v-for="item in menuList1" :key="item.type">
            {{ item.label }}
        </div>
    </div>
    <div class="box-01">
        <div class="bg-sq-02" v-for="item in filterList" :key="item.type" style="width: 87px;" @click="btnClick(item.type)">
            {{ item.label }}
        </div>
    </div>
    <div class="bg-sq-03">
        <Tooltip :content="item.label" v-for="(item, i ) in menuList3" :key="item">
            <div style="cursor: pointer;" @click="menu3Click(item.type)">
                <span v-html="item.svg" style="margin: 0px"></span>
            </div>
            <div v-show="item.type == 'scale'">999</div>
        </Tooltip>
    </div>
    <Lock v-show="false" :isLock="state.isLock"></Lock>
</template>
<script setup >
import { ref } from 'vue'
import { Tooltip } from 'view-ui-plus';
import useSelect from '@/hooks/select';
import { debounce } from 'lodash-es';
import Lock from '@/components/lock.vue'
const { mixinState, canvasEditor } = useSelect();
const event = inject('event');
const emit = defineEmits()
const state = reactive({
    isLock: false
})

const menuList1 = [
    {
        type: 'basic',
        label: '基础平铺'
    },
    {
        type: 'mirror',
        label: '镜像平铺'
    },
    {
        type: 'transverse',
        label: '横向平铺'
    },
    {
        type: 'direction',
        label: '纵向平铺'
    },
    {
        type: 'matting',
        label: '抠图'
    }
]
const filterList = [
    {
        type: 'clearness',
        label: '清晰'
    },
    {
        type: 'filter',
        label: '滤镜'
    },
    {
        type: 'cropping',
        label: '裁剪'
    }
]
const menuList3 = [
    {
        type: 'scale',
        label: '缩放',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><defs><style>.a{fill:#fff;opacity:0;}.b,.c{fill:none;stroke:#4e5969;stroke-linejoin:round;stroke-width:1.5px;}.c{stroke-linecap:round;}</style></defs><g transform="translate(-95 -178)"><rect class="a" width="20" height="20" transform="translate(95 178)"/><g transform="translate(93.695 176.695)"><path class="b" d="M10.587,17.173A6.587,6.587,0,1,0,4,10.587,6.587,6.587,0,0,0,10.587,17.173Z"/><path class="c" d="M33.222,33.222l3.288,3.288" transform="translate(-17.9 -17.9)"/></g></g></svg>'
    },
    {
        type: 'createCopy',
        label: '图层',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><defs><style>.a{fill:#fff;opacity:0;}.b,.c{fill:none;stroke:#4e5969;stroke-linejoin:round;stroke-width:1.5px;}.c{stroke-linecap:round;}.d{fill:#4e5969;}</style></defs><g transform="translate(-3616 202)"><rect class="a" width="20" height="20" transform="translate(3616 -202)"/><g transform="translate(-0.492 -1.025)"><g transform="translate(3613.885 -203.86)"><path class="b" d="M4,7.813,12.138,10.7l8.138-2.883L12.138,5Z"/><path class="c" d="M4,20l8.138,2.848,3.147-.92" transform="translate(0 -6.896)"/><path class="c" d="M4,36l8.138,2.848s1.906-.467,3.941-1.179" transform="translate(0 -18.386)"/></g><path class="d" d="M2019.542-1368.653l-.25.25.021-4.164.229.229a.655.655,0,0,0,.467.193.655.655,0,0,0,.466-.193.66.66,0,0,0,0-.933l-1.368-1.368a.659.659,0,0,0-.933,0l-1.368,1.368a.66.66,0,0,0,0,.933.659.659,0,0,0,.933,0l.255-.254-.021,4.173-.234-.234a.66.66,0,0,0-.933,0,.66.66,0,0,0,0,.933l1.368,1.368a.655.655,0,0,0,.467.193.657.657,0,0,0,.466-.193l1.368-1.368a.66.66,0,0,0,0-.933A.66.66,0,0,0,2019.542-1368.653Z" transform="translate(1614.433 1183.069)"/></g></g></svg>'
    },
    {
        type: 'createCopy',
        label: '创建副本',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><defs><style>.a{fill:#fff;opacity:0;}.b{fill:none;stroke:#4e5969;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;}</style></defs><g transform="translate(-3662 203)"><rect class="a" width="20" height="20" transform="translate(3662 -203)"/><g transform="translate(3658 -205)"><path class="b" d="M8.757,19.146h10.6a.757.757,0,0,0,.757-.757V7.787H16.33V4H8.757A.757.757,0,0,0,8,4.757V18.389A.757.757,0,0,0,8.757,19.146Z"/><path class="b" d="M30,4l3.787,3.787" transform="translate(-13.67)"/></g></g></svg>'
    },
    {
        type: 'copyTo',
        label: '复制至其他印刷面',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><defs><style>.a{fill:#fff;opacity:0;}.b{fill:none;stroke:#4e5969;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;}</style></defs><g transform="translate(-3708 203)"><rect class="a" width="20" height="20" transform="translate(3708 -203)"/><g transform="translate(3703 -205)"><path class="b" d="M20.117,11.194V7.787L16.709,4H8.757A.757.757,0,0,0,8,4.757V18.389a.757.757,0,0,0,.757.757h9.626"/><path class="b" d="M26,35h5.3" transform="translate(-9.184 -20.262)"/><path class="b" d="M30,4V7.787h3.787" transform="translate(-13.67)"/><path class="b" d="M18.76,13.031l1.574,1.884L18.76,16.488" transform="translate(2)"/></g></g></svg>'
    },
    {
        type: 'lock',
        label: '锁定/解锁',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><defs><style>.a{fill:#fff;opacity:0;}.b,.c{fill:none;stroke:#4e5969;stroke-linejoin:round;stroke-width:1.5px;}.c{stroke-linecap:round;}</style></defs><g transform="translate(-3754 203)"><rect class="a" width="20" height="20" transform="translate(3754 -203)"/><g transform="translate(3750 -205)"><rect class="b" width="13.595" height="8.797" rx="2" transform="translate(7 11.216)"/><path class="c" d="M14,11.2V8a4.043,4.043,0,0,1,8-.8" transform="translate(-4.201)"/><path class="c" d="M24,30v2.4" transform="translate(-10.202 -15.604)"/></g></g></svg>'
    },
    {
        type: 'delete',
        label: '删除',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><defs><style>.a{fill:#fff;opacity:0;}.b,.c,.d{fill:none;stroke:#4e5969;stroke-width:1.5px;}.b,.d{stroke-linejoin:round;}.c,.d{stroke-linecap:round;}.d{fill-rule:evenodd;}</style></defs><g transform="translate(-3803 203)"><rect class="a" width="20" height="20" transform="translate(3803 -203)"/><g transform="translate(3799.506 -205.522)"><path class="b" d="M15,7.787,15.478,5h6.211l.478,2.787" transform="translate(-5.417)"/><path class="c" d="M6,12H20.334" transform="translate(0 -4.213)"/><path class="d" d="M21.352,12l-.8,12.343H11.8L11,12Z" transform="translate(-3.009 -4.213)"/><path class="c" d="M19,35h3.982" transform="translate(-7.824 -18.055)"/></g></g></svg>'

    }
];
const del = debounce(function () {
    canvasEditor.del();
}, 300);
const btnClick = (item) => {
    emit('btnClick', item);
};

const menu3Click = (type) => {
    switch (type) {
        case 'delete':
            del()
            break
        case 'lock':
            state.isLock = !state.isLock
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
</style>