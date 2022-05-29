<template>
  <a-select class="mars-select" dropdownClassName="mars-select-dropdown" v-bind="attrs">
    <template v-for="(comp, name) in slots" :key="name" v-slot:[name]>
      <component :is="comp" />
    </template>
  </a-select>
</template>
<script lang="ts">
import { useAttrs, useSlots, defineComponent } from "vue"
export default defineComponent({
  name: "mars-select",
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
.mars-select {
  color: @mars-base-color;
  background-color: transparent !important;
  background: none;
  :deep(.ant-select-selector) {
    border-color: @mars-base-border-color !important;
    background: none;
    background-color: transparent !important;
    &:hover,
    &:focus {
      border-color: #4db3ff !important;
    }
  }

  :deep(.ant-select-arrow) {
    color: @mars-base-color !important;
  }
}
</style>
<style lang="less">
// 下拉选择
.mars-select-dropdown {
  padding: 0 !important;
  .mars-drop-bg();
  .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
    background: @mars-list-active;
  }
  .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
    font-weight: 700;
    background: @mars-list-active;
  }
  .ant-select-item {
    transition: none;
    color: @mars-base-color !important;
    text-align: center;
  }
}
</style>
