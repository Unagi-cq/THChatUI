const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
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
      // 配置代理 本地使用
      '/local': {
        target: 'http://localhost:5000', // 代理的目标地址
        changeOrigin: true, // 是否需要改变源
        pathRewrite: {
          '^/local': ''
        },
      },

    }
  }
})
