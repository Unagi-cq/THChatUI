import VMdPreview from './v-md-editor'

const pluginList = [
    VMdPreview // 预览markdown功能
]
const plugins = {
    install (app) {
        // 批量注册插件  改用自动引入
        Object.entries(pluginList).forEach(([, v]) => {
            app.use(v)
        })
    }
}

export default plugins
