import { createApp } from 'vue'

/* 导入ElementUIPlus */
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { ElNotification, ElImageViewer } from 'element-plus';

/* 导入功能性组件或方法 */
import App from './App.vue'
import router from './router'
import store from './store'
import plugins from './plugins' // 引入第三方的插件或组件
import components from "@/components"  // 引入自定义的组件
import '@/assets/styles/index.scss' // 全局css

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 全局方法挂载
app.config.globalProperties.$notify = ElNotification;
app.config.globalProperties.$imageViewer = ElImageViewer;

app.use(plugins)
    .use(components)
    .use(ElementPlus, { size: 'default', zIndex: 3000 })
    .use(store)
    .use(router)
    .mount('#app')

// 初始化app数据
store.dispatch('initializeState').then(() => {
    console.log('应用IndexedDB数据库初始化成功')
}).catch(error => {
    console.error('应用IndexedDB数据库初始化失败:', error)
})