<template>
  <MarsMap :url="configUrl" map-key="test" @onload="marsOnload" />
  <sample ref="sampleRef" />
</template>

<script setup lang="ts">
import { ref } from "vue"
import MarsMap from "@comp/MarsMap/index.vue"
import sample from "@/views/sample/index.vue"

const configUrl = "/config/config.json"

const sampleRef = ref()

const marsOnload = (map: any) => {
  console.log("map构造完成", map)
  sampleRef.value.setMap(map)
}
</script>

<style></style>
