module.exports = {
  devServer: {
    port: 8080,
    open: true,
    hot: true, //自动保存
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3030/newbee',
        ws: true,
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
  //配置彻底懒加载
  chainWebpack: (config) => {
    config.plugins.delete('prefetch'); //删除index.html开头的带有prefetch属性的link，不要异步下载暂时不需要的页面组件文件
  },
};
