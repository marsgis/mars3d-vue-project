<template>
  <a-date-picker :locale="locale" :dayjs="dayjs" class="mars-date-picker" v-bind="attrs">
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
  color: @mars-basecolor;
  border-color: @border-color-ordinary !important;
  background-color: @form-input-background !important;
  :deep(.ant-picker-input > input) {
    color: @mars-basecolor !important;
  }
  :deep(.ant-picker-clear) {
    background: transparent;
  }
  * {
    color: @mars-basecolor !important;
  }
}
</style>
