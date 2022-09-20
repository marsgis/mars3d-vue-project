<template>
  <div class="mars-steps">
    <component v-for="(child, i) in children" :key="i" :is="child" :index="child.stepNum"></component>
  </div>
</template>

<script setup lang="ts">
import { useSlots, provide, computed } from "vue"

const props = withDefaults(
  defineProps<{
    step: number
  }>(),
  {
    step: 0
  }
)

const step = computed(() => props.step)

provide("step", step)

const slots = useSlots()
const children: any[] = slots.default()
let stepNum = 0
children.forEach((child: any) => {
  child.stepNum = stepNum
  if (child.children) {
    const sl = child.children.default()
    stepNum += sl.length
  }
})
</script>

<style scoped lang="less"></style>
