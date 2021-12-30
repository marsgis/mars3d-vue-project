/**
 * 图上选点
 * @copyright 火星科技 mars3d.cn
 * @author 火星 胡椒 2021-12-20
 */
import * as mars3d from "mars3d"
let map: mars3d.Map // 地图对象
// 事件对象，用于抛出事件给vue
export const eventTarget = new mars3d.BaseClass()

// 初始化当前业务
export function onMounted(mapInstance: mars3d.Map): void {
  map = mapInstance // 记录map

  const point = map.getCenter()
  point.format()
  const currJD = point.lng
  const currWD = point.lat
  const currGD = point.alt

  eventTarget.fire("loadOK", { currJD, currWD, currGD })
}

// 释放当前业务
export function onUnmounted(): void {
  if (pointEntity) {
    pointEntity.remove()
    pointEntity = null
  }
  map = null
}

// 坐标转化的三种方法
export function marsUtilFormtNum(item: number, num: number) {
  return mars3d.Util.formatNum(item, num)
}

export function marsPointTrans(item: number) {
  return mars3d.PointTrans.degree2dms(item)
}

export function marsProj4Trans(JD: number, WD: number, radio: string) {
  if (radio === "2") {
    return mars3d.PointTrans.proj4Trans([JD, WD], mars3d.CRS.EPSG4326, mars3d.CRS.CGCS2000_GK_Zone_6)
  } else {
    return mars3d.PointTrans.proj4Trans([JD, WD], mars3d.CRS.EPSG4326, mars3d.CRS.CGCS2000_GK_Zone_3)
  }
}

// 地图选点
export function bindMourseClick() {
  map.setCursor(true)
  map.once(mars3d.EventType.click, function (event: any) {
    map.setCursor(false)
    const cartesian = event.cartesian
    const point = mars3d.LatLngPoint.fromCartesian(cartesian)
    point.format() // 经度、纬度、高度
    eventTarget.fire("clickMap", { point })
  })
}

let pointEntity: any
export function updateMarker(hasCenter: boolean, jd: number, wd: number, alt: number) {
  const position = [jd, wd, alt]

  if (pointEntity == null) {
    pointEntity = new mars3d.graphic.PointEntity({
      position: position,
      style: {
        color: "#3388ff",
        pixelSize: 10,
        outlineColor: "#ffffff",
        outlineWidth: 2
      }
    })
    map.graphicLayer.addGraphic(pointEntity)
  } else {
    pointEntity.position = position
  }

  if (hasCenter) {
    pointEntity.flyTo({ radius: 1000 })
  }
}
