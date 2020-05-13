module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://gppz.chuxy.cn'
      }
    },
  }
}