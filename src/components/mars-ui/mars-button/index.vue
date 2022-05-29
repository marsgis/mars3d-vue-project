<template>
  <a-button class="mars-button" v-bind="attrs">
    <template v-for="(comp, name) in slots" :key="name" v-slot:[name]>
      <component :is="comp" />
    </template>
  </a-button>
</template>
<script lang="ts">
import { useAttrs, useSlots, defineComponent } from "vue"
export default defineComponent({
  name: "mars-button",
  inheritAttrs: false,
  setup() {
    const attrs = useAttrs()
    const slots = useSlots()
    return {
      attrs,
      slots
    }
  }
})
</script>
<style lang="less" scoped>
// 按钮
.mars-button {
  font-size: 14px;
  background: @mars-primary-color-half;
  border: none;
  padding-left: 10px;
  padding-right: 10px;
  color: @mars-base-color;
  :deep(.mars-icon) {
    font-size: 18px !important;
    line-height: 18px;
    vertical-align: middle !important;
    padding-left: 2px;
    padding-right: 2px;
  }
}
.mars-button:not([disabled]) {
  &:hover {
    color: @mars-base-color;
    border-color: #89bceb;
    background: @mars-hover-btn-bg;
  }
  &:focus {
    color: @mars-base-color;
    border-color: #89bceb;
    background: @mars-click-btn-bg;
  }
}
.ant-btn:disabled {
  color: @mars-base-color;
  background: @mars-disable-btn-bg;
  &:hover {
    background: @mars-disable-btn-bg;
    color: @mars-base-color;
  }
}
</style>
<style lang="less">
.ant-btn-link {
  border: none !important;
  background: none !important;
  padding: 0;
  height: initial;
}
/* 小型 单击按钮 */
.small-btn {
  padding: 4px 5px;
}
</style>
