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

declare module "@/common/store/index.js" {
  export interface State {
    widgets: any[]
    openAtStart: string[]
    defaultOptions?: DefaultOption
    graphic?: any
  }
  export const injectState: (options: StoreOptions<State>) => Store<State>
}

declare module "kml-geojson" {
  export default (...args: any[]) => any
}
