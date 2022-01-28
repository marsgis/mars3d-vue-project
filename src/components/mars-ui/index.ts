/**
 * 统一导出公共组件, 按需初始化ant-design-vue
 * @copyright 火星科技 mars3d.cn
 * @author 木遥 2021-11-01
 */
import { App } from "vue"
import MarsSelect from "./mars-select"
import MarsButton from "./mars-button"
import MarsInput from "./mars-input"
import MarsInputNumber from "./mars-input-number"
import MarsDatePicker from "./mars-date-picker"
import MarsColorPicker from "./mars-color-picker"
import MarsDropDown from "./mars-dropdown"
import MarsMessage, { $message as marsMessage } from "./mars-message"
import MarsAlert, { $alert as marsAlert } from "./mars-alert"
import MarsNotify, { $notify as marsNotify } from "./mars-notify"
import MarsLoading, { $hideLoading as marsHideLoading, $showLoading as marsShowLoading } from "./mars-loading"
import MarsTree from "./mars-tree"

import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Collapse,
  Divider,
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
  Table,
  Tabs,
  Tooltip,
  Tree,
  Typography,
  Upload,
  Card,
  Image
} from "ant-design-vue"

import "./mars-echarts"
import "ant-design-vue/dist/antd.less"

import "./index.less"
import "./base.less"
import "./function.less"

export const $alert = marsAlert
export const $notify = marsNotify
export const $message = marsMessage
export const $hideLoading = marsHideLoading
export const $showLoading = marsShowLoading

const components = [MarsSelect, MarsButton, MarsInput, MarsInputNumber, MarsDatePicker, MarsColorPicker, MarsTree, MarsDropDown]

export default {
  install(app: App): App {
    app.use(AutoComplete)
    app.use(Row)
    app.use(Cascader)
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

    components.forEach((comp) => {
      app.component(comp.name, comp)
    })
    MarsMessage(app)
    MarsAlert(app)
    MarsNotify(app)
    MarsLoading(app)
    return app
  }
}
