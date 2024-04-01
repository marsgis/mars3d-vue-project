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
  margin: 0px 6px;

  :deep(.ant-slider-mark-text) {
    color: var(--mars-control-text) !important;
    top: 10px;
  }

  /*滑动条 未选择、已选择部分 高度*/
  :deep(.ant-slider-rail) {
    height: 4px;
    border-radius: 5px;
    background-color: var(--mars-control-border) !important;
  }

  :deep(.ant-slider-track) {
    height: 4px;
    border-radius: 5px;
    background-color: var(--mars-primary-color) !important;
  }

  /*滑动条 刻度点*/
  :deep(.ant-slider-dot) { 
    top: 12px;
    height: 6px;
    width: 1px;
    border-radius: 0 0;
    border: none;
    background-color: var(--mars-control-text);
  }

  :deep(.ant-slider-dot:first-child) {
    margin-left: 2px;
  }

  /*滑动条 拖拽点*/
  :deep(.ant-slider-handle) {
    position: absolute;
    width: 12px;
    height: 12px;
    border: 1px solid var(--mars-primary-color);
    box-shadow:
      0px 1px 2px 0px rgba(60, 64, 67, 0.3),
      0px 2px 6px 2px rgba(60, 64, 67, 0.15);
    inset-block-start: 0px;
    &::after {
      border-radius: 0;
      box-shadow: none;
    }
    &:hover,
    &:focus {
      &::after {
        width: 10px;
        height: 10px;
        inset-block-start: 0;
        inset-inline-start: 0;
      }
    }
  }

  :deep(.ant-slider-dot-active, .ant-slider-handle) {
    border-color: var(--mars-primary-color) !important;
  }
}
</style>
