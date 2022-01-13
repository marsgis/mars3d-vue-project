<template>
  <teleport to="#mars-main-view">
    <div class="pannel-model" :class="[customClass, animationClass]" ref="pannelBox" v-show="visible">
      <div ref="modelHeader" class="pannel-model__header" @mousedown="mousedown">
        <slot name="icon"></slot>
        <span class="title">{{ title }}</span>
        <close-o @click="closeModel" class="close-btn" />
      </div>
      <div class="pannel-model__body">
        <div class="content">
          <slot></slot>
        </div>
        <div class="footer" v-if="$slots.footer">
          <div class="footer-content">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
      <div
        v-for="handle in actualHandles"
        :key="handle"
        class="handle"
        :class="['handle-' + handle]"
        @mousedown.stop.prevent="handleDown(handle, $event)"
      >
        <slot :name="handle"></slot>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
/**
 * dislog弹框
 * @copyright 火星科技 mars3d.cn
 * @author 火星吴彦祖 2021-12-30
 */
import { computed, onMounted, onUnmounted, ref } from "vue"
import { Close as CloseO } from "@icon-park/vue-next"

interface Props {
  warpper?: string
  title?: string
  visible: boolean
  width?: number | string
  height?: number | string
  left?: number | string
  right?: number | string
  top?: number | string
  bottom?: number | string
  handles?: boolean | string
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  zIndex?: number
  customClass?: string
}
const props = withDefaults(defineProps<Props>(), {
  warpper: "app",
  title: "",
  visible: false,
  width: 200,
  handles: true,
  minWidth: 100,
  minHeight: 100,
  maxWidth: 1000,
  maxHeight: 1000,
  zIndex: 200
})

const animationClass = computed(() => {
  const left = parseInt((props.left || "").toString())
  const right = parseInt((props.right || "").toString())
  if (props.left && left > 0 && left < 40) {
    return "fadein-left"
  } else if (props.right && right > 0 && right < 40) {
    return "fadein-right"
  } else {
    return "fadein-popup"
  }
})

const emits = defineEmits(["update:visible"])

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
  pannelStyle.zIndex = props.zIndex
  // 横向位置初始化
  if (props.left !== undefined) {
    pannelStyle.left = antoUnit(props.left)
  } else if (props.right !== undefined) {
    pannelStyle.right = antoUnit(props.right)
    pannelStyle.left = "initial"
  }
  // 纵向位置初始化
  if (props.top !== undefined) {
    pannelStyle.top = antoUnit(props.top)
  }
  if (props.bottom !== undefined) {
    pannelStyle.bottom = antoUnit(props.bottom)
  }
}

// 初始化大小
function initSize() {
  const pannelStyle = pannelBox.value.style
  if (props.width) {
    pannelStyle.width = antoUnit(props.width)
  }
  if (!props.top || !props.bottom) {
    if (props.height) {
      pannelStyle.height = antoUnit(props.height)
    }
  }
}

// 处理窗口缩放
function resize() {
  const pb = pannelBox.value
  const warpper = document.getElementById(props.warpper)
  if (pb.offsetTop + pb.offsetHeight > warpper!.offsetHeight) {
    pb.style.height = antoUnit(Math.max(warpper!.offsetHeight - pb.offsetTop, props.minHeight))
  }
  if (pb.offsetLeft + pb.offsetWidth > warpper!.offsetWidth) {
    pb.style.width = antoUnit(Math.max(warpper!.offsetWidth - pb.offsetLeft, props.minWidth))
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
  const warpper = document.getElementById(props.warpper)
  const pb = pannelBox.value
  const x = event.clientX
  const y = event.clientY
  const bl = pb.offsetLeft
  const bt = pb.offsetTop
  const maxLeft = warpper!.offsetWidth - pb.offsetWidth
  const maxTop = warpper!.offsetHeight - pb.offsetHeight

  addEvent(document.documentElement, "mousemove", toPointerPosition)
  addEvent(document.documentElement, "mouseup", handleUp)

  function toPointerPosition(e: any) {
    e.preventDefault()
    const distanceX = e.clientX - x
    const distanceY = e.clientY - y
    const left = bl + distanceX
    const top = bt + distanceY
    if (props.top && props.bottom) {
      pb.style.height = antoUnit(pb.offsetHeight)
      pb.style.bottom = "initial"
    }
    pb.style.left = `${Math.min(Math.max(0, left), maxLeft)}px`
    pb.style.top = `${Math.min(Math.max(0, top), maxTop)}px`
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
  if (!props.handles) {
    return []
  }
  if (typeof props.handles === "string") {
    return props.handles.split("")
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
    if (handleName.indexOf("x") !== -1) {
      const width = bw + e.clientX - x
      pannelBox.value.style.width = `${Math.min(Math.max(props.minWidth, width, 0), props.maxWidth)}px`
    }
    if (handleName.indexOf("y") !== -1) {
      const height = bh + e.clientY - y
      pannelBox.value.style.height = `${Math.min(Math.max(props.minHeight, height, 0), props.maxHeight)}px`
    }
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

<style lang="less" scoped>
.pannel-model {
  position: absolute;
  padding: 0 5px 10px 10px;
  border-radius: 4px;
  border: 1px solid #4db3ff70;
  z-index: 100;
  background: linear-gradient(to left, #4db3ff, #4db3ff) left top no-repeat, linear-gradient(to bottom, #4db3ff, #4db3ff) left top no-repeat,
    linear-gradient(to left, #4db3ff, #4db3ff) right top no-repeat, linear-gradient(to bottom, #4db3ff, #4db3ff) right top no-repeat,
    linear-gradient(to left, #4db3ff, #4db3ff) left bottom no-repeat, linear-gradient(to bottom, #4db3ff, #4db3ff) left bottom no-repeat,
    linear-gradient(to left, #4db3ff, #4db3ff) right bottom no-repeat, linear-gradient(to left, #4db3ff, #4db3ff) right bottom no-repeat;
  background-size: 1px 20px, 20px 1px, 1px 20px, 20px 1px;
  background-color: rgba(20, 20, 20, 0.5);
}
.pannel-model__header {
  height: 40px;
  line-height: 40px;
  cursor: move;
  overflow: hidden;
  border-bottom: 1px solid #3b4d5e;
  color: #fff;
  :deep(.i-icon) {
    vertical-align: sub;
    margin-right: 5px;
  }
  .title {
    font-size: 16px;
  }
  .close-btn {
    float: right;
    cursor: pointer;
    font-size: 16px;
  }
}

.pannel-model__body {
  width: 100%;
  height: calc(100% - 40px);
  overflow-x: hidden;
  overflow-y: auto;
}
.content {
  overflow: hidden;
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
    background: rgb(64, 65, 70);
  }
}

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
@keyframes popup {
  from {
    opacity: 0;
    transform: scale(0.1);
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
.fadein-left {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation-name: fadeInLeft;
  animation-name: fadeInLeft;
}
.fadein-popup {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation-name: popup;
  animation-name: popup;
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
</style>
