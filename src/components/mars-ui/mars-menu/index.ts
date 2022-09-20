import { App } from "vue"
import "./mars-menu.less"
import MarsMenu from "./index.vue"
import MarsMenuItem from "./menu-item.vue"
import MarsSubMenu from "./sub-menu.vue"
import MarsMenuGroup from "./menu-group.vue"

export default function install(app: App): App {
  app.component("mars-menu", MarsMenu)
  app.component("mars-menu-item", MarsMenuItem)
  app.component("mars-sub-menu", MarsSubMenu)
  app.component("mars-menu-group", MarsMenuGroup)
  return app
}
