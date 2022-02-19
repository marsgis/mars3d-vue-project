<template>
  <Icon class="mars-icon" v-bind="attrs"></Icon>
</template>
<script lang="ts">
import { useAttrs, defineComponent } from "vue"
import { Icon } from "@iconify/vue"
export default defineComponent({
  name: "mars-icon",
  inheritAttrs: false,
  components: {
      Icon
  },
  setup() {
    const attrs = useAttrs()
    return {
      attrs
    }
  }
})
</script>
<style lang="less" scoped>
.mars-icon{
  vertical-align: sub;
}
</style>
