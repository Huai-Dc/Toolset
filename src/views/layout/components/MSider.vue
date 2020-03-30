<template>
    <div class="mside-content">
        <img src="../../../assets/logo-r.png" width="100%"/>
        <ScrollBar>
            <template>
                <Menu active-name="1-2" :open-names="['1']">
                    <template v-for="(item, index) in routers">
                        <router-link v-if="isSingleItem(item)" :to="item.path + '/' + item.children[0].path">
                            <MenuItem  :index="index+''">
                                <Icon type="ios-navigate"></Icon>
                                <span>{{ item.children[0].meta.title }}</span>
                            </MenuItem >
                        </router-link>
                        <Submenu v-else :index="''+index" :key="index">
                            <template slot="title">
                                <Icon type="ios-analytics" />
                                <span slot="title">{{ item.meta.title }}</span>
                            </template>
                            <template v-for="(child, number) in item.children" v-if="!child.hidden">
                                <router-link :to="item.path + '/' + child.path">
                                    <MenuItem :index="index+'-'+number">{{ child.meta.title }}</MenuItem>
                                </router-link>
                            </template>
                        </Submenu>
                    </template>
                </Menu>
            </template>
        </ScrollBar>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import ScrollBar from '../../../components/ScrollBar/Index'
    import { Menu, Submenu, MenuGroup, MenuItem, Icon } from 'view-design'
    export default {
        name: 'MSider',
        components: {
            ScrollBar, Menu, Submenu, MenuGroup, MenuItem, Icon
        },
        computed: {
            ...mapGetters([
                'routers',
                'isCollapsed'
            ])
        },
        mounted() {
            console.log(this.routers)
        },
        methods:{
            isSingleItem(item){
                if(item.path === ""){
                    return true
                }
            }
        },
    };
</script>

<style lang="scss" scoped>
.mside-content{
    height: 100%;
    width: 100%;
}
</style>
