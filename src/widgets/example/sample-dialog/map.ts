import * as mars3d from "mars3d"

export let map: mars3d.Map // 地图对象

// 事件对象，用于抛出事件给vue
export const eventTarget = new mars3d.BaseClass()

// 初始化当前业务
export function onMounted(mapInstance: mars3d.Map): void {
  map = mapInstance // 记录map
}

// 释放当前业务
export function onUnmounted(): void {
  map = null
}

// 绘制矩形（演示map.js与index.vue的交互）
export function drawExtent(): void {
  map.graphicLayer.clear()
  // 绘制矩形
  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      fill: true,
      color: "rgba(255,255,0,0.2)",
      outline: true,
      outlineWidth: 2,
      outlineColor: "rgba(255,255,0,1)"
    },
    success: function (graphic: mars3d.graphic.RectangleEntity) {
      const rectangle = graphic.getRectangle({ isFormat: true })
      eventTarget.fire("drawExtent", { extent: JSON.stringify(rectangle) }) // 抛出事件，可以vue中去监听事件
    }
  })
}
