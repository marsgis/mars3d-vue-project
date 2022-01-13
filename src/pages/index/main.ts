import "mars3d/dist/mars3d.css"

import { createApp } from "vue"
import Application from "./App.vue"
import { injectState, key } from "@mars/common/store/widget"
import store from "./widget-store"
import MarsUI from "@mars/components/mars-ui"
import directive from "@mars/directive/index"

const app = createApp(Application)

app.use(MarsUI)

app.use(injectState(store), key)
app.use(directive)

app.mount("#app")
