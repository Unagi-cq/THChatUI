const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // github action打包之后 访问的资源路径以仓库名开头 因此这里要做一下区分
  publicPath: process.env.DEPLOY_ENV === 'GH_PAGES'
    ? '/THChatUI/'
    : '/',
  transpileDependencies: true,
  devServer: {
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
      '/baidu/remote': {
        target: 'https://aip.baidubce.com', // 代理的目标地址
        changeOrigin: true, // 是否需要改变源
        pathRewrite: {
          '^/baidu/remote': ''
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
    config.module
      .rule('markdown')
      .test(/\.md$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end();
  }
})
