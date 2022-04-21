<template>
  <a-space>
    <template v-for="(item, i) in value" :key="i">
      <mars-input v-model:value="values[i]" @change="(v) => itemChange(v, i)" :suffix="props.units[i]" />
    </template>
  </a-space>
</template>
<script lang="ts" setup>
import { watchEffect, ref } from "vue"
const props = defineProps<{
  value: string[]
  units: string[]
}>()

const values = ref([])

watchEffect(() => {
  values.value = props.value
})

const emits = defineEmits(["update:value", "change"])

function itemChange(v, i) {
  emits("update:value", values)
  emits("change", values)
}
</script>
<script lang="ts">
export default {
  name: "mars-input-group"
}
</script>
<style lang="less" scoped></style>
