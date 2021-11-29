// 地图对象
export var map

// 事件对象，用于抛出事件给vue
export var eventTarget = new mars3d.BaseClass()

//
export function initWork(thismap) {
  map = thismap
  console.log("map.js", map)
}

// 绘制矩形（演示map.js与index.vue的交互）
export function drawExtent() {
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
    success: function (graphic) {
      var rectangle = mars3d.PolyUtil.formatRectangle(graphic._rectangle_draw)
      eventTarget.fire("drawExtent", { extent: JSON.stringify(rectangle) }) // 抛出事件，可以vue中去监听事件
    }
  })
}
