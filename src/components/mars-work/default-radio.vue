<template>
  <a-radio-group :value="value" @update:value="valueChange">
    <a-radio :value="true">是</a-radio>
    <a-radio :value="false">否</a-radio>
  </a-radio-group>
</template>

<script lang="ts" setup>
defineProps<{
  value: boolean
}>()

const emit = defineEmits(["update:value", "change"])

const valueChange = (value: boolean) => {
  emit("update:value", value)
  emit("change", value)
}
</script>
