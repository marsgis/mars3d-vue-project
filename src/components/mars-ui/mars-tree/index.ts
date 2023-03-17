import { Tree } from "ant-design-vue"
import { App, defineComponent, h } from "vue"
import Icon from "../mars-icon/index.vue"
import "./tree.less"

/**
 * 树控件
 * @copyright 火星科技 mars3d.cn
 * @author 火星渣渣灰 2022-01-01
 */
const MarsTree = defineComponent({
  name: "mars-tree",
  inheritAttrs: false,
  setup(props, context) {
    const icon = (isLeaf: boolean, expanded: boolean, group: boolean) => {
      if (isLeaf && !group) {
        return [
          h(Icon, {
            icon: "notes",
            width: "14",
            color: "#79C1F8",
            theme: "outline",
            key: new Date().getTime()
          })
        ]
      } else if (!expanded) {
        return [h(Icon, { icon: "folder-close", width: "14", color: "#db9829", theme: "filled", key: new Date().getTime() })]
      } else if (expanded) {
        return [h(Icon, { icon: "folder-open", width: "14", color: "#db9829", theme: "filled", key: new Date().getTime() })]
      }
    }
    return () =>
      h(
        Tree,
        {
          showIcon: true,
          showLine: true,
          ...context.attrs,
          ...props
        },
        {
          icon: ({ isLeaf, expanded, data }: any) => h("span", null, icon(isLeaf, expanded, data.group)),
          ...context.slots
        }
      )
  }
})

export function install(app: App): App {
  app.component(MarsTree.name, MarsTree)
  return app
}
export default MarsTree
