<template>
  <teleport to="#mars-main-view">
    <div class="pannel-box" :class="[customClass, animationClass]" ref="pannelBox" v-show="visible">
      <slot></slot>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
/**
 * pannel面板
 * @copyright 火星科技 mars3d.cn
 * @author 火星吴彦祖 2021-12-30
 */
import { onMounted, ref, computed } from "vue"

interface Props {
  visible: boolean
  width?: number
  height?: number
  left?: number
  right?: number
  top?: number
  bottom?: number
  zIndex?: number
  customClass?: string
}
const props = withDefaults(defineProps<Props>(), {
  warpper: "app",
  visible: false,
  zIndex: 100
})

const animationClass = computed(() => {
  const left = props.left
  const right = props.right
  // console.log(left, right)
  if (typeof right === "number" && right >= 0 && right < 40) {
    return "fadein-right"
  } else if (!left || (left >= 0 && left < 40)) {
    return "fadein-left"
  } else {
    return "fadein-popup"
  }
})

onMounted(() => {
  initPosition()
  initSize()
})

const pannelBox = ref()

// 初始化位置
function initPosition() {
  const pannelStyle = pannelBox.value.style
  // 层级位置
  pannelStyle.zIndex = props.zIndex
  // 横向位置初始化
  if (props.left !== undefined) {
    pannelStyle.left = `${Number(props.left)}px`
  } else if (props.right !== undefined) {
    pannelStyle.right = `${Number(props.right)}px`
    pannelStyle.left = "initial"
  }
  // 纵向位置初始化
  if (props.top !== undefined) {
    pannelStyle.top = `${Number(props.top)}px`
  } else if (props.bottom !== undefined) {
    pannelStyle.bottom = `${Number(props.bottom)}px`
    pannelStyle.top = "initial"
  }
}

// 初始化大小
function initSize() {
  const pannelStyle = pannelBox.value.style
  if (props.width) {
    pannelStyle.width = `${props.width}px`
  }
  if (props.height) {
    pannelStyle.height = `${props.height}px`
  }
}
</script>

<style lang="less" scoped>
.pannel-box {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 10px 10px;
  border-radius: 4px;
  z-index: 1000;

  border: 1px solid #4db3ff70;
  background: linear-gradient(to left, #4db3ff, #4db3ff) left top no-repeat, linear-gradient(to bottom, #4db3ff, #4db3ff) left top no-repeat,
    linear-gradient(to left, #4db3ff, #4db3ff) right top no-repeat, linear-gradient(to bottom, #4db3ff, #4db3ff) right top no-repeat,
    linear-gradient(to left, #4db3ff, #4db3ff) left bottom no-repeat, linear-gradient(to bottom, #4db3ff, #4db3ff) left bottom no-repeat,
    linear-gradient(to left, #4db3ff, #4db3ff) right bottom no-repeat, linear-gradient(to left, #4db3ff, #4db3ff) right bottom no-repeat;
  background-size: 1px 20px, 20px 1px, 1px 20px, 20px 1px;
  background-color: rgba(20, 20, 20, 0.5);

  overflow-y: auto;
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
</style>
