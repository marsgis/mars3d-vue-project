<template>
  <teleport to="#mars-main-view">
    <div class="pannel-model" :class="[customClass, animationClass]" ref="pannelBox" v-show="mergeProps.visible">
      <div ref="modelHeader" class="pannel-model__header" @mousedown="mousedown">
        <span class="icon">
          <slot name="icon"></slot>
        </span>
        <span class="title">{{ mergeProps.title }}</span>
        <mars-icon icon="close" :width="18" @click="closeModel" class="close-btn"></mars-icon>
      </div>
      <div class="pannel-model__body">
        <div class="content" :class="{ 'full-content': !$slots.footer }">
          <slot></slot>
        </div>
        <div class="footer" v-if="$slots.footer">
          <div class="footer-content">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
      <div v-for="handle in actualHandles" :key="handle" class="handle" :class="['handle-' + handle]" @mousedown="handleDown(handle, $event)">
        <slot :name="handle"></slot>
      </div>
    </div>
  </teleport>
</template>
<script lang="ts" setup>
/**
 * dislog弹框
 * @copyright 火星科技 mars3d.cn
 * @author 火星吴彦祖 2022-02-19
 */
import { computed, onMounted, onUnmounted, ref } from "vue"
import { getConfig } from "../index"

const CONFIG = getConfig()
let globalConfig: Record<string, any> = {}
if (CONFIG.dialog) {
  globalConfig = CONFIG.dialog
}

interface Position {
  left?: number | string // 定位 left值
  right?: number | string // 定位right值
  top?: number | string // 定位top值
  bottom?: number | string // 定位bottom值
}

interface Props {
  warpper?: string // 容器id 默认是app，将作为定位的参照元素，一般不需要修改
  title?: string // 弹框标题
  visible?: boolean // 是否显示
  width?: number | string // 初始宽度
  height?: number | string // 初始高度

  left?: number | string // 定位 left值
  right?: number | string // 定位right值
  top?: number | string // 定位top值
  bottom?: number | string // 定位bottom值
  position?: Position // 统一设置位置属性，优先级高于 left right top bottom

  handles?: boolean | string // 缩放控制器 默认 [x, y, xy]
  minWidth?: number // 最小宽度
  minHeight?: number // 最小高度
  maxWidth?: number // 最大宽度
  maxHeight?: number // 最大高度
  zIndex?: number // 层级
  customClass?: string // 自定义class
}
const props = withDefaults(defineProps<Props>(), {
  warpper: "mars-main-view",
  title: "",
  visible: false,
  width: 200,
  handles: true,
  minWidth: 100,
  minHeight: 100,
  maxWidth: 1000,
  maxHeight: 1000,
  zIndex: 900
})

const mergeProps = computed(() => {
  const newProps: Props = {}

  for (const k in props) {
    if (props[k] === undefined) {
      newProps[k] = globalConfig[k]
    } else {
      newProps[k] = props[k]
    }
  }

  if (newProps.position) {
    newProps.left = newProps.position.left
    newProps.right = newProps.position.right
    newProps.top = newProps.position.top
    newProps.bottom = newProps.position.bottom
  }
  return newProps
})

const animationClass = computed(() => {
  const right = getCssNumber(mergeProps.value.right)
  if (right && right >= 0 && right < 100) {
    return "fadein-right"
  }
  const left = getCssNumber(mergeProps.value.left)
  if (left || (left >= 0 && left < 100)) {
    return "fadein-left"
  }
  const top = getCssNumber(mergeProps.value.top)
  if (left || (top >= 0 && top < 100)) {
    return "fadein-down"
  }
  const bottom = getCssNumber(mergeProps.value.bottom)
  if (bottom || (bottom >= 0 && bottom < 100)) {
    return "fadein-up"
  }
  return "fadein-center"
})

function getCssNumber(value: number | string) {
  if (typeof value === "number") {
    return value
  }
  if (typeof value === "string") {
    if (/^[0-9]*$/.test(value)) {
      return Number(value)
    }
    if (value.endsWith("px")) {
      value = value.replace("px", "")
      return Number(value)
    }
  }
  return null
}

const emits = defineEmits(["update:visible", "resize", "move"])

const pannelBox = ref()

onMounted(() => {
  initSize()
  initPosition()

  addEvent(window, "resize", resize)
})
onUnmounted(() => {
  removeEvent(window, "resize", resize)
})

const closeModel = () => {
  emits("update:visible", false)
}

