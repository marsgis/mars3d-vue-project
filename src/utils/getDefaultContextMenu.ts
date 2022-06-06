import * as mars3d from "mars3d"
import { $alert as globalAlert } from "@mars/components/mars-ui/index"
import {
  Home,
  Local,
  PreviewOpen,
  AppSwitch,
  Forbid,
  Cube,
  MultiTriangular,
  Shovel,
  Close,
  MapDistance,
  Ruler,
  Texture,
  AutoHeightOne,
  Compass,
  DeleteKey,
  Mark,
  Label,
  Change,
  BringToFrontOne,
  Asterisk,
  Rectangle,
  Editor,
  Export,
  ClearFormat,
  Effects,
  LightRain,
  Snow,
  Fog,
  Halo,
  Brightness,
  DarkMode,
  Blackboard,
  HighLight,
  Config,
  LandSurveying,
  TwoTriangles,
  Sun,
  FlightAirflow,
  AddPicture,
  SwitchThemes,
  Agreement,
  TakeOff,
  KeyboardOne,
  RecentViewsSort,
  MoveInOne,
  ExclusiveGateway,
  CloseOne,
  LockOne,
  Box,
  MonitorOff,
  MapTwo,
  International,
  DatabaseForbid
} from "@icon-park/svg"

const Cesium = mars3d.Cesium

