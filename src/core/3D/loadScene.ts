import * as THREE from 'three';
import { v4 as uuid } from 'uuid';
import TWEEN from '@tweenjs/tween.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { createMultiMaterialObject } from 'three/examples/jsm/utils/SceneUtils.js'
import baseUrl from '@/config/constants/baseUrl';
import { useStore } from 'vuex'
class LoadScene {
    store = useStore()
    static canvasId: string = 'small-3d'
    static camera: any
    static scene: any
    static renderer: any
    static control: any
    static screenshotList: Array<any> = []
    static loadModel(url: string, name: string, modelColor: any = null) {
        if (LoadScene.scene) {
            LoadScene.scene.traverse(c => {
                if (c.isGroup) {
                    LoadScene.scene.remove(c);
                }
            })
        }
        const loader = new GLTFLoader();
        loader.load(baseUrl + 'ProjectTemplate/58871fa2-4b3a-11ee-b1c4-00163e10d08e/duanxiu.glb', object => {
            const normalMap = new THREE.TextureLoader().load(baseUrl + 'ImageSource/Other/Texture.png');
            normalMap.wrapT = 100
            normalMap.wrapS = 100
            normalMap.repeat.set(700, 700)
            object.name = name
            let group = new THREE.Group()
            object.scene.traverse(v => {
                if (v.type == 'Mesh' && modelColor) {
                    const color = new THREE.Color(modelColor)
                    const normalMap = new THREE.TextureLoader().load(baseUrl + 'ImageSource/Other/Texture.png'); //法线贴图
                    normalMap.wrapT = 100
                    normalMap.wrapS = 100
                    normalMap.repeat.set(700, 700)
                    const frontMaterial = new THREE.MeshLambertMaterial({
                        map: v.material.map,
                        color: color,
                        side: THREE.FrontSide,
                        transparent: false,
                        displacementScale: 0.05,
                        normalMap: normalMap,
                        normalScale: new THREE.Vector2(3, 3),
                    })
                    const backMaterial = new THREE.MeshLambertMaterial({
                        map: v.material.map,
                        color: 0xffffff,
                        side: THREE.BackSide,
                        transparent: false,
                        displacementScale: 0.05,
                        normalMap: normalMap,
                        normalScale: new THREE.Vector2(3, 3),
                    })
                    const materials = [frontMaterial, backMaterial];
                    const cube = createMultiMaterialObject(v.geometry, materials);
                    cube.name = v.name ? v.name : ''
                    group.add(cube)
                }
            })
            group.name = name
            LoadScene.scene.add(group);
        });

    }

