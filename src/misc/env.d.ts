/// <reference types="vite/client" />

declare module "*.vue" {
  import { DefineComponent } from "vue"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module "nprogress" {
  const nprogress: any
  export default nprogress
}

declare module "uuid" {
  export const v4: any
}

declare module "mapv" {
  export const geojson: any
  export const DataSet: any
  export const utilCityCenter: any
  export const utilCurve: any
}

declare module "kml-geojson" {
  const kg: (...args: any[]) => any
  export default kg
}

// declare module "*.png" {
//   const png: string
//   export default png
// }
