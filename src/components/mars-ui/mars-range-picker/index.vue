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
  color: @mars-base-color;
  border-color: @mars-base-border-color !important;
  background-color: transparent !important;
  &:hover {
    border-color: @mars-primary-color !important;
  }
  :deep(.ant-picker-input > input) {
    color: @mars-base-color !important;
  }
  :deep(.ant-picker-clear) {
    background: @mars-bg-base;
    color: @mars-base-color !important;
  }
  :deep(.ant-picker-suffix *) {
    color: @mars-base-color;
  }
  :deep(.ant-picker-range-separator *) {
    color: @mars-base-color;
  }

}
:deep(.ant-picker-panel-container ) {
    background: @mars-bg-base !important;
  }
</style>
