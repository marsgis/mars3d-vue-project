<template>
  <teleport :to="mergeProps.warpper">
    <div class="mars-dialog-thumb" v-show="isFold && show" ref="thumbnailRef" @click="toogleFold(false)">
      <mars-icon :icon="mergeProps.thumbnail.icon" :width="20" color="#FFFFFF"></mars-icon>
    </div>
    <div class="mars-dialog" :class="[customClass, animationClass]" ref="dialogRef" v-show="visible && !isFold && show">
      <div v-if="showHeader" class="mars-dialog__header" :style="{ cursor: mergeProps.draggable ? 'move' : 'auto' }" @mousedown="dragStart">
        <mars-icon v-if="mergeProps.icon" :icon="mergeProps.icon" :width="18" color="#41A8FF" class="icon"></mars-icon>
        <slot v-else-if="slots.icon" name="icon"></slot>
        <slot v-if="slots.title" name="title"></slot>
        <span v-else class="title">{{ mergeProps.title }}</span>
        <mars-icon v-if="mergeProps.closeable && mergeProps.closeButton" icon="close" :width="18" class="close-btn" @click="close"></mars-icon>
      </div>

      <mars-icon
        v-else-if="mergeProps.closeable && mergeProps.closeButton"
        icon="close-one"
        :width="18"
        class="close-btn__flot"
        @click="close"
      ></mars-icon>

      <div class="mars-dialog__content" :style="getContentStyle()">
        <slot></slot>
      </div>

      <div v-if="slots.leftBar" class="mars-dialog_leftbar">
        <slot name="leftBar"></slot>
      </div>

      <div v-if="slots.footer" class="mars-dialog__footer">
        <slot name="footer"></slot>
      </div>

      <div
        v-for="handle in actualHandles"
        :key="handle"
        class="mars-dialog__handle"
        :class="['handle-' + handle]"
        @mousedown="resizeStart(handle, $event)"
      ></div>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
/**
 * dialog弹框
 * @copyright 火星科技 mars3d.cn
 * @author 火星渣渣灰 2022-02-19
 */
import { logWarn } from "@mars/utils/mars-util"
import { computed, onMounted, onUnmounted, ref, useSlots, nextTick } from "vue"

const globalConfig: Record<string, any> = {}

interface Position {
  left?: number | string // 定位 left值
  right?: number | string // 定位right值
  top?: number | string // 定位top值
  bottom?: number | string // 定位bottom值
}

interface Props {
  warpper?: string // 容器id 默认是app，将作为定位的参照元素，一般不需要修改
  title?: string // 弹框标题
  visible?: boolean // 是否启用
  show?: boolean // 弹窗是否默认显示

  draggable?: boolean // 是否可拖拽

  closeable?: boolean // 是否可关闭
  closeButton?: boolean // 是否显示关闭按钮

  animation?: string | boolean // 是否开启开场动画，或开场动画的class名

  width?: number | string // 初始宽度
  height?: number | string // 初始高度

  left?: number | string // 定位 left值
  right?: number | string // 定位right值
  top?: number | string // 定位top值
  bottom?: number | string // 定位bottom值
  nopadding?: boolean // 是否存在 padding 值
  position?: Position // 统一设置位置属性，优先级高于 left right top bottom

  handles?: boolean | string // 缩放控制器
  minWidth?: number // 最小宽度
  minHeight?: number // 最小高度
  maxWidth?: number // 最大宽度
  maxHeight?: number // 最大高度
  zIndex?: number // 层级

  icon?: string

  customClass?: string // 自定义class

  defaultFold?: boolean // 是否折叠
  thumbnail?: {
    left?: number | string // 定位 left值
    right?: number | string // 定位right值
    top?: number | string // 定位top值
    bottom?: number | string // 定位bottom值
    icon?: string
  } // 折叠状态下的配置

  beforeClose?: () => Promise<any> | boolean | void
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  show: true,
  nopadding: false,
  closeable: false,
  closeButton: true,
  draggable: true,
  animation: true,
  handles: false,
  defaultFold: false,
  minWidth: 100,
  minHeight: 100,
  maxWidth: window.innerWidth,
  maxHeight: window.innerHeight,
  zIndex: 900
})

