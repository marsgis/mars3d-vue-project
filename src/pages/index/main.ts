import "mars3d/dist/mars3d.css"

import { createApp } from "vue"
import Application from "./App.vue"
import { injectState, key } from "@/common/store/widget.js"
import store from "./widget-store"
import MarsUI from "@comp/mars-ui/"
import directive from "@/directive/index"

import "@/styles/index.less" // 加载全局样式

const app = createApp(Application)

app.use(MarsUI)

app.use(injectState(store), key)
app.use(directive)

app.mount("#app")
