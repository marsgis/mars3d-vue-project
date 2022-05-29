import { notification } from "ant-design-vue"
import { App } from "vue"
import "./notify.less"

/**
 * 消息提醒
 * @export
 * @param {App} app vue实例
 * @copyright 火星科技 mars3d.cn
 * @author 木遥 2022-01-01
 * @returns { void }
 */
export const $notify = (message: any, description: any, options: any = {}, type: keyof typeof notification = "info") => {
  if (notification[type] && typeof notification[type] === "function") {
    return new Promise((resolve) => {
      notification.config({
        placement: "bottomRight",
        right: 10,
        bottom: 40,
        duration: 10,
        ...options
      })
      const func = notification[type] as (a: any) => any
      func({
        message,
        icon: () => null,
        description,
        class: "mars-notify-message",
        onClose() {
          resolve(true)
        }
      })
    })
  } else {
    return Promise!.reject()
  }
}
export default function (app: App): void {
  app.config.globalProperties.$notify = $notify
}