const emits = defineEmits(["update:visible", "resize", "move", "closed"])

const slots = useSlots()

const mergeProps = computed(() => {
  const newProps: Record<string, any> = {}

  for (const k in props) {
    if (props[k] === undefined) {
      newProps[k] = globalConfig[k]
    } else {
      newProps[k] = props[k]
    }
  }

  if (!props.warpper) {
    newProps.warpper = globalConfig.warpper || "#mars-main-view"
  }

  if (newProps.position) {
    newProps.left = newProps.position.left
    newProps.right = newProps.position.right
    newProps.top = newProps.position.top
    newProps.bottom = newProps.position.bottom
  }

  // 缩略图
  newProps.thumbnail = newProps.thumbnail ?? {}
  newProps.thumbnail.left = newProps.thumbnail.left ?? newProps.left ?? 10
  newProps.thumbnail.right = newProps.thumbnail.right ?? newProps.right
  newProps.thumbnail.top = newProps.thumbnail.top ?? newProps.top ?? 10
  newProps.thumbnail.bottom = newProps.thumbnail.bottom ?? newProps.bottom
  newProps.thumbnail.icon = newProps.thumbnail.icon ?? newProps.icon ?? "left-expand"

  if (!isAllowValue(newProps.left) && !isAllowValue(newProps.right)) {
    // left right 都不存在时默认出现在左侧
    newProps.right = 10
  }
  if (!isAllowValue(newProps.top) && !isAllowValue(newProps.bottom)) {
    // top bottom 都不存在时默认出现在顶部
    newProps.top = 10
  }

  if (isAllowValue(newProps.closeable) && (slots.title || isAllowValue(newProps.title) || isAllowValue(newProps.icon))) {
    newProps.closeable = true
  }

  if (newProps.draggable) {
    newProps.handles = true
  }

  return newProps
})

const showHeader = computed(() => slots.title || isAllowValue(mergeProps.value.icon) || isAllowValue(mergeProps.value.title))
const getContentStyle = () => {
  const style: any = {}
  style.height = "100%"
  // 头部和脚部各有一个时
  if (showHeader.value) {
    style.height = "calc(100% - 40px)"
    style.borderTopLeftRadius = "0 !important"
    style.borderTopRightRadius = "0 !important"
  }
  if (slots.footer) {
    style.height = "calc(100% - 40px)"
    style.borderBottomLeftRadius = "0 !important"
    style.borderBottomRightRadius = "0 !important"
  }

  // 头部和脚部都有时
  if (showHeader.value && slots.footer) {
    style.height = "calc(100% - 80px)"
    style.paddingBottom = 0
  }

  // 无内边距
  if (mergeProps.value.nopadding) {
    style.padding = "0 !important"
  }
  return style
}

const dialogRef = ref()
const thumbnailRef = ref()
let warpperEle = null

let observeDialog = false // 控制是否自动监听
let hasUserSet = false // 控制是否自动监听

// 处理折叠
const isFold = ref(mergeProps.value.defaultFold)

defineExpose({
  expend() {
    toogleFold(false)
  },
  fold() {
    toogleFold(true)
  },
  toggle() {
    toogleFold(!isFold.value)
  }
})

function toogleFold(status) {
  isFold.value = status
  nextTick(() => {
    if (status) {
      initThumbnail()
    } else if (!hasUserSet) {
      // 用户没有操作过
      initDialog()
    }
  })
}

function initThumbnail() {
  const thOp = mergeProps.value.thumbnail
  thumbnailRef.value.style.right = autoUnit(thOp.right)
  thumbnailRef.value.style.left = autoUnit(thOp.right) ? null : autoUnit(thOp.left) // 为了解决在折叠状态下的位置问题
  thumbnailRef.value.style.bottom = autoUnit(thOp.bottom)
  thumbnailRef.value.style.top = autoUnit(thOp.top)
  thumbnailRef.value.style.width = autoUnit(thOp.width) ?? autoUnit(30) // 为了解决在折叠状态下的弹出框长度问题
  thumbnailRef.value.style.height = autoUnit(thOp.height) ?? autoUnit(30) // 为了解决在折叠状态下的弹出框高度问题

  observeDialog = false
}

