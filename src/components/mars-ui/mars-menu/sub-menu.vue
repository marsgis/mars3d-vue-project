<template>
  <div class="mars-sub-menu">
    <span class="mars-menu-icon" v-if="slots.icon">
      <slot name="icon"></slot>
    </span>
    <span class="mars-menu-text">
      <slot name="title"></slot>
    </span>
    <div class="sub-menu-content" :class="`placement-${props.placement || 'left'}`">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSlots } from "vue"

const props = defineProps<{
  placement?: "left" | "middle" | "right"
}>()

const slots = useSlots()
</script>

<style scoped lang="less"></style>
