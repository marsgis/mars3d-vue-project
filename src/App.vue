<template>
  <MarsMap :url="configUrl" map-key="test" :mapWork="mapWork" @onload="marsOnload" />
  <sample ref="sampleRef" />
</template>

<script setup lang="ts">
import { ref } from "vue"
import MarsMap from "@comp/MarsMap/index.vue"
import sample from "@/views/sample/index.vue"
import * as mapWork from "@/views/sample/map.js"

const configUrl = "/config/config.json"

const sampleRef = ref()
 
const marsOnload = (map: any) => {
  console.log("map构造完成", map)
}
</script>

<style></style>
