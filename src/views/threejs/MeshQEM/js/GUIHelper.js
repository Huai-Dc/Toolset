import * as THREE from 'three';

let bunny = require('bunny');

export default class GUIHelper {
    constructor() {
        this.decimate = 1000;
        this.log = 'decimate';
        this.update = 5;
        this.agressiveness = 7;  // 侵入性 越大形变越大越小能优化的越有限
        this.emscipten = true;

        this.meshs = {
            bunny: {
                geometry: this.create_bunny(bunny),
                material: new THREE.MeshNormalMaterial({
                    wireframe: true,
                    side: THREE.DoubleSide
                }),
                has_texture: false,
            }
        };
        // 当前选择的mesh
        this.mesh = 'bunny';
    }

    create_bunny(bunny, scale = 0.07) {
        let vertices = new Float32Array(bunny.positions.length * 3),
            indices = new Uint32Array(bunny.cells.length * 3),
            geometry = new THREE.BufferGeometry(),
            size = new THREE.Vector3(),
            bounds = bunny.positions.reduce((b, [x,y,z]) =>
                b.expandByPoint(new THREE.Vector3(x, y, z)) ,new THREE.Box3());

        let dx = -bounds.min.x - size.x * 0.5,
            dy = -bounds.min.y - size.y * 0.5,
            dz = -bounds.min.z - size.x * 0.5;

        bunny.positions.forEach(([x, y, z], i) => {
            vertices[i*3+0] = (dx + x) * scale;
            vertices[i*3+1] = (dy + y) * scale;
            vertices[i*3+2] = (dz + z) * scale;
        });

        bunny.cells.forEach(([a, b, c], i) => {
            indices[i*3+0] = a;
            indices[i*3+1] = b;
            indices[i*3+2] = c;
        });

        geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        geometry.setIndex( new THREE.BufferAttribute( indices, 1 ) );

        geometry = (new THREE.Geometry()).fromBufferGeometry(geometry);

        geometry.mergeVertices();
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();

        geometry.center();

        return geometry;
    }

}
