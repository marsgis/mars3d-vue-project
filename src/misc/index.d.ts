/**
 * ts下为window定义全局变量
 * @copyright 火星科技 mars3d.cn
 * @author 木遥 2021-11-01
 */

export {}
declare global {
  interface Window {
    globalAlert: any
    globalMsg: any
  }
}
