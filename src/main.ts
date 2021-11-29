import { createApp } from "vue"
import mars3dPlugin from "@/plugins/mars3d-plugin"
import Application from "./App.vue"
import { install as iconInstall } from "@icon-park/vue-next/es/all"
import MarsUI from "@comp/MarsUI"

import {
  AutoComplete,
  Button,
  Checkbox,
  Col,
  Collapse,
  Dropdown,
  Form,
  Input,
  InputNumber,
  List,
  Menu,
  Modal,
  PageHeader,
  Popover,
  Progress,
  Radio,
  Row,
  Slider,
  Space,
  Spin,
  Switch,
  Tabs,
  Tooltip,
  Tree,
  Typography,
  Upload
} from "ant-design-vue"
import "ant-design-vue/dist/antd.dark.less"

// 加载全局样式
import "@/styles/index.less"

const app = createApp(Application)

app.use(mars3dPlugin)

app.use(AutoComplete)
app.use(Row)
app.use(Col)
app.use(Collapse)
app.use(Button)
app.use(List)
app.use(Form)
app.use(Input)
app.use(InputNumber)
app.use(Checkbox)
app.use(Radio)
app.use(Switch)
app.use(Space)
app.use(Slider)
app.use(Tree)
app.use(Upload)
app.use(Progress)
app.use(PageHeader)
app.use(Menu)
app.use(Dropdown)
app.use(Popover)
app.use(Spin)
app.use(Modal)
app.use(Typography)
app.use(Tabs)
app.use(Tooltip)

app.use(MarsUI)

iconInstall(app)

// 设置自适应高度指令
app.directive("auto-height", {
  mounted(el, binding) {
    const container = document.getElementById("sanbox-warpper")
    const loseHeight = binding.value || 0
    let wapperHeight = container?.clientHeight || 0
    el.style.height = `${wapperHeight - loseHeight}px`

    window.onresize = () => {
      wapperHeight = container?.clientHeight || 0
      const resizeHeight = wapperHeight - loseHeight
      el.style.height = `${resizeHeight}px`
    }
  }
})

app.mount("#app")
