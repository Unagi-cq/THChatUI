// 引入预览组件
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
// vuepress主题
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'
// github主题
// import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
// import '@kangc/v-md-editor/lib/theme/style/github.css';
// 显示代码行数
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index';
// 快速复制代码
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';
// 引入公式绘制
import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/cdn';
// 代码高亮
import Prism from 'prismjs'

VMdPreview.use(vuepressTheme, {
    Prism
})

// highlightjs
// import hljs from 'highlight.js';
//
// VMdPreview.use(githubTheme, {
//     Hljs: hljs,
// });
// VMdPreview.use(createLineNumbertPlugin());
VMdPreview.use(createCopyCodePlugin());
VMdPreview.use(createKatexPlugin());

export default VMdPreview

