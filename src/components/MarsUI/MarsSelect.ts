import { Select } from "ant-design-vue"
import { App, defineComponent, h } from "vue"

/**
 * 下拉选择控件
 *
 * @copyright 火星科技 mars3d.cn
 * @author 木遥 2021-11-01
 */

const MarsSesect = defineComponent({
  name: "mars-select",
  inheritAttrs: false,
  setup (props, context) {
    return () => h(Select, { ...context.attrs, ...props }, context.slots)
  }
})

export function install (app: App): App {
  app.component(MarsSesect.name, MarsSesect)
  return app
}
export default MarsSesect
