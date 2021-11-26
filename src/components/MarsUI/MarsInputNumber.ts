import { InputNumber } from "ant-design-vue"
import { App, defineComponent, h } from "vue"


/**
 * 数字输入框
 *
 * @copyright 火星科技 mars3d.cn
 * @author 木遥 2021-11-01
 */

const MarsInputNumber = defineComponent({
  name: "mars-input-number",
  inheritAttrs: false,
  setup (props, context) {
    return () => h(InputNumber, { ...context.attrs, ...props }, context.slots)
  }
})

export function install (app: App): App {
  app.component(MarsInputNumber.name, MarsInputNumber)
  return app
}
export default MarsInputNumber
