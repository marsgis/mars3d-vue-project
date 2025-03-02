/**
 * 项目内通用 静态Util方法
 *
 * @copyright 火星科技 mars3d.cn
 * @author 木遥 2022-01-01
 */
import axios from "axios"
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
 * @param {string} [defaultVal] 默认值
 * @return {string | null}  参数值
 */
export function getQueryString(parameter: string, defaultVal?: string): string | null {
  return new URL(window.location.href).searchParams.get(parameter) ?? defaultVal
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

/**
 * 请求服务返回JSON结果
 *
 * @param {object} options 请求参数
 * @param {string} options.url 服务URL地址
 * @return {Promise<object>} 返回Promise异步处理结果，对象为JSON数据
 */
export async function fetchJson(options) {
  const result: any = await axios.get(options.url, options)
  return result.data
}


// @ts-ignore 需要开启时请F12控制台执行：window.devProject()
window.devProject = function (open = true) {
  localStorage.setItem("project-debugger", open ? "1" : "0")
}

// 是否打印开发日志
const hasWriteLog = localStorage.getItem("project-debugger") === "1"
mars3d.Log.hasInfo(hasWriteLog)

// 打印普通日志信息,方便开发调试
export function logInfo(...sources) {
  if (!hasWriteLog) {
    return
  }

  // eslint-disable-next-line no-console
  console.log("%c %s", "padding: 2px 1px; border-radius: 3px 0 0 3px; color: #fff; background: rgba(17, 106, 48, 0.85);", ...sources)
}

// 打印警告日志信息,方便开发调试
export function logWarn(...sources) {
  if (!hasWriteLog) {
    return
  }

  // eslint-disable-next-line no-console
  console.log(
    "%c %s",
    "padding: 2px 1px; border-radius: 0 3px 3px 0; color: #fff; background: rgba(181, 27, 29, 0.8); font-weight: bold;",
    ...sources
  )
}

export const aloneTypeStyle = {
  fixedRoute: [["clockLoop"], "label", "billboard", "point", "model", "circle", "coneTrack", "path", "polyline", "wall"],
  route: [["clockLoop"], "label", "billboard", "point", "model", "circle", "coneTrack", "path", "polyline", "wall"],
  satellite: [["tle1", "tle2"], "model", "label", "billboard", "point", "path"]
}

