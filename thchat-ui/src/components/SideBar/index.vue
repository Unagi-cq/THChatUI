<template>
    <div class="recall-sidebar" v-if="recallList.length || webSearchResults.length">
        <div class="recall-header">
            <div v-if="recallList.length" class="title-container">
                <h3>召回内容</h3>
                <div class="header-icons">
                    <SvgIcon icon-class="close" class="close-icon icon-hover-effect" @click="$emit('close')" />
                </div>
            </div>
            <div v-else-if="webSearchResults.length" class="title-container">
                <h3>联网搜索结果</h3>
                <div class="header-icons">
                    <SvgIcon icon-class="close" class="close-icon icon-hover-effect" @click="$emit('close')" />
                </div>
            </div>
        </div>
        <div class="recall-content">
            <div v-if="recallList.length">
                <ul class="recall-list">
                    <li v-for="(item, idx) in recallList" :key="idx" class="recall-item">
                        <template v-if="typeof item === 'object'">
                            <div v-if="item.content" class="item-content">{{ item.content }}</div>
                            <div v-if="item.score" class="item-score">相关度: {{ (item.score * 100).toFixed(2) }}%</div>
                            <div v-if="item.filename" class="item-filename">文件名: {{ item.filename }}</div>
                        </template>
                        <template v-else>{{ item }}</template>
                    </li>
                </ul>
            </div>
            <div v-if="webSearchResults.length">
                <ul class="recall-list">
                    <li v-for="(item, idx) in webSearchResults" :key="idx" class="search-result-item">
                        <div class="result-content-wrapper">
                            <div v-if="item.title" class="result-title">{{ idx + 1 }}. {{ item.title }}</div>
                            <div v-if="item.content" class="result-content">{{ item.content }}</div>
                            <div v-if="item.url" class="result-url"><a :href="item.url" target="_blank">{{ item.url }}</a></div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SideBar',
    props: {
        recallList: {
            type: Array,
            default: () => []
        },
        webSearchResults: {
            type: Array,
            default: () => []
        },
        isMobile: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style scoped lang="scss">

@mixin header-before {
    &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        height: 60%;
        width: 4px;
        background-color: var(--components-sidebar-header-accent);
        border-radius: 2px;
    }
}

.recall-sidebar {
    background: var(--components-sidebar-bg);
    width: 20%;
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 8px;
    font-size: 12px;
    overflow: hidden;
    height: 90%;
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
    animation: componentsSidebarFadeIn 0.3s ease-in-out;
}

/* 在移动端全屏SideBar中，去除边距和圆角 */
.mobile-sidebar .recall-sidebar {
    width: 100%;
    height: 100%;
    position: relative;
    right: 0;
    top: 0;
    transform: none;
    box-shadow: none;
    border-radius: 0;
    border-left: none;
    background: var(--components-sidebar-bg-mobile);
}

/* 在 md 尺寸下 */
@media (max-width: 1500px) {
    .recall-sidebar {
        width: 25%;
    }
}

/* 在 xs 尺寸下 */
@media (max-width: 767px) {
    .recall-sidebar {
        width: 100%;
        right: 0;
        height: 100%;
    }
}

.recall-header {
    padding: 20px 20px 15px 20px;
    position: sticky;
    top: 0;
    background: var(--components-sidebar-bg);
    z-index: 1;
}

.title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.close-icon {
    cursor: pointer;
    width: 20px;
    height: 20px;
    opacity: 0.6;
}

.header-icons {
    display: flex;
    align-items: center;
}

.recall-content {
    padding: 10px;
    overflow-y: auto;
    overflow-x: hidden;
    flex: 1;
}

.recall-sidebar h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--components-sidebar-header-text);
    letter-spacing: 0.3px;
    position: relative;
    padding-left: 16px;
    transition: all 0.3s ease;

    @include header-before;
}

.recall-list {
    padding-left: 0;
    margin: 5px 0;
    list-style-type: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.recall-list li {
    padding: 14px;
    margin-bottom: 12px;
    background-color: var(--components-sidebar-item-bg);
    border-radius: 8px;
    line-height: 1.5;
    position: relative;
    overflow: hidden;
    border: 1px solid var(--components-sidebar-item-border);
}

.recall-item .item-content {
    margin-bottom: 10px;
    line-height: 1.6;
}

.recall-item .item-score,
.recall-item .item-filename {
    font-size: 12px;
    color: var(--components-sidebar-item-score-color);
    margin-top: 6px;
    display: flex;
    align-items: center;
}

.recall-item .item-score::before,
.recall-item .item-filename::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--components-sidebar-item-accent);
    margin-right: 6px;
    opacity: 0.6;
}

.search-result-item {
    padding: 14px;
    margin-bottom: 16px;
    border-radius: 8px;
    background-color: var(--components-sidebar-item-bg);
    display: flex;
    position: relative;
    overflow: hidden;
    animation: slideIn 0.4s ease-out;
    animation-fill-mode: both;
    border: 1px solid var(--components-sidebar-item-border);
}

.result-content-wrapper {
    flex: 1;
}

.result-title {
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--components-sidebar-result-title-color);
    position: relative;
    display: flex;
    align-items: center;
}

.result-content {
    color: var(--components-sidebar-result-content-color);
    margin-bottom: 10px;
    line-height: 1.6;
}

.result-url {
    margin-top: 8px;
    word-break: break-all;
    padding-top: 8px;
}

.result-url a {
    color: var(--components-sidebar-result-url-color);
    text-decoration: none;
    opacity: 0.85;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
}

.result-url a::before {
    content: '🔗';
    margin-right: 4px;
}

.result-url a:hover {    
    opacity: 1;    
    text-decoration: none;
}

/* 响应式设计优化 */
@media screen and (max-width: 768px) {
    .recall-sidebar {
        width: 100%;
        right: 0;
        height: 100%;
        transform: none;
        animation: none;
        border-radius: 0;
        top: 0;
    }
    
    .recall-header {
        padding: 15px;
    }
    
    .recall-content {
        padding: 10px;
    }
    
    .recall-list li, .search-result-item {
        padding: 12px;
        margin-bottom: 10px;
    }
    
    .recall-sidebar h3 {
        font-size: 16px;
    }

    /* 移动端颜色适配 */
    .close-icon {
        color: var(--components-sidebar-header-text);
    }

    .recall-list .item-content, 
    .recall-list .item-score, 
    .recall-list .item-filename,
    .search-result-item .result-content {
        color: var(--components-sidebar-result-content-color);
    }
}
</style>
