'use script' //开发环境建议开启严格模式
;(function (window, mars3d) {
  //创建widget类，需要继承BaseWidget
  class MyWidget extends mars3d.widget.BaseWidget {
    //弹窗配置
    get view() {
      return {
        type: 'window',
        url: 'view.html',
        windowOptions: {
          width: 250,
        },
      }
    }
    //初始化[仅执行1次]
    create() {}
    //每个窗口创建完成后调用
    winCreateOK(opt, result) {
      this.viewWindow = result
    }
    //打开激活
    activate() {
      //测试:调用【view.html弹窗页面】中的方法
      // this.viewWindow.testIframeFun();
    }
    //关闭释放
    disable() {
      this.viewWindow = null
    }

    //测试: 用于被【view.html弹窗页面】中调用
    // testFun() {
    //     toastr.info('我是index页面中widget定义的测试方法');
    // }
  }

  //注册到widget管理器中。
  mars3d.widget.bindClass(MyWidget)

  //每个widet之间都是直接引入到index.html中，会存在彼此命名冲突，所以闭包处理下。
})(window, mars3d)
