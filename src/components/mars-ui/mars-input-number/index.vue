<template>
  <a-input-number class="mars-input-number" v-bind="attrs">
    <template v-for="(comp, name) in slots" :key="name" v-slot:[name]>
      <component :is="comp" />
    </template>
  </a-input-number>
</template>
<script lang="ts">
import { useAttrs, useSlots, defineComponent } from "vue"
export default defineComponent({
  name: "mars-input-number",
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
.mars-input-number {
  color: @mars-basecolor;
  background-color: @form-input-background !important;
  border-color: @border-color-ordinary;
  * {
    color: @mars-basecolor;
  }
}
:deep(.ant-input-number-handler-wrap) {
  background: none;
}
</style>
