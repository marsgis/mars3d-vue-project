<template>
  <div class="mars-step-group" :style="{ background: props.background }">
    <div class="group-inner">
      <component v-for="(child, i) in children" :key="i" :is="child" :index="props.index + i"></component>
    </div>
    <div class="group-title" :style="{ background: step >= props.index ? props.background : '#999' }">{{ props.title }}</div>
  </div>
</template>

<script setup lang="ts">
import { useSlots, inject } from "vue"

const step = inject("step")

const slots = useSlots()
const children: any[] = slots.default()

const props = withDefaults(
  defineProps<{
    background: string
    index: number
    title: string
  }>(),
  {
    index: 0,
    background: "none",
    title: ""
  }
)
</script>

<style scoped lang="less"></style>
