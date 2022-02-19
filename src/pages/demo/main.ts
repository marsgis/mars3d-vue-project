import "mars3d-cesium/Build/Cesium/Widgets/widgets.css"
import "mars3d/dist/mars3d.css"

import { createApp } from "vue"
import Application from "./App.vue"
import { injectState, key } from "@mars/common/store/widget"
import { store as testStore, key as testKey } from "@mars/common/store/test"
import store from "./widget-store"
import MarsUI from "@mars/components/mars-ui"

const app = createApp(Application)

app.use(MarsUI)

app.use(injectState(store), key)
app.use(testStore, testKey)

app.mount("#app")