// 初始化展示
function initDialog() {
  initSize()
  initPosition()

  // 处理给定top之后的超出的情况
  observeDialog = true
  autoNiceHeight()
}
onMounted(() => {
  warpperEle = document.querySelector(mergeProps.value.warpper)
  if (isFold.value) {
    initThumbnail()
  } else {
    initDialog()
  }
})

// 初始化位置
function initPosition() {
  const pannelStyle = dialogRef.value.style
  // 层级位置
  pannelStyle.zIndex = mergeProps.value.zIndex
  // 横向位置初始化 同时存在优先取left, right 将用来控制宽度
  if (isAllowValue(mergeProps.value.left)) {
    pannelStyle.left = autoUnit(mergeProps.value.left)
  } else if (mergeProps.value.right) {
    pannelStyle.right = autoUnit(mergeProps.value.right)
  }
  // 纵向位置初始化 同时存在优先取top, bottom 将用来控制宽度
  if (isAllowValue(mergeProps.value.top)) {
    pannelStyle.top = autoUnit(mergeProps.value.top)
  } else if (isAllowValue(mergeProps.value.bottom)) {
    pannelStyle.bottom = autoUnit(mergeProps.value.bottom)
  }
}

// 初始化大小
function initSize() {
  let w = null
  let h = null

  // 如果同时存在 left right 则自动计算
  if (isAllowValue(mergeProps.value.left) && isAllowValue(mergeProps.value.right)) {
    w = warpperEle.offsetWidth - mergeProps.value.left - mergeProps.value.right
  } else if (mergeProps.value.width) {
    w = mergeProps.value.width
  }
  setSize("width", w)

  // 如果同时存在 left right 则自动计算
  if (isAllowValue(mergeProps.value.top) && isAllowValue(mergeProps.value.bottom)) {
    h = warpperEle.offsetHeight - mergeProps.value.top - mergeProps.value.bottom
  } else if (mergeProps.value.height) {
    h = mergeProps.value.height
  }
  setSize("height", h)
}

// 开始移动
function dragStart(event: any) {
  if (!warpperEle || !mergeProps.value.draggable) {
    return
  }

  const pb = dialogRef.value
  const x = event.clientX
  const y = event.clientY
  const bl = pb.offsetLeft
  const bt = pb.offsetTop

  bindMouseDrag(toPointerPosition)

  function toPointerPosition(e: any) {
    const distanceX = e.clientX - x
    const distanceY = e.clientY - y
    const left = bl + distanceX
    const top = bt + distanceY

    setPosition("left", left)
    setPosition("top", top)
    emits("move")
  }
}

// 缩放
const defaultHandles = ["l", "r", "t", "b", "lb", "rb"]
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
function resizeStart(handle: string, event: any) {
  handleName = handle
  const x = event.clientX
  const y = event.clientY
  const bw = dialogRef.value.offsetWidth
  const bh = dialogRef.value.offsetHeight
  const bl = dialogRef.value.offsetLeft
  const bt = dialogRef.value.offsetTop

  bindMouseDrag(handleMove)

  function handleMove(e: any) {
    if (handleName.indexOf("l") !== -1) {
      const L = x - e.clientX
      if (e.clientX > 0 && e.clientX < warpperEle.offsetWidth) {
        if ((dialogRef.value.offsetWidth <= mergeProps.value.minWidth && L > 0) || dialogRef.value.offsetWidth > mergeProps.value.minWidth) {
          setPosition("left", bl - L)
          setSize("width", bw + L)
        }
      }
    }
    if (handleName.indexOf("r") !== -1) {
      setSize("width", bw + e.clientX - x)
    }
    if (handleName.indexOf("t") !== -1) {
      const L = y - e.clientY
      if (e.clientY > 0 && e.clientY < warpperEle.offsetHeight) {
        if ((dialogRef.value.offsetHeight <= mergeProps.value.minHeight && L > 0) || dialogRef.value.offsetHeight > mergeProps.value.minHeight) {
          setPosition("top", bt - y + e.clientY)
          setSize("height", bh + y - e.clientY)
        }
      }
    }
    if (handleName.indexOf("b") !== -1) {
      setSize("height", bh + e.clientY - y)
    }

    emits("resize")
  }
}

