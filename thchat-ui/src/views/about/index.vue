<template>
    <div class="about-container">
        <div class="title-section">
            <img :src="logoSrc" class="logo" alt="logo" />

            <span class="title">THChatUI<span style="font-size: 12px; color: #999;">v3.0.1</span></span>
            <p class="subtitle">欢迎使用<span>THChatUI</span>，一个基于<span>Vue</span>和<span>Element Plus</span>的Web对话管理WebUI。目前支持以下平台：<b>Web PC端、Web 移动端、Wins桌面端。</b></p>

            <p>
                THChatUI是一个专为数据敏感型个人/组织设计的大模型WebUI。<br />
                前端采用Vue更适合中国宝宝体质~<br />
                后端采用Python的Flask快速启动接口，项目提供了若干个调用示例(并不是必须的)。<br />
                不需额外数据库，数据存浏览器缓存中。<br />
            </p>

            <div>
                <el-button @click="openLink('https://github.com/Unagi-cq/THChatUI/tree/main')">查看仓库</el-button>
                <el-button @click="openLink('https://github.com/Unagi-cq/THChatUI/issues')">问题反馈</el-button>
                <el-button @click="openLink('https://blog.csdn.net/qq_43592352')">关注我的博客</el-button>
                <el-tooltip effect="light" placement="bottom" :hide-after="0">
                    <template #content>
                        <img src="https://raw.githubusercontent.com/Unagi-cq/THChatUI/refs/heads/main/doc_img/qr_code.png" alt="公众号二维码" class="qrcode-image" />
                    </template>
                    <el-button>关注我的公众号</el-button>
                </el-tooltip>
            </div>
        </div>

        <!-- 更新日志 -->
        <div class="changelog-section">
            <h2>更新日志</h2>

            <div class="version-block">
                <h3>v3.0.1 - 2025.05.05</h3>
                <ul>
                    <li>[add] 新增了Electron打包成桌面应用功能</li>
                    <li>[add] 新增了用户输入复制按钮</li>
                    <li>[add] 新增了Google AI平台（Gemini） 要在本地用梯子才能连上Google服务器</li>
                    <li>[fix] 解决了SSE请求无限报错重试bug</li>
                    <li>[fix] 修复了多模态模型无法多轮对话bug</li>
                </ul>
            </div>

            <div class="version-block">
                <h3>v3.0.0 - 2025.05.03 - 代码优化</h3>
                <ul>
                    <li>Notice: 代码实现上，个人觉得可读性和低入手难度比层层封装到大家看不懂代码更重要。</li>
                    <li>[del] 移除了对多语言的配置，降低代码阅读难度，如需要请移至分支2.0.3查看</li>
                    <li>[del] 移除了对移动云平台的支持，如需要请移至分支2.0.3查看</li>
                    <li>[upd] 重构了各个平台的调用代码</li>
                    <li>[upd] 项目中SVG从代码改为图片存储</li>
                    <li>[upd] 调整了项目中的注释、文件结构和代码结构</li>
                </ul>

                <h3>v3.0.0 - 2025.05.03 - 功能优化</h3>
                <ul>
                    <li>[upd] 优化了设置弹窗的UI</li>
                    <li>[upd] 优化了API KEY配置和模型配置的UI</li>
                    <li>[upd] 优化了思考内容折叠样式</li>
                    <li>[add] 新增了对硅基流动平台的支持</li>
                    <li>[add] 新增了对TavilySearch联网搜索的支持</li>
                </ul>
            </div>

            <div class="version-block">
                <h3>v2.0.3 - 2025.03.16</h3>
                <ul>
                    <li>[add] 新增了对移动云平台的支持</li>
                </ul>
            </div>

            <div class="version-block">
                <h3>v2.0.2 - 2025.02.25</h3>
                <ul>
                    <li>[add] 新增了对看板娘的支持</li>
                    <li>[add] 新增了200+看板娘模型，感谢 https://github.com/zenghongtu/live2d-model-assets</li>
                </ul>
            </div>

            <div class="version-block">
                <h3>v2.0.1 - 2025.02.16</h3>
                <ul>
                    <li>[add] 新增了对字节火山方舟平台的支持</li>
                    <li>[add] 新增了对推理模型的样式支持</li>
                </ul>
            </div>

            <div class="version-block">
                <h3>v2.0.0 - 2025.01.12</h3>
                <ul>
                    <li>[fix] 重构后端Python脚本示例 给出对话模型、图片理解模型、图片会话模型API接口示例</li>
                    <li>[fix] 重构后端Python脚本示例 整合对话模型的普通聊天、联网搜索、知识库功能</li>
                    <li>[add] 新增了对月之暗面Kimi平台的支持</li>
                    <li>[add] 新增了对OpenAI式EndPoint接口的支持</li>
                    <li>[add] 内置了几个毛玻璃主题的壁纸</li>
                    <li>[add] 多语言支持 支持简中、英文</li>
                    <li>[add] 接入智谱的图片生成模型</li>
                    <li>[add] 新增联网搜索功能</li>
                    <li>[add] 接入图片上传模型</li>
                    <li>[add] 新增知识库功能 完全依赖于前端 支持文件上传、分段、搜索</li>
                    <li>[upd] 重构了底层储存 使用浏览器自带的IndexedDB 从此存储空间不再受限制</li>
                    <li>[upd] 优化了公式显示插件引入方式 从cdn改为本地引入</li>
                    <li>[upd] 优化了GitHub Pages发布脚本</li>
                </ul>
            </div>

            <div class="version-block">
                <h3>v1.1.3 - 2025.01.01</h3>
                <ul>
                    <li>[fix] 重构会话预处理 适配不同平台并支持图片输入</li>
                    <li>[add] 会话卡可以查看图片</li>
                    <li>[add] 接入阿里云百炼平台视觉模型</li>
                </ul>
            </div>

            <div class="version-block">
                <h3>v1.1.2 - 2025.01.01</h3>
                <ul>
                    <li>[fix] 重构缓存数据的数据格式，便于直接将数据缓存改为接后端db接口</li>
                    <li>[fix] 手机版侧边栏体验优化</li>
                    <li>[add] 接入视觉模型</li>
                    <li>[add] 对话框图片上传</li>
                    <li>[add] 图片粘贴上传</li>
                </ul>
            </div>

            <div class="version-block">
                <h3>v1.1.1 - 2024.12.29</h3>
                <ul>
                    <li>[upd]弹窗页面UI优化</li>
                    <li>[upd]手机端体验优化：蒙版，点击后自动关闭左边栏</li>
                </ul>
            </div>

            <div class="version-block">
                <h3>v1.1.0 - 2024.12.29</h3>
                <ul>
                    <li>[fix]重构第三方平台请求链路与配置架构</li>
                    <li>[fix]重构了三套主题的配色方案与配置库</li>
                    <li>[add]新增背景图片上传功能</li>
                    <li>[add]新增所有平台api key统一维护功能</li>
                    <li>[add]新增头部栏，用于显示会话标题与当前配置</li>
                    <li>[add]简单的md格式公式显示支持</li>
                    <li>[upd]优化侧边栏UI，改为扁平化</li>
                    <li>[upd]优化模型选择页面，将下拉改为列表单选</li>
                    <li>[upd]优化侧边栏收起按钮样式与icon</li>
                    <li>[upd]优化输入框UI，并内置文件上传、知识库选择、联网搜索选项</li>
                    <li>[upd]优化项目icon，全面使用扁平化icon</li>
                    <li>[upd]部分页面改为弹窗模式显示</li>
                </ul>
            </div>

            <div class="version-block">
                <h3>v1.0.2 - 2024.12.21</h3>
                <ul>
                    <li>[fix]使用microsoft/fetch-event-source库接受流式传输时，浏览器页面切换后传输停止并重传</li>
                    <li>[add]新增百度千帆平台的LLM调用支持</li>
                    <li>[add]新增单次对话卡删除功能</li>
                    <li>[add]新增AI回答的纯文本复制功能</li>
                    <li>[add]新增用户消息折叠功能（大于3行时）</li>
                    <li>[upd]主题优化、输入框样式优化</li>
                </ul>
            </div>

            <div class="version-block">
                <h3>v1.0.0 - 2024.7.7</h3>
                <ul>
                    <li>初始版本提交</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import logoDark from '../../assets/images/logo_dark_2480.png'
