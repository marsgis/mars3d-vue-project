/**
 * index页面的widget配置
 * @copyright 火星科技 mars3d.cn
 * @author 火星渣渣灰 2022-02-19
 */
import { defineAsyncComponent, markRaw } from "vue"
import { WidgetState } from "@mars/common/store/widget"
import { StoreOptions } from "vuex"

const store: StoreOptions<WidgetState> = {
  state: {
    widgets: [
      {
        component: markRaw(defineAsyncComponent(() => import("@mars/widgets/basic/query-poi/index.vue"))),
        name: "query-poi",
        autoDisable: true
      },
      {
        component: markRaw(defineAsyncComponent(() => import("@mars/widgets/basic/toolbar/index.vue"))),
        name: "toolbar",
        autoDisable: true
      },
      {
        component: markRaw(defineAsyncComponent(() => import("@mars/widgets/basic/manage-basemap/index.vue"))),
        name: "manage-basemap",
        group: "manage"
      },
      {
        component: markRaw(defineAsyncComponent(() => import("@mars/widgets/basic/manage-layers/index.vue"))),
        name: "manage-layers",
        group: "manage",
        disableOther: ["roamLine"]
      },
      {
        component: markRaw(defineAsyncComponent(() => import("@mars/widgets/basic/manage-layers/scenetree.vue"))),
        name: "layer-scenetree"
      },
      {
        component: markRaw(defineAsyncComponent(() => import("@mars/widgets/basic/manage-layers/picture-heatmap.vue"))),
        name: "layer-picture-heatmap"
      },
      {
        component: markRaw(defineAsyncComponent(() => import("@mars/widgets/basic/manage-layers/picture-guihua.vue"))),
        name: "layer-picture-guihua"
      },
      {
        component: markRaw(defineAsyncComponent(() => import("@mars/widgets/basic/location-point/index.vue"))),
        name: "location-point",
        group: "tools"
      }
    ],
    openAtStart: ["query-poi", "toolbar"]
  }
}

export default store

// src\widgets\basic\toolbar\index.vue 中使用的菜单数组
window.toolBarMenuData = [
  { name: "底图", img: "img/icon/basemap.png", activeImg: "img/icon/basemap-active.png", widget: "manage-basemap" },
  { name: "图层", img: "img/icon/layer.png", activeImg: "img/icon/layer-active.png", widget: "manage-layers" },
  {
    name: "工具",
    img: "img/icon/tool.png",
    activeImg: "img/icon/tool-active.png",
    children: [
      // { name: "图上量算", icon: "ruler", widget: "measure" },
      // { name: "空间分析", icon: "analysis", widget: "analysis" },
      { name: "坐标定位", icon: "local", widget: "location-point" }
      // { name: "地区导航", icon: "navigation", widget: "location-region" },
      // { name: "我的标记", icon: "mark", widget: "addmarker" },
      // { name: "视角书签", icon: "bookmark", widget: "bookmark" },
      // { name: "地图打印", icon: "printer", widget: "print" },
      // { name: "飞行漫游", icon: "take-off", widget: "roamLine-list" },
      // { name: "图上标绘", icon: "hand-painted-plate", widget: "plot" },
      // { name: "路线导航", icon: "connection", widget: "query-route" },
      // { name: "卷帘对比", icon: "switch-contrast", widget: "map-split" },
      // { name: "分屏对比", icon: "full-screen-play", widget: "map-compare" }
    ]
  }
]
