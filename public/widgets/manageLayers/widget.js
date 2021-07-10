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
          height: 500,
        },
      }
    }
    //是否可以控制basemaps，因为有底图控制了，具体项目中可以按需改为false
    get hasManagerBaseMaps() {
      return true
    }

    //初始化[仅执行1次]
    create() {}
    //每个窗口创建完成后调用
    winCreateOK(opt, result) {
      this.viewWindow = result
    }
    //打开激活
    activate() {
      //监听事件，联动勾选状态
      this.map.on(mars3d.EventType.addLayer, this._onAddLayerHandler, this)
      this.map.on(mars3d.EventType.removeLayer, this._onRemoveLayerHandler, this)
    }
    //关闭释放
    disable() {
      this.viewWindow = null

      this.map.off(mars3d.EventType.addLayer, this._onAddLayerHandler, this)
      this.map.off(mars3d.EventType.removeLayer, this._onRemoveLayerHandler, this)
    }
    _onAddLayerHandler(e) {
      if (!this.isActivate || !this.viewWindow) {
        return
      }
      console.log('添加了图层', e)

      this.viewWindow.updateNode(e.layer)
    }
    _onRemoveLayerHandler(e) {
      if (!this.isActivate || !this.viewWindow) {
        return
      }
      console.log('移除了图层', e)

      this.viewWindow.removeNode(e.layer)
    }

    getLayers() {
      return this.map.getLayers({
        basemaps: true, //是否取config.json中的basempas
        layers: true, //是否取config.json中的layers
      })
    }
    //对单击的图层做处理（单个）
    checkClickLayer(layer, show) {
      if (show) {
        if (this.config.autoCenter && !layer.options.noCenter) {
          //在对应config.json图层节点配置 noCenter:true 可以不定位
          layer.flyTo()
        }

        //存在关联widget时
        let item = layer.options
        if (item.onWidget) {
          if (this._lastWidget) {
            mars3d.widget.disable(this._lastWidget)
            this._lastWidget = null
          }

          mars3d.widget.activate({
            uri: item.onWidget,
            layerItem: item,
            disableOther: false,
          })
          this._lastWidget = item.onWidget
        }
      } else {
        //存在关联widget时
        let item = layer.options
        if (item.onWidget) {
          mars3d.widget.disable(item.onWidget)
          if (this._lastWidget == item.onWidget) {
            this._lastWidget = null
          }
        }
      }
    }

    //更新图层:显示隐藏状态（勾选后的图层及其子级图层，多个）
    updateLayerShow(layer, show) {
      layer.show = show

      if (show) {
        if (!layer.isAdded) {
          this.map.off(mars3d.EventType.addLayer, this._onAddLayerHandler, this)
          this.map.addLayer(layer)
          this.map.on(mars3d.EventType.addLayer, this._onAddLayerHandler, this)
        }
      } else {
        // if (layer.isAdded) {
        //   this.map.removeLayer(layer)
        // }
      }
    }
  }

  //注册到widget管理器中。
  mars3d.widget.bindClass(MyWidget)

  //每个widet之间都是直接引入到index.html中，会存在彼此命名冲突，所以闭包处理下。
})(window, mars3d)
