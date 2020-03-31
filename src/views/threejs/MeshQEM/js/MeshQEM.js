import * as THREE from 'three'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'


export class BaseCanvas{
    constructor(container){
        this.container = container;
        // Camera
        this.DEFAULT_CAMERA = new THREE.PerspectiveCamera(50, 1, 0.01, 1000);
        this.DEFAULT_CAMERA.name = 'Camera';
        this.DEFAULT_CAMERA.position.set(0, 5, 10);
        this.DEFAULT_CAMERA.lookAt(new THREE.Vector3());
        this.camera = this.DEFAULT_CAMERA.clone();
        // Scene
        this.scene = new THREE.Scene();
        this.scene.name = 'Scene';
        this.scene.background = new THREE.Color(0xe8e8e8);
        // renderer
        this.renderer = null;

        this.gui = new GUI() // gui监测器

        this.transformControls = new TransformControls(this.camera, this.container.dom);
        this.controls = new OrbitControls(this.camera, this.container.dom);

        this.init();
    }
    init(){
        this.createRenderer();
        this.initAxes()
    }

    initAxes(){
        let axes = new THREE.AxisHelper(20) // 坐标轴
        this.scene.add(axes)
    }
    createRenderer(){
        let parameters = { // 渲染器参数
            antialias: true,
            preserveDrawingBuffer: true, // 设置绘图缓冲
            precision: 'lowp',  // 着色精度设置
        };

        if (this.renderer !== null) {

            this.renderer.dispose();

        }

        this.renderer = new THREE.WebGLRenderer(parameters);

        if (true) {

            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type =  THREE.PCFSoftShadowMap;

        }

        this.renderer.physicallyCorrectLights = true;
        
        this.configRenderer();
    }
    
    configRenderer(){
        let scope = this;
        try{
            scope.renderer.autoClear = false;
            scope.renderer.autoUpdateScene = false;
            scope.renderer.setPixelRatio(window.devicePixelRatio);
            scope.renderer.setSize(scope.container.dom.offsetWidth, scope.container.dom.offsetHeight);

            scope.container.dom.appendChild(scope.renderer.domElement);
            scope.render();
        }catch (e) {
            console.log(e);
        }
    }
    
    render(){
        requestAnimationFrame(this.render.bind(this));

        this.scene.updateMatrixWorld();

        this.renderer.render(this.scene, this.camera);
    }

}