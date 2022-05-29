import * as mars3d from "mars3d"
const Cesium = mars3d.Cesium

let map: mars3d.Map // 地图对象
export const eventTarget = new mars3d.BaseClass()

let currEffect // 当前生效的效果
let weather
// 雨效果
const rainEffect = new mars3d.effect.RainEffect({
  speed: 10,
  size: 20,
  direction: -30,
  enabled: false
})
// 雾效果
const fogEffect = new mars3d.effect.FogEffect({
  maxHeight: 20000, // 大于此高度后不显示
  fogByDistance: new Cesium.Cartesian4(1600, 0.0, 37602, 0.9),
  color: Cesium.Color.WHITE,
  enabled: false
})

const snowEffect = new mars3d.effect.SnowEffect({
  speed: 20,
  enabled: false
})

const snowCover = new mars3d.effect.SnowCoverEffect({
  maxHeight: 8000, // 大于此高度后不显示
  alpha: 0.2,
  enabled: false
})

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  map.addEffect(rainEffect)
  map.addEffect(fogEffect)
  map.addEffect(snowEffect)
  map.addEffect(snowCover)

  Cesium.Resource.fetchJson({ url: "http://wthrcdn.etouch.cn/weather_mini?city=青岛" })
    .then((msg) => {
      const data = JSON.parse(msg)
      const tianqiForcat = data.data.forecast[0].type
      if (tianqiForcat.search("雪") !== -1) {
        snowEffect.enabled = true
        snowCover.enabled = true
        currEffect = snowEffect
        weather = "snow"
      } else if (tianqiForcat.search("雨") !== -1) {
        rainEffect.enabled = true
        currEffect = rainEffect
        weather = "rain"
      } else if (tianqiForcat.search("雾") !== -1) {
        fogEffect.enabled = true
        currEffect = fogEffect
        weather = "fog"
      } else {
        currEffect = null
        weather = "normal"
      }

      eventTarget.fire("weather", { weather: weather })
    })

}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map.removeEffect(rainEffect)
  map.removeEffect(fogEffect)
  map.removeEffect(snowEffect)
  map.removeEffect(snowCover)
  map = null
}

export function snow() {
  if (!snowEffect.enabled) {
    if (currEffect != null) {
      currEffect.enabled = false
    }

    snowEffect.enabled = true
    snowCover.enabled = true
    currEffect = snowEffect
  }
}

export function rain() {
  if (!rainEffect.enabled) {
    if (currEffect != null) {
      currEffect.enabled = false
      if (currEffect === snowEffect) {
        snowCover.enabled = false
      }
    }

    rainEffect.enabled = true
    currEffect = rainEffect
  }

}

export function fog() {
  if (!fogEffect.enabled) {
    if (currEffect != null) {
      currEffect.enabled = false
      if (currEffect === snowEffect) {
        snowCover.enabled = false
      }
    }

    fogEffect.enabled = true
    currEffect = fogEffect
  }
}

export function normal() {
  if (currEffect != null) {
    currEffect.enabled = false
    if (currEffect === snowEffect) {
      snowCover.enabled = false
    }
  }

  currEffect = null
}

export function getSnow() {
  return snowEffect.enabled
}
// 速度
export function setSpeed(value) {
  snowEffect.speed = value
}

// 是否开启积雪效果
export function setCover(val) {
  snowCover.enabled = val
}

// 积雪厚度
export function setAlpha(value) {
  snowCover.alpha = value
}

// 是否开启下雪效果
export function setSnow(val) {
  snowEffect.enabled = val
}

// 是否开始雾效果
export function setFogEffect(val) {
  fogEffect.enabled = val
}

// 改变雾的颜色
export function setColor(color) {
  fogEffect.color = Cesium.Color.fromCssColorString(color)
}

// 修改近距离和远距离
export function setDistanceX(val) {
  fogEffect.fogByDistance.x = val
}

export function setDistanceZ(val) {
  fogEffect.fogByDistance.z = val
}

export function getFog() {
  return fogEffect.enabled
}

// 是否开启特效
export function setRainEffect(val) {
  rainEffect.enabled = val
}

// 粒子速度
export function setRainSpeed(value) {
  rainEffect.speed = value
}

// 粒子大小
export function setRainSize(value) {
  rainEffect.size = value
}

// 粒子方向
export function setRainDirection(value) {
  rainEffect.direction = value
}

export function getRain() {
  return rainEffect.enabled
}
