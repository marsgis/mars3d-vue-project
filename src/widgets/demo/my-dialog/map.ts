import * as mars3d from "mars3d"

let map: mars3d.Map // 地图对象

// 初始化当前业务
export function onMounted(mapInstance: mars3d.Map): void {
  map = mapInstance // 记录map
}

// 释放当前业务
export function onUnmounted(): void {
  map.graphicLayer.clear()
  map = null
}

// 绘制矩形（演示map.js与index.vue的交互）
export function drawExtent(): Promise<any> {
  return new Promise((resolve) => {
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
      success: function (graphic: any) {
        const rectangle = mars3d.PolyUtil.formatRectangle(graphic._rectangle_draw)
        resolve({ extent: JSON.stringify(rectangle) })
      }
    })
  })
}
