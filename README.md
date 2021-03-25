# Mars3D widget项目模版 - Vue版(本地引入mars3d)
    Mars3D三维地球平台软件，在`Vue技术栈下`的widget项目模版，基于vueCli 4.x (本地引入mars3d库，非npm)。
     

### 与[mars3d-vue-template](https://github.com/marsgis/mars3d-vue-template)仓库的区别
1. mars3d库使用的是本地目录下的js和css，非npm版本。
2. 该仓库主要是提供给已购买Mars3D授权的用户使用的。


 > 其他技术栈，请参考： [https://github.com/marsgis/mars3d](https://github.com/marsgis/mars3d)
 
  
## 运行命令
 
### 首次运行前安装依赖
 `npm install` 或 `cnpm install`
 
### http运行项目
 `npm run serve`  运行后访问：`http://localhost:3001/` 

### 打包编译项目
 运行`npm run build`来构建项目。 


## 项目说明
1. 部分第三方库不是npm方式引入，是主页head中静态资源方式引入的。资源放在public目录下。 
2. public目录下文件与 Mars3D基础项目 的目录和文件完全相同，可以直接复制到该目录下进行更新。

3. public下面的widgets目录为之前传统js方式编写的一些widget模块，目前未重写为vue，当前为了兼容使用是静态引入的方式。  
  新开发业务功能请在src目录下按vue方式去编写，不要使用原有的widget方式。
 
### 更新项目
 此脚手架中类库和widgets不保证是最新版本
 请您自行拷贝"基础项目"的 config、img、lib和widgets目录覆盖至当前项目的public目录下



## 运行效果 
 [在线Demo](http://mars3d.cn/project/vue-template/)  

 ![image](http://mars3d.cn/project/vue-template/screenshot.jpg)
 

  
## 如何集成到自己已有的项目中
1. ### 安装mars3d依赖包
 覆盖授权版本的SDK至 `src\components\mars3d\lib\`目录下。

2. ### 拷贝文件
 > 场景配置文件：`public\config\config.json`

 > 组件定义文件：`src\components\mars3d\Map.vue`

3. ### 安装 mars3d-cesium
 npm install  mars3d-cesium --save
 npm install  @turf/turf --save

4. ### 配置vue.config.js 
当前仓库是基于 vueCli 4.x 
```js
// vue.config.js  添加下面配置  
const CopywebpackPlugin = require('copy-webpack-plugin')
const cesiumSource = 'node_modules/mars3d-cesium/Build/Cesium/'

//拷贝cesium相关资源
plugins = [
    new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify('static')
    }),
    new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Workers'), to: 'static/Workers' }]),
    new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Assets'), to: 'static/Assets' }]),
    new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'ThirdParty'), to: 'static/ThirdParty' }]),
    new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Widgets'), to: 'static/Widgets' }])
]
```
如果是 vueCli 3.x 时，参考下面配置plugins 

```js
// vue.config.js 添加下面配置

const CopywebpackPlugin = require('copy-webpack-plugin')
const cesiumSource = 'node_modules/mars3d-cesium/Build/Cesium/'

module.exports = {
  //已忽略其他配置
  configureWebpack: config => {
    let plugins = [];
    if (process.env.NODE_ENV === 'production') {
      plugins = [
        new webpack.DefinePlugin({
          'CESIUM_BASE_URL': JSON.stringify('static')
        }),
        new CopywebpackPlugin([{ from: path.join(cesiumSource, cesiumWorkers), to: 'static/Workers' }]),
        new CopywebpackPlugin([{ from: path.join(cesiumSource, 'Assets'), to: 'static/Assets' }]),
        new CopywebpackPlugin([{ from: path.join(cesiumSource, 'Widgets'), to: 'static/Widgets' }]),
      ]
    } else {
      plugins = [
        new webpack.DefinePlugin({
          'CESIUM_BASE_URL': JSON.stringify('')
        }),
        new CopywebpackPlugin([{ from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' }]),
        new CopywebpackPlugin([{ from: path.join(cesiumSource, 'Assets'), to: 'Assets' }]),
        new CopywebpackPlugin([{ from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }]),
      ]
    }
    return {
      plugins: plugins
    }
  },
}
```


5. ### 创建地球 
 参考 `src\views\Index.vue`文件引入Map组件和构造创建地球，主要关注下下面代码处
```js
<Map :url="configUrl" @onload="onMapload" />

import Map from '../components/mars3d/Map.vue'
```
6. ### 常见问题
 运行报错时，请检查相关版本是否有冲突，比如webpack 4.43.0与copy-webpack-plugin 7.0.0 会出问题
  >1. 检查webpack和copy-webpack-plugin版本兼容问题
  >2. 检查webpack和copy-webpack-plugin与node、npm的版本兼容问题
 

## Mars3D 是什么 
> `Mars3D三维地球平台软件` 是[火星科技](http://marsgis.cn/)团队研发的二三维一体的WebGIS地图开发平台，是火星科技团队成员多年GIS开发和Cesium使用的技术沉淀。基于[Cesium](https://cesium.com/cesiumjs/)开源库和现代Web技术栈全新构建，该平台框架优化了Cesium的使用方式和增添了更多高级功能。集成了领先的开源地图库、可视化库，提供了全新的三维大数据可视化、实时流数据可视化功能，通过本产品可快速实现浏览器和移动端上美观、流畅的三维地图呈现与空间分析。

### 相关网站 
- Mars3D官网：[http://mars3d.cn](http://mars3d.cn)  

- GitHub导航列表：[https://github.com/marsgis/mars3d](https://github.com/marsgis/mars3d)


## 版权说明
1. 任何`个人或组织`可以在遵守Mars3D相关要求下`免费无限制`使用。
2. 如有`个性化需求`或`商业应用`，请联系[火星科技](http://mars3d.cn)购买。