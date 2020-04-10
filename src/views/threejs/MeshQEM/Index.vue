<template>
    <div class="three-canvas" ref="renderCanvas"></div>
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

<style lang="scss" scoped>
    .ivu-layout-content{
        >div{
            line-height: 0;
            margin: 0!important;
            padding: 0!important;
            overflow: hidden;
            .three-canvas{
                overflow: hidden;
            }
        }
    }

    div{
        &:focus{
            outline: none;
        }
    }

</style>
