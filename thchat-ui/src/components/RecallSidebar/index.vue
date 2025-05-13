<template>
    <div class="recall-sidebar" v-if="recallList.length || webSearchResults.length">
        <div class="recall-header">
            <div v-if="recallList.length" class="title-container">
                <h3>召回内容</h3>
                <SvgIcon @click="$emit('close')" icon-class="close" class="close-icon" />
            </div>
            <div v-else-if="webSearchResults.length" class="title-container">
                <h3>联网搜索结果</h3>
                <SvgIcon @click="$emit('close')" icon-class="close" class="close-icon" />
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
                <ul class="search-results-list">
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
    name: 'RecallSidebar',
    props: {
        recallList: {
            type: Array,
            default: () => []
        },
        webSearchResults: {
            type: Array,
            default: () => []
        }
    }
}
</script>

<style scoped>
.recall-sidebar {
    background: var(--recall-bg-color, #ffffff);
    width: 20%;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border-radius: 12px 0 0 12px;
    font-size: 14px;
    overflow: hidden;
    height: 90%;
    display: flex;
    flex-direction: column;
    border-left: 1px solid rgba(0, 0, 0, 0.05);
}

/* 在 md 尺寸下 */
@media (max-width: 1500px) {
    .recall-sidebar {
        width: 25%;
    }
}

.recall-header {
    padding: 20px 20px 10px 20px;
    position: sticky;
    top: 0;
    background: var(--recall-bg-color, #ffffff);
    z-index: 1;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
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

.close-icon:hover {
    opacity: 1;
}

.recall-content {
    padding: 10px;
    overflow-y: auto;
    scrollbar-width: none;
    flex: 1;
}

.recall-sidebar h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--common-color, #2454ff);
    letter-spacing: 0.3px;
}

.recall-list, .search-results-list {
    padding-left: 0;
    margin: 10px 0;
    list-style-type: none;
}

.recall-list li {
    padding: 10px;
    margin-bottom: 8px;
    background-color: rgba(36, 84, 255, 0.04);
    border-radius: 8px;
    line-height: 1.5;
}

.recall-item .item-content {
    font-size: 13px;
    margin-bottom: 8px;
}

.recall-item .item-score,
.recall-item .item-filename {
    font-size: 12px;
    color: #666;
    margin-top: 4px;
}

.search-result-item {
    padding: 12px;
    margin-bottom: 14px;
    border-radius: 8px;
    background-color: rgba(36, 84, 255, 0.04);
    display: flex;
}

.result-content-wrapper {
    flex: 1;
}

.search-result-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
}

.result-title {
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 6px;
    color: var(--common-color, #2454ff);
}

.result-content {
    color: var(--answer-stats-color, #2454ff);
    margin-bottom: 8px;
    line-height: 1.5;
    font-size: 12px;
}

.result-url {
    font-size: 12px;
    margin-top: 6px;
    word-break: break-all;
}

.result-url a {
    color: var(--primary-color, #2454ff);
    text-decoration: none;
    opacity: 0.85;
}

.result-url a:hover {
    opacity: 1;
    text-decoration: underline;
}
</style>