// 获取平台内置的右键菜单
export function getDefaultContextMenu(map) {
  const that = map.contextmenu
  return [
    {
      text: "查看此处坐标",
      icon: Local({ theme: "outline", fill: "#fff", size: "18" }),
      show: function (e) {
        return Cesium.defined(e.cartesian)
      },
      callback: function (e) {
        // 经纬度
        const mpt = mars3d.LngLatPoint.fromCartesian(e.cartesian)
        const ptNew = mars3d.PointTrans.proj4Trans([mpt.lng, mpt.lat], "EPSG:4326", mars3d.CRS.CGCS2000_GK_Zone_3)

        const inhtml = `
         经度:${mpt.lng}, 纬度:${mpt.lat}, 海拔:${mpt.alt},

         横坐标:${ptNew[0].toFixed(1)}, 纵坐标:${ptNew[1].toFixed(1)} (CGCS2000)
        `
        globalAlert(inhtml, "位置信息")
      }
    },
    {
      text: "查看当前视角",
      icon: PreviewOpen({ theme: "outline", fill: "#fff", size: "18" }),
      callback: function (e) {
        const mpt = JSON.stringify(map.getCameraView())
        globalAlert(mpt, "当前视角信息")
      }
    },
    {
      text: "视角切换",
      icon: SwitchThemes({ theme: "outline", fill: "#fff", size: "18" }),
      children: [
        {
          text: "允许进入地下",
          icon: Agreement({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return map.scene.screenSpaceCameraController.enableCollisionDetection
          },
          callback: function (e) {
            map.scene.screenSpaceCameraController.enableCollisionDetection = false
          }
        },
        {
          text: "禁止进入地下",
          icon: Forbid({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return !map.scene.screenSpaceCameraController.enableCollisionDetection
          },
          callback: function (e) {
            map.scene.screenSpaceCameraController.enableCollisionDetection = true
          }
        },
        {
          text: "绕此处环绕飞行",
          icon: TakeOff({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return e.cartesian && (!that.rotatePoint || !that.rotatePoint?.isStart)
          },
          callback: function (e) {
            if (!that.rotatePoint) {
              that.rotatePoint = new mars3d.thing.RotatePoint()
              map.addThing(that.rotatePoint)
            }
            that.rotatePoint.start(e.cartesian)
          }
        },
        {
          text: "关闭环绕飞行",
          icon: CloseOne({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return that.rotatePoint?.isStart
          },
          callback: function (e) {
            if (that.rotatePoint) {
              that.rotatePoint.stop()
            }
          }
        },

        {
          text: "移动到此处",
          icon: MoveInOne({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return Cesium.defined(e.cartesian)
          },
          callback: function (e) {
            const cameraDistance = Cesium.Cartesian3.distance(e.cartesian, map.camera.positionWC) * 0.1

            map.flyToPoint(e.cartesian, {
              radius: cameraDistance, // 距离目标点的距离
              maximumHeight: map.camera.positionCartographic.height
            })
          }
        },
        {
          text: "第一视角站到此处",
          icon: RecentViewsSort({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return Cesium.defined(e.cartesian)
          },
          callback: function (e) {
            map.camera.flyTo({
              destination: mars3d.PointUtil.addPositionsHeight(e.cartesian, 10), // 升高10米
              orientation: {
                heading: map.camera.heading,
                pitch: 0.0,
                roll: 0.0
              },
              maximumHeight: map.camera.positionCartographic.height
            })
          }
        },
        {
          text: "开启键盘漫游",
          icon: KeyboardOne({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return !map.keyboardRoam.enabled
          },
          callback: function (e) {
            map.keyboardRoam.enabled = true
          }
        },
        {
          text: "关闭键盘漫游",
          icon: CloseOne({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return map.keyboardRoam.enabled
          },
          callback: function (e) {
            map.keyboardRoam.enabled = false
          }
        },
        {
          text: "取消锁定",
          icon: LockOne({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return map.trackedEntity !== undefined
          },
          callback: function (e) {
            map.trackedEntity = undefined
          }
        }
      ]
    },
    {
      text: "三维模型",
      icon: Cube({ theme: "outline", fill: "#fff", size: "18" }),
      show: function (e) {
        const model = map.pick3DTileset(e.cartesian) // 拾取绘制返回的模型
        return Cesium.defined(model)
      },
      children: [
        {
          text: "显示三角网",
          icon: MultiTriangular({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            const model = map.pick3DTileset(e.cartesian) // 拾取绘制返回的模型
            return !model.debugWireframe
          },
          callback: function (e) {
            const model = map.pick3DTileset(e.cartesian) // 拾取绘制返回的模型
            model.debugWireframe = true
          }
        },
        {
          text: "关闭三角网",
          icon: CloseOne({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            const model = map.pick3DTileset(e.cartesian) // 拾取绘制返回的模型
            return model.debugWireframe
          },
          callback: function (e) {
            const model = map.pick3DTileset(e.cartesian) // 拾取绘制返回的模型
            model.debugWireframe = false
          }
        },
        {
          text: "显示包围盒",
          icon: Box({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            const model = map.pick3DTileset(e.cartesian) // 拾取绘制返回的模型
            return !model.debugShowBoundingVolume
          },
          callback: function (e) {
            const model = map.pick3DTileset(e.cartesian) // 拾取绘制返回的模型
            model.debugShowBoundingVolume = true
          }
        },
        {
          text: "关闭包围盒",
          icon: MonitorOff({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            const model = map.pick3DTileset(e.cartesian) // 拾取绘制返回的模型
            return model.debugShowBoundingVolume
          },
          callback: function (e) {
            const model = map.pick3DTileset(e.cartesian) // 拾取绘制返回的模型
            model.debugShowBoundingVolume = false
          }
        }
      ]
    },
    {
      text: "地形服务",
      icon: International({ theme: "outline", fill: "#fff", size: "18" }),
      show: function (e) {
        return Cesium.defined(e.cartesian)
      },
      children: [
        {
          text: "开启地形",
          icon: MapTwo({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return !map.hasTerrain
          },
          callback: function (e) {
            map.hasTerrain = true
          }
        },
        {
          text: "关闭地形",
          icon: CloseOne({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return map.hasTerrain
          },
          callback: function (e) {
            map.hasTerrain = false
          }
        },
        {
          text: "显示三角网",
          icon: MultiTriangular({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return !map.scene.globe._surface.tileProvider._debug.wireframe
          },
          callback: function (e) {
            map.scene.globe._surface.tileProvider._debug.wireframe = true
          }
        },
        {
          text: "关闭三角网",
          icon: CloseOne({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return map.scene.globe._surface.tileProvider._debug.wireframe
          },
          callback: function (e) {
            map.scene.globe._surface.tileProvider._debug.wireframe = false
          }
        }
      ]
    },
    {
      text: "图上量算",
      icon: Ruler({ theme: "outline", fill: "#fff", size: "18" }),
      children: [
        {
          text: "距离",
          icon: MapDistance({ theme: "outline", fill: "#fff", size: "18" }),
          callback: function (e) {
            if (!that.measure) {
              that.measure = new mars3d.thing.Measure()
              map.addThing(that.measure)
            }
            that.measure.distance()
          }
        },
        {
          text: "面积",
          icon: Texture({ theme: "outline", fill: "#fff", size: "18" }),
          callback: function (e) {
            if (!that.measure) {
              that.measure = new mars3d.thing.Measure()
              map.addThing(that.measure)
            }
            that.measure.area()
          }
        },
        {
          text: "高度差",
          icon: AutoHeightOne({ theme: "outline", fill: "#fff", size: "18" }),
          callback: function (e) {
            if (!that.measure) {
              that.measure = new mars3d.thing.Measure()
              map.addThing(that.measure)
            }
            that.measure.heightTriangle()
          }
        },
        {
          text: "角度",
          icon: Compass({ theme: "outline", fill: "#fff", size: "18" }),
          callback: function (e) {
            if (!that.measure) {
              that.measure = new mars3d.thing.Measure()
              map.addThing(that.measure)
            }
            that.measure.angle()
          }
        },
        {
          text: "删除测量",
          icon: DeleteKey({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return that.measure && that.measure.hasMeasure
          },
          callback: function (e) {
            if (that.measure) {
              that.measure.clear()
            }
          }
        }
      ]
    },

    {
      text: "图上标记",
      icon: Mark({ theme: "outline", fill: "#fff", size: "18" }),
      children: [
        {
          text: "标记点",
          icon: Label({ theme: "outline", fill: "#fff", size: "18" }),
          callback: function (e) {
            map.graphicLayer.startDraw({
              type: "point",
              style: {
                pixelSize: 12,
                color: "#3388ff"
              },
              success: function (graphic) {
                // eslint-disable-next-line no-console
                console.log(JSON.stringify(graphic.coordinates))
              }
            })
          }
        },
        {
          text: "标记线",
          icon: Change({ theme: "outline", fill: "#fff", size: "18" }),
          callback: function (e) {
            map.graphicLayer.startDraw({
              type: "polyline",
              style: {
                color: "#55ff33",
                width: 3
              },
              success: function (graphic) {
                // eslint-disable-next-line no-console
                console.log(JSON.stringify(graphic.coordinates))
              }
            })
          }
        },
        {
          text: "标记面",
          icon: BringToFrontOne({ theme: "outline", fill: "#fff", size: "18" }),
          callback: function (e) {
            map.graphicLayer.startDraw({
              type: "polygon",
              style: {
                color: "#29cf34",
                opacity: 0.5,
                outline: true,
                outlineWidth: 2.0
              },
              success: function (graphic) {
                // eslint-disable-next-line no-console
                console.log(JSON.stringify(graphic.coordinates))
              }
            })
          }
        },
        {
          text: "标记圆",
          icon: Asterisk({ theme: "outline", fill: "#fff", size: "18" }),
          callback: function (e) {
            map.graphicLayer.startDraw({
              type: "circle",
              style: {
                color: "#ffff00",
                opacity: 0.6
              },
              success: function (graphic) {
                // eslint-disable-next-line no-console
                console.log(JSON.stringify(graphic.coordinates))
              }
            })
          }
        },
        {
          text: "标记矩形",
          icon: Rectangle({ theme: "outline", fill: "#fff", size: "18" }),
          callback: function (e) {
            map.graphicLayer.startDraw({
              type: "rectangle",
              style: {
                color: "#ffff00",
                opacity: 0.6
              },
              success: function (graphic) {
                // eslint-disable-next-line no-console
                console.log(JSON.stringify(graphic.coordinates))
              }
            })
          }
        },
        {
          text: "允许编辑",
          icon: Editor({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return !map.graphicLayer.hasEdit
          },
          callback: function (e) {
            map.graphicLayer.hasEdit = true
          }
        },
        {
          text: "禁止编辑",
          icon: DatabaseForbid({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return map.graphicLayer.hasEdit
          },
          callback: function (e) {
            map.graphicLayer.hasEdit = false
          }
        },
        {
          text: "导出GeoJSON",
          icon: Export({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return map.graphicLayer.length > 0
          },
          callback: function (e) {
            mars3d.Util.downloadFile("图上标记.json", JSON.stringify(map.graphicLayer.toGeoJSON()))
          }
        },
        {
          text: "清除所有标记",
          icon: ClearFormat({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return map.graphicLayer.length > 0
          },
          callback: function (e) {
            map.graphicLayer.clear()
          }
        }
      ]
    },
    {
      text: "特效效果",
      icon: Effects({ theme: "outline", fill: "#fff", size: "18" }),
      children: [
        {
          text: "开启下雨",
          icon: LightRain({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return !that.rainEffect
          },
          callback: function (e) {
            if (!that.rainEffect) {
              that.rainEffect = new mars3d.effect.RainEffect()
              map.addEffect(that.rainEffect)
            }
          }
        },
        {
          text: "关闭下雨",
          icon: Close({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return that.rainEffect
          },
          callback: function (e) {
            if (that.rainEffect) {
              map.removeEffect(that.rainEffect, true)
              delete that.rainEffect
            }
          }
        },
        {
          text: "开启下雪",
          icon: Snow({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return !that.snowEffect
          },
          callback: function (e) {
            if (!that.snowEffect) {
              that.snowEffect = new mars3d.effect.SnowEffect()
              map.addEffect(that.snowEffect)
            }
          }
        },
        {
          text: "关闭下雪",
          icon: CloseOne({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return that.snowEffect
          },
          callback: function (e) {
            if (that.snowEffect) {
              map.removeEffect(that.snowEffect, true)
              delete that.snowEffect
            }
          }
        },

        {
          text: "开启雾天气",
          icon: Fog({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return !that.fogEffect
          },
          callback: function (e) {
            if (!that.fogEffect) {
              const height = map.camera.positionCartographic.height * 2
              that.fogEffect = new mars3d.effect.FogEffect({
                fogByDistance: new Cesium.Cartesian4(0.1 * height, 0.1, height, 0.8)
              })
              map.addEffect(that.fogEffect)
            }
          }
        },
        {
          text: "关闭雾天气",
          icon: CloseOne({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return that.fogEffect
          },
          callback: function (e) {
            if (that.fogEffect) {
              map.removeEffect(that.fogEffect, true)
              delete that.fogEffect
            }
          }
        },

        {
          text: "开启泛光",
          icon: Halo({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return !that.bloomEffect
          },
          callback: function (e) {
            if (!that.bloomEffect) {
              that.bloomEffect = new mars3d.effect.BloomEffect()
              map.addEffect(that.bloomEffect)
            }
          }
        },
        {
          text: "关闭泛光",
          icon: CloseOne({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return that.bloomEffect
          },
          callback: function (e) {
            if (that.bloomEffect) {
              map.removeEffect(that.bloomEffect, true)
              delete that.bloomEffect
            }
          }
        },

        {
          text: "开启亮度",
          icon: Brightness({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return !that.brightnessEffect
          },
          callback: function (e) {
            if (!that.brightnessEffect) {
              that.brightnessEffect = new mars3d.effect.BrightnessEffect()
              map.addEffect(that.brightnessEffect)
            }
          }
        },
        {
          text: "关闭亮度",
          icon: CloseOne({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return that.brightnessEffect
          },
          callback: function (e) {
            if (that.brightnessEffect) {
              map.removeEffect(that.brightnessEffect, true)
              delete that.brightnessEffect
            }
          }
        },

        {
          text: "开启夜视",
          icon: DarkMode({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return !that.nightVisionEffect
          },
          callback: function (e) {
            if (!that.nightVisionEffect) {
              that.nightVisionEffect = new mars3d.effect.NightVisionEffect()
              map.addEffect(that.nightVisionEffect)
            }
          }
        },
        {
          text: "关闭夜视",
          icon: CloseOne({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return that.nightVisionEffect
          },
          callback: function (e) {
            if (that.nightVisionEffect) {
              map.removeEffect(that.nightVisionEffect, true)
              delete that.nightVisionEffect
            }
          }
        },

        {
          text: "开启黑白",
          icon: Blackboard({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return !that.blackAndWhiteEffect
          },
          callback: function (e) {
            if (!that.blackAndWhiteEffect) {
              that.blackAndWhiteEffect = new mars3d.effect.BlackAndWhiteEffect()
              map.addEffect(that.blackAndWhiteEffect)
            }
          }
        },
        {
          text: "关闭黑白",
          icon: CloseOne({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return that.blackAndWhiteEffect
          },
          callback: function (e) {
            if (that.blackAndWhiteEffect) {
              map.removeEffect(that.blackAndWhiteEffect, true)
              delete that.blackAndWhiteEffect
            }
          }
        },

        {
          text: "开启拾取高亮",
          icon: HighLight({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return !that.outlineEffect
          },
          callback: function (e) {
            if (!that.outlineEffect) {
              that.outlineEffect = new mars3d.effect.OutlineEffect()
              map.addEffect(that.outlineEffect)
            }
          }
        },
        {
          text: "关闭拾取高亮",
          icon: CloseOne({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return that.outlineEffect
          },
          callback: function (e) {
            if (that.outlineEffect) {
              map.removeEffect(that.outlineEffect, true)
              delete that.outlineEffect
            }
          }
        }
      ]
    },
    {
      text: "场景设置",
      icon: Config({ theme: "outline", fill: "#fff", size: "18" }),
      children: [
        {
          text: "开启深度监测",
          icon: LandSurveying({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return !map.scene.globe.depthTestAgainstTerrain
          },
          callback: function (e) {
            map.scene.globe.depthTestAgainstTerrain = true
          }
        },
        {
          text: "关闭深度监测",
          icon: CloseOne({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return map.scene.globe.depthTestAgainstTerrain
          },
          callback: function (e) {
            map.scene.globe.depthTestAgainstTerrain = false
          }
        },

        {
          text: "显示星空背景",
          icon: TwoTriangles({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return !map.scene.skyBox.show
          },
          callback: function (e) {
            map.scene.skyBox.show = true // 天空盒
            map.scene.moon.show = true // 太阳
            map.scene.sun.show = true // 月亮
          }
        },
        {
          text: "关闭星空背景",
          icon: ExclusiveGateway({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return map.scene.skyBox.show
          },
          callback: function (e) {
            map.scene.skyBox.show = false // 天空盒
            map.scene.moon.show = false // 太阳
            map.scene.sun.show = false // 月亮
          }
        },
        {
          text: "开启日照阴影",
          icon: Sun({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return !map.viewer.shadows
          },
          callback: function (e) {
            map.viewer.shadows = true
            map.viewer.terrainShadows = Cesium.ShadowMode.ENABLED
            map.scene.globe.enableLighting = true
          }
        },
        {
          text: "关闭日照阴影",
          icon: CloseOne({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return map.viewer.shadows
          },
          callback: function (e) {
            map.viewer.shadows = false
            map.viewer.terrainShadows = Cesium.ShadowMode.RECEIVE_ONLY
            map.scene.globe.enableLighting = false
          }
        },
        {
          text: "开启大气渲染",
          icon: FlightAirflow({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return !map.scene.skyAtmosphere.show
          },
          callback: function (e) {
            map.scene.skyAtmosphere.show = true
            map.scene.globe.showGroundAtmosphere = true
          }
        },
        {
          text: "关闭大气渲染",
          icon: CloseOne({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return map.scene.skyAtmosphere.show
          },
          callback: function (e) {
            map.scene.skyAtmosphere.show = false
            map.scene.globe.showGroundAtmosphere = false
          }
        },

        {
          text: "场景出图",
          icon: AddPicture({ theme: "outline", fill: "#fff", size: "18" }),
          callback: function (e) {
            map.expImage()
          }
        }
      ]
    }
  ]
}
