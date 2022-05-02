/**
 * 项目内通用 静态Util方法
 *
 * @copyright 火星科技 mars3d.cn
 * @author 木遥 2022-01-01
 */
import * as mars3d from "mars3d"

/**
 * 判断是否 "经度,纬度" 字符串值
 *
 * @export
 * @param {string} text 传入的字符串
 * @return {boolean} 是否 经度,纬度
 */
export function isLonLat(text: string): boolean {
  const reg = /^-?((0|1?[0-7]?[0-9]?)(([.][0-9]*)?)|180(([.][0]*)?)),-?((0|[1-8]?[0-9]?)(([.][0-9]*)?)|90(([.][0]*)?))$/
  return reg.test(text)
}

/**
 * 设置自动高度值
 * @param {function} callback 窗口大小变化时的回调,返回当前计算完成的高度
 * @param {number} [lose=0] 窗口高度基础上减少的值
 * @param {string} [container="sanbox-warpper"] 窗口id
 * @return {void}
 */
export function setAutoHeight(callback: (v: number) => void, lose = 0, container = "sanbox-warpper"): void {
  const wapper = document.getElementById(container) || document.body

  let wapperHeight = wapper?.clientHeight || 0
  const result = wapperHeight - lose
  callback(result)

  const resize = () => {
    wapperHeight = wapper?.clientHeight || 0
    const resizeHeight = wapperHeight - lose
    callback(resizeHeight)
  }

  window.addEventListener("resize", resize)

  resize()
  // return () => {
  //   window.removeEventListener("resize", resize)
  // }
}

/**
 *  获取URL参数
 *
 * @export
 * @param {string} parameter url值
 * @return {string | null}  参数值
 */
export function getQueryString(parameter: string): string | null {
  return new URL(window.location.href).searchParams.get(parameter)
}


/**
 * 将指定的异步方法转为Promise
 *
 * @param {*} context
 * @param {string} apiName
 * @param {string} [success="success"]
 * @param {string} [error="error"]
 * @return {*} Promise
 */
export function apiToSync(context: any, apiName: string, success = "success", error = "error") {
  return apiArrayToSync(context, [apiName], success, error)[0]
}

/**
 * 将指定的多个异步方法转为Promise
 *
 * @param {*} context
 * @param {string[]} apiNames
 * @param {string} [success="success"]
 * @param {string} [error="error"]
 * @return {*} Promise[]
 */
export function apiArrayToSync(context: any, apiNames: string[], success = "success", error = "error") {
  return apiNames.map((name) => {
    const apiFunc = context[name]

    return (options: any) =>
      new Promise((resolve, reject) => {
        options[success] = function (result: any) {
          resolve(result)
        }
        options[error] = function (error) {
          reject(error)
        }
        // console.log("zhix", options)
        apiFunc.call(context, options)
      })
  })
}

/**
 * 地图打印，连接打印机，设置参数
 *
 * @param {*} base64 map.expImage方法的回调函数参数
 */
export function printImage(base64: any) {
  const iframe: HTMLIFrameElement = mars3d.DomUtil.create("iframe", "", document.body)
  let doc = null
  iframe.setAttribute("style", "position:absolute;width:0px;height:0px;left:-500px;top:-500px;")
  document.body.appendChild(iframe)
  doc = iframe.contentWindow.document
  doc.write(`<div><img src="${base64}" style="margin:0" /></div>`)
  doc.close()

  iframe.focus()
  iframe.contentWindow.focus()
  setTimeout(() => {
    iframe.contentWindow.print()
    document.body.removeChild(iframe)
  }, 500)
}
