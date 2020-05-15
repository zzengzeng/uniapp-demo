module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://hf.pay-face.com/'
      }
    },
  }
}