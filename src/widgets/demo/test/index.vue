<template>
  <mars-dialog title="test" width="300" height="400" top="400" bottom="10" :right="10">
  test
  </mars-dialog>
</template>

<script setup lang="ts">
import { reactive } from "vue"
import useLifecycle from "@mars/common/uses/use-lifecycle"
import * as mapWork from "./map"

// 启用map.ts生命周期
useLifecycle(mapWork)
</script>
<style lang="less"></style>
