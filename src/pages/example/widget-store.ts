import { defineAsyncComponent, markRaw } from "vue"
import { WidgetState } from "@mars/common/store/widget"
import { StoreOptions } from "vuex"

const store: StoreOptions<WidgetState> = {
  state: {
    widgets: [
      {
        component: markRaw(defineAsyncComponent(() => import("@mars/widgets/example/menu/index.vue"))),
        name: "menu",
        autoDisable: false,
        disableOther: false
      },
      {
        component: markRaw(defineAsyncComponent(() => import("@mars/widgets/example/sample-pannel/index.vue"))),
        name: "sample-pannel"
      },
      {
        component: markRaw(defineAsyncComponent(() => import("@mars/widgets/example/sample-dialog/index.vue"))),
        name: "sample-dialog"
      },
      {
        component: markRaw(defineAsyncComponent(() => import("@mars/widgets/example/ui/index.vue"))),
        name: "ui"
      },
      {
        name: "my-widget",
        component: markRaw(defineAsyncComponent(() => import(/* webpackChunkName: "my-widget" */"@mars/widgets/example/my-dialog/index.vue")))
      }
    ],
    openAtStart: ["menu", "ui"]
  }
}

export default store
