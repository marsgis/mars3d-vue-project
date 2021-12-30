import { defineAsyncComponent, markRaw } from "vue"
import { State } from "@/common/store/index.js"
import { StoreOptions } from "vuex"

const store: StoreOptions<State> = {
  state: {
    widgets: [
      {
        component: markRaw(defineAsyncComponent(() => import(/* webpackChunkName: "query-poi" */ "@widgets/basic/query-poi/index.vue"))),
        name: "query-poi",
        autoDisable: true
      },
      {
        component: markRaw(defineAsyncComponent(() => import(/* webpackChunkName: "toolbar" */ "@widgets/basic/toolbar/index.vue"))),
        name: "toolbar",
        autoDisable: true
      },
      {
        component: markRaw(defineAsyncComponent(() => import(/* webpackChunkName: "manage-basemap" */ "@widgets/basic/manage-basemap/index.vue"))),
        name: "manage-basemap",
        group: "manage"
      },
      {
        component: markRaw(defineAsyncComponent(() => import(/* webpackChunkName: "manage-layers" */ "@widgets/basic/manage-layers/index.vue"))),
        name: "manage-layers",
        group: "manage",
        disableOther: ["roamfly"]
      },
      {
        component: markRaw(defineAsyncComponent(() => import(/* webpackChunkName: "layer-tree" */ "@widgets/basic/manage-layers/layer-tree.vue"))),
        name: "layer-tree"
      },
      {
        component: markRaw(defineAsyncComponent(() => import(/* webpackChunkName: "select-point" */ "@widgets/basic/select-point/index.vue"))),
        name: "select-point",
        group: "tools"
      }
    ],
    openAtStart: ["query-poi", "toolbar"]
  }
}

export default store
