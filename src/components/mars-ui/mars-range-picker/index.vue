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
  color: @mars-basecolor;
  background-color: @form-input-background !important;
  :deep(.ant-picker-input > input) {
    color: @mars-basecolor !important;
  }
  :deep(.ant-picker-clear) {
    display: none;
  }
  // * {
  //   color: @mars-basecolor !important;
  // }
}
.ant-picker-header-view {
  color: red !important;
}
</style>
