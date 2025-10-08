import * as mars3d from "mars3d"

/**
 * 视角列表播放（分步执行）
 *
 * @param {object} [options] 参数对象，包括以下：
 * @param {string} [options.name]  标题名称
 * @param {string} [options.type]  类型标识，自动赋值的，无需手动传入
 * @param {number} [options.start]  开始时间，相当于map.clock.startTime的秒数
 * @param {number} [options.duration]  时长
 * @param {object[]} [options.list]  视角数组
 */
export class CameraList extends mars3d.TaskItem {
  // 进入，激活开始处理事务
  _activateWork() {
    if (this.options && this.options.list) {
      this._map.setCameraViewList(this.options.list)
    }
  }

  _disableWork() {
    this._map.cancelFlyTo()
  }

  // 暂停
  _pauseWork() {
    this._map.pauseCameraViewList()
  }

  // 继续
  _proceedWork() {
    this._map.proceedCameraViewList()
  }
}
mars3d.thing.Task.register("cameraList", CameraList)
