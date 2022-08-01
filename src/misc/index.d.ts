/**
 * ts下为window定义全局变量
 * @copyright 火星科技 mars3d.cn
 * @author 木遥 2022-01-01
 */

export {}
declare global {
  interface Window {
    buildTime: Date // 打包时间
    toolBarMenuData:any
  }
}