// 初始化位置
function initPosition() {
  const pannelStyle = pannelBox.value.style
  // 层级位置
  pannelStyle.zIndex = mergeProps.value.zIndex
  // 横向位置初始化
  if (mergeProps.value.left !== undefined) {
    pannelStyle.left = antoUnit(mergeProps.value.left)
  } else if (mergeProps.value.right !== undefined) {
    pannelStyle.right = antoUnit(mergeProps.value.right)
    pannelStyle.left = "initial"
  }
  // 纵向位置初始化
  if (mergeProps.value.top !== undefined) {
    pannelStyle.top = antoUnit(mergeProps.value.top)
  } else if (mergeProps.value.height === undefined) {
    pannelStyle.top = antoUnit(0)
  }
  if (mergeProps.value.bottom !== undefined) {
    pannelStyle.bottom = antoUnit(mergeProps.value.bottom)
  }
}

// 初始化大小
function initSize() {
  const pannelStyle = pannelBox.value.style
  if (mergeProps.value.width) {
    pannelStyle.width = antoUnit(mergeProps.value.width)
  }
  if (!mergeProps.value.top || !mergeProps.value.bottom) {
    if (mergeProps.value.height) {
      pannelStyle.height = antoUnit(mergeProps.value.height)
    }
  }
}

// 处理窗口缩放
function resize() {
  const pb = pannelBox.value
  const warpper = document.getElementById(mergeProps.value.warpper)
  if (!warpper) {
    return
  }

  if (pb.offsetTop + pb.offsetHeight > warpper.offsetHeight) {
    pb.style.height = antoUnit(Math.max(warpper.offsetHeight - pb.offsetTop, mergeProps.value.minHeight))
  }
  if (pb.offsetLeft + pb.offsetWidth > warpper.offsetWidth) {
    pb.style.width = antoUnit(Math.max(warpper.offsetWidth - pb.offsetLeft, mergeProps.value.minWidth))
  }
}

// 处理传入的单位问题
function antoUnit(value: number | string) {
  if (typeof value === "number" || (typeof value === "string" && /^[0-9]*$/.test(value))) {
    return `${value}px`
  } else {
    return value
  }
}

// 移动窗口
function mousedown(event: any) {
  const warpper = document.getElementById(mergeProps.value.warpper)
  if (!warpper) {
    return
  }

  const pb = pannelBox.value
  const x = event.clientX
  const y = event.clientY
  const bl = pb.offsetLeft
  const bt = pb.offsetTop
  const maxLeft = warpper.offsetWidth - pb.offsetWidth
  const maxTop = warpper.offsetHeight - pb.offsetHeight

  pb.style.height = antoUnit(pb.offsetHeight) // 处理没有height的情况

  addEvent(document.documentElement, "mousemove", toPointerPosition)
  addEvent(document.documentElement, "mouseup", handleUp)

  function toPointerPosition(e: any) {
    e.preventDefault()
    const distanceX = e.clientX - x
    const distanceY = e.clientY - y
    const left = bl + distanceX
    const top = bt + distanceY
    if (mergeProps.value.top && mergeProps.value.bottom) {
      pb.style.height = antoUnit(pb.offsetHeight)
      pb.style.bottom = "initial"
    }

    const xPos = Math.min(Math.max(0, left), maxLeft)
    const yPos = Math.min(Math.max(0, top), maxTop)
    pb.style.left = `${xPos}px`
    pb.style.top = `${yPos}px`

    emits("move", { x: xPos, y: yPos })
  }

  function handleUp(e: any) {
    e.preventDefault()
    removeEvent(document.documentElement, "mousemove", toPointerPosition)
    removeEvent(document.documentElement, "mouseup", handleUp)
  }
}

// 拖拽缩放
const defaultHandles = ["x", "y", "xy"]
let handleName = ""
const actualHandles = computed<string[]>(() => {
  if (!mergeProps.value.handles) {
    return []
  }
  if (typeof mergeProps.value.handles === "string") {
    return mergeProps.value.handles.split("")
  }
  return defaultHandles
})

