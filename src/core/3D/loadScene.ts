import * as THREE from 'three';
import { v4 as uuid } from 'uuid';
import TWEEN from '@tweenjs/tween.js';
// 引入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// 模型加载器，用于加载3D Studio Max软件中的3DS和MAX文件格式
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
class LoadScene {
    static canvasId: string
    static camera: any
    static scene: any
    static renderer: any
    static screenshotList: Array<any> = []

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
        LoadScene.camera.position.z = 5;
        // 将相机添加到场景中
        LoadScene.scene.add(LoadScene.camera);

        // 添加直线光,并设置光源位置
        const light1 = new THREE.DirectionalLight(0xffeedd);
        light1.position.set(0, 0, 2);
        LoadScene.scene.add(light1);
        const light2 = new THREE.DirectionalLight(0xffeedd);
        light2.position.set(0, 0, -2);
        LoadScene.scene.add(light2);

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

        // 加载纹理
        // const normal = new THREE.TextureLoader().load('src/assets/png/bg-01.png');
        // 加载模型
        const loader = new FBXLoader();
        loader.load('src/assets/model/JBJ_D(1).FBX', object => {
            object.name = 'duanxiu'

            const color = new THREE.Color('blue')
            const material = new THREE.MeshBasicMaterial({ color })
            object.traverse((v: any) => {
                v.material = material
            })
            LoadScene.scene.add(object);
        });
        // loader.load('src/assets/model/short.FBX', object => {
        //     // 遍历对象，给物体添加贴图
        //     object.traverse((child) => {
        //         // if (child.isMesh) {
        //         //     //此处更新fbx 模型的贴图信息 ，需要在引入GTALoader.js
        //         //     const tgaloader = new TGALoader()
        //         //     tgaloader.load('src/assets/png/bg-01.png', (texture) => {
        //         //         //模型使用新的贴图纹理
        //         //         texture.needsUpdate = true
        //         //         child.material.map = texture

        //         //     })
        //         // }
        //     })
        //     LoadScene.scene.add(object);
        //     console.log('scene', LoadScene.scene)
        // });

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