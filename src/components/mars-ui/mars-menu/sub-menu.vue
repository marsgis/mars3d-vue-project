<template>
  <div class="mars-sub-menu">
    <span class="mars-menu-icon" v-if="slots.icon">
      <slot name="icon"></slot>
    </span>
    <span>
      <slot name="title"></slot>
    </span>
    <div class="sub-menu-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSlots } from "vue"

const slots = useSlots()
</script>

<style scoped lang="less"></style>