// 处理自定义缩放
function handleDown(handle: string, event: any) {
  handleName = handle
  const x = event.clientX
  const y = event.clientY
  const bw = pannelBox.value!.offsetWidth || 0
  const bh = pannelBox.value!.offsetHeight || 0

  addEvent(document.documentElement, "mousemove", handleMove)
  addEvent(document.documentElement, "mouseup", handleUp)

  function handleMove(e: any) {
    e.preventDefault()
    let width = 0
    let height = 0
    if (handleName.indexOf("x") !== -1) {
      width = Math.min(Math.max(mergeProps.value.minWidth, bw + e.clientX - x, 0), mergeProps.value.maxWidth)
      pannelBox.value.style.width = `${width}px`
    }
    if (handleName.indexOf("y") !== -1) {
      height = Math.min(Math.max(mergeProps.value.minHeight, bh + e.clientY - y, 0), mergeProps.value.maxHeight)
      pannelBox.value.style.height = `${height}px`
    }

    emits("resize", { width, height })
  }

  function handleUp(e: any) {
    e.preventDefault()
    removeEvent(document.documentElement, "mousemove", handleMove)
    removeEvent(document.documentElement, "mouseup", handleUp)
  }
}
// 事件绑定处理
function addEvent(el: any, event: any, handler: (e: any) => void) {
  if (!el) {
    return
  }
  if (el.attachEvent) {
    el.attachEvent(`on${event}`, handler)
  } else if (el.addEventListener) {
    el.addEventListener(event, handler)
  } else {
    el[`on${event}`] = handler
  }
}
// 事件解除绑定
function removeEvent(el: any, event: any, handler: (e: any) => void) {
  if (!el) {
    return
  }
  if (el.detachEvent) {
    el.detachEvent(`on${event}`, handler)
  } else if (el.removeEventListener) {
    el.removeEventListener(event, handler)
  } else {
    el[`on${event}`] = null
  }
}
</script>
<script lang="ts">
export default {
  name: "mars-dialog"
}
</script>

<style lang="less" scoped>
.pannel-model {
  position: absolute;
  padding: 0;
  border-radius: 4px;
  z-index: 100;
  border-bottom: 1px solid #008aff70;
  border-left: 1px solid #008aff70;
  border-right: 1px solid #008aff70;
  z-index: 100;
  background: linear-gradient(to left, @mars-content-color, @mars-content-color) left bottom no-repeat,
    linear-gradient(to bottom, @mars-content-color, @mars-content-color) left bottom no-repeat,
    linear-gradient(to left, @mars-content-color, @mars-content-color) right bottom no-repeat,
    linear-gradient(to left, @mars-content-color, @mars-content-color) right bottom no-repeat;
  background-size: 1px 10px, 10px 1px, 1px 10px, 10px 1px;
  background-color: @mars-bg-base;
}
.pannel-model__header {
  height: 44px;
  line-height: 44px;
  cursor: move;
  overflow: hidden;
  padding: 0 5px 0px 15px;
  background-image: url(../assets/images/dialog-title.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  color: @mars-base-color;
  .icon {
    vertical-align: middle;
    margin-right: 5px;
  }
  .title {
    font-size: 16px;
  }
  .close-btn {
    float: right;
    cursor: pointer;
    font-size: 16px;
    margin-top: 2px;
  }
}

.pannel-model__body {
  width: 100%;
  height: calc(100% - 40px);
  padding: 10px;
  overflow: hidden;
}
.content {
  height: calc(100% - 40px);
  overflow-y: auto;
}
.full-content {
  height: 100%;
}
.footer {
  height: 40px;
  .footer-content {
    height: 40px;
    width: 100%;
    padding-left: 10px;
    padding-right: 10px;
    position: absolute;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    background: @mars-bg-base;
  }
}

.active {
  touch-action: none;
  z-index: 999 !important;
}
.handle {
  box-sizing: border-box;
  position: absolute;
  z-index: 1;
  width: 10px;
  height: 10px;
  opacity: 0;
}
.handle-x {
  height: auto;
  top: 10px;
  right: 0;
  bottom: 10px;
  cursor: e-resize;
}
.handle-y {
  width: auto;
  bottom: 0;
  left: 10px;
  right: 10px;
  cursor: s-resize;
}
.handle-xy {
  bottom: 0;
  right: 0;
  cursor: se-resize;
}
@media only screen and (max-width: 768px) {
  [class*="handle-"]:before {
    content: "";
    left: -10px;
    right: -10px;
    bottom: -10px;
    top: -10px;
    position: absolute;
  }
}

/**下面是 5个 动画 */
@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  to {
    opacity: 1;
    transform: none;
  }
}
.fadein-right {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation-name: fadeInRight;
  animation-name: fadeInRight;
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }

  to {
    opacity: 1;
    transform: none;
  }
}
.fadein-left {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation-name: fadeInLeft;
  animation-name: fadeInLeft;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}

.fadein-up {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation-name: fadeInUp;
  animation-name: fadeInUp;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}
.fadein-down {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation-name: fadeInDown;
  animation-name: fadeInDown;
}

@keyframes fadeInCenter {
  from {
    opacity: 0;
    transform: scale(0.1);
  }

  to {
    opacity: 1;
    transform: none;
  }
}
.fadein-center {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation-name: fadeInCenter;
  animation-name: fadeInCenter;
}
</style>
