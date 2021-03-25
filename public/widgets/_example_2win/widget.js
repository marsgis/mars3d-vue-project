'use script' //开发环境建议开启严格模式
;(function (window, mars3d) {
  //创建widget类，需要继承BaseWidget
  class MyWidget extends mars3d.widget.BaseWidget {
    //弹窗配置，2个弹窗的情形
    get view() {
      return [
        {
          type: 'window',
          url: 'viewLeft.html',
          name: 'left',
          windowOptions: {
            noTitle: true,
            closeBtn: 0,
            width: 200,
            position: {
              top: 70,
              bottom: 0,
              left: 0,
            },
          },
        },
        {
          type: 'window',
          url: 'viewRight.html',
          name: 'right',
          windowOptions: {
            noTitle: true,
            closeBtn: 0,
            width: 200,
            position: {
              top: 70,
              bottom: 0,
              right: 0,
            },
          },
        },
      ]
    }

    //每个窗口创建完成后调用
    winCreateOK(opt, result) {
      if (opt.name == 'left') {
        this.viewWindowLeft = result

        this.viewWindowLeft.testShowText('这是从地图主页面发送的交互请求1') //test
      } else {
        this.viewWindowRight = result

        this.viewWindowRight.testShowText('这是从地图主页面发送的交互请求2') //test
      }
    }
    //打开激活
    activate() {
      if (this.viewWindowLeft) {
        this.viewWindowLeft.testShowText('这是从地图主页面发送的交互请求3')
      }

      if (this.viewWindowRight) {
        this.viewWindowRight.testShowText('这是从地图主页面发送的交互请求4')
      }
    }
    //关闭释放
    disable() {}
    testCenterAt1() {
      this.map.setCameraView({ y: 31.981816, x: 118.782446, z: 10607.4, heading: 5.5, pitch: -51.9, roll: 0 })
    }
    testCenterAt2() {
      this.map.setCameraView({ y: 31.686288, x: 117.229619, z: 11333.9, heading: 359.2, pitch: -39.5, roll: 360 })
    }
  }

  //注册到widget管理器中。
  mars3d.widget.bindClass(MyWidget)

  //每个widet之间都是直接引入到index.html中，会存在彼此命名冲突，所以闭包处理下。
})(window, mars3d)
