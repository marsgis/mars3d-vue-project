import * as mars3d from "mars3d"

/**
 * 进入时创建对象，离开时销毁对象
 *
 * @param {object} [options] 参数对象，包括以下：
 * @param {string} [options.name]  标题名称
 * @param {string} [options.type]  类型标识，自动赋值的，无需手动传入
 * @param {number} [options.start]  开始时间，相当于map.clock.startTime的秒数
 * @param {number} [options.duration]  时长
 *
 * @param {object[]} [options.graphics]  矢量对象创建参数 列表
 * @param {object[]} [options.layers]  图层创建参数 列表
 * @param {object[]} [options.effects]  特效对象创建参数 列表
 * @param {object[]} [options.controls]  控件对象创建参数 列表
 */
class CreateTarget extends mars3d.TaskItem {
  // 进入，激活开始处理事务
  _activateWork() {
    // 存在需要创建的矢量对象时
    const graphicsOptions = this.options.graphics || []
    if (graphicsOptions && graphicsOptions.length > 0) {
      this._graphicLayer = new mars3d.layer.GraphicLayer({
        data: graphicsOptions // 直接支持传入构造参数数组
      })
      this._map.addLayer(this._graphicLayer)
    }

    // 存在需要创建的图层时
    const layersOptions = this.options.layers
    if (layersOptions && layersOptions.length > 0) {
      const layers = []
      layersOptions.forEach((options) => {
        const layer = mars3d.LayerUtil.create(options)
        if (layer) {
          this._map.addLayer(layer)
          layers.push(layer)
        }
      })
      this._layers = layers
    }

    // 存在需要创建的特效时
    const effectsOptions = this.options.effects
    if (effectsOptions && effectsOptions.length > 0) {
      const effects = []
      effectsOptions.forEach((options) => {
        const effect = mars3d.EffectUtil.create(options)
        if (effect) {
          this._map.addEffect(effect)
          effects.push(effect)
        }
      })
      this._effects = effects
    }

    // 存在需要创建的控件时
    const controlsOptions = this.options.controls
    if (controlsOptions && controlsOptions.length > 0) {
      const controls = []
      controlsOptions.forEach((options) => {
        const control = mars3d.ControlUtil.create(options)
        if (control) {
          this._map.addControl(control)
          controls.push(control)
        }
      })
      this._controls = controls
    }
  }

  // 离开，释放相关对象
  _disableWork() {
    if (this._graphicLayer) {
      this._graphicLayer.remove(true)
      delete this._graphicLayer
    }

    if (this._layers) {
      this._layers.forEach((layer) => {
        layer.remove(true)
      })
      delete this._layers
    }

    if (this._effects) {
      this._effects.forEach((layer) => {
        layer.remove(true)
      })
      delete this._effects
    }
  }
}
mars3d.thing.Task.register("createTarget", CreateTarget)



