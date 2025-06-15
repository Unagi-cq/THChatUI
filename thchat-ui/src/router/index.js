import {createRouter, createWebHashHistory} from 'vue-router'


/* Layout */
import Layout from '@/layout'

const routes = [
    {
        path: '/',
        component: Layout,
        children: [
            {
                path: '',
                name: 'index',
                component: () => import('@/views/AppMain.vue')
            }
        ]
    },
    {
        path: '/docs',
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
        path: '/kb',
        component: Layout,
        children: [
            {
                path: '', // 默认子路由
                name: 'kb',
                component: () => import('@/views/kb/index.vue')
            }
        ]
    },
    {
        path: '/agent',
        component: Layout,
        children: [
            {
                path: '', // 默认子路由
                name: 'agent',
                component: () => import('@/views/agent/index.vue')
            }
        ]
    },
    {
        path: '/mcp',
        component: Layout,
        children: [
            {
                path: '', // 默认子路由
                name: 'mcp',
                component: () => import('@/views/mcp/index.vue')
            }
        ]
    },
    {
        path: '/setting',
        component: Layout,
        children: [
            {
                path: '', // 默认子路由
                name: 'setting',
                component: () => import('@/views/setting/index.vue')
            }
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
