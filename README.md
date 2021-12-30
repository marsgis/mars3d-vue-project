 
<p align="center">
<img src="https://muyao1987.gitee.io/cdn/mars3d.cn/logo.png" width="300px" />
</p>

<p align="center">基于Vue3.x技术栈的 Mars3D🌎基础项目系统</p>

<p align="center">
<a target="_black" href="https://github.com/marsgis/mars3d">
<img alt="GitHub stars" src="https://img.shields.io/github/stars/marsgis/mars3d?style=flat&logo=github">
</a>
<a target="_black" href="https://www.npmjs.com/package/mars3d">
<img alt="Npm downloads" src="https://img.shields.io/npm/dt/mars3d?style=flat&logo=npm">
</a>
<a target="_black" href="https://www.npmjs.com/package/mars3d">
<img alt="Npm version" src="https://img.shields.io/npm/v/mars3d.svg?style=flat&logo=npm&label=version"/>
</a>
</p>



## 项目介绍
 
Mars3D基础项目 是基于[Mars3D平台](http://mars3d.cn)做的一个应用系统，提供的一个基础项目模版，包含常用基础地图功能，可在该基础项目上快速开发搭建新项目。方便快速搭建三维地图产品，敏捷开发，可复用，支持各种配置，适合各种场景使用。

Vue版的特点：
1. 基于**Vue3+TS**技术栈下开发的
2. 继续沿用了原生JS版本widget架构的一些思想，使用vue方式实现了各widget功能



## 视频讲解
建议先看一遍视频讲解，再实际操作。

### Web前端基础知识讲解
 我们也对我们推荐的[Vue3](https://v3.cn.vuejs.org/api/)、[TypeScript](https://www.tslang.cn/)的相关基础知识做了视频讲解，可以进行浏览学习。
 
 您可以[新页面查看高清视频](https://www.bilibili.com/video/BV1xr4y1U73r/)， 视频对应代码在[gitee下载](https://gitee.com/jjniu/basic-technical-develop)
 

### 对Vue版基础项目的讲解
 (录制中……)





## 下载运行项目
 
 
### 下载代码
- [Github](https://github.com/marsgis/mars3d-vue-project)

```
git clone git@github.com:marsgis/mars3d-vue-project.git
```

- [Gitee](https://gitee.com/marsgis/mars3d-vue-project)：国内码云，下载速度快些。

```
git clone git@gitee.com:marsgis/mars3d-vue-project.git
```
 
  
### 运行环境

- 推荐使用 vscode，安装参考[开发环境搭建教程](guide/start/env.html)
- 安装 vscode 插件，推荐安装 volar（并禁用 vetur）、ESlint 、 Prettier
- 配置 vscode 参数
```json
// setting.json相关配置
{
  "eslint.format.enable": true,
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### 运行命令

#### 首次运行前安装依赖
```
npm install

//或使用代理
npm i --registry=http://registry.taobao.org
```

#### 启动开发环境
```
npm run serve
```

#### 编译构建
```
npm run build
```



## 运行效果 
访问[基础项目Vue版](http://mars3d.cn/project/jcxm-vue/index.html) 在线体验效果和功能

 ![image](https://muyao1987.gitee.io/cdn/mars3d.cn/xm/jcxm-vue/1.jpg)


 
## 如何反馈问题？
- 发现您发现项目中存在的问题或者需要优化的地方；
- 如果您有一些自己全新编写的示例，希望也开源与大家分享。

提交方式：
- 欢迎在github或gitee上[提交PR](https://www.baidu.com/s?wd=在GitHub上提交PR) 
- 如果对git不熟悉，也可以整理示例代码发送邮件到 wh@marsgis.cn 由我们来整理集成。


 

## 项目架构

### 技术选型

- [Vue3](https://v3.cn.vuejs.org/api/)：开发框架
- [Vue CLI](https://cli.vuejs.org/zh/guide/)：开发环境
- [TypeScript](https://www.tslang.cn/):开发语言 
- [ESlint](https://eslint.bootcss.com/)：代码检查工具
- [Ant Design Vue](https://next.antdv.com/components/overview-cn/)：UI控件库
- [IconPark](https://iconpark.oceanengine.com/official)：UI图标库

> 需要有一定的知识储备，包括 vue3.0 中的 composition Api 模式等



### 主要目录说明
```
mars3d-vue-project
└───src                 主要项目代码
│   └───common          通用处理
│   └───components      vue组件代码
│   └───directive       vue自定义指令
│   └───misc            主要存放ts相关的模块定义
│   └───pages           页面入口
│   └───styles          样式文件
│   └───utils           工具方法
│   └───widgets         功能模块目录【重要】
└───public              无需编译构建的静态资源【重要】
│   └───config          项目和功能的配置文件
│   └───img             图片资源
│───.eslintrc.js        eslint配置文件
│───babel.config.js     babel配置
│───package.json        项目配置信息
└───vue.config.js       vueCLI 配置文件
```

主要目录是：`src\widgets`


#### 功能主目录
 项目所有功能主要在 `src/widgets/*/*`目录下，每一个功能对应了叶子目录下的一个`index.vue`和 `map.ts` 文件
 
 

## 如何增加新的widget
 
### 1.创建示例

widget目录下的example创建示例，应包含index.vue和map.ts

#### index.vue
index.vue 是vue组件，弹框使用mars-dialog组件、普通面板使用mars-pannel组件
 
vue中需要调用地图方法时，需得启用map.ts的生命周期

```js
import useLifecycle from "@/common/uses/use-lifecycle"
import * as mapWork from "./map"

// 启用map.ts生命周期
useLifecycle(mapWork)
```

#### map.ts
在当前目录下，创建map.ts中，须得创建如下两个方法，传入的参数须得是vue中对应的类型
```js
/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance: mars3d.Map): void {
  map = mapInstance // 记录首次创建的map
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}
```

如果有外部资源的引入，引入js和css文件
将新建的js文件放在新建的文件夹下，使用export将方法抛出去，在map.ts文件中使用import引入即可使用，使用css文件，直接将css文件放在新建的文件夹下，再import导入即可。 
```js
import { Typhoon, PlayTyphoon } from "./Typhoon"
import "./typhoon.css"
```

#### `map.ts`和`index.vue`各自代码业务分离的原则 
- 涉及地图业务的操作均写在 map.ts 中
- 涉及 UI 层面、和地图无关的操作均写在 index.vue 中,vue 中尽量不使用 mars3d 和 Cesium 开头的类




### 2.相关页面加入菜单入口

#### store.ts清单配置
src\pages\example\store.ts中，加入刚加的vue入口文件，import中地址需要与创建的示例路径一致；

```js
{
  component: markRaw(defineAsyncComponent(() => import("@widgets/example/typhoon/index.vue"))),
  name: "typhoon"
}
```

#### 菜单vue文件
在`widgets\example\menu\index.vue`,在menu文件夹下找到index.vue文件，在文件中加入需要的按钮。

在widget目录下的example下的menu中创建弹窗按钮：单击事件的参数与store.ts中的name一致

```vue
<mars-button @click="show('sample-ui')">ui面板示例</mars-button>
```


 

## 开发中常见问题

### 1. 局域网离线使用时注意事项
 平台所有代码层面来说支持离线运行和使用的，但需要注意的是离线时的地图服务的相关处理。
 
 如果局域网内有相关地形、卫星底图服务可以按内网服务类型和URL地址替换下`config.json`或`构造Map的代码中`的默认地形和底图。

 如果局域网内没有相关服务，可以按下面处理：
- 修改config.json中`terrain`配置中，将已有的`"show": true`配置，改为`"show": false` 
- 修改config.json中`basemaps`数组配置中，将已有的`"show": true`的图层，将该值改为`"show": false` ，并将单张图片或离线地图加上`"show": true`，并修改相关URL地址。
- 您也可以参考教程[发布三维数据服务](/guide/data/server.html)进行部署离线地图服务，里面也有一些示例离线数据。









## Mars3D 是什么 
>  `Mars3D平台` 是[火星科技](http://marsgis.cn/)研发的一款基于 WebGL 技术实现的三维客户端开发平台，基于[Cesium](https://cesium.com/cesiumjs/)优化提升与B/S架构设计，支持多行业扩展的轻量级高效能GIS开发平台，能够免安装、无插件地在浏览器中高效运行，并可快速接入与使用多种GIS数据和三维模型，呈现三维空间的可视化，完成平台在不同行业的灵活应用。

 > Mars3D平台可用于构建无插件、跨操作系统、 跨浏览器的三维 GIS 应用程序。平台使用 WebGL 来进行硬件加速图形化，跨平台、跨浏览器来实现真正的动态大数据三维可视化。通过 Mars3D产品可快速实现浏览器和移动端上美观、流畅的三维地图呈现与空间分析。

### 相关网站 
- Mars3D官网：[http://mars3d.cn](http://mars3d.cn)  

- Mars3D开源项目列表：[https://github.com/marsgis/mars3d](https://github.com/marsgis/mars3d)
 

## 版权说明
1. Mars3D平台由[火星科技](http://marsgis.cn/)自主研发，拥有所有权利。
2. 任何个人或组织可以在遵守相关要求下可以免费无限制使用。
