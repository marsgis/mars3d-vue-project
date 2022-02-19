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
  color: @mars-basecolor;
  background-color: @form-input-background !important;
  background: none;
  * {
    color: @mars-basecolor;
  }
  :deep(.ant-select-selector) {
    border-color: @border-color-ordinary !important;
    background: none;
    background-color: transparent !important;
  }
}
:deep(.ant-select:not(.ant-select-disabled)) {
  &:hover,
  &:focus {
    border-color: #4db3ff;
    .ant-select-selector {
      border-color: #4db3ff;
    }
  }
}
</style>
<style lang="less">
// 下拉选择
// .mars-select-dropdown {
//   background-color: @dropdown-background !important;
//   .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
//     background-color: @dropdown-active-background !important;
//   }
//   .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
//     font-weight: 700;
//     background-color: @dropdown-active-background !important;
//   }
//   .ant-select-item {
//     transition: none;
//   }
// }
</style>
