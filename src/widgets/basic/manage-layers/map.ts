/**
 * 图层管理
 * @copyright 火星科技 mars3d.cn
 * @author 火星渣渣灰 2022-01-10
 */
import * as mars3d from "mars3d"
const Cesium = mars3d.Cesium

let map: mars3d.Map // 地图对象

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance: mars3d.Map) {
  map = mapInstance // 记录首次创建的map

}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null
}


export function getLayrsTree(params) {
  return map.getLayrsTree(params)
}

export function getLayerById(id) {
  return map.getLayerById(id)
}

export function getLayerByAttr(attrValue: string | number, attrName?: string) {
  return map.getLayerByAttr(attrValue, attrName)
}

// 更新图层勾选状态
export function updateLayerShow(layer, show) {
  if (show) {
    if (!layer.isAdded) {
      map.addLayer(layer)
    }
    layer.show = true

    layer.flyTo() // 如果不想勾选定位，注释该行
  } else {
    layer.show = false
  }
}


// **********************************  图层的结构树控件  ****************************** //
export function flytoModelNode(nodeid: number, nodesphere: any) {
  if (!nodesphere || nodesphere[3] <= 0) {
    return
  }
  // 构件节点位置
  let center = new Cesium.Cartesian3(nodesphere[0], nodesphere[1], nodesphere[2])
  const tiles3dLayer: mars3d.layer.TilesetLayer = map.getLayerById(nodeid)

  // 获取构件节点位置，现对于原始矩阵变化后的新位置
  center = tiles3dLayer.getPositionByOrginMatrix(center)

  // 飞行过去
  const sphere = new Cesium.BoundingSphere(center, nodesphere[3])
  map.camera.flyToBoundingSphere(sphere, {
    offset: new Cesium.HeadingPitchRange(map.camera.heading, map.camera.pitch, nodesphere[3] * 1.5),
    duration: 0.5
  })
}
export function checkModelStyle(layerid: number, arrIds: any) {
  // 设置tileset的样式
  if (!map) {
    return
  }
  const tiles3dLayer = map.getLayerById(layerid)

  let titleStyle = ""
  if (!arrIds.length) {
    tiles3dLayer.style = null
    return
  }
  // 勾选
  arrIds.forEach((element: any, index: number) => {
    if (index === 0) {
      titleStyle += "${id} ==='" + element.id + "' "
    } else {
      titleStyle += "|| ${id} ==='" + element.id + "'"
    }
  })
  tiles3dLayer.style = new Cesium.Cesium3DTileStyle({
    color: {
      conditions: [
        [titleStyle, "rgb(255, 255, 255)"],
        ["true", "rgba(255, 200, 200,0.2)"]
      ]
    }
  })
}

export function exchangeLayer(thisLayerId, moveLayerId) {
  const thisLayer = map.getLayerById(thisLayerId)
  const moveLayer = map.getLayerById(moveLayerId)

  if (thisLayer == null || moveLayer == null) {
    return

  }
  const or = thisLayer.zIndex
  thisLayer.zIndex = moveLayer.zIndex // 向上移动
  moveLayer.zIndex = or // 向下移动
}



