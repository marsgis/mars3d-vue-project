参考：http://mars3d.cn/dev/guide/start/authorization.html

-  覆盖授权版：将mars3d-sdk授权版.rar离线包内 mars3d.js和mars3d.css等文件覆盖至packages/mars3d/dist/目录下。
-  修改链接：修改package.json中mars3d包配置为："mars3d": "file:packages/mars3d",
-  删除node_modules重新npm install安装依赖
