<template>
    <div class="about-container">
        <div class="title-section">
            <img :src="logoSrc" class="logo" alt="logo" />

            <span class="title">THChatUI</span>
            <p class="subtitle">欢迎使用<span>THChatUI</span>，一个基于<span>Vue</span>和<span>Element Plus</span>的Web对话管理WebUI。
            </p>

            <p class="description">
                THChatUI是一个专为数据敏感型个人/组织设计的大模型WebUI。<br />
                前端采用Vue更适合中国宝宝体质~<br />
                后端采用Python的Flask快速启动接口，项目提供了若干个调用示例(并不是必须的)。<br />
                不需额外数据库，数据存浏览器缓存中。<br />
            </p>

            <div class="button-group">
                <el-button @click="openLink('https://github.com/Unagi-cq/THChatUI/tree/main')">查看仓库</el-button>
                <el-button @click="openLink('https://github.com/Unagi-cq/THChatUI/issues')">问题反馈</el-button>
                <el-button @click="openLink('https://blog.csdn.net/qq_43592352')">关注我的博客</el-button>
                <el-tooltip
                    effect="light"
                    placement="bottom"
                    :hide-after="0"
                >
                    <template #content>
                        <img 
                            src="https://camo.githubusercontent.com/87a893bee88420aeafe213982817f6a2e184206a3fa42e5f466e489681b58a4e/68747470733a2f2f696d672e63686b616a612e636f6d2f613833643538356231626138356662392e706e67" 
                            alt="公众号二维码" 
                            class="qrcode-image"
                        />
                    </template>
                    <el-button>关注我的公众号</el-button>
                </el-tooltip>
            </div>
        </div>

        <!-- 更新日志 -->
        <div class="changelog-section">
            <h2>更新日志</h2>

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
            qrCodeVisible: false
        }
    },
    computed: {
        logoSrc() {
            const theme = this.$store.state.setting.theme
            return theme === 'dark' ? logoLight : logoDark
        }
    },
    methods: {
        openLink(url) {
            window.open(url, '_blank');
        },
        showQrCode() {
            this.qrCodeVisible = !this.qrCodeVisible;
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
            font-size: 14px;
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
        font-size: 14px;
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

    .qrcode-container {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .qrcode-image {
        width: 150px;
        height: 150px;
    }
}
</style>
