
/**
 * 读取json文件内容 
 *
 * @template T 返回的数据类型
 * @param {*} file 文件选择框选择的文件对象
 * @return {*}  {Promise<T>} 
 */
export function readJSON<T>(file: any): Promise<T> {
  return new Promise((resolve) => {
    const fileName = file.name
    const fileType = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase()
    if (fileType !== "json") {
      alert("文件类型不合法,请选择json格式标注文件！")
      return
    }

    if (window.FileReader) {
      const reader = new FileReader()
      reader.readAsText(file, "UTF-8")
      reader.onloadend = function () {
        resolve(JSON.parse(this.result as string))
      }
    }
  })
}


function clone(obj: any, removeKeys: any, level: any): any {
  // 避免死循环，拷贝的层级最大深度
  if (level == null) {
    level = 9
  }
  if (removeKeys == null) {
    removeKeys = ["_layer"]
  }

  if (obj === null || typeof obj !== "object") {
    return obj
  }

  // Handle Date
  if (isDate(obj)) {
    const copy = new Date()
    copy.setTime(obj.getTime())
    return copy
  }

  // Handle Array
  if (isArray(obj) && level >= 0) {
    const copy = []
    for (let i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i], removeKeys, level - 1)
    }
    return copy
  }

  // Handle Object
  if (typeof obj === "object" && level >= 0) {
    try {
      const copy: any = {}
      for (const attr in obj) {
        if (typeof attr === "function") {
          continue
        }
        if (removeKeys.indexOf(attr) !== -1) {
          continue
        }

        if (obj.hasOwnProperty(attr)) {
          copy[attr] = clone(obj[attr], removeKeys, level - 1)
        }
      }
      return copy
    } catch (e) {
      console.log(e)
    }
  }
  return obj
}
function isArray(obj: any) {
  if (typeof Array.isArray === "function") {
    return Array.isArray(obj)
  } else {
    return Object.prototype.toString.call(obj) === "[object Array]"
  }
}
function isDate(obj: any) {
  return typeof obj === "object" && obj.constructor === Date
}
