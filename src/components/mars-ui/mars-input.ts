import { Input } from "ant-design-vue"
import { App, defineComponent, h } from "vue"

/**
 * input输入框
 *
 * @copyright 火星科技 mars3d.cn
 * @author 木遥 2021-11-01
 */
const MarsInput = defineComponent({
  name: "mars-input",
  inheritAttrs: false,
  setup (props, context) {
    return () => h(Input, { ...context.attrs, ...props }, context.slots)
  }
})

export function install (app: App): App {
  app.component(MarsInput.name, MarsInput)
  return app
}
export default MarsInput
