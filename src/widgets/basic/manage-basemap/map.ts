/**
 * 底图控制
 * @copyright 火星科技 mars3d.cn
 * @author 火星吴彦祖 2021-12-10
 */
import * as mars3d from "mars3d"
// const Cesium = mars3d.Cesium

let map: mars3d.Map // 地图对象

// 事件对象，用于抛出事件给vue
export const eventTarget = new mars3d.BaseClass()

// 初始化当前业务
export function onMounted(mapInstance: mars3d.Map): void {
  map = mapInstance // 记录map

  const baseMaps = map.getBasemaps(true)
  const hasTerrain = map.hasTerrain

  eventTarget.fire("mapLoaded", { baseMaps, hasTerrain })
}

// 释放当前业务
export function onUnmounted(): void {
  map = null
}

export function changeBaseMaps(id: string) {
  map.basemap = id
}

export function changeTerrain(value: boolean) {
  map.hasTerrain = value
}
