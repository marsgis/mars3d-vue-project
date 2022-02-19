/**
 * index页面的widget配置
 * @copyright 火星科技 mars3d.cn
 * @author 火星吴彦祖 2022-02-19
 */
import { defineAsyncComponent, markRaw } from "vue"
import { WidgetState } from "@mars/common/store/widget"
import { StoreOptions } from "vuex"

const store: StoreOptions<WidgetState> = {
  state: {
    widgets: [
      {
        component: markRaw(defineAsyncComponent(() => import(/* webpackChunkName: "query-poi" */ "@mars/widgets/basic/query-poi/index.vue"))),
        name: "query-poi",
        autoDisable: true
      },
      {
        component: markRaw(defineAsyncComponent(() => import(/* webpackChunkName: "toolbar" */ "@mars/widgets/basic/toolbar/index.vue"))),
        name: "toolbar",
        autoDisable: true
      },
      {
        component: markRaw(
          defineAsyncComponent(() => import(/* webpackChunkName: "manage-basemap" */ "@mars/widgets/basic/manage-basemap/index.vue"))
        ),
        name: "manage-basemap",
        group: "manage"
      },
      {
        component: markRaw(defineAsyncComponent(() => import(/* webpackChunkName: "manage-layers" */ "@mars/widgets/basic/manage-layers/index.vue"))),
        name: "manage-layers",
        group: "manage",
        disableOther: ["roamLine"]
      },
      {
        component: markRaw(
          defineAsyncComponent(() => import(/* webpackChunkName: "layer-tree" */ "@mars/widgets/basic/manage-layers/layer-tree.vue"))
        ),
        name: "layer-tree"
      },
      {
        component: markRaw(
          defineAsyncComponent(
            () => import(/* webpackChunkName: "layer-picture-heatmap" */ "@mars/widgets/basic/manage-layers/layer-picture-heatmap.vue")
          )
        ),
        name: "layer-picture-heatmap"
      },
      {
        component: markRaw(
          defineAsyncComponent(
            () => import(/* webpackChunkName: "layer-picture-guihua" */ "@mars/widgets/basic/manage-layers/layer-picture-guihua.vue")
          )
        ),
        name: "layer-picture-guihua"
      },
      {
        component: markRaw(defineAsyncComponent(() => import(/* webpackChunkName: "location-point" */ "@mars/widgets/basic/location-point/index.vue"))),
        name: "location-point",
        group: "tools"
      }
    ],
    openAtStart: ["query-poi", "toolbar"]
  }
}

export default store
