<template>
  <a-range-picker :locale="locale" :dayjs="dayjs" class="mars-range-picker" v-bind="attrs">
    <!-- <template v-for="(comp, name) in slots" :key="name" v-slot:[name]>
      <component :is="comp" />
    </template> -->
  </a-range-picker>
</template>
<script lang="ts">
import { useAttrs, defineComponent } from "vue"
import dayjs from "dayjs"
import "dayjs/locale/zh-cn"
import locale from "ant-design-vue/es/date-picker/locale/zh_CN"
export default defineComponent({
  name: "mars-range-picker",
  inheritAttrs: false,
  setup() {
    const attrs = useAttrs()
    return {
      attrs,
      dayjs,
      locale
    }
  }
})
</script>
<style lang="less" scoped>
.mars-range-picker {
  color: var(--mars-control-text);
  border-color: var(--mars-control-border) !important;
  background-color: transparent !important;
  &:hover {
    border-color: var(--mars-primary-color) !important;
  }
  :deep(.ant-picker-input > input) {
    color: var(--mars-control-text) !important;
    &::placeholder {
      color: var(--mars-control-text) !important;
    }
  }
  :deep(.ant-picker-clear) {
    background: var(--mars-base-bg);
    color: var(--mars-control-text) !important;
  }
  :deep(.ant-picker-suffix *) {
    color: var(--mars-control-text);
  }
  :deep(.ant-picker-range-separator *) {
    color: var(--mars-control-text);
  }
}
:deep(.ant-picker-panel-container) {
  background: var(--mars-dropdown-bg) !important;
}
</style>