    static setTexture = (name, url, callback) => {
        if (url) {
            LoadScene.scene.traverse((child: any) => {
                if (child.isMesh && child.name == name) {
                    const mapTexture = new THREE.TextureLoader().load(url)
                    const normalMap = new THREE.TextureLoader().load(baseUrl + 'ImageSource/Other/Texture.png');
                    mapTexture.encoding = THREE.sRGBEncoding
                    normalMap.wrapT = 10000
                    normalMap.wrapS = 10000
                    child.material = new THREE.MeshLambertMaterial({
                        map: mapTexture,
                        side: THREE.DoubleSide,
                        transparent: false,
                        displacementScale: 0.05,
                        normalMap: normalMap,//凹凸贴图
                        normalScale: new THREE.Vector2(3, 3),
                    })
                }
            })
        }
        callback ? callback() : ''
    }
    setTexture = (name, url, callback) => {
        if (url) {
            LoadScene.scene.traverse((child: any) => {
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
        setTimeout(() => {
            LoadScene.canvasId == 'big-3d' ? this.getScreenshotList('big') : this.getScreenshotList('small')
        }, 100);
    }
    init(scene: any, camera: any, renderer: any, id: string, callBack: Function) {
        LoadScene.scene = scene
        LoadScene.camera = camera
        LoadScene.renderer = renderer
        LoadScene.scene = new THREE.Scene();
        LoadScene.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 200);
        LoadScene.camera.position.set(-0.08928988914516146, -0.1569660082212971, -3.169317572406974);
        LoadScene.scene.add(LoadScene.camera);
        LoadScene.scene.background = new THREE.Color("#F5F5F5");
        const light1 = new THREE.DirectionalLight(0xffffff);
        light1.intensity = 1.5
        light1.position.set(0.479, 5.491, 0.636);
        LoadScene.scene.add(light1);
        const light2 = new THREE.DirectionalLight(0xffffff);
        light2.intensity = 1.5
        light2.position.set(7.663, 0.215, -0.162);
        LoadScene.scene.add(light2);
        const light3 = new THREE.DirectionalLight(0xffffff);
        light3.intensity = 1.5
        light3.position.set(-9.651, 0.310, -0.364);
        LoadScene.scene.add(light3);
        const light4 = new THREE.DirectionalLight(0xffffff);
        light4.intensity = 1.5
        light4.position.set(-0.101, 0.711, -7.471);
        LoadScene.scene.add(light4);
        const light5 = new THREE.DirectionalLight(0xffffff);
        light5.intensity = 1.5
        light5.position.set(0.393, -0.997, 7.500);
        LoadScene.scene.add(light5);

        // 创建一个渲染器
        LoadScene.renderer = new THREE.WebGLRenderer({
            antialias: true, // 设置抗锯齿
            preserveDrawingBuffer: true,
            alpha: true
        });
        // 设置渲染尺寸
        const height = id == 'big-3d' ? 600 : 280
        const width = id == 'big-3d' ? 600 : 280

        LoadScene.renderer.setSize(height, width);
        // 设置渲染的输出编码
        LoadScene.renderer.outputEncoding = THREE.sRGBEncoding;
        // 将内容渲染到页面中
        document.getElementById(id)?.appendChild(LoadScene.renderer.domElement);

        // 创建轨道控制器
        LoadScene.control = new OrbitControls(LoadScene.camera, LoadScene.renderer.domElement);
        LoadScene.control.enablePan = true
        LoadScene.control.hylMovePanY = false
        LoadScene.control.hylMovePanX = true
        LoadScene.control.target.set(-0.017017322512750035,
            -0.13816378273860236, 0.01996416024727918);

        LoadScene.control.enablePan = false
        LoadScene.control.saveState()
        const render = () => {
            LoadScene.control.update();
            LoadScene.renderer.render(LoadScene.scene, LoadScene.camera);
            // 通过动画帧来执行函数
            requestAnimationFrame(render);
            TWEEN.update()
        };
        render();
        setTimeout(() => {
            callBack()
        }, 1000);
    }
    static change3dBox = (id, callback) => {
        const height = id == 'big-3d' ? 600 : 280
        const width = id == 'big-3d' ? 600 : 280
        this.canvasId = id
        LoadScene.renderer.setSize(height, width);
        document.getElementById(id)?.appendChild(LoadScene.renderer.domElement);
        callback ? callback() : ''
    }
    getScreenshotList(size) {
        LoadScene.screenshotList = []
        const setImage = () => {
            LoadScene.renderer.render(LoadScene.scene, LoadScene.camera)
            let imgData = LoadScene.renderer.domElement.toDataURL("image/jpeg");
            const obj = {
                src: imgData,
                id: uuid()
            }
            LoadScene.screenshotList.push(obj)
        }

        LoadScene.control.reset()
        LoadScene.scene.traverse((c: any) => {
            if (c.name == 'duanxiu') {
                c.position.set(0, 0, 0)
                c.rotation.set(0, 0, 0)
                c.rotation.y = 0
                setImage()
                c.rotation.y = Math.PI / 2
                setImage()
                c.rotation.y = Math.PI
                setImage()
                c.position.set(0, 0, 0)
                c.rotation.set(0, 0, 0)
                c.rotation.y = 0
            }

        })
        let obj: any = {}
        obj[size] = LoadScene.screenshotList
        this.store.commit('setScreenshotList', obj)
        return LoadScene.screenshotList
    }
    destroyScene() {
        LoadScene.scene = null
    }
    getScreenshot() {
        let screenshotList = []
        LoadScene.renderer.render(LoadScene.scene, LoadScene.camera);//renderer为three.js里的渲染器，scene为场景 camera为相机
        let imgData = LoadScene.renderer.domElement.toDataURL("image/jpeg");
        screenshotList.push(imgData)
        return screenshotList
    }

    setModelCamera(direction: string) {
        if (LoadScene.scene) {
            LoadScene.scene.traverse((c: any) => {
                const setModelRotation = (targetPosition: any) => {
                    let position = { x: LoadScene.camera.position.x, y: LoadScene.camera.position.y, z: LoadScene.camera.position.z };
                    let testTween = new TWEEN.Tween(position);
                    testTween.to({ x: targetPosition.x, y: targetPosition.y, z: targetPosition.z }, 1000);
                    testTween.onStart(function () {
                    }).onUpdate(function (object) {
                        LoadScene.camera.position.x = object.x
                        LoadScene.camera.position.z = object.z
                        LoadScene.camera.position.y = object.y
                    }).onComplete(function () {
                    });
                    testTween.easing(TWEEN.Easing.Quadratic.Out);
                    testTween.start(); //开始
                }
                if (c.name == 'duanxiu') {
                    if (direction.includes('左')) {
                        setModelRotation({ x: 2.7697086512561713, y: -0.7981105367000209, z: 0.8317052112167073 })
                    } else if (direction.includes('右')) {
                        setModelRotation({ x: -2.8087046119192127, y: -0.7981105367000209, z: 0.8317052112167073 })
                    } else if (direction.includes('前')) {
                        setModelRotation({ x: 0.06689093537133349, y: -0.33589342830992186, z: -3 })
                    } else if (direction.includes('后')) {
                        setModelRotation({ x: 0.06689093537133349, y: -0.33589342830992186, z: 2.980386083644747 })
                    } else {
                        setModelRotation({ x: 0.06689093537133349, y: -0.33589342830992186, z: -3 })
                    }
                }
            })
        }

    }
}
export default LoadScene