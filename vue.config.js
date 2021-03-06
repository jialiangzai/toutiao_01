module.exports = {
  lintOnSave: true,
  // 打包后可以部署到任意目录
  publicPath: './',
  devServer: {
    open: true,
    port: 3012
  },
  css: {
    loaderOptions: {
      less: {
        // 若使用 less-loader@5，请移除 lessOptions 这一级，直接配置选项。
        // lessOptions: {
        modifyVars: {
          // 直接覆盖变量 不加@
          blue: '#fc6627'
        }
        // }
      }
    }
  }

}
