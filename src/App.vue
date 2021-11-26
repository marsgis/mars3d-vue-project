<template>
  <MarsMap :url="configUrl" map-key="test" @onload="marsOnload" />
  <sample />
</template>

<script setup lang="ts">
import { getCurrentInstance, ref } from "vue"
import MarsMap from "@comp/MarsMap/index.vue"
import sample from "@/views/sample/index.vue"

const configUrl = ref("/config/config.json")

const instance = getCurrentInstance()
const mars3d = instance?.appContext.config.globalProperties.mars3d
const Cesium = instance?.appContext.config.globalProperties.Cesium


const marsOnload = (map: any) => {
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

 console.log("map构造完成", map)
}
</script>

<style></style>
