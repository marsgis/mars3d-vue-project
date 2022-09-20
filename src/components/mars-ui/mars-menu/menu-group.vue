<template>
  <div class="mars-menu-group">
    <div class="menu-group-title">
      <span class="mars-menu-icon">
        <slot name="icon"></slot>
      </span>
      <span>{{ props.title }}</span>
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
}>()
</script>

<style scoped lang="less"></style>
