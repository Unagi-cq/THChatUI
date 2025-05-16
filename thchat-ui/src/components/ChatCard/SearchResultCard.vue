<template>
    <div v-if="items && items.length > 0" :class="[`${type}-content`]">
        <div class="header-container">
            <div :class="[`${type}-header`]">{{ headerText }}</div>
            <el-button type="text" @click="viewAll" class="view-all-btn">查看全部</el-button>
        </div>
        <div class="carousel-container">
            <div class="carousel-prev" @click="scrollCarousel('prev')" v-show="items.length > 1">
                <el-icon><ArrowLeft /></el-icon>
            </div>
            <div :class="[`${type}-items-container`]" ref="itemsContainer">
                <div v-for="(item, index) in items" :key="index" :class="[`${type}-item`]">
                    <div :class="[`${type}-title`]">
                        <!-- 网络搜索结果标题 -->
                        <template v-if="type === 'web-search'">
                            <a :href="item.url" target="_blank" class="web-search-link" @click.stop>{{ item.title }}</a>
                            <span class="web-search-score">搜索匹配度: {{ (item.score * 100).toFixed(1) }}%</span>
                        </template>
                        <!-- 知识库召回标题 -->
                        <template v-else>
                            {{ item.filename }}
                            <span class="recall-score">相关性分数: {{ (item.score * 100).toFixed(1) }}%</span>
                        </template>
                    </div>
                    <div :class="[`${type}-text`]">{{ item.content }}</div>
                </div>
            </div>
            <div class="carousel-next" @click="scrollCarousel('next')" v-show="items.length > 1">
                <el-icon><ArrowRight /></el-icon>
            </div>
        </div>
    </div>
</template>

<script>
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue';
import eventBus from '@/eventBus';

export default {
    name: 'SearchResultCard',
    components: {
        ArrowLeft,
        ArrowRight
    },
    props: {
        // 内容数组
        items: {
            type: Array,
            default: () => []
        },
        // 类型：recall (知识库召回) 或 web-search (网络搜索)
        type: {
            type: String,
            default: 'recall',
            validator: (value) => ['recall', 'web-search'].includes(value)
        },
        // 自定义标题
        customTitle: {
            type: String,
            default: ''
        }
    },
    computed: {
        // 标题文本
        headerText() {
            if (this.customTitle) return this.customTitle;
            return this.type === 'recall' ? '知识库检索内容' : '网络搜索结果';
        }
    },
    methods: {
        /**
         * 滚动轮播
         * @param {string} direction - 'prev' 或 'next'
         */
        scrollCarousel(direction) {
            const container = this.$refs.itemsContainer;
            if (!container) return;
            
            const scrollAmount = 300; // 每次滚动的像素数
            const currentScroll = container.scrollLeft;
            
            if (direction === 'prev') {
                container.scrollTo({
                    left: Math.max(0, currentScroll - scrollAmount),
                    behavior: 'smooth'
                });
            } else {
                container.scrollTo({
                    left: currentScroll + scrollAmount,
                    behavior: 'smooth'
                });
            }
        },

        /**
         * 查看全部
         */
        viewAll() {
            if (this.type === 'recall') {
                eventBus.emit('showSideBar', {
                    recallList: this.items,
                    webSearchResults: []
                });
            } else {
                eventBus.emit('showSideBar', {
                    recallList: [],
                    webSearchResults: this.items
                });
            }
        }
    }
}
</script>

<style lang="scss" scoped>
/**
 * 通用容器样式
 */
.recall-content,
.web-search-content {
    padding: 5px 0;
    width: 100%;
    font-size: 12px;
}

/**
 * 头部容器
 */
.header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
}

/**
 * 标题样式
 */
.recall-header,
.web-search-header {
    color: var(--common-color);
    font-weight: bold;
    display: flex;
    align-items: center;
    padding: 5px 10px;
    background-color: var(--sendBox-bg-color);
    border-radius: 10px;
}

/**
 * 项目容器
 */
.recall-items-container,
.web-search-items-container {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 10px;
    scrollbar-width: thin;
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */

    &::-webkit-scrollbar {
        display: none; /* Chrome, Safari and Opera */
    }
}

/**
 * 项目样式
 */
.recall-item,
.web-search-item {
    min-width: 120px;
    max-width: 200px;
    flex: 0 0 auto;
    margin-bottom: 0;
    border-radius: 8px;
    border: 1px solid var(--answer-stats-color);
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
}

.recall-item {
    padding: 8px;
}

.web-search-item {
    padding: 8px;
}

/**
 * 标题样式
 */
.recall-title,
.web-search-title {
    margin-bottom: 4px;
    display: flex;
    flex-direction: column;
}

.recall-title {
    color: var(--recall-item-title-color);
    font-weight: bold;
}

.web-search-link {
    color: var(--el-color-primary);
    font-weight: bold;
    text-decoration: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:hover {
        text-decoration: underline;
    }
}

/**
 * 分数样式
 */
.recall-score,
.web-search-score {
    color: var(--recall-item-title-color);
    font-weight: normal;
    font-size: 12px;
    margin-top: 4px;
}

/**
 * 文本样式
 */
.recall-text,
.web-search-text {
    color: var(--answer-stats-color);
    line-height: 1.5;
    position: relative;
    font-size: 11px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

/**
 * 查看全部按钮
 */
.view-all-btn {
    margin: 0;
    padding: 0;
}

/**
 * 轮播导航按钮
 */
.carousel {
    &-container {
        display: flex;
        align-items: center;
        position: relative;
        width: 100%;
    }

    &-prev, &-next {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background-color: var(--sendBox-bg-color);
        border: 1px solid var(--answer-stats-color);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        z-index: 10;
        flex-shrink: 0;
        transition: all 0.2s;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);

        &:hover {
            background-color: var(--el-color-primary-light-9);
            color: var(--el-color-primary);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
        }
    }

    &-prev {
        left: -12px;
    }

    &-next {
        right: -12px;
    }
}
</style> 