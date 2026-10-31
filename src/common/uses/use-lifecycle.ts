/**
 * 组件中开启 map.ts 生命周期
 *
 * 在 widget 的 index.vue 中调用（仅需在 index.vue 调用一次，子组件不需要）：
 * - 组件挂载前：通过注入的 getMapInstance 拿到地图实例，回调 mapWork.onMounted(map, params)
 * - 组件卸载前：回调 mapWork.onUnmounted()，map.ts 中绑定的地图事件/图层应在此钩子内释放
 *
 * @copyright mars3d.cn
 * @author 火星渣渣灰 2022-02-19
 * @param mapWork widget 目录下的 map.ts 模块（约定导出 onMounted/onUnmounted）
 * @param params 透传给 mapWork.onMounted 的额外参数
 */
import { inject, onBeforeMount, onBeforeUnmount } from "vue"

export default function useLifecycle(mapWork: any, params?:any): void {
  const getMapInstance = inject<(() => any) | undefined>("getMapInstance")
  onBeforeMount(() => {
    if (mapWork.onMounted && getMapInstance) {
      const map = getMapInstance()
      if (map) {
        mapWork.onMounted(map, params)
      }
    }
  })
  onBeforeUnmount(() => {
    if (mapWork.onUnmounted) {
      mapWork.onUnmounted()
    }
  })
}
