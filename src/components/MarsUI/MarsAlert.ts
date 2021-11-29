import { Modal } from "ant-design-vue"
import { App } from "vue"

/**
 * alert弹窗
 *
 * @copyright 火星科技 mars3d.cn
 * @author 木遥 2021-11-01
 */
export default function (app: App): void {
  window.$alert = app.config.globalProperties.$alert = (content: any, title = "提示", type: keyof typeof Modal = "info") => {
    if (Modal[type] && typeof Modal[type] === "function") {
      return new Promise((resolve, reject) => {
        const func = Modal[type] as (a: any) => any
        func({
          title,
          content,
          okType: "default",
          okText: "确定",
          class: "global-alert",
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
}
