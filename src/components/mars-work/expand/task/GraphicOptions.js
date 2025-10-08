import { logInfo } from "@mars/utils/mars-util"
import * as mars3d from "mars3d"
const Cesium = mars3d.Cesium

/**
 *
 * 修改地图上矢量对象的样式（可用于show:出现、消失、闪烁、availability显示、postions移动、比例、popup属性）
 *
 * @param {object} [options] 参数对象，包括以下：
 * @param {string} [options.name]  标题名称
 * @param {string} [options.type]  类型标识，自动赋值的，无需手动传入
 * @param {number} [options.start]  开始时间，相当于map.clock.startTime的秒数
 * @param {number} [options.duration]  时长
 *
 * @param {string|number} [options.layerId]  图层ID
 * @param {string[]|number[]} [options.graphicIds]  矢量对象ID集合，可以多个
 * @param {boolean} [options.interval] 是否定时修改切换原样式（比如：达到闪烁效果）
 * @param {number} [options.intervalTime] 传定时器毫秒数
 * @param {object} [options.options] 需要修改的graphic的options
 * @param {boolean} [options.reset=false] 离开时是否恢复原有值
 */
class GraphicOptions extends mars3d.TaskItem {
  // 进入，激活开始处理事务
  _activateWork () {
    if (!this._map.clock.shouldAnimate) {
      return
    }

    const layer = this._map.getLayerById(this.options.layerId)
    const graphicOptions = this.options.graphicOptions
    if (layer && graphicOptions) {
      if (!layer.show) {
        layer.show = true
        this._old_show = false
      }
      this._layer = layer

      layer.readyPromise.then(() => {
        if (!this._isActivate) {
          this._disableWork()
          return
        }
        const arrIds = this.options.graphicIds
        const arrGraphic = []
        for (let index = 0; index < arrIds.length; index++) {
          const graphic = layer.getGraphicById(arrIds[index])
          if (graphic) {
            graphic.show = true
            this._updateGraphic(graphic, graphicOptions)

            arrGraphic.push(graphic)
          }
        }
        this._arrGraphic = arrGraphic

        // 如果设置了定时修改（比如：达到闪烁效果）
        if (this.options.interval) {
          let tag = true

          this._interVal = setInterval(() => {
            tag = !tag
            for (let index = 0; index < this._arrGraphic.length; index++) {
              const graphic = this._arrGraphic[index]
              if (tag) {
                graphic.setOptions(graphic._task_old_options)
              } else {
                graphic.setOptions(graphic._task_new_options)
              }
            }

            if (!this._isActivate) {
              this._disableWork()
            }
          }, this.options.intervalTime ?? 500)
        }
      })
    }
  }

  _updateGraphic (graphic, newOptions) {
    const oldOptions = {}
    const noKey = []
    for (const key in newOptions) {
      oldOptions[key] = mars3d.Util.clone(graphic.options[key])
      if (!Cesium.defined(oldOptions[key])) {
        noKey.push(key)
      }
    }
    if (this.options.reset && noKey.length > 0) {
      console.log("_updateGraphic：原有options中不存在以下属性，关闭时将无法恢复", noKey)
    }
    graphic._task_old_options = oldOptions
    graphic._task_new_options = newOptions

    graphic.setOptions(newOptions)
  }

  // 离开，释放相关对象
  _disableWork () {
    if (this._interVal) {
      clearInterval(this._interVal)
      delete this._interVal
    }

    if (this._arrGraphic && this.options.reset) {
      for (let index = 0; index < this._arrGraphic.length; index++) {
        const graphic = this._arrGraphic[index]

        graphic.setOptions(graphic._task_old_options)
        delete graphic._task_old_options
        delete graphic._task_new_options
      }
      delete this._arrGraphic
    }

    if (Cesium.defined(this._old_show)) {
      this._layer.show = false
      delete this._old_show
    }
  }
}
mars3d.thing.Task.register("graphicOptions", GraphicOptions)
