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
  background: @button-background-base;
  border-color: #20a0ff;
  padding-left: 10px;
  padding-right: 10px;
  color: @button-color-base;
  :deep(.i-icon) {
    font-size: 18px !important;
    line-height: 18px;
    vertical-align: middle !important;
    padding-left: 2px;
    padding-right: 2px;
  }
}
.mars-button:not([disabled]) {
  &:hover {
    color: @button-color-active;
    border-color: #89bceb;
    background: @button-background-active;
  }
  &:focus {
    color: @button-color-active;
    border-color: #89bceb;
    background: @button-background-active;
  }
}
.ant-btn:disabled {
  color: @button-color-base;
  border-color: #89bceb;
  background: rgba(32, 160, 255, 0.2);
  &:hover {
    background: rgba(32, 160, 255, 0.2);
    color: @mars-disable-color;
  }
}
</style>
<style lang="less">
.ant-btn-primary {
  background: @primary-color;
  border: none;
}
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
