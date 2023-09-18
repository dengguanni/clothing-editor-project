import * as THREE from 'three';
import { v4 as uuid } from 'uuid';
import TWEEN from '@tweenjs/tween.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
class LoadScene {
    static canvasId: string
    static camera: any
    static scene: any
    static renderer: any
    static screenshotList: Array<any> = []
    static loadModel(url: string, name: string) {
        if (LoadScene.scene) {
            LoadScene.scene.traverse(c => {
                if (c.isGroup) {
                    console.log('asdfghj')
                    LoadScene.scene.remove(c);
                    // c.geometry.dispose();
                    // c.material.dispose();
                }
            })
        }

        const loader = new GLTFLoader();
        loader.load('public/static/duanxiu1.glb', object => {
            const color = new THREE.Color('0xffffff')
            object.name = name
            LoadScene.scene.add(object.scene);
            LoadScene.setCameraAngle()
        });
    }
    static getImages = () => {
        this.setCameraAngle()
        return this.screenshotList
    }
    static setTexture = (name, url, callback) => {
        console.log('LoadScene.scene', LoadScene.scene)

        const drawingCanvas = document.getElementById('canvas');
        const drawingContext = drawingCanvas.getContext('2d');
        drawingContext.fillStyle = '#FFFFFF';
        drawingContext.fillRect(10, 10, 10, 10);

        LoadScene.scene.traverse((child: any) => {
            if (child.isMesh && child.name == name) {
                // const mapTexture = new THREE.TextureLoader().load(url)
                const mapTexture = new THREE.CanvasTexture(drawingCanvas)
                mapTexture.encoding = THREE.sRGBEncoding
                // mapTexture.offset.y = -80
                console.log('mapTexture', mapTexture)
                mapTexture.repeat.set(1, 1)
                child.material = new THREE.MeshLambertMaterial({
                    map: mapTexture,
                    transparent: true, // 允许材质可透明
                    // color
                })
            }
        })
        LoadScene.setCameraAngle()
        callback ? callback() : ''
    }
    init(scene: any, camera: any, renderer: any, id: string, callBack: Function) {
        LoadScene.scene = scene
        LoadScene.camera = camera
        LoadScene.renderer = renderer
        LoadScene.scene = new THREE.Scene();
        LoadScene.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100);
        LoadScene.camera.position.z = 3;
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
        // LoadScene.renderer.setClearAlpha(0)
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
    static change3dBox = (id, callback) => {
        const height = id == 'big-3d' ? 600 : 280
        const width = id == 'big-3d' ? 600 : 280
        LoadScene.renderer.setSize(height, width);
        // // 设置渲染的输出编码
        // LoadScene.renderer.outputEncoding = THREE.sRGBEncoding;
        // 将内容渲染到页面中
        document.getElementById(id)?.appendChild(LoadScene.renderer.domElement);

        // // 创建轨道控制器
        // const control = new OrbitControls(LoadScene.camera, LoadScene.renderer.domElement);
        // control.target.set(0, 0, 0);
        // // 设置阻尼
        // // control.enableDamping = true;
        // // LoadScene.loadModel()
        // // 创建渲染函数
        // const render = () => {
        //     control.update();
        //     LoadScene.renderer.render(LoadScene.scene, LoadScene.camera);
        //     // 通过动画帧来执行函数
        //     requestAnimationFrame(render);
        //     TWEEN.update()
        // };
        // render();
        callback ? callback() : ''
    }


    static setCameraAngle() {
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
        console.log(' LoadScene.scene', LoadScene.scene)
        console.log('更新，照片', LoadScene.screenshotList)
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
        console.log('LoadScene.scene', LoadScene.scene)
        const color = new THREE.Color(color1)
        // const material = new THREE.MeshBasicMaterial({ color })
        LoadScene.scene.traverse((c: any) => {
            if (c.name == 'duanxiu') {
                c.traverse((v: any) => {
                    if (v.type == 'Mesh') {
                        v.material.color = color
                    }
                })

            }
        })
        setTimeout(() => {
            callBack()
        }, 1000);
    }
    setModelCamera(direction: string) {
        if (LoadScene.scene) {
            LoadScene.scene.traverse((c: any) => {
                const setModelRotation = (targetRotation) => {
                    let rotation = { x: c.rotation.x, y: c.rotation.y, z: c.rotation.z };
                    let testTween = new TWEEN.Tween(rotation);
                    testTween.to({ x: c.rotation.x, y: targetRotation, z: c.rotation.z }, 1000);
                    testTween.onStart(function () {
                    }).onUpdate(function (object) {
                        c.rotation.y = object.y
                    }).onComplete(function () {
                    });
                    testTween.easing(TWEEN.Easing.Quadratic.Out);
                    testTween.start(); //开始
                }
                if (c.name == 'duanxiu') {
                    if (direction.includes('左')) {
                        setModelRotation(Math.PI / 2)
                    } else if (direction.includes('右')) {
                        setModelRotation(-(Math.PI / 2))
                    } else if (direction.includes('前')) {
                        setModelRotation((Math.PI))
                    } else if (direction.includes('后')) {
                        setModelRotation(-Math.PI)
                    } else {
                        setModelRotation((Math.PI))
                    }


                }
            })
        }

    }
}
export default LoadScene