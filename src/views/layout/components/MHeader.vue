<template>
    <div class="layout-header-content">
        <Icon :style="{margin: '0 20px'}" type="md-menu" size="24" @click.native="collapsedSider"
              :class="rotateIcon"></Icon>
        自定义头部
    </div>
</template>

<script>
    import { Icon } from 'view-design';
    import { mapGetters } from 'vuex';

    export default {
        name: 'MHeader',
        components: {
            Icon
        },
        computed: {
            ...mapGetters([
                "isCollapsed"
            ]),
            rotateIcon () {
                return [
                    'menu-icon',
                    this.isCollapsed ? 'rotate-icon' : ''
                ];
            },
        },
        methods: {
            collapsedSider(){
                this.$store.dispatch('toogleCollapse');
            }
        }
    };
</script>

<style lang="scss" scoped>
    .layout-header-content {
        .rotate-icon {
            transform: rotate(-90deg);
        }
    }
</style>
