<template>
  <main-view @mapLoaded="mapLoaded" :url="sceneUrl" />
</template>

<script setup lang="ts">
import { computed } from "vue"
import MainView from "@mars/components/mars-work/main-view.vue"
import { getQueryString } from "@mars/utils/mars-util"

const sceneUrl = computed(() => getQueryString("url"))
function mapLoaded(map: any) {
  // 地图构造完成
}
</script>

<style></style>
