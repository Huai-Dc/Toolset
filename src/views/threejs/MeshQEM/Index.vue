<template>
    <div ref="renderCanvas"></div>
</template>

<script>
    import {BaseCanvas } from './js/MeshQEM'
    export default {
        name: "index",
        data(){
            return {
                editor: null,
            }
        },
        mounted(){
            let viewportContainer = {
                dom: this.$refs.renderCanvas,
            };
            this.$nextTick(()=>{

                this.editor = new BaseCanvas(viewportContainer);
            })
        }
    }
</script>

<style scoped>

</style>