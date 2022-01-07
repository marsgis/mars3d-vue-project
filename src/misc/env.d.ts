/**
 * 统一定义ts模块类型
 * @copyright 火星科技 mars3d.cn
 * @author 木遥 2021-11-01
 */

declare module "*.vue" {
  import { DefineComponent } from "vue"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module "nprogress" {
  export default any
}

declare module "@/components/marsgis/mars-dialog.js" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module "@/components/marsgis/mars-pannel.js" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module "@/common/store/widget.js" {
  export interface WidgetState {
    widgets: any[]
    openAtStart: string[]
    defaultOptions?: DefaultOption
    graphic?: any
  }
  export const injectState: (options: StoreOptions<State>) => Store<State>

  export const key: symbol

  export type Widget = {
    name: string // 唯一标识
    component: any // widget关联的异步组件

    autoDisable?: boolean // 是否能够被自动关闭
    disableOther?: boolean | string[] // 是否自动关闭其他widget,或通过数组指定需要被关闭的widget
    group?: string // group相同的widget一定是互斥的
    visible?: boolean // 显示隐藏
    data?: any // 额外传参 会在每次关闭后清除
    meta?: any // 额外参数 不会在每次关闭后清除
  }

  export const useWidget: () => {
    getWidget : (name: string) => any,
    activate : (params: string | any) => void,
    disable : (name: string) => void
  }

}

declare module "kml-geojson" {
  export default (...args: any[]) => any
}
