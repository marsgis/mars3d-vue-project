<template>
  <a-date-picker :locale="locale" :dayjs="dayjs" class="mars-date-picker" dropdownClassName="mars-datepicker-dropdown" v-bind="attrs">
    <template v-for="(comp, name) in slots" :key="name" v-slot:[name]>
      <component :is="comp" />
    </template>
  </a-date-picker>
</template>
<script lang="ts">
import { useAttrs, useSlots, defineComponent } from "vue"
import dayjs from "dayjs"
import "dayjs/locale/zh-cn"
import locale from "ant-design-vue/es/date-picker/locale/zh_CN"
export default defineComponent({
  name: "mars-date-picker",
  inheritAttrs: false,
  setup() {
    const attrs = useAttrs()
    const slots = useSlots()
    return {
      attrs,
      slots,
      dayjs,
      locale
    }
  }
})
</script>
<style lang="less" scoped>
.mars-date-picker {
  color: @mars-base-color;
  border-color: @mars-base-border-color !important;
  background-color: transparent !important;
  &:hover {
    border-color: @mars-primary-color !important;
  }

  :deep(.ant-picker-input) {
    input {
      color: @mars-base-color !important;
    }
  }
  :deep(.ant-picker-clear) {
    background: @mars-bg-base;
    color: @mars-base-color !important;
  }
  :deep(.ant-picker-suffix *) {
    color: @mars-base-color;
  }
}
</style>
<style lang="less">
.mars-datepicker-dropdown {
  .ant-picker-panel-container {
    .mars-drop-bg();
  }
  *,
  .ant-picker-content th {
    color: @mars-base-color;
  }
  .ant-picker-footer {
    border: none;
  }
  .ant-picker-cell {
    &:hover,
    &.ant-picker-cell-selected {
      .ant-picker-cell-inner {
        background-color: @mars-primary-color !important;
      }
    }
  }
}
</style>
