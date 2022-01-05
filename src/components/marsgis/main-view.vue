<template>
  <ConfigProvider :locale="locale">
    <div id="centerDiv" class="centerDiv-container">
      <mars-map :url="configUrl" @onload="marsOnload" />
    </div>
    <template v-if="loaded">
      <template v-for="comp in widgets" :key="comp.name">
        <component
          v-if="openAtStart.includes(comp.name) && comp.visible"
          :is="comp.component"
          v-model:visible="comp.visible"
          v-bind="getWidgetAttr(comp)"
        />
      </template>
    </template>
  </ConfigProvider>
</template>

<script setup lang="ts">
/**
 * 渲染主入口
 * @copyright 火星科技 mars3d.cn
 * @author 火星吴彦祖 2021-12-30
 */
import zhCN from "ant-design-vue/es/locale/zh_CN"
import { computed, provide, ref } from "vue"
import { ConfigProvider } from "ant-design-vue"
import { useStore } from "vuex"
import MarsMap from "@/components/marsgis/mars-map.vue"
import { Widget } from "@/common/store"

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

const getWidgetAttr = (widget: Widget) => {
  let attr = {}
  if (widget.meta && widget.meta.props) {
    attr = {
      ...attr,
      ...widget.meta.props
    }
  }
  if (widget.data && widget.data.props) {
    attr = {
      ...attr,
      ...widget.data.props
    }
  }
  return attr
}
</script>

<style lang="less">
.centerDiv-container {
  height: 100%;
  overflow: hidden;
}
</style>
