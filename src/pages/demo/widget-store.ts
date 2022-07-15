import { defineAsyncComponent, markRaw } from "vue"
import { WidgetState } from "@mars/common/store/widget"
import { StoreOptions } from "vuex"

const store: StoreOptions<WidgetState> = {
  state: {
    widgets: [
      {
        component: markRaw(defineAsyncComponent(() => import("@mars/widgets/demo/menu/index.vue"))),
        name: "menu",
        autoDisable: false,
        disableOther: false
      },
      {
        component: markRaw(defineAsyncComponent(() => import("@mars/widgets/demo/sample-pannel/index.vue"))),
        name: "sample-pannel"
      },
      {
        component: markRaw(defineAsyncComponent(() => import("@mars/widgets/demo/sample-dialog/index.vue"))),
        name: "sample-dialog"
      },
      {
        component: markRaw(defineAsyncComponent(() => import("@mars/widgets/demo/ui/index.vue"))),
        name: "ui"
      },
      {
        name: "my-widget",
        component: markRaw(defineAsyncComponent(() => import("@mars/widgets/demo/my-dialog/index.vue")))
      },
      {
        component: markRaw(defineAsyncComponent(() => import("@mars/widgets/demo/test/index.vue"))),
        name: "test"
      },
      {
        component: markRaw(defineAsyncComponent(() => import("@mars/widgets/demo/power-pannel/index.vue"))),
        name: "power-pannel"
      },
      {
        component: markRaw(defineAsyncComponent(() => import("@mars/widgets/demo/my-dialog/index.vue"))),
        name: "my-dialog"
      }
    ],
    openAtStart: ["my-dialog"]
  }
}

export default store
