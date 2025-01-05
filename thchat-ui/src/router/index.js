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
        path: '/kb',
        name: 'kb',
        component: Layout,
        children: [
            {
                path: '', // 默认子路由
                name: 'kb',
                component: () => import('@/views/kb/index.vue')
            }
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
