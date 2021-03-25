'use script' //开发环境建议开启严格模式
;(function (window, mars3d) {
  //创建widget类，需要继承BaseWidget
  class MyWidget extends mars3d.widget.BaseWidget {
    //外部资源配置
    get resources() {
      return ['view.css']
    }
    //页面配置， append是添加DOM节点到html中的方式
    get view() {
      return {
        type: 'append',
        url: 'view.html',
      }
    }

    //初始化[仅执行1次]
    create() {}
    //每个窗口创建完成后调用
    winCreateOK(opt, result) {
      //此处可以绑定页面dom事件
    }
    //激活插件
    activate() {
      toastr.info('激活插件_example_append')
    }
    //释放插件
    disable() {
      toastr.info('释放插件_example_append')
    }
  }

  //注册到widget管理器中。
  mars3d.widget.bindClass(MyWidget)

  //每个widet之间都是直接引入到index.html中，会存在彼此命名冲突，所以闭包处理下。
})(window, mars3d)
