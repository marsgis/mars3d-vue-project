'use script' //开发环境建议开启严格模式
;(function (window, mars3d) {
  //创建widget类，需要继承BaseWidget
  class MyWidget extends mars3d.widget.BaseWidget {
    //初始化[仅执行1次]
    create() {
      this.zommControl = new mars3d.control.Zoom({
        insertIndex: 1, //插入的位置顺序, 1是home按钮后面
        zoomInClass: 'fa fa-plus',
        zoomOutClass: 'fa fa-minus',
      })
    }
    //激活插件
    activate() {
      this.map.addControl(this.zommControl)
    }
    //释放插件
    disable() {
      this.map.removeControl(this.zommControl)
    }
  }

  //注册到widget管理器中。
  mars3d.widget.bindClass(MyWidget)

  //每个widet之间都是直接引入到index.html中，会存在彼此命名冲突，所以闭包处理下。
})(window, mars3d)
