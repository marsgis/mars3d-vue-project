import { message } from "ant-design-vue"
import { App } from "vue"

/**
 * message 信息弹窗
 *
 * @copyright 火星科技 mars3d.cn
 * @author 木遥 2021-11-01
 */
export default function (app: App): void {
  message.config({
    top: `100px`
  })
  window.$message = app.config.globalProperties.$message = (msg: string, type: keyof typeof message = "info") => {
    if (message[type] && typeof message[type] === "function") {
      const func = message[type] as (a: string) => Promise<any>
      return func(msg)
    } else {
      return Promise!.reject()
    }
  }
}
