import { App } from "vue"

const directives: ((app: App) => void)[] = []

importAll(require.context("./", true, /v-.*\.ts$/))

/**
 * 自动安装所有自定义指令
 *
 * @export
 * @param {App} app vue app
 * @returns {void} 无
 * @copyright 火星科技 mars3d.cn
 * @author 火星吴彦祖 2021-11-01
 */
export default function install(app: App): void {
  for (let i = 0; i < directives.length; i++) {
    directives[i](app)
  }
}

function importAll(r: __WebpackModuleApi.RequireContext) {
  r.keys().forEach((key: string) => {
    directives.push(r(key).default)
  })
}
