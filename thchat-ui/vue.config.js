const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
    // github action打包之后 访问的资源路径以仓库名开头 因此这里要做一下区分
    publicPath: process.env.DEPLOY_ENV === 'GH_PAGES'
        ? '/THChatUI/'
        : './',
    transpileDependencies: true,
    devServer: {
        client: {
            overlay: false // 禁用错误覆盖层
        },
        compress: false,
        // 开发服务器配置
        proxy: {
            // 可以配置多个代理
            '/ali/remote': {
                target: 'https://dashscope.aliyuncs.com', // 代理的目标地址
                changeOrigin: true, // 是否需要改变源
                pathRewrite: {
                    '^/ali/remote': ''
                },
            },
            // 配置代理 本地使用
            '/local': {
                target: 'http://localhost:5000', // 代理的目标地址
                changeOrigin: true, // 是否需要改变源
                pathRewrite: {
                    '^/local': ''
                },
            },

        }
    },
    chainWebpack: config => {
        // SVG图标加载配置
        // 先排除icons目录中的svg文件，让其使用svg-sprite-loader处理
        config.module
            .rule('svg')
            .exclude.add(path.resolve('src/assets/icons/svg'))
            .end();

        // 配置svg-sprite-loader专门处理icons目录中的svg
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(path.resolve('src/assets/icons/svg'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end();

        config.module
            .rule('markdown')
            .test(/\.md$/)
            .use('raw-loader')
            .loader('raw-loader')
            .end();
    }
})
