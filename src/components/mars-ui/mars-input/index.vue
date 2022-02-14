<template>
  <a-input class="mars-input" v-bind="attrs">
    <template v-for="(comp, name) in slots" :key="name" v-slot:[name]>
      <component :is="comp" />
    </template>
  </a-input>
</template>
<script lang="ts">
import { useAttrs, useSlots, defineComponent } from "vue"
export default defineComponent({
  name: "mars-input",
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
.mars-input {
  color: @mars-basecolor;
  background-color: @form-input-background !important;
  * {
    color: @mars-basecolor;
  }
  :deep(.ant-input) {
    background-color: @form-input-background !important;
  }
}
</style>
