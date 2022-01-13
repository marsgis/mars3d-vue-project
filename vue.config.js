const path = require("path")
const glob = require("glob")
const webpack = require("webpack")
const CopyWebpackPlugin = require("copy-webpack-plugin")

function resolve(dir) {
  return path.join(__dirname, dir)
}

const pages = handleEntry("./src/pages/**/main.ts")

module.exports = {
  publicPath: process.env.BASE_URL,
  outputDir: "dist/jcxm-vue",
  assetsDir: "static",
  productionSourceMap: false,
  devServer: {
    // 它支持webPack-dev-server的所有选项
    host: "localhost", // 也可以直接写IP地址这样方便真机测试
    port: 2003, // 端口号
    https: false, // https:{type:Boolean}
    open: true // 配置自动启动浏览器
  },
  filenameHashing: false,
  pages,
  configureWebpack: (config) => {
    // console.log(config)
    // const cesiumRunPath = config.output.publicPath// cesium运行时主目录
    const cesiumRunPath = "./cesium" // cesium运行时主目录

    const cesiumSourcePath = "node_modules/mars3d-cesium/Build/Cesium/" // cesium库目录

    const plugins = [
      // 标识cesium资源所在的主目录，cesium内部资源加载、多线程等处理时需要用到
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify(cesiumRunPath)
      }),
      // cesium相关资源目录需要拷贝到系统目录下面
      new CopyWebpackPlugin({
        patterns: [
          { from: path.join(cesiumSourcePath, "Workers"), to: path.join(config.output.path, cesiumRunPath, "Workers") },
          { from: path.join(cesiumSourcePath, "Assets"), to: path.join(config.output.path, cesiumRunPath, "Assets") },
          { from: path.join(cesiumSourcePath, "ThirdParty"), to: path.join(config.output.path, cesiumRunPath, "ThirdParty") },
          { from: path.join(cesiumSourcePath, "Widgets"), to: path.join(config.output.path, cesiumRunPath, "Widgets") }
        ]
      })
    ]

    config.plugins = [...config.plugins, ...plugins]
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set("@mars", resolve("src"))

  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  }
}

function handleEntry(entry) {
  const entries = {}

  glob.sync(entry).forEach((item) => {
    const entryBaseName = item.replace(/\.\/src\/pages\/(\S*)\/main\.ts/g, "$1")
    entries[entryBaseName] = {
      entry: `src/pages/${entryBaseName}/main.ts`,
      template: "public/index.html",
      filename: `${entryBaseName}.html`,
      title: "Mars3D",
      chunks: ["chunk-vendors", "chunk-common", entryBaseName]
    }
  })

  return entries
}
