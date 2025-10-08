import * as mars3d from "mars3d"
const Cesium = mars3d.Cesium

/**
 * 修改地图上场景参数值（比如切换到二维视图）
 *
 * @param {object} [options] 参数对象，包括以下：
 * @param {string} [options.name]  标题名称
 * @param {string} [options.type]  类型标识，自动赋值的，无需手动传入
 * @param {number} [options.start]  开始时间，相当于map.clock.startTime的秒数
 * @param {number} [options.duration]  时长
 *
 * @param {mars3d.Map.sceneOptions} [options.scene] 需要修改的场景参数，原参数中必须有对应键值否则无法还原。
 */
class SceneOptions extends mars3d.TaskItem {
  // 进入，激活开始处理事务
  _activateWork() {
    const newOptions = this.options.scene
    const oldOptions = {}

    const noKey = []
    for (const key in newOptions) {
      oldOptions[key] = this._map.options.scene[key]

      if (!mars3d.Cesium.defined(this._map.options.scene[key])) {
        noKey.push(key)
      }
    }

    if (noKey.length > 0) {
      console.log("SceneOptions:原有场景参数中不存在以下属性，关闭时将无法恢复", noKey)
    }

    this._oldOptions = oldOptions

    this._map.setSceneOptions(newOptions)
  }

  // 离开，释放相关对象
  _disableWork() {
    this._map.setSceneOptions(this._oldOptions)
    delete this._oldOptions
  }
}
mars3d.thing.Task.register("sceneOptions", SceneOptions)
