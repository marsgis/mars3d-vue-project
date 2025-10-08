
## mars-ui介绍

## 依赖库
- [Ant Design Vue](https://next.antdv.com/components/overview-cn/)：UI 控件库
- [IconPark](https://iconpark.oceanengine.com/official)：UI 图标库


## 将mars-ui集成到自己的项目中

> 前提条件：需要 2 个项目的技术栈基本是一致的，比如`vue3+ts+ant-design-vue`等


### 流程概览：

需要拷贝的目录和文件：

- `/src/components/mars-ui` 拷贝到 `/src/components/mars-ui`

需要修改自己项目的文件：

- `package.json`
- `vite.config.ts` 或 `vue.config.js`
- `src/main.js`
- 需要加地图的`vue文件`

![image](http://mars3d.cn/dev/img/guide/project-vue-hebing.jpg)

### 1. 拷贝src/components/mars-ui文件夹
### 2. 在main.ts文件中进行集成
```json

import "./components/mars-ui/common";
import MarsUIInstall from "./components/mars-ui";


MarsUIInstall(app);
```
### 3. 安装相关依赖
```json
  "dependencies": {
    "@icon-park/svg": "^1.4.2",
    "@turf/turf": "^7.2.0",
    "ant-design-vue": "^4.0.7",
    "consola": "^3.2.3",
    "echarts": "^5.4.3",
    "mars3d": "~3.10.0",
    "mars3d-cesium": "~1.134.0",
    "nprogress": "^0.2.0",
    "vite-plugin-style-import": "^2.0.0",
    "vue": "^3.5.13",
    "vue-color-kit": "^1.0.6"
  },
```

### 4. 配置vite文件
```json
  export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: `@import "${path.resolve(
          __dirname,
          "src/components/mars-ui/base.less"
        )}";`,
      },
    },
  },
  plugins: [
    vue(),
    mars3dPlugin(),
    createStyleImportPlugin({
      resolves: [AndDesignVueResolve()],
      libs: [
        {
          libraryName: "ant-design-vue",
          esModule: true,
          resolveStyle: (name) => {
            if (name === "auto-complete") {
              return `ant-design-vue/es/${name}/index`;
            }
            return `ant-design-vue/es/${name}/style/index`;
          },
        },
      ],
    }),
  ],
});
```

### 5. 使用
参考实例，使用对应的标签

基础项目已经基本保证不会影响外部样式，此处要处理的是您项目中的全局样式对 mars3d 相关组件的影响。修改相关 CSS 保证基础项目功能 UI 正常即可。

