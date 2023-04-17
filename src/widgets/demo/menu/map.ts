import * as mars3d from "mars3d"
import PopupDemo from "./popup-demo.vue"
import { initVue3Popup } from "@mars/utils/file-util"

export let map: mars3d.Map // 地图对象
export let graphicLayer: mars3d.layer.GraphicLayer // 地图对象

// 初始化当前业务
export function onMounted(mapInstance: mars3d.Map): void {
  map = mapInstance // 记录map

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  graphicLayer.bindPopup((event: any) => {
    const attr = event.graphic.attr || {}
    const dom = initVue3Popup(PopupDemo, attr)
    return dom
  })

  const graphic1 = new mars3d.graphic.PointEntity({
    position: [117.194842, 31.831489, 41.21521],
    style: {
      color: "#ff0000",
      pixelSize: 10,
      outlineColor: "#ffffff",
      outlineWidth: 2
    },
    attr: { remark: "示例1" }
  })
  graphicLayer.addGraphic(graphic1)

  const graphic2 = new mars3d.graphic.DivGraphic({
    position: [117.229619, 31.8, 1521],
    pointerEvents: true,
    style: {
      html: `<div class="marsGreenGradientPnl" >安徽欢迎您</div>`
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(graphic2)

}

// 释放当前业务
export function onUnmounted(): void {
  map = null
}

