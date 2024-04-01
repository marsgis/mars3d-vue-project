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
  width: 30px;
  min-width: 30px;
  height: 16px;
  border-radius: 2px;
  background-color: var(--mars-close-color);
  border: 1px solid var(--mars-control-border);
  &.ant-switch-checked {
    background-color: var(--mars-primary-color) !important;
    border: 1px solid var(--mars-primary-color);
    :deep(.ant-switch-handle) {
      inset-inline-start: calc(100% - 14px);
    }
  }
  :deep(.ant-switch-handle) {
    width: 12px;
    height: 12px;
    top: 1px;
    &::before {
      border-radius: 2px;
    }
  }
}
</style>
