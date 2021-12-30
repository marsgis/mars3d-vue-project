<template>
  <ConfigProvider :locale="locale">
    <mars-map :url="configUrl" @onload="marsOnload" />
    <template v-if="loaded">
      <template v-for="comp in widgets" :key="comp.name">
        <component v-if="openAtStart.includes(comp.name) && comp.visible" :is="comp.component" v-model:visible="comp.visible" />
      </template>
    </template>
  </ConfigProvider>
</template>

<script setup lang="ts">
import zhCN from "ant-design-vue/es/locale/zh_CN"
import { computed, provide, ref } from "vue"
import { ConfigProvider } from "ant-design-vue"
import { useStore } from "vuex"
import MarsMap from "./mars-map.vue"

const locale = zhCN

const store = useStore()

const widgets = computed(() => store.state.widgets)
const openAtStart = computed(() => store.state.openAtStart)

const configUrl = `${process.env.BASE_URL}config/config.json`

let mapInstance: any = null
provide("getMapInstance", () => {
  return mapInstance
})

const loaded = ref(false)
const marsOnload = (map: any) => {
  console.log("map构造完成", map)
  mapInstance = map
  loaded.value = true
}
</script>
