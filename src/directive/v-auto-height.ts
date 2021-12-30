import { App } from "vue"
/**
 * 自定义指令：自动设置元素高度
 *
 * @export
 * @param {App} app vue app
 * @returns {void} 无
 * @copyright 火星科技 mars3d.cn
 * @author 火星吴彦祖 2021-11-01
 */
export default function install(app: App): void {
  app.directive("auto-height", {
    mounted(el, binding) {
      const container = document.getElementById("sanbox-warpper")
      const loseHeight = binding.value || 0
      let wapperHeight = container?.clientHeight || 0
      el.style.height = `${wapperHeight - loseHeight}px`

      window.onresize = () => {
        wapperHeight = container?.clientHeight || 0
        const resizeHeight = wapperHeight - loseHeight
        el.style.height = `${resizeHeight}px`
      }
    }
  })
}
