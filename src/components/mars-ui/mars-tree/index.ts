import { Tree } from "ant-design-vue"
import { App, defineComponent, h } from "vue"
import { FolderClose, FolderOpen, FullSelection } from "@icon-park/vue-next"
import "./tree.less"

/**
 * 树控件
 * @copyright 火星科技 mars3d.cn
 * @author 火星吴彦祖 2021-11-01
 */
const MarsTree = defineComponent({
  name: "mars-tree",
  inheritAttrs: false,
  setup(props, context) {
    const icon = (isLeaf: boolean, expanded: boolean) => {
      if (isLeaf) {
        return [h(FullSelection, { theme: "multi-color", size: "14", fill: ["#FFFFFF", "#4db3ff", "#4db3ff", "#4db3ff"] })]
      } else if (expanded) {
        return [h(FolderOpen, { theme: "filled", size: "14", fill: "#db9829" })]
      } else if (!expanded) {
        return [h(FolderClose, { theme: "multi-color", size: "14", fill: ["#db9829", "#af7920", "#1c222b", "#af7920"] })]
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
          icon: ({ isLeaf, expanded }: any) => h("span", null, icon(isLeaf, expanded)),
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
