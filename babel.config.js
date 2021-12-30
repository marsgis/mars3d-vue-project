module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  ignore: ["./src/common/mars3d-sdk/dist/mars3d.js"],
  plugins: [["import", { libraryName: "ant-design-vue", libraryDirectory: "es", style: true }]]
}
