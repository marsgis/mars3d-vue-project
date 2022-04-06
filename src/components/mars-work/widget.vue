<template>
  <component :is="widget.component" v-bind="getWidgetAttr(widget)" />
</template>
<script lang="ts">
import { useAttrs, defineComponent, provide } from "vue"
import type { Widget } from "@mars/common/store/widget"

export default defineComponent({
  name: "mars-widget",
  props: ["widget"],
  setup(props) {
    const attrs = useAttrs()

    provide("getCurrentWidget", () => {
      return props.widget.name
    })

    const getWidgetAttr = (widget: Widget) => {
      let attr = {}
      if (widget.meta && widget.meta.props) {
        attr = {
          ...attr,
          ...widget.meta.props
        }
      }
      if (widget.data && widget.data.props) {
        attr = {
          ...attr,
          ...widget.data.props
        }
      }
      return attr
    }

    return {
      attrs,
      getWidgetAttr
    }
  }
})
</script>
