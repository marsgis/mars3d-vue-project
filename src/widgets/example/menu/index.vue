<template>
  <mars-pannel>
    <a-space>
      <mars-button @click="show('sample-pannel')">面板示例</mars-button>
      <mars-button @click="show('sample-dialog')">弹窗示例</mars-button>
      <mars-button @click="show('ui')">UI面板</mars-button>
    </a-space>
  </mars-pannel>
</template>

<script setup lang="ts">
import { useStore } from "vuex"
import MarsPannel from "@/components/marsgis/mars-pannel.js"
const store = useStore()

const show = (name: string) => {
  store.dispatch("activate", name)
}
</script>
<style lang="less"></style>
