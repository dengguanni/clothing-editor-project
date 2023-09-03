
<template>
    <div class="icon">
        <span v-html="svgList[props.angleKey]" ></span>

    </div>
</template>
  
<script lang="ts" setup>
import { ImagePreview } from 'view-ui-plus';
import { ref, reactive } from 'vue'
const props = defineProps({
    angleKey: {
        type: String,
        default: 'full',
    },
    color: {
        type: [Object, String],
        default: '',
    },
});
const svgList = reactive(

    {
        bigFull: '<svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27"><defs><style>.a{fill:#fff;opacity:0;}.a,.b{stroke:#4e5969;}.b{fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}</style></defs><g transform="translate(-1509.681 1523.472)"><path class="a" d="M0,0H26V26H0Z" transform="translate(1510.181 -1522.972)"/><path class="b" d="M1514.181-1518.972l5,4.949"/><path class="b" d="M1514.181-1501.023l5-4.949"/><path class="b" d="M1532.181-1501.023l-4.95-4.949"/><path class="b" d="M1532.131-1518.972l-4.95,4.949"/><path class="b" d="M1527.681-1518.972h4.5v4.5"/><path class="b" d="M1532.181-1505.472v4.5h-4.5"/><path class="b" d="M1518.681-1500.972h-4.5v-4.5"/><path class="b" d="M1514.181-1514.472v-4.5h4.5"/></g></svg>',
        full: '<svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27"><defs><style>.a{fill:#fff;opacity:0;}.a,.b{stroke:#4e5969;}.b{fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}</style></defs><g transform="translate(-1581.681 1523.472)"><rect class="a" width="26" height="26" transform="translate(1582.181 -1522.972)"/><path class="b" d="M1586.181-1501.023l5-4.949"/><path class="b" d="M1604.131-1518.972l-4.95,4.949"/><path class="b" d="M1599.681-1518.972h4.5v4.5"/><path class="b" d="M1590.681-1500.972h-4.5v-4.5"/></g></svg>',
        height: '<svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27"><defs><style>.a{fill:#fff;opacity:0;}.a,.b{stroke:#4e5969;}.b{fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}</style></defs><g transform="translate(-1653 1523.032)"><rect class="a" width="26" height="26" transform="translate(1653.5 -1522.532)"/><path class="b" d="M1666.668-1504.158l.035-7.035"/><path class="b" d="M1666.686-1514.905v7"/><path class="b" d="M1663.5-1512.8l2.144-2.144,2.144,2.144" transform="translate(1.038 -0.481)"/><path class="b" d="M1663.5-1512.8l2.144-2.144,2.144,2.144" transform="translate(3332.334 -3019.099) rotate(180)"/><line class="b" x2="14" transform="translate(1659.5 -1518.032)"/><line class="b" x2="14" transform="translate(1659.5 -1501.032)"/></g></svg>',
        width: '<svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27"><defs><style>.a{fill:#fff;opacity:0;}.a,.b{stroke:#4e5969;}.b{fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}</style></defs><g transform="translate(-1496.032 -1653) rotate(90)"><rect class="a" width="26" height="26" transform="translate(1653.5 -1522.532)"/><path class="b" d="M1666.668-1504.158l.035-7.035"/><path class="b" d="M1666.686-1514.905v7"/><path class="b" d="M1663.5-1512.8l2.144-2.144,2.144,2.144" transform="translate(1.038 -0.481)"/><path class="b" d="M1663.5-1512.8l2.144-2.144,2.144,2.144" transform="translate(3332.334 -3019.099) rotate(180)"/><line class="b" x2="14" transform="translate(1659.5 -1518.032)"/><line class="b" x2="14" transform="translate(1659.5 -1501.032)"/></g></svg>',
        withdraw: '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26"><defs><style>.a{fill:#fff;opacity:0;}.b{fill:none;stroke:#4e5969;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}</style></defs><g transform="translate(-397 -14)"><rect class="a" width="26" height="26" transform="translate(397 14)"/><g transform="translate(395 11)"><path class="b" d="M9.5,8,6,11l3.5,3.5"/><path class="b" d="M6,14H17.5a6.5,6.5,0,1,1,0,13H9" transform="translate(0 -3)"/></g></g></svg>',
        redo: '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26"><defs><style>.a{fill:#fff;opacity:0;}.b{fill:none;stroke:#dce1e9;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}</style></defs><rect class="a" width="26" height="26"/><g transform="translate(4 5)"><path class="b" d="M6,8l3.5,3L6,14.5" transform="translate(8.5 -8)"/><path class="b" d="M24,14H12.5a6.5,6.5,0,1,0,0,13H21" transform="translate(-6 -11)"/></g></svg>',
        empty: '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26"><defs><style>.a,.c{fill:#4e5969;}.a{opacity:0;}.b,.d,.e{fill:none;stroke-linecap:round;}.b,.c,.e{stroke:#4e5969;}.b,.c,.d,.e{stroke-linejoin:round;stroke-width:2px;}.b{fill-rule:evenodd;}.d{stroke:#fff;}</style></defs><rect class="a" width="26" height="26"/><g transform="translate(-498 -16)"><g transform="translate(496 14.086)"><path class="b" d="M12.5,5.914h4v4H24v4H5v-4h7.5Z"/><path class="c" d="M8,31H24V22H8Z" transform="translate(-1.5 -8.041)"/><path class="d" d="M16,36.906V33.914" transform="translate(-5.499 -13.997)"/><path class="d" d="M24,36.9v-3" transform="translate(-9.498 -13.989)"/><path class="d" d="M32,36.906V33.914" transform="translate(-13.497 -13.997)"/><path class="e" d="M12,40H24" transform="translate(-3.499 -17.04)"/></g></g></svg>',
        gridLine: '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26"><defs><style>.a{fill:#4e5969;opacity:0;}.b,.c{fill:none;stroke:#4e5969;stroke-width:2px;}.c{stroke-linecap:round;}</style></defs><rect class="a" width="26" height="26"/><g transform="translate(-591 -46.997)"><g transform="translate(589 44.997)"><path class="b" d="M22.653,6H7.35A1.35,1.35,0,0,0,6,7.35v15.3A1.35,1.35,0,0,0,7.35,24h15.3A1.35,1.35,0,0,0,24,22.653V7.35A1.35,1.35,0,0,0,22.653,6Z"/><path class="c" d="M24,6V24" transform="translate(-8.998)"/><path class="c" d="M6,24H24" transform="translate(0 -8.998)"/></g></g></svg>',
        auxiliarylLine: '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26"><defs><style>.a,.b{fill:#4e5969;}.a{opacity:0;}.b,.c{stroke:#4e5969;stroke-width:2px;}.c{fill:none;stroke-linecap:round;}</style></defs><g transform="translate(-609 -14)"><rect class="a" width="26" height="26" transform="translate(609 14)"/><g transform="translate(-0.476 1)"><path class="b" d="M14.325,6H6.675A.675.675,0,0,0,6,6.675v7.65A.675.675,0,0,0,6.675,15h7.65A.675.675,0,0,0,15,14.325V6.675A.675.675,0,0,0,14.325,6Z" transform="translate(616.003 12)"/><path class="c" d="M24,6v4.793" transform="translate(592.873 23.75)"/><g transform="translate(616.873 18)"><path class="c" d="M24,6v.623" transform="translate(-24 1.811)"/><path class="c" d="M24,6v.623" transform="translate(-24 -2.129)"/><path class="c" d="M24,6v.623" transform="translate(-24 -6)"/></g><g transform="translate(622.764 32.146) rotate(-90)"><path class="c" d="M0,0V.623" transform="translate(0 7.811)"/><path class="c" d="M0,0V.623" transform="translate(0 3.871)"/><path class="c" d="M0,0V.623" transform="translate(0 0)"/></g><path class="c" d="M6,24h4.793" transform="translate(608.476 8.146)"/></g></g></svg>',
        gallery: '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30"><defs><style>.a{fill:#fff;opacity:0;}.b{fill:#3064f2;}</style></defs><g transform="translate(-18 -115)"><rect class="a" width="30" height="30" transform="translate(18 115)"/><g transform="translate(204 1005)"><path class="b" d="M-162-884h-17a2,2,0,0,0-2,2v14a2,2,0,0,0,2,2h17a2,2,0,0,0,2-2v-14A2,2,0,0,0-162-884Zm0,2v9.976l-6.893-5.27a1,1,0,0,0-1.366.143l-2.371,2.766-1.745-1.4a1,1,0,0,0-1.332.074L-179-872.414V-882Z"/><path class="b" d="M-175.25-877a1.752,1.752,0,0,0,1.75-1.75,1.752,1.752,0,0,0-1.75-1.75,1.752,1.752,0,0,0-1.75,1.75A1.752,1.752,0,0,0-175.25-877Z"/></g></g></svg>',
        background: '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30"><defs><style>.a{fill:#4e5969;opacity:0;}</style></defs><rect class="a" width="30" height="30"/></svg>',
        text: '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30"><defs><style>.a{fill:#4e5969;opacity:0;}.b{fill:none;stroke:#4e5969;stroke-linecap:square;stroke-width:2px;}</style></defs><g transform="translate(-18 -115)"><rect class="a" width="30" height="30" transform="translate(18 115)"/><g transform="translate(202.914 881.736)"><path class="b" d="M-174.834-753.846v-1.363h8.839v1.363"/><path class="b" d="M-170.414-755.209v9.945"/><path class="b" d="M-172.624-745.264h4.42"/><rect class="b" width="19" height="19" rx="2.25" transform="translate(-179.914 -760.736)"/></g></g></svg>',
        upload: '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30"><defs><style>.a,.b{fill:#4e5969;}</style></defs><g transform="translate(-18 -115)"><rect class="a" width="30" height="30" transform="translate(18 115)"/><g transform="translate(204 818.945)"><path class="b" d="M-164.031-691.548a7.006,7.006,0,0,0-6.969-6.4,7.007,7.007,0,0,0-6.967,6.352A5.961,5.961,0,0,0-182-685.945a6.006,6.006,0,0,0,6,6,5.988,5.988,0,0,0,1.639-.227,1,1,0,0,0,.689-1.235,1,1,0,0,0-1.235-.689,4.01,4.01,0,0,1-1.093.151,4,4,0,0,1-4-4,3.986,3.986,0,0,1,3.07-3.892.963.963,0,0,0,.477-.293.982.982,0,0,0,.453-.815,5.006,5.006,0,0,1,5-5,5.006,5.006,0,0,1,5,5,.927.927,0,0,0,.044.217.988.988,0,0,0,.752.891,3.985,3.985,0,0,1,3.07,3.892,4,4,0,0,1-4,4,4.01,4.01,0,0,1-1.093-.151,1,1,0,0,0-1.235.689,1,1,0,0,0,.689,1.235,5.993,5.993,0,0,0,1.639.227,6.006,6.006,0,0,0,6-6A5.963,5.963,0,0,0-164.031-691.548Z"/><path class="b" d="M-168.138-686.235a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.3,1,1,0,0,0-.006-1.414l-3.566-3.538a1,1,0,0,0-1.412,0l-3.467,3.479a1,1,0,0,0,0,1.414,1,1,0,0,0,1.414,0l1.759-1.765v6.118a1,1,0,0,0,1,1,1,1,0,0,0,1-1v-6.137Z"/></g></g></svg>',
        layer: '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30"><defs><style>.a{fill:#4e5969;}.b{fill:#4e5969;}.a{opacity:0;}</style></defs><g transform="translate(-18 -115)"><rect class="a" width="30" height="30" transform="translate(18 115)"/><g transform="translate(202.638 757.445)"><path class="b" d="M-179.972-632.045l10,3.543a1.01,1.01,0,0,0,.334.057,1.006,1.006,0,0,0,.334-.057l10-3.543a1,1,0,0,0,.666-.947,1,1,0,0,0-.673-.941l-10-3.457a1,1,0,0,0-.653,0l-10,3.457a1,1,0,0,0-.674.941A1,1,0,0,0-179.972-632.045Zm10.334-3.342,6.973,2.411-6.973,2.47-6.972-2.47Z"/><path class="b" d="M-159.968-629.889l-9.67,3.385-9.669-3.385a1,1,0,0,0-1.275.614,1,1,0,0,0,.614,1.274l10,3.5a.983.983,0,0,0,.33.056.989.989,0,0,0,.331-.056l10-3.5a1,1,0,0,0,.613-1.274A1,1,0,0,0-159.968-629.889Z"/><path class="b" d="M-159.968-625.889l-9.67,3.385-9.669-3.385a1,1,0,0,0-1.275.614,1,1,0,0,0,.614,1.274l10,3.5a.983.983,0,0,0,.33.056.989.989,0,0,0,.331-.056l10-3.5a1,1,0,0,0,.613-1.274A1,1,0,0,0-159.968-625.889Z"/><path class="b" d="M-159.968-621.889l-9.67,3.385-9.669-3.385a1,1,0,0,0-1.275.614,1,1,0,0,0,.614,1.274l10,3.5a.983.983,0,0,0,.33.056.989.989,0,0,0,.331-.056l10-3.5a1,1,0,0,0,.613-1.274A1,1,0,0,0-159.968-621.889Z"/></g></g></svg>',
        'background-1': '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30"><defs><style>.a{fill:#fff;opacity:0;}.b{fill:#3064f2;}</style></defs><g transform="translate(-18 -115)"><rect class="a" width="30" height="30" transform="translate(18 115)"/><g transform="translate(204 1005)"><path class="b" d="M-162-884h-17a2,2,0,0,0-2,2v14a2,2,0,0,0,2,2h17a2,2,0,0,0,2-2v-14A2,2,0,0,0-162-884Zm0,2v9.976l-6.893-5.27a1,1,0,0,0-1.366.143l-2.371,2.766-1.745-1.4a1,1,0,0,0-1.332.074L-179-872.414V-882Z"/><path class="b" d="M-175.25-877a1.752,1.752,0,0,0,1.75-1.75,1.752,1.752,0,0,0-1.75-1.75,1.752,1.752,0,0,0-1.75,1.75A1.752,1.752,0,0,0-175.25-877Z"/></g></g></svg>',
        qq: ''

    }
)

</script>
  
<style scoped lang="less">
.icon {
    display: inline-block;

}

.a {
    fill: #fff;
    opacity: 0;
}
.a,
.b {
    fill: #3064f2;
}

span.active {
    svg.icon {
        fill: #2d8cf0;
    }
}</style>
  