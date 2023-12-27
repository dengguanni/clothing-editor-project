<!--
生成广告图场景
-->
<template>
    <div id="canvas-images" class="canvas-images">
    </div>
</template>
  
<script setup >
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { createMultiMaterialObject } from 'three/examples/jsm/utils/SceneUtils.js'
import baseUrl from '@/config/constants/baseUrl';
import { useStore } from 'vuex'
const info = [
    {
        url: '/ProjectTemplate/58871fa2-4b3a-11ee-b1c4-00163e10d08e/3d.glb',
        position: {
            x: 0,
            y: -0.06626868818423806,
            z: -3.989
        },
        rotation: {
            x: -3.1328181934669352,
            y: -0.06626868818423806,
            z: -3.141011592280413
        },
        color: "#F5F5F5",
        imageSize: 300
    }
]
let scene, camera, renderer, control
onMounted(() => {
    initScene()
})

const initScene = () => {
    scene = scene
    camera = camera
    renderer = renderer
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 200);
    camera.position.set(0, 10, 10);
    scene.add(camera);
    scene.background = new THREE.Color("#F5F5F5");
    const light1 = new THREE.DirectionalLight(0xffffff);
    light1.intensity = 1.5
    light1.position.set(0.479, 5.491, 0.636);
    scene.add(light1);
    const light2 = new THREE.DirectionalLight(0xffffff);
    light2.intensity = 1.5
    light2.position.set(7.663, 0.215, -0.162);
    scene.add(light2);
    const light3 = new THREE.DirectionalLight(0xffffff);
    light3.intensity = 1.5
    light3.position.set(-9.651, 0.310, -0.364);
    scene.add(light3);
    const light4 = new THREE.DirectionalLight(0xffffff);
    light4.intensity = 1.5
    light4.position.set(-0.101, 0.711, -7.471);
    scene.add(light4);
    const light5 = new THREE.DirectionalLight(0xffffff);
    light5.intensity = 1.5
    light5.position.set(0.393, -0.997, 7.500);
    scene.add(light5);

    renderer = new THREE.WebGLRenderer({
        antialias: true, // 设置抗锯齿
        preserveDrawingBuffer: true,
        alpha: true
    });
    // 设置渲染尺寸
    const height = 300
    const width = 300
    renderer.setSize(height, width);
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.getElementById('canvas-images')?.appendChild(renderer.domElement);
    control = new OrbitControls(camera, renderer.domElement);
    control.enablePan = false
    control.hylMovePanY = false
    control.hylMovePanX = false
    control.target.set(0,
        0, 0);
    const render = () => {
        control.update();
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };
    render();
    loadModel(info[0])
}
const setTexture = (name, url, callback) => {
    if (url) {
        scene.traverse((child) => {
            if (child.name == name) {
                const normalMap = new THREE.TextureLoader().load(baseUrl + 'ImageSource/Other/Texture.png'); //法线贴图
                const mapTexture = new THREE.TextureLoader().load(url)  //普通贴图
                mapTexture.encoding = THREE.sRGBEncoding
                normalMap.wrapT = 100
                normalMap.wrapS = 100
                normalMap.repeat.set(700, 700)
                child.children[0].material = new THREE.MeshLambertMaterial({
                    map: mapTexture,
                    side: THREE.FrontSide,
                    transparent: false,
                    displacementScale: 0.05,
                    normalScale: new THREE.Vector2(3, 3),
                    normalMap: normalMap,
                })
            }
        })
    }
    callback ? callback() : ''
}
const loadModel = (obj) => {
    if (scene) {
        scene.traverse(c => {
            if (c.isGroup) {
                scene.remove(c);
            }
        })
    }
    scene.background = new THREE.Color(obj.color);
    renderer.setSize(obj.imageSize, obj.imageSize);
    const loader = new GLTFLoader();
    
    const timestamp = Date.parse(new Date());
    // const path = obj.url.slice(25)
    loader.load(baseUrl + obj.url, object => {
        const normalMap = new THREE.TextureLoader().load(baseUrl + 'ImageSource/Other/Texture.png');
        normalMap.wrapT = 100
        normalMap.wrapS = 100
        normalMap.repeat.set(700, 700)
        object.name = name
        let group = new THREE.Group()
        object.scene.traverse(v => {
            // 正文
            if (v.type == 'Mesh') {
                const normalMap = new THREE.TextureLoader().load(baseUrl + 'ImageSource/Other/Texture.png'); //法线贴图
                normalMap.wrapT = 100
                normalMap.wrapS = 100
                normalMap.repeat.set(700, 700)
                const frontMaterial = new THREE.MeshLambertMaterial({
                    map: v.material.map,
                    // color: color,
                    side: THREE.DoubleSide,
                    transparent: false,
                    displacementScale: 0.05,
                    normalMap: normalMap,
                    normalScale: new THREE.Vector2(3, 3),
                })
                const backMaterial = new THREE.MeshLambertMaterial({
                    map: v.material.map,
                    color: 0xffffff,
                    side: THREE.BackSide,
                    transparent: true,
                    opacity: 0.9,
                    displacementScale: 0.05,
                    normalMap: normalMap,
                    normalScale: new THREE.Vector2(3, 3),
                })
                const materials = [frontMaterial, backMaterial];
                const cube = createMultiMaterialObject(v.geometry, materials);
                cube.name = v.name ? v.name : ''
                group.add(cube)
            }
            camera.position.x = obj.position.x
            camera.position.z = obj.position.z
            camera.position.y = obj.position.y
            camera.rotation.x = obj.rotation.x
            camera.rotation.z = obj.rotation.z
            camera.rotation.y = obj.rotation.y
        })
        group.name = name
        scene.add(group);
    });
}
const setImages = () => {
    let imgData = renderer.domElement.toDataURL("image/jpeg");
}
</script>
  
<style scoped lang="less">
.canvas-images {
    position: absolute;
    z-index: -1;
}
</style>
  