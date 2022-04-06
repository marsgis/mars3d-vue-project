<template>
  <component class="mars-icon" :is="iconComponent" theme="outline" :fill="color" :size="width" v-bind="attrs" />
</template>
<script lang="ts">
import { computed, useAttrs, defineComponent } from "vue"
import * as iconModules from "@icon-park/vue-next"
import _ from "lodash"
export default defineComponent({
  name: "mars-icon",
  // inheritAttrs: false,
  props: {
    icon: {
      type: String
    },
    color: {
      type: String,
      default: "#fff"
    },
    width: {
      type: [String, Number],
      default: "14"
    }
  },
  setup(props) {
    const attrs = useAttrs()
    const iconName = computed(() => _.upperFirst(_.camelCase(props.icon)))
    const iconComponent = iconModules[iconName.value] || iconModules.Logout
    return {
      attrs,
      iconComponent
    }
  }
})
</script>
<style lang="less" scoped>
.mars-icon {
  vertical-align: middle;
}
</style>
