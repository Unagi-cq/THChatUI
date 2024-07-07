import {createRouter, createWebHashHistory} from 'vue-router'


/* Layout */
import Layout from '@/layout'

const routes = [
    {
        path: '/',
        name: 'index',
        component: Layout,
        children: [
            {
                path: '', // 默认子路由
                name: 'index',
                component: () => import('@/views/AppMain.vue')
            }
        ]
    },
    {
        path: '/tools',
        name: 'tools',
        component: Layout,
        children: [
            {
                path: '', // 默认子路由
                name: 'tools',
                component: () => import('@/views/tools/index.vue')
            }
        ]
    },
    {
        path: '/setting',
        name: 'setting',
        component: Layout,
        children: [
            {
                path: '', // 默认子路由
                name: 'setting',
                component: () => import('@/views/setting/index.vue')
            }
        ]
    },
    {
        path: '/docs',
        name: 'docs',
        component: Layout,
        children: [
            {
                path: '', // 默认子路由
                name: 'docs',
                component: () => import('@/views/docs/index.vue')
            }
        ]
    },
    {
        path: '/tutorial',
        name: 'tutorial',
        component: Layout,
        children: [
            {
                path: '', // 默认子路由
                name: 'tutorial',
                component: () => import('@/views/tutorial/index.vue')
            }
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
