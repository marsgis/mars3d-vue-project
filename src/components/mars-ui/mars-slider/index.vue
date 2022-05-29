<template>
  <a-slider class="mars-slider" v-bind="attrs">
    <template v-for="(comp, name) in slots" :key="name" v-slot:[name]>
      <component :is="comp" />
    </template>
  </a-slider>
</template>
<script lang="ts">
import { useAttrs, useSlots, defineComponent } from "vue"
export default defineComponent({
  name: "mars-slider",
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
/*滑动条 输入面板内时修改高度等*/
.mars-slider {
  margin: 0px 6px 6px 6px;
  :deep(.ant-slider-mark-text) {
    color: @mars-base-color !important;
    top: 5px;
  }
  /*滑动条 未选择、已选择部分 高度*/
  :deep(.ant-slider-rail) {
    height: 10px;
    border-radius: 5px;
    background-color: #284660 !important;
  }
  :deep(.ant-slider-track) {
    height: 10px;
    border-radius: 5px;
    background-color: @mars-primary-color !important;
  }
  /*滑动条 刻度点*/
  :deep(.ant-slider-dot) {
    background-color: #16212c7d;
    top: 12px;
    height: 6px;
    width: 1px;
    border-radius: 0 0;
    border: none;
    background-color: #fff;
  }
  :deep(.ant-slider-dot:first-child) {
    margin-left: 2px;
  }

  /*滑动条 拖拽点*/
  :deep(.ant-slider-handle) {
    position: absolute;
    width: 16px;
    height: 16px;
    margin-top: -3px;
    border: 4px solid @mars-primary-color;
  }
  :deep(.ant-slider-dot-active, .ant-slider-handle) {
    border-color: @mars-primary-color !important;
  }
}
</style>
