/**
 * 组件中开启 map.ts 生命周期
 * @copyright 火星科技 mars3d.cn
 * @author 火星渣渣灰 2022-02-19
 */
import { inject, onBeforeMount, onBeforeUnmount } from "vue"

export default function useLifecycle(mapWork: any, params?:any): void {
  const getMapInstance = inject<any>("getMapInstance")
  onBeforeMount(() => {
    if (mapWork.onMounted) {
      const map = getMapInstance()
      mapWork.onMounted(map, params)
    }
  })
  onBeforeUnmount(() => {
    if (mapWork.onUnmounted) {
      mapWork.onUnmounted()
    }
  })
}
