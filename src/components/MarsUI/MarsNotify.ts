import { notification } from "ant-design-vue"
import { App } from "vue"

/**
 * 消息提醒
 *
 * @copyright 火星科技 mars3d.cn
 * @author 木遥 2021-11-01
 */
export default function (app: App): void {
  window.$notify = app.config.globalProperties.$notify = (message: any, description: any, type: keyof typeof notification = "info") => {
    if (notification[type] && typeof notification[type] === "function") {
      return new Promise((resolve, reject) => {
        notification.config({
          placement: "bottomRight",
          duration: undefined
        })
        const func = notification[type] as (a: any) => any
        func({
          message,
          description,
          class: "notify-mesage",
          onClose() {
            resolve(true)
          }
        })
      })
    } else {
      return Promise!.reject()
    }
  }
}
