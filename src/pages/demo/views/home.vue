<template>
  <a-space style="position: absolute; top: 10px; left: 10px">
    路由切换测试：
    <mars-button @click="toWidget">打开widget地图</mars-button>
    <mars-button @click="toMap">打开空白地图</mars-button>
  </a-space>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"

const router = useRouter()

const toMap = () => {
  router.push("map")
}
const toWidget = () => {
  router.push("widget")
}
</script>

<style></style>
