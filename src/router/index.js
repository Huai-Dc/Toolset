import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from '@/views/layout/Index'

Vue.use(VueRouter);

const constantRouterMap = [
    {
        path: '',
        component: Layout,
        redirect: 'homeIndex',
        children: [
            {
                path: 'homeIndex',
                name: 'HomeIndex',
                component: () => import("@/views/Home"),
                meta: {
                    title: '首页',
                    describe: '首页',
                    icon: 'md-home',
                }
            }
        ]
    },
    {
        path: '/cssTools',
        component: Layout,
        meta: {
            title: 'css工具',
            icon: '',
            activeKey: 0,
        },
        children: [
            {
                path: 'homeIndex',
                name: 'HomeIndex',
                component: () => import("@/views/cssTools/Bg-alpha"),
                meta: {
                    title: '透明背景',
                    describe: 'rgba 低版本ie 兼容代码生成',
                    icon: 'md-home',
                    activeKey: "0-0"
                }
            },{
                path: 'csstools/boxshadow',
                name: 'BoxShadowAdjust',
                component: () => import('@/views/cssTools/BoxShadowAdjust'),
                meta: {
                    title: '阴影调整',
                    describe: "css 阴影调校",
                    icon: '',
                    activeKey: '0-1'
                }
            }
        ]
    },
];

const router = new VueRouter({
    scrollBehavior: () => ({y: 0}),
    routes: constantRouterMap
});

export { constantRouterMap }
export default router;
