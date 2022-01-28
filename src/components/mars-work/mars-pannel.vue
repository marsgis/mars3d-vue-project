<template>
  <teleport to="#mars-main-view">
    <div class="pannel-box" :class="[customClass, animationClass]" ref="pannelBox" v-show="visible">
      <div class="pannel-content">
        <slot></slot>
      </div>

      <div v-if="closeable" class="pannel-close-icon" @click="closeModel">
        <close-one theme="outline" size="20" />
      </div>
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
import { CloseOne } from "@icon-park/vue-next"

interface Props {
  warpper?: string // 容器id 默认是app，将作为定位的参照元素，一般不需要修改
  visible?: boolean // 是否显示
  width?: number | string // 初始宽度
  height?: number | string // 初始高度
  left?: number | string // 定位 left值
  right?: number | string // 定位right值
  top?: number | string // 定位top值
  bottom?: number | string // 定位bottom值
  zIndex?: number // 层级
  customClass?: string // 自定义class
  closeable?: boolean
  beforeClose?: () => Promise<any> | boolean | void
}
const props = withDefaults(defineProps<Props>(), {
  warpper: "app",
  visible: false,
  closeable: false,
  zIndex: 200
})

const animationClass = computed(() => {
  const right = getNumber(props.right)
  if (right && right >= 0 && right < 100) {
    return "fadein-right"
  }

  const left = getNumber(props.left)
  if (left || (left >= 0 && left < 100)) {
    return "fadein-left"
  }

  return "fadein-popup"
})

const emits = defineEmits(["update:visible"])

onMounted(() => {
  initPosition()
  initSize()
})

const pannelBox = ref()

// 点击按钮关闭
const closeModel = async () => {
  if (props.beforeClose && typeof props.beforeClose === "function") {
    const result = props.beforeClose()

    if (result instanceof Promise) {
      try {
        await result
        emits("update:visible", false)
      } catch (err) {
        console.log("取消关闭")
      }
    } else if (result !== false) {
      emits("update:visible", false)
    }
  } else {
    emits("update:visible", false)
  }
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

function getNumber(value: number | string) {
  if (typeof value === "number" || (typeof value === "string" && /^[0-9]*$/.test(value))) {
    return Number(value)
  } else {
    return null
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
</script>

<style lang="less" scoped>
.pannel-box {
  position: absolute;
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

  .pannel-content {
    overflow-y: auto;
    width: 100%;
    height: 100%;
  }

  .pannel-close-icon {
    position: absolute;
    right: -8px;
    top: -8px;
    cursor: pointer;
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
</style>
