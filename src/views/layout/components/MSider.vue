<template>
    <div class="mside-content">
        <div class="logo">
            <img src="../../../assets/logo-r.png" height="100%"/>
        </div>
        <div class="navigation-content">
            <ScrollBar>
                <template>
                    <Menu theme="dark" width="auto" :class="menuItemClasses" :active-name="onRoutes">
                        <template v-for="(item, index) in filterRouters">
                            <router-link v-if="isSingleItem(item)" :to="item.path + '/' + item.children[0].path">
                                <MenuItem :name="item.children[0].meta.activeKey" :index="index+''">
                                    <Icon v-if="item.children[0].meta && item.children[0].meta.icon"
                                          :type="item.children[0].meta.icon"/>
                                    <span>{{ item.children[0].meta.title }}</span>
                                </MenuItem>
                            </router-link>
                            <Submenu v-else :name="index+''">
                                <template slot="title">
                                    <Icon :type="item.meta.icon"/>
                                    <span>{{ item.meta.title }}</span>
                                </template>
                                <template v-for="(child, number) in item.children" v-if="!child.hidden">
                                    <router-link :to="item.path + '/' + child.path">
                                        <MenuItem :name="child.meta.activeKey">{{ child.meta.title }}</MenuItem>
                                    </router-link>
                                </template>
                            </Submenu>
                        </template>
                    </Menu>
                </template>
            </ScrollBar>
        </div>
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
            ]),
            menuItemClasses() {
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : ''
                ]
            },
            onRoutes() {
                return this.$route.meta.activeKey
            },
            filterRouters() {
                if (this.routers && this.routers.length > 0) {
                    return this.routers.map(item => {
                        return item
                    })
                } else {
                    return []
                }
            },
        },
        methods:{
            isSingleItem(item){
                if(item.path === "") return true;
                return item.children.length === 1
            }
        },
    };
</script>

<style lang="scss" scoped>
.mside-content{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    .logo {
        height: 64px;
        box-sizing: border-box;
        background-color: #dbdfe2;
        color: #ffffff;
        font-size: 24px;
        font-weight: bolder;
        line-height: 64px;
        text-align: center;
        overflow: hidden;
    }
    .navigation-content{
        flex: 1;
        .ivu-menu {
            .ivu-menu-item {
                border-left: 2px solid transparent;
                padding-left: 22px;
            }
            .ivu-menu-item-active {
                border-left: 2px solid #1fb5ac;
            }
            span {
                display: inline-block;
                overflow: hidden;
                width: 69px;
                text-overflow: ellipsis;
                white-space: nowrap;
                vertical-align: bottom;
                transition: width .2s ease .2s;
            }
            .menu-item {
                span {
                    display: inline-block;
                    overflow: hidden;
                    width: 69px;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    vertical-align: bottom;
                    transition: width .2s ease .2s;
                }
                i {
                    transform: translateX(0px);
                    transition: font-size .2s ease, transform .2s ease;
                    vertical-align: middle;
                    font-size: 20px;
                }
            }
        }
        .collapsed-menu {
            span {
                width: 0;
                transition: width .2s ease;
            }
            i {
                transform: translateX(5px);
                transition: font-size .2s ease .2s, transform .2s ease .2s;
                vertical-align: middle;
                font-size: 22px;
            }
        }
    }
}
</style>
