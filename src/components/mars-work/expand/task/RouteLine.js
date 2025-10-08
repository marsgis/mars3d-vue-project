import * as mars3d from "mars3d"

/**
 * 按路线漫游
 *
 * @param {object} [options] 参数对象，包括以下：
 * @param {string} [options.name]  标题名称
 * @param {string} [options.type]  类型标识，自动赋值的，无需手动传入
 * @param {number} [options.start]  开始时间，相当于map.clock.startTime的秒数
 * @param {number} [options.duration]  时长
 *
 * @param {object} [options.route]  FixedRoute对应的构造参数
 */
export class RouteLine extends mars3d.TaskItem {
  _mountedHook() {
    if (this.options.graphicId && this._map.availabilityEnabled) {
      const layer = this._map.getLayerById(this.options.layerId)
      if (layer) {
        const that = this
        layer.readyPromise.then(() => {
          that._fixedRoute = layer.getGraphicById(that.options.graphicId)
          that._fixedRoute && that._fixedRoute.setOptions({ showStop: false }) // 播放前后不展示
        })
      }
    }
  }

  // 进入，激活开始处理事务
  _activateWork() {
    // if (this.options.goBack) {
    //   this._backCameraView = this._map.getCameraView({ simplify: false })
    // }

    if (this.options.graphicId) {
      const layer = this._map.getLayerById(this.options.layerId)
      if (layer) {
        this._fixedRoute = layer.getGraphicById(this.options.graphicId)
        if (this.options.camera) {
          this._fixedRoute.setCameraOptions(this.options.camera)
        }
      } else {
        console.warn("地图上未找到该漫游路线图层")
      }
    } else if (this.options.route) {
      this._graphicLayer = new mars3d.layer.GraphicLayer()
      this._map.addLayer(this._graphicLayer)

      const fixedRoute = new mars3d.graphic.FixedRoute(this.options.route)
      this._map.graphicLayer.addGraphic(fixedRoute)
      this._fixedRoute = fixedRoute
    }

    if (this._fixedRoute) {
      this._fixedRoute.start()
    }
  }

  // 暂停(非必须)
  _pauseWork(options) {
    if (this._fixedRoute) {
      this._fixedRoute.pause()
    }
  }

  // 继续(非必须)
  _proceedWork() {
    if (this._fixedRoute) {
      this._fixedRoute.proceed()
    }
  }

  // 离开，释放相关对象
  _disableWork() {
    if (this._fixedRoute) {
      this._fixedRoute.stop()
      delete this._fixedRoute
    }

    if (this._graphicLayer) {
      this._graphicLayer.destroy()
      delete this._graphicLayer
    }

    if (this._backCameraView) {
      this._map.setCameraView(this._backCameraView, { duration: 0 })
      delete this._backCameraView
    }
  }
}
mars3d.thing.Task.register("routeLine", RouteLine)
