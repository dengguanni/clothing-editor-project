<template>
    <div id="img-width" class="aa"></div>
    <div id="img-angle"></div>
    <div id="img-padding"></div>
    <div id="img-offset-x"></div>
    <div id="img-offset-y"></div>
    <div id="img-repeat"></div>
    <div id="c"></div>
</template>
<script>
import useSelect from '@/hooks/select';
import { v4 as uuid } from 'uuid';
import { uiType, paramsFilters, combinationFilters } from '@/config/constants/filter';
import { reactive } from 'vue'
const { fabric, mixinState, canvasEditor } = useSelect();
onMounted(() => {
    fn()
})
const fn = () => {
    // var canvas = new fabric.Canvas('c');
    fabric.Object.prototype.transparentCorners = false;
    var padding = 0;
    fabric.Image.fromURL('http://8.140.206.30:8089/ImageSource/Masks/01.png', function (img) {
        img.scaleToWidth(100);
        var patternSourceCanvas = new fabric.StaticCanvas();
        patternSourceCanvas.add(img);
        patternSourceCanvas.renderAll();
        var pattern = new fabric.Pattern({
            source: patternSourceCanvas.getElement(),
            repeat: 'repeat',
        });

        canvas.add(
            new fabric.Polygon(
                [
                    { x: 185, y: 0 },
                    { x: 250, y: 100 },
                    { x: 385, y: 170 },
                    { x: 0, y: 245 },
                ],
                {
                    left: 0,
                    top: 200,
                    angle: -30,
                    fill: pattern,
                    objectCaching: false,
                },
            ),
        );

        document.getElementById('img-width').oninput = function () {
            img.scaleToWidth(parseInt(this.value, 10));
            patternSourceCanvas.setDimensions({
                width: img.getScaledWidth() + padding,
                height: img.getScaledHeight() + padding,
            });
            canvas.requestRenderAll();
        };
        document.getElementById('img-angle').oninput = function () {
            img.set('angle', this.value);
            patternSourceCanvas.renderAll();
            canvas.requestRenderAll();
        };
        document.getElementById('img-padding').oninput = function () {
            padding = parseInt(this.value, 10);
            patternSourceCanvas.setDimensions({
                width: img.getScaledWidth() + padding,
                height: img.getScaledHeight() + padding,
            });
            canvas.requestRenderAll();
        };
        document.getElementById('img-offset-x').oninput = function () {
            pattern.offsetX = parseInt(this.value, 10);
            canvas.requestRenderAll();
        };
        document.getElementById('img-offset-y').oninput = function () {
            pattern.offsetY = parseInt(this.value, 10);
            canvas.requestRenderAll();
        };
        document.getElementById('img-repeat').onclick = function () {
            pattern.repeat = this.checked ? 'repeat' : 'no-repeat';
            canvas.requestRenderAll();
        };
    });
}
</script>
<style>
.aa{
    height: 20px;
    width: 200px;
}
</style>