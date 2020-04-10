<template>
    <div ref="canvas" class="welcome-canvas-content">
    </div>
</template>

<script>
    import * as PIXI from 'pixi.js';
    import gsap from 'gsap';
    import Emitter from './Emitter';

    export default {
        name: 'Welcome',
        data() {
            return {
                app: null,
                count: 0,
                max: 60,
                particles: [],
                timer: null,
                colors: [0xff3399, 0xffffff, 0x6666ff, 0x33ffff],
                rotation: 0,
                width: 600,
                height: 400
            };
        },
        mounted() {
            this.$nextTick(() => {
                this.width = this.$refs.canvas.offsetWidth;
                // this.height = this.$refs.canvas.offsetHeight;
                this.init();
            }, 1000);

        },
        methods: {
            init() {
                this.timer = gsap.to({}, {
                    onComplete: this.placeEmitter,
                    duration: 0.08
                });

                this.app = new PIXI.Application({
                    width: this.width, // default: 800
                    height: this.height, // default: 600
                    antialias: true, // default: false
                    transparent: false, // default: false
                    resolution: 1, // default: 1
                    backgroundColor: 0x230716
                });


                gsap.set(this.app.stage, {
                    pixi: {
                        blurX: 2,
                        blurY: 2
                    }
                });

                this.$refs.canvas.appendChild(this.app.view);
                let getRandom = this.weightedRandom(this.colors, 'power2.in');

                for (let n = 0; n < this.max; n++) {
                    let e = new Emitter(gsap.utils.random(16, 24), getRandom());
                    this.particles.push(e);
                }
            },
            placeEmitter() {
                let e = this.app.stage.addChild(this.particles[this.count % this.particles.length]);
                e.y = this.height / 2;
                e.x = this.width / 2;
                e.animation.restart();
                gsap.set(e, { pixi: { rotation: (this.rotation += gsap.utils.random(10, 14)) } });
                this.count++;

                this.timer.restart();
            },
            weightedRandom(collection, ease) {
                return gsap.utils.pipe(
                    Math.random, //random number between 0 and 1
                    gsap.parseEase(ease), //apply the ease
                    gsap.utils.mapRange(0, 1, 0, collection.length - 1), //map to the index range of the array
                    gsap.utils.snap(1), //snap to the closest integer
                    i => collection[i] //return that element from the array
                );
            }
        }
    };
</script>

<style lang="scss" scoped>
    .welcome-canvas-content {
        height: 100%;
        width: 100%;
    }
</style>
