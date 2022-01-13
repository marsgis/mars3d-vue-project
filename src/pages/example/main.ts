import "mars3d/dist/mars3d.css"

import { createApp } from "vue"
import Application from "./App.vue"
import { injectState, key } from "@mars/common/store/widget"
import { store as testStore, key as testKey } from "@mars/common/store/test"
import store from "./widget-store"
import { install as iconInstall } from "@icon-park/vue-next/es/all"
import MarsUI from "@mars/components/mars-ui"
import directive from "@mars/directive/index"

const app = createApp(Application)

app.use(MarsUI)

iconInstall(app)

app.use(injectState(store), key)
app.use(testStore, testKey)
app.use(directive)

app.mount("#app")
