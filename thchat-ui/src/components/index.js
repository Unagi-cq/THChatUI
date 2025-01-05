import ChatCard from './ChatCard'
import SendBox  from "./SendBox"
import CustomDialog from './CustomDialog'

const ComponentList = [
    ChatCard, // 自定义对话卡片组件
    SendBox, // 自定义发送框组件
    CustomDialog
]
const components = {
    install (app) {
        // 批量注册插件  改用自动引入
        Object.entries(ComponentList).forEach(([, v]) => {
            app.component(v.name, v)
        })
    }
}

export default components
