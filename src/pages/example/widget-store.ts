import { defineAsyncComponent, markRaw } from "vue"
import { WidgetState } from "@/common/store/widget.js"
import { StoreOptions } from "vuex"

const store: StoreOptions<WidgetState> = {
  state: {
    widgets: [
      {
        component: markRaw(defineAsyncComponent(() => import("@widgets/example/menu/index.vue"))),
        name: "menu",
        autoDisable: false,
        disableOther: false
      },
      {
        component: markRaw(defineAsyncComponent(() => import("@widgets/example/sample-pannel/index.vue"))),
        name: "sample-pannel"
      },
      {
        component: markRaw(defineAsyncComponent(() => import("@widgets/example/sample-dialog/index.vue"))),
        name: "sample-dialog"
      },
      {
        component: markRaw(defineAsyncComponent(() => import("@widgets/example/ui/index.vue"))),
        name: "ui"
      }
    ],
    openAtStart: ["menu"]
  }
}

export default store
