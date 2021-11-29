/**
 * 统一导出公共组件
 * @copyright 火星科技 mars3d.cn
 * @author 木遥 2021-11-01
 */
import { App } from "vue"
import MarsSelect from "./MarsSelect"
import MarsButton from "./MarsButton"
import MarsInput from "./MarsInput"
import MarsInputNumber from "./MarsInputNumber"
import MarsDatePicker from "./MarsDatePicker"
import MarsColorPicker from "./MarsColorPicker"
import MarsMessage from "./MarsMessage"
import MarsAlert from "./MarsAlert"
import MarsNotify from "./MarsNotify"
import "./base.less"

const components = [MarsSelect, MarsButton, MarsInput, MarsInputNumber, MarsDatePicker, MarsColorPicker]

export default {
  install(app: App): App {
    components.forEach((comp) => {
      app.component(comp.name, comp)
    })
    MarsMessage(app)
    MarsAlert(app)
    MarsNotify(app)
    return app
  }
}
