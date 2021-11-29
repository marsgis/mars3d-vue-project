<template>
  <div class="pannel-box fadeInRight" :class="{ 'pannel-model': props.type === 'model' }" ref="pannelBox" v-show="props.type === 'pannel' || visible">
    <div v-if="props.type === 'model'" ref="modelHeader" class="pannel-model__header" @mousedown="mousedown">
      <span class="title">{{ title }}</span>
      <icon-close @click="closeModel" class="close-btn" />
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
/**
 * 操作公共容器
 * @copyright 火星科技 mars3d.cn
 * @author 木遥 2021-11-01
 */
import { ref } from "vue"

const props = defineProps({
  type: {
    type: String,
    default: "pannel"
  },
  warpper: {
    type: String,
    default: "sanbox-warpper"
  },
  title: {
    type: String,
    default: ""
  },
  visible: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(["update:visible"])

const pannelBox = ref()

const closeModel = () => {
  emits("update:visible", false)
}

function mousedown(event: any) {
  let x = event.clientX
  let y = event.clientY
  window.onmousemove = function (ev) {
    ev.preventDefault()
    toPointerPosition(ev)
  }
  window.onmouseup = function (ev) {
    toPointerPosition(ev)
    window.onmousemove = null
    window.onmouseup = null
  }

  function toPointerPosition(ev: any) {
    const pb = pannelBox.value
    const distanceX = ev.clientX - x
    const distanceY = ev.clientY - y

    toPosition(pb, pb.offsetLeft + distanceX, pb.offsetTop + distanceY, ev)
  }
  function toPosition(dom: any, left: number, top: number, e: any) {
    const warpper = document.getElementById(props.warpper)
    if (left > 0 && left + dom.offsetWidth < warpper!.offsetWidth) {
      dom.style.left = left + "px"
      x = e.clientX
    }
    if (top > 0 && top + dom.offsetHeight < warpper!.offsetHeight) {
      dom.style.top = top + "px"
      y = e.clientY
    }
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
}
.pannel-model {
  padding-top: 0;
}
.pannel-model__header {
  height: 40px;
  line-height: 40px;
  cursor: move;
  overflow: hidden;
  border-bottom: 1px solid #3b4d5e;
  .title {
    font-size: 16px;
  }
  .close-btn {
    float: right;
    cursor: pointer;
    font-size: 16px;
  }
}

@-webkit-keyframes fadeInRight {
  from {
    opacity: 0;
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}

.fadeInRight {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation-name: fadeInRight;
  animation-name: fadeInRight;
}
</style>
