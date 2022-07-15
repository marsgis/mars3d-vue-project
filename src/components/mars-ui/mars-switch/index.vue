<template>
  <a-switch class="mars-switch" v-model:checked="switchValue" @change="valueChange" />
</template>

<script lang="ts" setup>
import { ref, watchEffect } from "vue"

const props = withDefaults(
  defineProps<{
    value?: boolean | string | number
    checked?: boolean | string | number
  }>(),
  {
    value: undefined,
    checked: undefined
  }
)

const switchValue = ref()
watchEffect(() => {
  if (props.checked !== undefined) {
    switchValue.value = props.checked
  } else {
    switchValue.value = props.value || false
  }
})

const emit = defineEmits(["update:value", "update:checked", "change"])

const valueChange = (value: boolean) => {
  emit("update:value", value)
  emit("update:checked", value)
  emit("change", value)
}
</script>
<script lang="ts">
export default {
  name: "mars-switch"
}
</script>
<style lang="less" scoped>
// 开关
.mars-switch {
  background-color: var(--mars-disable-btn-bg);
  &.ant-switch-checked {
    background-color: var(--mars-primary-color) !important;
  }
}
</style>