function setSize(attr: "width" | "height", v) {
  if (isAllowValue(v)) {
    let value = v
    switch (attr) {
      case "width": {
        if (!isPercentage(value)) {
          value = Math.max(mergeProps.value.minWidth, value)
          value = Math.min(mergeProps.value.maxWidth, value, warpperEle.offsetWidth)
        }
        break
      }
      case "height": {
        if (!isPercentage(value)) {
          value = Math.max(mergeProps.value.minHeight, value)
          value = Math.min(mergeProps.value.maxHeight, value, warpperEle.offsetHeight)
        }
        break
      }
    }
    dialogRef.value.style[attr] = autoUnit(value)
  }
}

function setPosition(attr: "left" | "top", v) {
  if (isAllowValue(v)) {
    let value = v
    const pb = dialogRef.value

    switch (attr) {
      case "left": {
        const maxLeft = warpperEle.offsetWidth - pb.offsetWidth
        value = Math.min(Math.max(0, value), maxLeft)
        break
      }
      case "top": {
        const maxTop = warpperEle.offsetHeight - pb.offsetHeight
        value = Math.min(Math.max(0, value), maxTop)
        break
      }
    }
    dialogRef.value.style[attr] = autoUnit(value)
  }
}

let domObserver
onMounted(() => {
  addEvent(window, "resize", resize)

  // 监听元素变化
  domObserver = new MutationObserver((mList, ob) => {
    autoNiceHeight()
  })

  domObserver.observe(dialogRef.value, {
    attributes: true,
    childList: true,
    subtree: true
  })
})
onUnmounted(() => {
  removeEvent(window, "resize", resize)
  domObserver.disconnect()
})

// 处理高度超出的情况
function autoNiceHeight() {
  if (observeDialog) {
    const isExceed = warpperEle.offsetHeight < dialogRef.value.offsetHeight + dialogRef.value.offsetTop
    if (isExceed) {
      const niceHeight = warpperEle.offsetHeight - dialogRef.value.offsetTop
      dialogRef.value.style.height = autoUnit(niceHeight)
    }
  }
}

// 处理窗口缩放
function resize() {
  const pb = dialogRef.value
  if (!warpperEle) {
    return
  }

  if (pb.offsetTop + pb.offsetHeight > warpperEle.offsetHeight) {
    setSize("height", warpperEle.offsetHeight - pb.offsetTop)
  }
  if (pb.offsetLeft + pb.offsetWidth > warpperEle.offsetWidth) {
    setSize("width", warpperEle.offsetWidth - pb.offsetLeft)
  }
}

// 处理百分比
function isPercentage(value) {
  if (typeof value === "string") {
    return value.search("%") !== -1
  } else {
    return false
  }
}

async function close() {
  if (props.beforeClose && typeof mergeProps.value.beforeClose === "function") {
    const result = props.beforeClose()

    if (result instanceof Promise) {
      try {
        await result
        emitClose()
      } catch (err) {
       logWarn("取消关闭")
      }
    } else if (result !== false) {
      emitClose()
    }
  } else {
    emitClose()
  }
}

function emitClose() {
  emits("update:visible", false)
  emits("closed")
}

const animationClass = computed(() => {
  if (mergeProps.value.animation === true) {
    const right = mergeProps.value.right
    if (right && right >= 0 && right < 100) {
      return "fadein-right"
    }
    const left = mergeProps.value.left
    if (left || (left >= 0 && left < 100)) {
      return "fadein-left"
    }
    const top = mergeProps.value.top
    if (left || (top >= 0 && top < 100)) {
      return "fadein-down"
    }
    const bottom = mergeProps.value.bottom
    if (bottom || (bottom >= 0 && bottom < 100)) {
      return "fadein-up"
    }
    return "fadein-center"
  } else if (typeof mergeProps.value.animation === "string") {
    return mergeProps.value.animation
  } else {
    return ""
  }
})

