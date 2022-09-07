/**
 * 统一导出公共组件, 按需初始化ant-design-vue
 * @copyright 火星科技 mars3d.cn
 * @author 木遥 2022-01-01
 */
import { App } from "vue"
import MarsSelect from "./mars-select/index.vue"
import MarsButton from "./mars-button/index.vue"
import MarsInput from "./mars-input/index.vue"
import MarsTextarea from "./mars-textarea/index.vue"
import MarsInputNumber from "./mars-input-number/index.vue"
import MarsInputGroup from "./mars-input-group/index.vue"
import MarsDatePicker from "./mars-date-picker/index.vue"
import MarsRangePicker from "./mars-range-picker/index.vue"
import MarsColorPicker from "./mars-color-picker"
import MarsColor from "./mars-color/index.vue"
import MarsIcon from "./mars-icon/index.vue"
import MarsSwitch from "./mars-switch/index.vue"
import MarsDialog from "./mars-dialog/index.vue"
import MarsSlider from "./mars-slider/index.vue"
import MarsDropDown from "./mars-dropdown"
import MarsGui from "./mars-gui/index.vue"
import MarsTable from "./mars-table/index.vue"

import MarsMessage, { $message as marsMessage } from "./mars-message"
import MarsAlert, { $alert as marsAlert } from "./mars-alert/"
import MarsNotify, { $notify as marsNotify } from "./mars-notify"
import MarsLoading, { $hideLoading as marsHideLoading, $showLoading as marsShowLoading } from "./mars-loading"
import MarsTree from "./mars-tree"
import MarsMenu from "./mars-menu"
import MarsSteps from "./mars-steps"
import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Collapse,
  Divider,
  Dropdown,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  List,
  Menu,
  Modal,
  PageHeader,
  Popover,
  Progress,
  Pagination,
  Radio,
  Row,
  Slider,
  Space,
  Spin,
  Switch,
  Table,
  Tabs,
  Tooltip,
  Tree,
  Typography,
  Upload,
  Card,
  Image,
  Empty
} from "ant-design-vue"

import "./mars-echarts"
import "./themes"
import "./index.less"
import "./function.less"

export const $alert = marsAlert
export const $notify = marsNotify
export const $message = marsMessage
export const $hideLoading = marsHideLoading
export const $showLoading = marsShowLoading

const components = [
  MarsSelect,
  MarsButton,
  MarsInput,
  MarsInputGroup,
  MarsInputNumber,
  MarsDatePicker,
  MarsRangePicker,
  MarsColorPicker,
  MarsTree,
  MarsDropDown,
  MarsIcon,
  MarsDialog,
  MarsTextarea,
  MarsSwitch,
  MarsSlider,
  MarsGui,
  MarsTable,
  MarsColor
]

let marsUIConfig: Record<string, any>

export const getConfig = () => {
  return marsUIConfig
}

export default function (app: App, config: Record<string, any> = {}): App {
  marsUIConfig = config
  app.use(AutoComplete)
  app.use(Row)
  app.use(Cascader)
  app.use(Col)
  app.use(Collapse)
  app.use(Button)
  app.use(Select)
  app.use(List)
  app.use(Form)
  app.use(Input)
  app.use(InputNumber)
  app.use(DatePicker)
  app.use(Dropdown)
  app.use(Checkbox)
  app.use(Radio)
  app.use(Switch)
  app.use(Space)
  app.use(Slider)
  app.use(Table)
  app.use(Tree)
  app.use(Upload)
  app.use(Progress)
  app.use(PageHeader)
  app.use(Menu)
  app.use(Popover)
  app.use(Spin)
  app.use(Modal)
  app.use(Typography)
  app.use(Tabs)
  app.use(Tooltip)
  app.use(Divider)
  app.use(Card)
  app.use(Image)
  app.use(Pagination)
  app.use(Table)
  app.use(Empty)

  app.use(MarsMenu)
  app.use(MarsSteps)

  components.forEach((comp) => {
    app.component(comp.name, comp)
  })
  MarsMessage(app)
  MarsAlert(app)
  MarsNotify(app)
  MarsLoading(app)
  return app
}
