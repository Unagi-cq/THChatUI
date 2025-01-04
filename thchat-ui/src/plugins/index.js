import VMdPreview from './v-md-editor'
import i18n from './i18n'

const pluginList = [
    VMdPreview, // 预览markdown功能
    i18n // 国际化
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
