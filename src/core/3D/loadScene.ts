import * as THREE from 'three';
import { v4 as uuid } from 'uuid';
import TWEEN from '@tweenjs/tween.js';
// 引入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// 模型加载器，用于加载3D Studio Max软件中的3DS和MAX文件格式
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
class LoadScene {
    static canvasId: string
    static camera: any
    static scene: any
    static renderer: any
    static screenshotList: Array<any> = []

    static loadModel(url: string, name: string) {

        const loader = new GLTFLoader();
        loader.load('public/static/duanxiu1.glb', object => {
            const color = new THREE.Color('0xffffff')
            object.name = name
            object.scene.traverse((child: any) => {
                if (child.isMesh) {
                    const mapTexture = new THREE.TextureLoader().load('public/static/bg-01.png')
                    child.material = new THREE.MeshLambertMaterial({
                        map: mapTexture,
                        transparent: true, // 允许材质可透明
                        // color
                    })
                }
            })
            LoadScene.scene.add(object.scene);
            console.log('LoadScene.scene', LoadScene.scene)
        });
    }
    init(scene: any, camera: any, renderer: any, id: string, callBack: Function) {
        LoadScene.scene = scene
        LoadScene.camera = camera
        LoadScene.renderer = renderer
        // 创建一个场景
        LoadScene.scene = new THREE.Scene();
        LoadScene.scene.background = new THREE.Color(0xffffff);
        // 创建一个相机
        LoadScene.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100);
        // 设置相机的位置
        LoadScene.camera.position.z = 3;
        // 将相机添加到场景中
        LoadScene.scene.add(LoadScene.camera);

        // 添加直线光,并设置光源位置
        const light1 = new THREE.DirectionalLight(0xffffff);
        light1.position.set(0.479, 5.491, 0.636);
        LoadScene.scene.add(light1);
        const light2 = new THREE.DirectionalLight(0xffffff);
        light2.position.set(7.663, 0.215, -0.162);
        LoadScene.scene.add(light2);
        const light3 = new THREE.DirectionalLight(0xffffff);
        light3.position.set(-9.651, 0.310, -0.364);
        LoadScene.scene.add(light3);
        const light4 = new THREE.DirectionalLight(0xffffff);
        light4.position.set(-0.101, 0.711, -7.471);
        LoadScene.scene.add(light4);
        const light5 = new THREE.DirectionalLight(0xffffff);
        light5.position.set(0.393, -0.997, 7.500);
        LoadScene.scene.add(light5);

        // 创建一个渲染器
        LoadScene.renderer = new THREE.WebGLRenderer({
            antialias: true, // 设置抗锯齿
            preserveDrawingBuffer: true,
            alpha: true
        });
        LoadScene.renderer.setClearAlpha(0.0)
        // 设置渲染尺寸
        const height = id == 'big-3d' ? 600 : 280
        const width = id == 'big-3d' ? 600 : 280
        LoadScene.renderer.setSize(height, width);
        // 设置渲染的输出编码
        LoadScene.renderer.outputEncoding = THREE.sRGBEncoding;
        // 将内容渲染到页面中
        document.getElementById(id)?.appendChild(LoadScene.renderer.domElement);

        // 创建轨道控制器
        const control = new OrbitControls(LoadScene.camera, LoadScene.renderer.domElement);
        control.target.set(0, 0, 0);
        // 设置阻尼
        // control.enableDamping = true;
        // LoadScene.loadModel()
        // 创建渲染函数
        const render = () => {
            control.update();
            LoadScene.renderer.render(LoadScene.scene, LoadScene.camera);
            // 通过动画帧来执行函数
            requestAnimationFrame(render);
            TWEEN.update()
        };
        render();
        setTimeout(() => {
            callBack()
        }, 1000);
        console.log('LoadScene.scene', LoadScene.scene)

    }

    setCameraAngle() {
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
        setImage()
        LoadScene.scene.traverse((c: any) => {
            if (c.name == 'duanxiu') {
                c.rotation.y = c.rotation.y - Math.PI / 3
                setImage()
            }
        })
        LoadScene.scene.traverse((c: any) => {
            if (c.name == 'duanxiu') {
                c.rotation.y = c.rotation.y - 2 * Math.PI / 3
                setImage()
            }
        })
        LoadScene.scene.traverse((c: any) => {
            if (c.name == 'duanxiu') {
                c.rotation.y = 0
            }
        })
        return LoadScene.screenshotList
    }

    destroyScene() {
        LoadScene.scene = null
        console.log('销毁')
    }
    getScreenshot() {
        let screenshotList = []
        LoadScene.renderer.render(LoadScene.scene, LoadScene.camera);//renderer为three.js里的渲染器，scene为场景 camera为相机
        let imgData = LoadScene.renderer.domElement.toDataURL("image/jpeg");
        screenshotList.push(imgData)
        return screenshotList
    }
    setModelColor(color1: string, callBack: Function) {
        const color = new THREE.Color(color1)
        const material = new THREE.MeshBasicMaterial({ color })
        LoadScene.scene.traverse((c: any) => {
            if (c.name == 'duanxiu') {
                c.traverse((v: any) => {
                    v.material = material
                })

            }
        })
        setTimeout(() => {
            callBack()
        }, 1000);
    }
    setModelCamera() {
        LoadScene.scene.traverse((c: any) => {
            if (c.name == 'duanxiu') {
                let rotation = { x: c.rotation.x, y: c.rotation.y, z: c.rotation.z };
                let testTween = new TWEEN.Tween(rotation);
                testTween.to({ x: c.rotation.x, y: c.rotation.y - Math.PI / 3, z: c.rotation.z }, 500);
                testTween.onStart(function () {
                    console.log("start");
                }).onUpdate(function (object) {
                    c.rotation.y = object.y
                    console.log("update", object);
                }).onComplete(function () {
                    console.log("complete");
                });
                testTween.easing(TWEEN.Easing.Quadratic.Out);
                testTween.start(); //开始
            }
        })
    }
}
export default LoadScene