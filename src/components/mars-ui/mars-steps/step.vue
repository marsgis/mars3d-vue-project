<template>
  <i class="mars-step" :class="{active: step >= props.index}"></i>
</template>

<script setup lang="ts">
import { inject } from "vue"

const step = inject("step")

const props = withDefaults(
  defineProps<{
    index: number
  }>(),
  {
    index: 0
  }
)
</script>

<style scoped lang="less"></style>
