<template>
  <a-input-number class="mars-input-number" v-bind="attrs" :precision="attrs.tofixed">
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

    // 在style.js中配置toFixed用于控制保留小数位数
    return {
      slots,
      attrs
    }
  }
})
</script>
<style lang="less" scoped>
.mars-input-number {
  color: var(--mars-text-color);
  background-color: transparent !important;
  border-color: var(--mars-base-border-color);
  width: 100%;
  * {
    color: var(--mars-text-color);
  }
}
:deep(.ant-input-number-handler-wrap) {
  background: none;
  .anticon {
    color: var(--mars-text-color);
  }
}
</style>
