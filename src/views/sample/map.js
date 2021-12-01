// 地图对象
export var map


// 事件对象，用于抛出事件给vue
export var eventTarget = new mars3d.BaseClass()

// 初始化当前业务
export function onMounted(e) {
  map = e // 记录map
  console.log("map.js", map)

  // // 构造bloom效果 用于滑动条测试
  // bloomEffect = new mars3d.effect.BloomEffect()
  // map.addEffect(bloomEffect)
}

// 释放当前业务
export function onUnmounted(e) {
  // map.removeEffect(bloomEffect, true)
  // bloomEffect = null

  map = null
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
