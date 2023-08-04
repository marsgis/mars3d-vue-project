/**
 * 高德POI 查询栏 （左上角）
 * @copyright 火星科技 mars3d.cn
 * @author 火星渣渣灰 2022-01-10
 */
import * as mars3d from "mars3d"
import QueryPopup from "./query-popup.vue"
import { initVue3Popup } from "@mars/utils/file-util"

const Cesium = mars3d.Cesium

let map: mars3d.Map // 地图对象
export let graphicLayer: mars3d.layer.GraphicLayer
let queryPoi: mars3d.query.GaodePOI // GaodePOI查询
let address: any = null
const imgArr = []

// 初始化当前业务
export async function onMounted(mapInstance: mars3d.Map): Promise<void> {
  for (let i = 0; i < 6; i++) {
    const img = await getCanvas(i + 1)
    imgArr.push(img)
  }

  map = mapInstance // 记录map

  queryPoi = new mars3d.query.GaodePOI({
    // city: '合肥市',
  })

  graphicLayer = new mars3d.layer.GraphicLayer({
    name: "POI查询",
    pid: 99 // 图层管理 中使用，父节点id
  })

  graphicLayer.bindPopup((event) => {
    const attr = event.graphic.attr || {}
    if (!attr) {
      return
    }

    const dom = initVue3Popup(QueryPopup, attr)
    return dom
  })

  map.addLayer(graphicLayer)

  map.on(mars3d.EventType.cameraChanged, cameraChanged)
}

function cameraChanged() {
  queryPoi.getAddress({
    location: map.getCenter(),
    success: (result: any) => {
      address = result
    }
  })
}

// 释放当前业务
export function onUnmounted(): void {
  map.removeLayer(graphicLayer)
  map.off(mars3d.EventType.cameraChanged, cameraChanged)
  queryPoi = null
  address = null
  map = null
}

// 查询数据
export function queryData(val: string) {
  return queryPoi.autoTip({
    text: val,
    city: address?.city,
    location: map.getCenter()
  })
}

export function querySiteList(text: string, page: number) {
  return queryPoi.queryText({
    text,
    count: 6,
    page: page - 1,
    city: address?.city
  })
}

/**
 * 加载查询之后的数据，通过矢量数据展示出来
 * @param {any} arr 查询之后的数据
 * @returns {void} 无
 */
export function showPOIArr(arr: any): void {
  clearLayers()

  arr.forEach(async (item: any, index: number) => {
    const jd = Number(item.lng)
    const wd = Number(item.lat)
    if (isNaN(jd) || isNaN(wd)) {
      return
    }

    item.lng = jd
    item.lat = wd

    // 添加实体
    const graphic = new mars3d.graphic.BillboardEntity({
      position: Cesium.Cartesian3.fromDegrees(jd, wd),
      style: {
        pixelSize: 10,
        color: "#ffffff",
        outline: true,
        outlineColor: "#ffffff",
        outlineWidth: 2,
        scaleByDistance: new Cesium.NearFarScalar(1000, 1, 1000000, 0.1),
        clampToGround: true, // 贴地
        visibleDepth: false, // 是否被遮挡
        label: {
          text: item.name,
          font_size: 20,
          color: "#ffffff",
          outline: true,
          outlineWidth: 2,
          outlineColor: Cesium.Color.BLACK,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffsetY: -10, // 偏移量
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 200000),
          clampToGround: true, // 贴地
          visibleDepth: false // 是否被遮挡
        },
        image: imgArr[index]
      },
      attr: item
    })
    graphicLayer.addGraphic(graphic)

    item._graphic = graphic
  })

  if (arr.length > 1) {
    graphicLayer.flyTo({ radius: 5000, pitch: -90 })
  }
}

// 获取Canvas对象
async function getCanvas(text) {
  return new Promise((resolve) => {
    const img = new Image(19, 25)
    img.crossOrigin = "Anonymous"
    img.src = "img/poi/indexMark.png"
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = 19
      canvas.height = 25
      const ctx = canvas.getContext("2d")
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // 绘制图片
      ctx.drawImage(img, 0, 0)
      // 绘制文字
      ctx.fillStyle = "#ffffff"
      ctx.font = "22px 楷体"
      ctx.textBaseline = "middle"
      ctx.fillText(text, 4, 10)
      // 将图片赋予给矢量对象进行显示，this.image是父类的属性
      resolve(canvas.toDataURL("image/png"))
    }
  })
}

/**
 * 判断是否为经纬度值，
 * 若是，加载为矢量数据且定位至该矢量数据
 * 若否，返回
 * @param {string} text 输入框输入的关键字
 * @returns {void} 无
 */
export function centerAtLonLat(text: string): void {
  const arr = text.split(",")
  if (arr.length !== 2) {
    return
  }

  const jd = Number(arr[0])
  const wd = Number(arr[1])
  if (isNaN(jd) || isNaN(wd)) {
    return
  }

  // 添加实体
  const graphic = new mars3d.graphic.PointEntity({
    position: Cesium.Cartesian3.fromDegrees(jd, wd),
    style: {
      color: "#3388ff",
      pixelSize: 10,
      outline: true,
      outlineColor: "#ffffff",
      outlineWidth: 2,
      scaleByDistance: new Cesium.NearFarScalar(1000, 1, 1000000, 0.1),
      clampToGround: true, // 贴地
      visibleDepth: false // 是否被遮挡
    }
  })
  graphicLayer.addGraphic(graphic)

  graphic.bindPopup(`<div class="mars3d-template-titile">坐标定位</div>
              <div class="mars3d-template-content" >
                <div><label>经度</label> ${jd}</div>
                <div><label>纬度</label>${wd}</div>
              </div>`)

  graphic.openHighlight()

  graphic.flyTo({
    radius: 1000, // 点数据：radius控制视距距离
    scale: 1.5, // 线面数据：scale控制边界的放大比例
    complete: () => {
      graphic.openPopup()
    }
  })
}

export function flyToGraphic(graphic: mars3d.graphic.BaseGraphic, option: any): void {
  map.flyToGraphic(graphic, { ...option, complete: () => graphicLayer.openPopup(graphic) })
}

export function clearLayers(): void {
  graphicLayer.closePopup()
  graphicLayer.clear()
}
