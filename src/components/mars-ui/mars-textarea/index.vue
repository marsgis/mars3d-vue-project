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
  color: var(--mars-control-text);
  background-color: var(--mars-control-bg) !important;
  border-radius: 0;
  border: 1px solid;
  border-color: var(--mars-control-border);
  :deep(.ant-input) {
    background-color: var(--mars-control-bg) !important;
    color: var(--mars-control-text);
  }
  :deep(.ant-input-suffix .anticon) {
    color: var(--mars-control-text) !important;
  }

  &:hover {
    border-color: var(--mars-hover-color);
  }

  &::placeholder {
    color: var(--mars-control-placeholder);
  }
}

.mars-textarea[disabled] {
  color: var(--mars-disable-color);
}
</style>
