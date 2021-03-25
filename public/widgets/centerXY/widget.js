;(function (window, mars3d) {
  //创建widget类，需要继承BaseWidget
  class MyWidget extends mars3d.widget.BaseWidget {
    //外部资源配置
    get resources() {
      return ['view.css']
    }
    //弹窗配置
    get view() {
      return {
        type: 'divwindow',
        url: 'view.html',
        windowOptions: {
          width: 210,
          height: 210,
        },
      }
    }
    //每个窗口创建完成后调用
    winCreateOK(opt, result) {
      var point = this.map.getCenter()
      this.showInputView(point)

      $('#btnCenterXY').click(() => {
        var jd = $('#point_jd').val()
        var wd = $('#point_wd').val()
        var height = $('#point_height').val()

        let point = new mars3d.LatLngPoint(Number(jd), Number(wd), Number(height))
        this.updateMarker(point, true)
      })
    }
    //激活插件
    activate() {
      //单击地图事件
      this.map.on(mars3d.EventType.click, this.onMapClick, this)
    }
    //释放插件
    disable() {
      //释放单击地图事件
      this.map.off(mars3d.EventType.click, this.onMapClick, this)

      if (this.graphic) {
        this.map.graphicLayer.removeGraphic(this.graphic, true)
        this.graphic = null
      }
    }
    onMapClick(event) {
      var cartesian = event.cartesian
      if (cartesian) {
        var point = mars3d.LatLngPoint.fromCartesian(cartesian)

        this.updateMarker(point)
        this.showInputView(point)
      }
    }
    updateMarker(position, iscenter) {
      if (this.graphic) {
        this.graphic.position = position
      } else {
        this.graphic = new mars3d.graphic.BillboardEntity({
          position: position,
          style: {
            image: this.path + 'img/marker.png',
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // default: CENTER
            scale: 0.6,
          },
        })
        this.map.graphicLayer.addGraphic(this.graphic)
      }

      if (iscenter) {
        this.map.flyToGraphic(this.graphic, { radius: 2000 })
      }
    }
    showInputView(xy) {
      $('#point_jd').val(xy.lng.toFixed(6))
      $('#point_wd').val(xy.lat.toFixed(6))
      $('#point_height').val(xy.alt.toFixed(1))
    }
  }

  //注册到widget管理器中。
  mars3d.widget.bindClass(MyWidget)

  //每个widet之间都是直接引入到index.html中，会存在彼此命名冲突，所以闭包处理下。
})(window, mars3d)
