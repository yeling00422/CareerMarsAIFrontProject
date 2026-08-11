const path = require('path');  // 👈 加上这一行

module.exports = {
  publicPath: '/ai/',
  productionSourceMap: false,
  lintOnSave: false,
  outputDir: 'ai', // 👈 打包输出目录名，build之后生成 ai文件夹，不再是dist

  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),  // 现在 path 就能用了
      },
      extensions: ['.ts', '.js', '.vue', '.json','.css', '.scss'], // 👈 加上这一行
    }
  }
};