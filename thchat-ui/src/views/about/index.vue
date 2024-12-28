<template>
    <div class="changelog-container">
        <!-- Logo和标题部分 -->
        <div class="header-section">
            <img src="@/assets/images/logo_white_2480.png" class="logo" alt="logo" />
            
            <h1>THChatUI</h1>
            <p class="subtitle">Boost your efficiency with AI, your ultimate copilot for work and learning
            </p>
            <p class="description">A user-friendly AI desktop client that supports multiple advanced AI
                models, transforming cutting-edge artificial intelligence technology into an easy-to-use
                productivity tool.</p>

            <!-- 按钮组 -->
            <div class="button-group">
                <el-button type="primary" @click="checkUpdate">CHECK UPDATE</el-button>
                <el-button @click="goToHomepage">HOMEPAGE</el-button>
                <el-button @click="goToFeedback">FEEDBACK</el-button>
                <el-button @click="goToFaqs">FAQS</el-button>
            </div>

            <!-- 作者信息 -->
            <div class="author-section">
                <h3>Benn:</h3>
                <p>Hi! I made Chatbox for my own use and it's great to see so many people enjoying it! If
                    you'd like to support development, a donation would be greatly appreciated, though it is
                    entirely optional. Many thanks, Benn.</p>
                <div class="links">
                    <el-link type="primary" href="#">Donate</el-link>
                    <el-link type="primary" href="#">Follow me on Twitter(X)</el-link>
                </div>
            </div>
        </div>

        <!-- 更新日志部分 -->
        <div class="changelog-section">
            <h2>Changelog</h2>

            <div class="version-block">
                <h3>v1.8.1 - 2024.12.23</h3>
                <ul>
                    <li>Fixed an issue with DALL-E API requests.</li>
                </ul>
            </div>

            <div class="version-block">
                <h3>v1.8.0 - 2024.12.22</h3>
                <ul>
                    <li>Introduced Web Browsing capability. Chatbox AI Models and Gemini 2.0 flash(API) can
                        now be enabled to access real-time internet information, providing responses with
                        cited sources</li>
                    <li>Added first-token latency display for message generation, toggleable in settings
                    </li>
                    <li>Enhanced image preprocessing capabilities. You can now send images in more formats
                        (e.g., svg, gif) - Chatbox automatically converts them to model-compatible formats
                        and adjusts dimensions to meet model requirements</li>
                    <li>Double-click thread title to quickly access the thread list</li>
                    <li>Improved compatibility for custom model provider configurations - Chatbox now
                        automatically corrects and handles common configuration errors</li>
                    <li>Increased maximum temperature range to 2.0</li>
                    <li>Added confirmation for all delete actions</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "About",
    data() {
        return {

        }
    },
    methods: {
        checkUpdate() {
            // 实现检查更新逻辑
        },
        goToHomepage() {
            // 跳转到主页
        },
        goToFeedback() {
            // 跳转到反馈页面
        },
        goToFaqs() {
            // 跳转到FAQ页面
        }
    }
};
</script>

<style scoped>
.changelog-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.header-section {
    text-align: center;
    margin-bottom: 40px;
}

.logo {
    width: 100px;
    height: 100px;
    margin-bottom: 20px;
}

.subtitle {
    font-size: 18px;
    font-weight: bold;
    margin: 15px 0;
}

.description {
    color: #666;
    margin-bottom: 20px;
}

.button-group {
    margin: 20px 0;
    display: flex;
    justify-content: center;
    gap: 10px;
}

.author-section {
    text-align: left;
    padding: 20px;
    background: #f5f7fa;
    border-radius: 8px;
    margin: 20px 0;
}

.links {
    margin-top: 10px;
    display: flex;
    gap: 15px;
}

.changelog-section {
    text-align: left;
}

.version-block {
    margin-bottom: 30px;
}

.version-block h3 {
    color: #409EFF;
    margin-bottom: 15px;
}

.version-block ul {
    list-style-type: disc;
    padding-left: 20px;
}

.version-block li {
    margin-bottom: 10px;
    line-height: 1.5;
}
</style>
