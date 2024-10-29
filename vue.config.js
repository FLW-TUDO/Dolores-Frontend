module.exports = {
    configureWebpack: {
        devtool: 'source-map'
    },

    pluginOptions: {
      i18n: {
        locale: 'de',
        fallbackLocale: 'en',
        localeDir: 'locales',
        enableLegacy: false,
        runtimeOnly: false,
        compositionOnly: false,
        fullInstall: true
      }
    }
}
