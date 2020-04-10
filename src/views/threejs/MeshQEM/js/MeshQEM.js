import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import GUIHelper from './GUIHelper';
// import WSWorker from './worker'

export class BaseCanvas {
    constructor(container) {
        this.container = container;
        // Camera
        this.DEFAULT_CAMERA = new THREE.PerspectiveCamera(10, 1, 0.01, 1000);
        this.DEFAULT_CAMERA.name = 'Camera';
        this.DEFAULT_CAMERA.position.set(0, 5, 10);
        this.DEFAULT_CAMERA.lookAt(new THREE.Vector3());
        this.camera = this.DEFAULT_CAMERA.clone();
        // Scene
        this.scene = new THREE.Scene();
        this.scene.name = 'Scene';
        this.scene.background = new THREE.Color(0xaaccff);
        // renderer
        this.renderer = null;

        this.gui = new GUI(); // gui监测器
        this.guiHelper = new GUIHelper();

        // Worker
        this.worker = null;

        // 当前模型基础数据
        this.geometry = this.guiHelper.meshs[this.guiHelper.mesh].geometry;
        this.material = this.guiHelper.meshs[this.guiHelper.mesh].material;
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.transformControls = new TransformControls(this.camera, this.container.dom);
        this.controls = new OrbitControls(this.camera, this.container.dom);
        // 处理窗口变化
        window.addEventListener('resize', this.windowResize.bind(this), false);

        this.init();
    }

    init() {
        this.createRenderer();

        this.scene.add(this.mesh);

        this.windowResize();

        this.initGUI();
    }

    /**
     * 初始化 renderer
     */
    createRenderer() {
        let parameters = { // 渲染器参数
            antialias: true,
            preserveDrawingBuffer: true, // 设置绘图缓冲
            precision: 'lowp',  // 着色精度设置
        };

        if (this.renderer !== null) {

            this.renderer.dispose();

        }

        this.renderer = new THREE.WebGLRenderer(parameters);

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.renderer.physicallyCorrectLights = true;
        this.configRenderer();

    }

