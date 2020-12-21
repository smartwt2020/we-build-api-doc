module.exports = {
  publicPath: '/api-doc',
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "@/assets/scss/_variables.scss"; @import "asw-ele2/scss/parent/_vars.scss"; @import "asw-ele2/scss/parent/_colors-vars.scss";'
      }
    }
  }
}
