import * as mars3d from "mars3d"

export let map: mars3d.Map // 地图对象

// 初始化当前业务
export function onMounted(mapInstance: mars3d.Map): void {
  map = mapInstance // 记录map

  // 传入坐标和内容，可以直接任意弹出
  const position = [117.229619, 31.8, 1521]
  map.openPopup(position, "<my-element><my-element/>")
}

// 释放当前业务
export function onUnmounted(): void {
  map = null
}