    /**
     * 配置renderer
     */
    configRenderer() {
        let scope = this;
        try {
            scope.renderer.autoClear = false;
            scope.renderer.autoUpdateScene = false;
            scope.renderer.setPixelRatio(window.devicePixelRatio);

            scope.renderer.setSize(scope.container.dom.offsetWidth, scope.container.dom.offsetHeight);
            scope.container.dom.appendChild(scope.renderer.domElement);
            scope.render();
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * render
     */
    render() {
        requestAnimationFrame(this.render.bind(this));

        this.scene.updateMatrixWorld();

        this.renderer.render(this.scene, this.camera);
    }

    /**
     * 重新调整窗体
     */
    windowResize() {
        let scope = this;
        scope.DEFAULT_CAMERA.aspect = scope.container.dom.offsetWidth / scope.container.dom.offsetHeight;
        scope.DEFAULT_CAMERA.updateProjectionMatrix();

        scope.camera.aspect = scope.container.dom.offsetWidth / scope.container.dom.offsetHeight;
        scope.camera.updateProjectionMatrix();

        scope.renderer.setSize(scope.container.dom.offsetWidth, scope.container.dom.offsetHeight);
    }

    initGUI() {
        let gui = new GUI();
        // let wl = gui.add(this.guiHelper, 'log');
        // if (window.Worker) {
        //     if (!this.worker) {
        //         this.worker = new WSWorker();
        //     }
        //     this.worker.addEventListener('message', (e) => {
        //         this.mesh.geometry = this.simplify_to_geometry_buffers(e.data.vertices, e.data.uvs, e.data.indices);
        //     });
        // }
    }

    /**
     * 简化成GeometryBuffer
     * @param vertices
     * @param uvs
     * @param indices
     * @returns {Geometry}
     */
    simplify_to_geometry_buffers(vertices, uvs, indices) {
        let geometry = new THREE.BufferGeometry();

        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        if(uvs){
            geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
        }

        geometry.setIndex(new THREE.BufferAttribute(indices, 1));

        geometry = new THREE.Geometry().fromBufferGeometry(geometry);
        geometry.mergeVertices();
        geometry.computeFaceNormals();

        return geometry;
    }

    /**
     * 减面线程
     * @param geometry
     * @param v 期望优化后的顶点数
     */
    emscipten_worker(geometry, v) {
        let helper = this.guiHelper;
        let obj = this.geometry_to_obj(helper.meshs[helper.mesh].geometry);
        let perc = v / helper.meshs[helper.mesh].geometry.faces.length;
        let blob = new Blob([obj], {
            type: 'text/plain'
        });
        let name = `em${Math.round(Math.random()* 0xffffff)}.obj`;
        let file = new File([blob], name);

        this.emscipten_worker.postMessage({
            blob: file,
            percentage: perc,
            simplify_name: name,
            agressiveness: helper.agressiveness,
            recompute: helper.recompute,
            update: helper.update
        });

        this.emscipten_worker.addEventListener('message', e=>{
            if(e.data.blob instanceof Blob){
                let render = new FileReader();
                render.onload = () => {
                    this.mesh.geometry = this.obj_to_geometry(render.result);
                }
                render.readAsText(e.data.blob);
            }
        }, false);
    }

    /**
     * Geometry to object
     * @param geometry
     * @returns {string}
     */
    geometry_to_obj(geometry) {
        let { vertices, faces, faceVertexUvs } = geometry,
            hasUV = faceVertexUvs[0].length === faces.length,
            obj = '';
        for (let i = 0; i < vertices.length; i++) {
            let v = vertices[i];
            obj += `v ${v.x} ${v.y} ${v.z}\n`;
        }

        if (hasUV) {
            for (let i = 0; i < faces.length; i++) {
                let [a, b, c] = faceVertexUvs[0][i];
                obj += `vt ${a.x} ${a.y}\n`;
                obj += `vt ${b.x} ${b.y}\n`;
                obj += `vt ${c.x} ${c.y}\n`;
            }
        }

        for (let i = 0; i < faces.length; i++) {
            let { a, b, c } = faces[i],
                j = i * 3 + 1;
            if (hasUV) {
                obj += `f ${a + 1}/${j}/1 ${b + 1}/${j + 1}/1 ${c + 1}/${j + 2}/1\n`;
            } else {
                obj += `f ${a + 1} ${b + 1} ${c + 1}\n`;
            }
        }

        return obj;
    }

    obj_to_geometry(obj) {
        let geometry = new THREE.BufferGeometry(),
            lines = obj.split(/[\r\n]/)
                .filter(ln => ln && ln.length),
            vertices = [],
            uvs = [],
            uv_indices = [],
            indices = [];

        console.time('parse obj');
        // parseInt 有两个参数 原数字， 进制
        // parseFloat 只有一个参数
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].split(/\s+/),
                cmd = line.shift();
            switch (cmd) {
                case 'v':
                    vertices[vertices.length] = line.map(parseFloat);
                    break;
                case 'vt':
                    uvs[uvs.length] = line.map(parseFloat);
                    break;
                case 'f':
                    let face = line.map(f => f.split('/')
                        .map(i => parseInt(i, 10)));

                    indices[indices.length] = face.map(f => f[0] - 1);

                    if (face[0].length > 1) {
                        uv_indices[uv_indices.length] = face.map(f => f[1] - 1);
                    }
                    break;
                default:
                    break;
            }
        }
        console.timeEnd('parse obj');

        let num_faces = indices.length,
            v = [],
            uv = [],
            idx = [];

        for (let i = 0; i < num_faces; i++) {
            let [a, b, c] = indices[i],
                v0 = vertices[a],
                v1 = vertices[b],
                v2 = vertices[c],
                j = i * 3;

            v.push(v0[0], v0[1], v0[2], 1[0], v1[1], v1[2], v2[0], v2[1], v2[2]);

            if (uv_indices.length) {
                let [a, b, c] = uv_indices[i].map(i => uv[i]);

                uv.push(a[0], a[1], b[0], b[1], c[0], c[1]);
            }

            idx.push(j, j + 1, j + 2);
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(v), 3));

        if (uv_indices.length) {
            geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uv), 2));
        }

        geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(idx), 1));

        geometry = new THREE.Geometry().fromBufferGeometry(geometry);
        // 以下两个步骤确保生成的mesh的面与顶点的法向量能正确计算
        geometry.mergeVertices(); // 移除重复顶点 更新面顶点
        geometry.computeFaceNormals();// 计算面法向量

        return geometry;
    }
}
