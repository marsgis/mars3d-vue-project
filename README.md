# Mars3D widget项目模版 - Vue版
    Mars3D三维地球平台软件，在`Vue技术栈下`的 widget模式的项目模版，基于vueCli 4.x 。
     

 > 其他技术栈，请参考： [https://github.com/marsgis/mars3d](https://github.com/marsgis/mars3d)
 
  
## 项目说明
1. 部分第三方库不是npm方式引入，是主页head中静态资源方式引入的。资源放在public目录下。 
2. public目录下文件与 Mars3D基础项目 的目录和文件完全相同，可以直接复制到该目录下进行更新。

3. public下面的widgets目录为之前传统js方式编写的一些widget模块，目前未重写为vue，当前为了兼容使用是静态引入的方式。  
  新开发业务功能请在src目录下按vue方式去编写，不要使用原有的widget方式。
 
### 更新项目
 此脚手架中类库和widgets不保证是最新版本
 请您自行拷贝"基础项目"的 config、img、lib和widgets目录覆盖至当前项目的public目录下



## 运行命令
 
### 首次运行前安装依赖
 `npm install` 或 `cnpm install`
 
### http运行项目
 `npm run serve`  运行后访问：`http://localhost:3001/` 

### 打包编译项目
 运行`npm run build`来构建项目。 



## 运行效果 
 [在线Demo](http://mars3d.cn/project/jcxm/)  

 ![image](http://mars3d.cn/img/jcxm.jpg)
 

 
 

## Mars3D 是什么 
> `Mars3D三维地球平台软件` 是[火星科技](http://marsgis.cn/)团队研发的二三维一体的WebGIS地图开发平台，是火星科技团队成员多年GIS开发和Cesium使用的技术沉淀。基于[Cesium](https://cesium.com/cesiumjs/)开源库和现代Web技术栈全新构建，该平台框架优化了Cesium的使用方式和增添了更多高级功能。集成了领先的开源地图库、可视化库，提供了全新的三维大数据可视化、实时流数据可视化功能，通过本产品可快速实现浏览器和移动端上美观、流畅的三维地图呈现与空间分析。

### 相关网站 
- Mars3D官网：[http://mars3d.cn](http://mars3d.cn)  

- GitHub导航列表：[https://github.com/marsgis/mars3d](https://github.com/marsgis/mars3d)


## 版权说明
1. 任何`个人或组织`可以在遵守Mars3D相关要求下`免费无限制`使用。
2. 如有`个性化需求`或`商业应用`，请联系[火星科技](http://mars3d.cn)购买。