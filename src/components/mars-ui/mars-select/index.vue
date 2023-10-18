<template>
  <a-select class="mars-select" popupClassName="mars-select-dropdown" v-bind="attrs">
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
  color: var(--mars-text-color);
  background-color: transparent !important;
  background: none;
  :deep(.ant-select-selector) {
    border-color: var(--mars-base-border-color) !important;
    background: none;
    background-color: transparent !important;
    &:hover,
    &:focus {
      border-color: #4db3ff !important;
    }
    .ant-select-selection-item {
      color: var(--mars-base-color) !important;
    }
  }

  :deep(.ant-select-arrow) {
    color: var(--mars-base-color) !important;
  }
}
</style>
<style lang="less"></style>
