// 地图对象
export var map
// 构造bloom效果对象
var bloomEffect

// 事件对象，用于抛出事件给vue
export var eventTarget = new mars3d.BaseClass()

//
export function initWork(thismap) {
  map = thismap

  // 构造bloom效果 用于滑动条测试
  bloomEffect = new mars3d.effect.BloomEffect()
  map.addEffect(bloomEffect)

  eventTarget.fire("test", 123)
}

// 绘制矩形（演示map.js与index.vue的交互）
export function drawExtent(extent) {
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
      eventTarget.fire("drawExtent", { extent: JSON.stringify(rectangle) })// 抛出事件，可以vue中去监听事件
    }
  })
}

// 是否运行地图鼠标交互
export function enableMapMouseController(value) {
  map.setSceneOptions({
    cameraController: {
      enableZoom: value,
      enableTranslate: value,
      enableRotate: value,
      enableTilt: value
     }
  })
}

// 调整亮度 （演示滑动条）
export function updateBrightness(val) {
  bloomEffect.brightness = val
}

// 调整对比度 （演示滑动条）
export function updateContrast(val) {
  bloomEffect.contrast = val
}