import logoLight from '../../assets/images/logo_light_2480.png'

export default {
    name: "About",
    data() {
        return {

        }
    },
    computed: {
        // 根据当前主题返回对应的logo图片
        logoSrc() {
            const theme = this.$store.state.setting.theme
            return theme === 'dark' ? logoLight : logoDark
        }
    },
    methods: {
        /**
         * 在新标签页中打开指定链接
         * @param {string} url - 要打开的URL地址
         */
        openLink(url) {
            window.open(url, '_blank');
        }
    }
};
</script>

<style scoped>
.about-container {
    color: var(--common-color);
    max-width: 600px;
    margin: 0 auto;
    padding: 10px;

    /**
     * 头部
     */
    >.title-section {
        text-align: center;
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;

        .logo {
            width: 88px;
            height: 88px;
            border-radius: 10px;
            margin-bottom: 10px;
        }

        >.title {
            font-style: normal;
            font-weight: 400;
            font-size: 18px;
        }

        >.subtitle {
            font-weight: 400;

            span {
                color: #3f68ff;
            }
        }
    }

    /**
     * 日志
     */
    .changelog-section {
        text-align: left;

        .version-block h3 {
            color: #409EFF;
            margin-bottom: 10px;
        }

        .version-block ul {
            list-style-type: disc;
            padding-left: 20px;
        }

        .version-block li {
            margin-bottom: 2px;
        }
    }

    .qrcode-image {
        width: 150px;
        height: 150px;
    }
}
</style>