// 处理传入的单位问题
function autoUnit(value: number | string) {
  if (typeof value === "number" || (typeof value === "string" && /^[0-9]*$/.test(value))) {
    return `${value}px`
  } else {
    return value
  }
}

function isAllowValue(value) {
  return value !== null && value !== undefined
}

// 事件绑定处理
function bindMouseDrag(callback) {
  addEvent(document.documentElement, "mousemove", handleMove)
  addEvent(document.documentElement, "mouseup", handleUp)

  function handleMove(e) {
    e.preventDefault()
    e.stopPropagation()
    hasUserSet = true
    callback(e)
  }

  function handleUp(e: any) {
    e.preventDefault()
    e.stopPropagation()
    removeEvent(document.documentElement, "mousemove", handleMove)
    removeEvent(document.documentElement, "mouseup", handleUp)
  }
}

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
.mars-dialog-thumb {
  background-color: var(--mars-base-bg);
  backdrop-filter: blur(10px);
  position: absolute;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
}

.mars-dialog {
  position: absolute;
  box-sizing: border-box;
  z-index: 999 !important;

  .mars-drop-bg();
  box-shadow: var(--mars-base-shadow);
  border-radius: 4px;
  // border-image 与 border-radius 无法共存
  // padding 作为边框，与 mars-dialog__content 背景
  padding: 1px;
  background: var(--mars-base-border);
  border-radius: 4px;
  backdrop-filter: blur(10px);

  .mars-dialog__header {
    height: 44px;
    width: 100%;
    line-height: 44px;
    overflow: hidden;
    .mars-msg-title();
    box-shadow: var(--mars-collapse-title-shadow);
    border-radius: 4px 4px 0 0;
    padding: 0 5px 0px 10px;
    color: var(--mars-text-color);
    position: relative;
    top: 0;
    left: 0;

    .icon {
      margin-right: 11px;
      color: #41a8ff;
    }

    .title {
      font-size: 16px;
    }

    .close-btn {
      float: right;
      cursor: pointer;
      margin-top: 12px;
      color: var(--mars-text-color);
    }
  }

  .close-btn__flot {
    position: absolute;
    right: -8px;
    top: -8px;
    cursor: pointer;
  }

  .mars-dialog__content {
    height: 100%;
    padding: 14px;
    overflow: auto;
    border-radius: 4px;
    background-color: var(--mars-dropdown-bg);

    :deep(.ant-form) {
      padding: 0;
    }
  }

  .mars-dialog_leftbar {
    position: absolute;
    top: 42px;
  }

  .mars-dialog__footer {
    height: 39px;
    width: calc(100% - 2px);
    color: var(--mars-text-color);
    background-color: var(--mars-dropdown-bg);
    position: absolute;
    left: 1px;
    bottom: 1px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    // padding-left: 14px;  会导致图上标绘弹出框底部tab栏错位
  }

  .mars-dialog__handle {
    box-sizing: border-box;
    position: absolute;
    z-index: 1;
    width: 10px;
    height: 10px;
    opacity: 0;
  }

  .handle-t {
    width: auto;
    top: 0;
    left: 10px;
    right: 10px;
    cursor: row-resize;
  }

  .handle-b {
    width: auto;
    bottom: 0;
    left: 10px;
    right: 10px;
    cursor: row-resize;
  }

  .handle-l {
    height: auto;
    top: 10px;
    left: 0;
    bottom: 10px;
    cursor: col-resize;
  }

  .handle-r {
    height: auto;
    top: 10px;
    right: 0;
    bottom: 10px;
    cursor: col-resize;
  }

  .handle-rb {
    bottom: 0;
    right: 0;
    cursor: nwse-resize;
  }

  .handle-lb {
    bottom: 0;
    left: 0;
    cursor: nesw-resize;
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
