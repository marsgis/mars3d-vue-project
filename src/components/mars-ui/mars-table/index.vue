<template>
  <a-table class="mars-table" v-bind="attrs">
    <template v-for="(comp, name) in slots" #[name]="data" :key="name">
      <slot :name="name" v-bind="data"></slot>
    </template>
  </a-table>
</template>
<script lang="ts">
import { useAttrs, useSlots, defineComponent } from "vue"
export default defineComponent({
  name: "mars-table",
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
<style lang="less" scoped></style>
