import * as mars3d from "mars3d"
import { $alert as globalAlert } from "@mars/components/mars-ui/index"
import {
  Local,
  PreviewOpen,
  Forbid,
  Cube,
  MultiTriangular,
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

const iconStyle: any = { theme: "outline", fill: "#fff", size: "18" }

const Cesium = mars3d.Cesium

// 获取平台内置的右键菜单
export function getDefaultContextMenu(map) {
  const that = map.contextmenu

  return [
    {
      text: function () {
        return map.getLangText("_查看此处坐标")
      },
      icon: Local(iconStyle),
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
      text: function () {
        return map.getLangText("_查看当前视角")
      },
      icon: PreviewOpen(iconStyle),
      callback: function (e) {
        const mpt = JSON.stringify(map.getCameraView())
        globalAlert(mpt, map.getLangText("_当前视角信息"))
      }
    },
    {
      text: function () {
        return map.getLangText("_视角切换")
      },
      icon: SwitchThemes(iconStyle),
      children: [
        {
          text: function () {
            return map.getLangText("_允许进入地下")
          },
          icon: Agreement(iconStyle),
          show: function (e) {
            return map.scene.screenSpaceCameraController.enableCollisionDetection
          },
          callback: function (e) {
            map.scene.screenSpaceCameraController.enableCollisionDetection = false
          }
        },
        {
          text: function () {
            return map.getLangText("_禁止进入地下")
          },
          icon: Forbid(iconStyle),
          show: function (e) {
            return !map.scene.screenSpaceCameraController.enableCollisionDetection
          },
          callback: function (e) {
            map.scene.screenSpaceCameraController.enableCollisionDetection = true
          }
        },
        {
          text: function () {
            return map.getLangText("_绕此处环绕飞行")
          },
          icon: TakeOff(iconStyle),
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
          text: function () {
            return map.getLangText("_关闭环绕飞行")
          },
          icon: CloseOne(iconStyle),
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
          text: function () {
            return map.getLangText("_移动到此处")
          },
          icon: MoveInOne(iconStyle),
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
          text: function () {
            return map.getLangText("_第一视角站到此处")
          },
          icon: RecentViewsSort(iconStyle),
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
          text: function () {
            return map.getLangText("_开启键盘漫游")
          },
          icon: KeyboardOne(iconStyle),
          show: function (e) {
            return !map.keyboardRoam.enabled
          },
          callback: function (e) {
            map.keyboardRoam.enabled = true
          }
        },
        {
          text: function () {
            return map.getLangText("_关闭键盘漫游")
          },
          icon: CloseOne(iconStyle),
          show: function (e) {
            return map.keyboardRoam.enabled
          },
          callback: function (e) {
            map.keyboardRoam.enabled = false
          }
        },
        {
          text: function () {
            return map.getLangText("_跟踪锁定")
          },
          icon: LockOne(iconStyle),
          show: function (e) {
            const graphic = e.graphic
            if (!graphic) {
              return false
            }

            if (graphic.entity instanceof Cesium.Entity) {
              return true
            } else if (graphic.trackedEntity instanceof Cesium.Entity) {
              return true
            }

            return false
          },
          callback: function (e) {
            map.trackedEntity = e.graphic
            that.trackedGraphic = e.graphic
          }
        },
        {
          text: function () {
            return map.getLangText("_取消锁定")
          },
          icon: LockOne(iconStyle),
          show: function (e) {
            return that.trackedGraphic === e.graphic && map.trackedEntity !== undefined
          },
          callback: function (e) {
            map.trackedEntity = undefined
            that.trackedGraphic = undefined
          }
        }
      ]
    },
    {
      text: function () {
        return map.getLangText("_三维模型")
      },
      icon: Cube(iconStyle),
      show: function (e) {
        const model = map.pick3DTileset(e.cartesian) // 拾取绘制返回的模型
        return Cesium.defined(model)
      },
      children: [
        {
          text: function () {
            return map.getLangText("_显示三角网")
          },
          icon: MultiTriangular(iconStyle),
          show: function (e) {
            const model = map.pick3DTileset(e.cartesian) // 拾取绘制返回的模型
            return !model.debugWireframe && model._enableDebugWireframe
          },
          callback: function (e) {
            const model = map.pick3DTileset(e.cartesian) // 拾取绘制返回的模型
            model.debugWireframe = true
          }
        },
        {
          text: function () {
            return map.getLangText("_关闭三角网")
          },
          icon: CloseOne(iconStyle),
          show: function (e) {
            const model = map.pick3DTileset(e.cartesian) // 拾取绘制返回的模型
            return model.debugWireframe && model._enableDebugWireframe
          },
          callback: function (e) {
            const model = map.pick3DTileset(e.cartesian) // 拾取绘制返回的模型
            model.debugWireframe = false
          }
        },
        {
          text: function () {
            return map.getLangText("_显示包围盒")
          },
          icon: Box(iconStyle),
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
          text: function () {
            return map.getLangText("_关闭包围盒")
          },
          icon: MonitorOff(iconStyle),
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
      text: function () {
        return map.getLangText("_地形服务")
      },
      icon: International(iconStyle),
      show: function (e) {
        return Cesium.defined(e.cartesian)
      },
      children: [
        {
          text: function () {
            return map.getLangText("_开启地形")
          },
          icon: MapTwo(iconStyle),
          show: function (e) {
            return !map.hasTerrain
          },
          callback: function (e) {
            map.hasTerrain = true
          }
        },
        {
          text: function () {
            return map.getLangText("_关闭地形")
          },
          icon: CloseOne(iconStyle),
          show: function (e) {
            return map.hasTerrain
          },
          callback: function (e) {
            map.hasTerrain = false
          }
        },
        {
          text: function () {
            return map.getLangText("_显示三角网")
          },
          icon: MultiTriangular(iconStyle),
          show: function (e) {
            return !map.scene.globe._surface.tileProvider._debug.wireframe
          },
          callback: function (e) {
            map.scene.globe._surface.tileProvider._debug.wireframe = true
          }
        },
        {
          text: function () {
            return map.getLangText("_关闭三角网")
          },
          icon: CloseOne(iconStyle),
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
      text: function () {
        return map.getLangText("_图上量算")
      },
      icon: Ruler(iconStyle),
      children: [
        {
          text: function () {
            return map.getLangText("_距离")
          },
          icon: MapDistance(iconStyle),
          callback: function (e) {
            if (!that.measure) {
              that.measure = new mars3d.thing.Measure()
              map.addThing(that.measure)
            }
            that.measure.distance()
          }
        },
        {
          text: function () {
            return map.getLangText("_面积")
          },
          icon: Texture(iconStyle),
          callback: function (e) {
            if (!that.measure) {
              that.measure = new mars3d.thing.Measure()
              map.addThing(that.measure)
            }
            that.measure.area()
          }
        },
        {
          text: function () {
            return map.getLangText("_高度差")
          },
          icon: AutoHeightOne(iconStyle),
          callback: function (e) {
            if (!that.measure) {
              that.measure = new mars3d.thing.Measure()
              map.addThing(that.measure)
            }
            that.measure.heightTriangle()
          }
        },
        {
          text: function () {
            return map.getLangText("_角度")
          },
          icon: Compass(iconStyle),
          callback: function (e) {
            if (!that.measure) {
              that.measure = new mars3d.thing.Measure()
              map.addThing(that.measure)
            }
            that.measure.angle()
          }
        },
        {
          text: function () {
            return map.getLangText("_删除测量")
          },
          icon: DeleteKey(iconStyle),
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
      text: function () {
        return map.getLangText("_图上标记")
      },
      icon: Mark(iconStyle),
      children: [
        {
          text: function () {
            return map.getLangText("_标记点")
          },
          icon: Label(iconStyle),
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
          text: function () {
            return map.getLangText("_标记线")
          },
          icon: Change(iconStyle),
          callback: function (e) {
            map.graphicLayer.startDraw({
              type: "polyline",
              style: {
                color: "#55ff33",
                width: 3
                // arcType: Cesium.ArcType.NONE
              },
              success: function (graphic) {
                // eslint-disable-next-line no-console
                console.log(JSON.stringify(graphic.coordinates))
              }
            })
          }
        },
        {
          text: function () {
            return map.getLangText("_标记面")
          },
          icon: BringToFrontOne(iconStyle),
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
          text: function () {
            return map.getLangText("_标记圆")
          },
          icon: Asterisk(iconStyle),
          callback: function (e) {
            map.graphicLayer.startDraw({
              type: "circle",
              style: {
                color: "#ffff00",
                opacity: 0.6
              },
              addHeight: 1,
              success: function (graphic) {
                // eslint-disable-next-line no-console
                console.log(JSON.stringify(graphic.coordinates))
              }
            })
          }
        },
        {
          text: function () {
            return map.getLangText("_标记矩形")
          },
          icon: Rectangle(iconStyle),
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
          text: function () {
            return map.getLangText("_允许编辑")
          },
          icon: Editor(iconStyle),
          show: function (e) {
            return !map.graphicLayer.hasEdit
          },
          callback: function (e) {
            map.graphicLayer.hasEdit = true
          }
        },
        {
          text: function () {
            return map.getLangText("_禁止编辑")
          },
          icon: DatabaseForbid(iconStyle),
          show: function (e) {
            return map.graphicLayer.hasEdit
          },
          callback: function (e) {
            map.graphicLayer.hasEdit = false
          }
        },
        {
          text: function () {
            return map.getLangText("_导出文件")
          },
          icon: Export(iconStyle),
          show: function (e) {
            return map.graphicLayer.length > 0
          },
          callback: function (e) {
            mars3d.Util.downloadFile("图上标记.json", JSON.stringify(map.graphicLayer.toGeoJSON()))
          }
        },
        {
          text: function () {
            return map.getLangText("_清除标记")
          },
          icon: ClearFormat(iconStyle),
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
      text: function () {
        return map.getLangText("_特效效果")
      },
      icon: Effects(iconStyle),
      children: [
        {
          text: function () {
            return map.getLangText("_开启下雨")
          },
          icon: LightRain(iconStyle),
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
          text: function () {
            return map.getLangText("_关闭下雨")
          },
          icon: Close(iconStyle),
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
          text: function () {
            return map.getLangText("_开启下雪")
          },
          icon: Snow(iconStyle),
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
          text: function () {
            return map.getLangText("_关闭下雪")
          },
          icon: CloseOne(iconStyle),
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
          text: function () {
            return map.getLangText("_开启雾天气")
          },
          icon: Fog(iconStyle),
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
          text: function () {
            return map.getLangText("_关闭雾天气")
          },
          icon: CloseOne(iconStyle),
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
          text: function () {
            return map.getLangText("_开启泛光")
          },
          icon: Halo(iconStyle),
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
          text: function () {
            return map.getLangText("_关闭泛光")
          },
          icon: CloseOne(iconStyle),
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
          text: function () {
            return map.getLangText("_开启亮度")
          },
          icon: Brightness(iconStyle),
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
          text: function () {
            return map.getLangText("_关闭亮度")
          },
          icon: CloseOne(iconStyle),
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
          text: function () {
            return map.getLangText("_开启夜视")
          },
          icon: DarkMode(iconStyle),
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
          text: function () {
            return map.getLangText("_关闭夜视")
          },
          icon: CloseOne(iconStyle),
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
          text: function () {
            return map.getLangText("_开启黑白")
          },
          icon: Blackboard(iconStyle),
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
          text: function () {
            return map.getLangText("_关闭黑白")
          },
          icon: CloseOne(iconStyle),
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
          text: function () {
            return map.getLangText("_开启拾取高亮")
          },
          icon: HighLight(iconStyle),
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
          text: function () {
            return map.getLangText("_关闭拾取高亮")
          },
          icon: CloseOne(iconStyle),
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
      text: function () {
        return map.getLangText("_场景设置")
      },
      icon: Config(iconStyle),
      children: [
        {
          text: function () {
            return map.getLangText("_开启深度监测")
          },
          icon: LandSurveying(iconStyle),
          show: function (e) {
            return !map.scene.globe.depthTestAgainstTerrain
          },
          callback: function (e) {
            map.scene.globe.depthTestAgainstTerrain = true
          }
        },
        {
          text: function () {
            return map.getLangText("_关闭深度监测")
          },
          icon: CloseOne(iconStyle),
          show: function (e) {
            return map.scene.globe.depthTestAgainstTerrain
          },
          callback: function (e) {
            map.scene.globe.depthTestAgainstTerrain = false
          }
        },

        {
          text: function () {
            return map.getLangText("_显示星空背景")
          },
          icon: TwoTriangles(iconStyle),
          show: function (e) {
            return !map.scene.skyBox?.show
          },
          callback: function (e) {
            map.scene.skyBox.show = true // 天空盒
            map.scene.moon.show = true // 太阳
            map.scene.sun.show = true // 月亮
          }
        },
        {
          text: function () {
            return map.getLangText("_关闭星空背景")
          },
          icon: ExclusiveGateway(iconStyle),
          show: function (e) {
            return map.scene.skyBox?.show
          },
          callback: function (e) {
            map.scene.skyBox.show = false // 天空盒
            map.scene.moon.show = false // 太阳
            map.scene.sun.show = false // 月亮
          }
        },
        {
          text: function () {
            return map.getLangText("_开启日照阴影")
          },
          icon: Sun(iconStyle),
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
          text: function () {
            return map.getLangText("_关闭日照阴影")
          },
          icon: CloseOne(iconStyle),
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
          text: function () {
            return map.getLangText("_开启大气渲染")
          },
          icon: FlightAirflow(iconStyle),
          show: function (e) {
            return map.scene.skyAtmosphere && !map.scene.skyAtmosphere.show
          },
          callback: function (e) {
            map.scene.skyAtmosphere.show = true
            map.scene.globe.showGroundAtmosphere = true
          }
        },
        {
          text: function () {
            return map.getLangText("_关闭大气渲染")
          },
          icon: CloseOne(iconStyle),
          show: function (e) {
            return map.scene.skyAtmosphere?.show
          },
          callback: function (e) {
            map.scene.skyAtmosphere.show = false
            map.scene.globe.showGroundAtmosphere = false
          }
        },

        {
          text: function () {
            return map.getLangText("_场景出图")
          },
          icon: AddPicture(iconStyle),
          callback: function (e) {
            map.expImage()
          }
        }
      ]
    }
  ]
}
