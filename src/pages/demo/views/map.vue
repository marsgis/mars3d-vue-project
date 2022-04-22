<template>
  <div id="centerDiv" class="centerDiv-container">
    <mars-map :url="configUrl" @onload="marsOnload" />

    <a-space style="position: absolute; top: 10px; left: 10px">
      <mars-button @click="back">返回</mars-button>
    </a-space>
  </div>
</template>

<script setup lang="ts">
import MarsMap from "@mars/components/mars-work/mars-map.vue"
import { useRouter } from "vue-router"

const configUrl = `${process.env.BASE_URL}config/config.json`

const marsOnload = (map: any) => {
  console.log("map构造完成", map)
}

const router = useRouter()
const back = () => {
  router.back()
}
</script>

<style>
.centerDiv-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
