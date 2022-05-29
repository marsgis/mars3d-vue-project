import { Modal } from "ant-design-vue"
import { App } from "vue"
import "./alert.less"

/**
 * alert弹窗
 * @export
 * @param {App} app vue实例
 * @copyright 火星科技 mars3d.cn
 * @author 木遥 2022-01-01
 * @returns { void }
 */
export const $alert = (content: any, title = "提示", type: keyof typeof Modal = "info") => {
  if (Modal[type] && typeof Modal[type] === "function") {
    return new Promise((resolve, reject) => {
      const func = Modal[type] as (a: any) => any
      func({
        title,
        content,
        icon: null,
        okType: "default",
        okText: "确定",
        class: "mars-global-alert",
        onOk() {
          resolve(true)
        },
        onCancel() {
          reject(new Error("用户取消"))
        }
      })
    })
  } else {
    return Promise!.reject()
  }
}
export default function (app: App): void {
  app.config.globalProperties.$alert = $alert
}
