/**
 * 组件中通过name获取widget数据
 * @copyright 火星科技 mars3d.cn
 * @author 火星吴彦祖 2021-12-30
 */
import { useStore } from "vuex"

export default function useWidget(name: string): () => any {
  const store = useStore()

  const pannel = store.state.widgets.find((item: any) => item.name === name)

  return () => pannel
}
