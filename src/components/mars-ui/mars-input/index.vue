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
  color: @mars-base-color;
  background-color: transparent !important;
  font-size: 12px !important;
  :deep(.ant-input) {
    background-color: transparent !important;
    border-color: @mars-base-border-color;
    color: @mars-base-color;
  }
  :deep(.ant-input-suffix .anticon) {
    color: @mars-base-color;
  }
}
.mars-input[disabled] {
  color: @mars-disable-btn-bg;
}
</style>
