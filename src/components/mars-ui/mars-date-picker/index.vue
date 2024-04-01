<template>
  <a-date-picker :locale="locale" :dayjs="dayjs" class="mars-date-picker" popupClassName="mars-datepicker-dropdown" v-bind="attrs">
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
  width: 100%;
  height: 32px;
  color: var(--mars-control-text);
  border-color: var(--mars-control-border) !important;
  background-color: var(--mars-control-bg) !important;
  border-radius: 2px;
  &:hover {
    border-color: var(--mars-primary-color) !important;
  }

  :deep(.ant-picker-input) {
    > input {
      color: var(--mars-control-text) !important;
      &::placeholder {
        color: var(--mars-control-placeholder);
      }
    }
  }
  :deep(.ant-picker-clear) {
    background: var(--mars-base-bg);
    color: var(--mars-control-text) !important;
  }
  :deep(.ant-picker-suffix *) {
    color: var(--mars-control-placeholder);
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
    color: var(--mars-control-text);
  }
  .ant-picker-footer {
    border: none;
  }
  .ant-picker-cell {
    &:hover,
    &.ant-picker-cell-selected {
      .ant-picker-cell-inner {
        // background-color: var(--mars-primary-color) !important; 基础项目中日期选中的是透明的
        background-color: transparent !important;
        color:#fff
      }
    }
  }

  .ant-picker-cell-disabled {
    background-color: var(--mars-disable-color);
  }

  .ant-picker-time-panel-cell {
    .ant-picker-time-panel-cell-inner {
      color: var(--mars-control-text) !important;
    }
    &:hover,
    &.ant-picker-time-panel-cell-selected {
      background-color: var(--mars-primary-color) !important;
      .ant-picker-time-panel-cell-inner {
        background-color: var(--mars-primary-color) !important;
      }
    }
  }
}
</style>
