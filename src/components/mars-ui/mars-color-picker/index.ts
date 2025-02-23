import { Popover } from "ant-design-vue"
import { ColorPicker } from "vue-color-kit"
import MarsButton from "../mars-button/index.vue"
import { App, defineComponent, h, ref } from "vue"
import "./mars-color-picker.less"

/**
 * 颜色选择器
 *
 * @copyright 火星科技 mars3d.cn
 * @author 木遥 2022-01-01
 */
const MarsColorPicker = defineComponent({
  name: "mars-color-picker",
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      default: "rgba(255,255,255,1)"
    },
    hiddenAlpha: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:value", "change"],
  setup(props, context) {
    let pointColor = props.value || ""
    const oldColor = pointColor
    const visible = ref(false)
    let colorObject: any = null

    const changeColor = (color: any) => {
      pointColor = `rgba(${color.rgba.r},${color.rgba.g},${color.rgba.b},${color.rgba.a})` // color.hex
      colorObject = color

      emitChangeEvent()
    }
    const cancel = () => {
      visible.value = false
      pointColor = oldColor
      emitChangeEvent()
    }
    const choose = () => {
      visible.value = false
      emitChangeEvent()
    }

    let timeTik // 防抖
    const emitChangeEvent = () => {
      clearTimeout(timeTik)
      timeTik = setTimeout(() => {
        context.emit("update:value", pointColor)
        context.emit("change", colorObject)
      }, 50)
    }

    const Buttons = [
      h(
        MarsButton,
        { size: "small", onClick: choose },
        {
          default: () => "确定"
        }
      ),
      h(
        MarsButton,
        { size: "small", class: "ml5", style: { backgroundColor: "var(--mars-disable-color)" }, onClick: cancel },
        {
          default: () => "取消"
        }
      )
    ]

    const content = [
      h(ColorPicker, { suckerHide: true, color: pointColor, onChangeColor: changeColor } as any /* TODO 强制给any类型 */),
      h("div", { class: "mars-color-btns" }, Buttons)
    ]

    return () => h("div", { class: "mars-color-view" }, [h(
      Popover,
      {
        trigger: "click",
        placement: "right",
        overlayClassName: props.hiddenAlpha ? "overlay-className" : "", // 打开的面板样式,隐藏透明度面板
        // overlayClassName: "overlayClassName", // 打开的面板样式,隐藏透明度面板
        open: visible.value,
        "onUpdate:visible": (v: boolean) => {
          visible.value = v
        },
        color: "var(--mars-control-bg)"
      },
      {
        default: () => h("div", { class: "mars-color-picker", style: { backgroundColor: props.value } }),
        content: () => h("div", null, content)
      }
    ),
    h("div", { class: "mars-color-bg" }),
    h("label", { class: "mars-color-label", innerText: props.value })])
  }
})

export function install(app: App): App {
  app.component(MarsColorPicker.name, MarsColorPicker)
  return app
}
export default MarsColorPicker
