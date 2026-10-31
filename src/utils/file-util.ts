/**
 * 文件处理相关 静态Util方法
 *
 * @copyright mars3d.cn
 * @author 木遥 2022-01-01
 */
import { toKml } from "kml-geojson"
import { createApp } from "vue"

export function saveJSON(data: any[]) {
  if (data == null || !data) {
    alert("当前未标记任何数据！")
  } else {
    const strData = JSON.stringify(data)

    const aLink = document.createElement("a")
    aLink.download = "我的标记点.json"
    const blob = new Blob([strData])
    aLink.href = URL.createObjectURL(blob)
    document.body.appendChild(aLink)
    aLink.click()
    document.body.removeChild(aLink)
    URL.revokeObjectURL(aLink.href)
  }
}

/**
 * 读取json文件内容
 *
 * @template T 返回的数据类型
 * @param {*} file 文件选择框选择的文件对象
 * @return {*}  {Promise<T>}
 */
export function readJSON<T>(file: Blob & { name?: string }): Promise<T> {
  return new Promise((resolve, reject) => {
    const fileName = file?.name || ""
    const fileType = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase()
    if (fileType !== "json") {
      const message = "文件类型不合法,请选择json格式标注文件！"
      alert(message)
      reject(new Error(message))
      return
    }

    if (!window.FileReader) {
      reject(new Error("当前浏览器不支持读取本地文件"))
      return
    }

    const reader = new FileReader()
    reader.onerror = () => {
      reject(reader.error || new Error("读取文件失败"))
    }
    reader.onloadend = () => {
      try {
        resolve(JSON.parse(String(reader.result)) as T)
      } catch (error) {
        reject(error)
      }
    }
    reader.readAsText(file, "UTF-8")
  })
}

export function saveGeoJSON2Kml(geojson: object, options: any): any {
  const kml = toKml(geojson, {
    name: "Mars3D标绘数据",
    documentName: "Mars3D标绘数据文件",
    documentDescription: "标绘数据 by mars3d.cn",
    simplestyle: true,
    ...options
  })
  return kml
}

/**
 * Vue3组件示例化为Popup的DOM
 *
 * @param {*} comp 传入的vue组件
 * @param {*} para 传入的vue组件的参数
 * @return {*}  HTMLElement
 */
export function initVue3Popup(comp, para) {
  const vNodeDom = document.createElement("div")
  document.body.appendChild(vNodeDom)

  const vNode = createApp(comp, { ...para }) // vue2中可使用extend
  vNode.mount(vNodeDom)
  return vNode._container
}
