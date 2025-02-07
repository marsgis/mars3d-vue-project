<template>
  <ConfigProvider :locale="locale">
    <div class="mars-main-view" id="mars-main-view">
      <div id="centerDiv" class="centerDiv-container">
        <mars-map :url="configUrl" :options="mapOptions" @onload="marsOnload" />
      </div>
      <template v-if="loaded">
        <template v-for="comp in widgets" :key="comp.key">
          <mars-widget v-if="openAtStart.includes(comp.name) && comp.visible" v-model:visible="comp.visible" :widget="comp" />
        </template>
      </template>
    </div>
  </ConfigProvider>
</template>

<script setup lang="ts">
/**
 * 渲染主入口
 * @copyright 火星科技 mars3d.cn
 * @author 火星渣渣灰 2022-02-19
 */
import zhCN from "ant-design-vue/es/locale/zh_CN"
import { computed, provide, ref } from "vue"
import { ConfigProvider } from "ant-design-vue"
import { useWidgetStore } from "@mars/common/store/widget"
import MarsMap from "@mars/components/mars-work/mars-map.vue"
import MarsWidget from "./widget.vue"
import { logInfo } from "@mars/utils/mars-util"

const locale = zhCN

const widgetStore = useWidgetStore()

const widgets = computed(() => widgetStore.state.widgets)
const openAtStart = computed(() => widgetStore.state.openAtStart)

const props = withDefaults(
  defineProps<{
    mapOptions?: any
    url?: string
  }>(),
  {
    mapOptions: () => ({}),
    url: null
  }
)
const configUrl = props.url ?? `${process.env.BASE_URL}config/config.json?time=${new Date().getTime()}`

let mapInstance: any = null
provide("getMapInstance", () => {
  return mapInstance
})

const emit = defineEmits(["mapLoaded"])

const loaded = ref(false)
const marsOnload = (map: any) => {
  logInfo("map构造完成", map)
  mapInstance = map

  emit("mapLoaded", mapInstance)
  loaded.value = true
}
</script>

<style lang="less" scoped>
.mars-main-view {
  height: 100%;
  width: 100%;
  position: relative;
}
.centerDiv-container {
  background-color: var(--mars-base-bg) !important;
  color: var(--mars-text-color) !important;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
