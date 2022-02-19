<template>
  <a-textarea class="mars-textarea" v-bind="attrs">
    <template v-for="(comp, name) in slots" :key="name" v-slot:[name]>
      <component :is="comp" />
    </template>
  </a-textarea>
</template>
<script lang="ts">
import { useAttrs, useSlots, defineComponent } from "vue"
export default defineComponent({
  name: "mars-textarea",
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
.mars-textarea {
  color: @mars-basecolor;
  background-color: @form-input-background !important;
  :deep(.ant-input) {
    background-color: @form-input-background !important;
    color: @mars-basecolor;
  }
  :deep(.ant-input-suffix .anticon) {
    color: @mars-basecolor;
  }
}
.mars-textarea[disabled]{
  color: @mars-disable-color;
}
</style>
