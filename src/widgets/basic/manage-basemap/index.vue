<template>
  <mars-dialog :draggable="true" title="底图" :width="380" :position="{ top: 60, right: 10 }">
    <ul class="basemap">
      <li v-for="(item, i) in baseMaps" :key="i" class="basemap-card" :class="{ 'active-card': active === item.id }" @click="changeBaseMaps(item)">
        <div><img class="icon" :src="`${item.options.icon || 'img/basemaps/bingAerial.png'}`" /></div>
        <div>{{ item.name }}</div>
      </li>
    </ul>
    <template #footer>
      <mars-switch v-model:checked="chkHasTerrain" @change="changeTerrain" />
      <span class="f-ml">显示地形</span>
    </template>
  </mars-dialog>
</template>

<script setup lang="ts">
import { ref, markRaw, onMounted } from "vue"
import useLifecycle from "@mars/common/uses/use-lifecycle"
import * as mapWork from "./map"

// 启用map.ts生命周期
useLifecycle(mapWork)

const baseMaps = ref<any[]>([])
const active = ref("")
const chkHasTerrain = ref(false)

onMounted(() => {
  const layers = mapWork.getLayers()
  initData(layers)
})

function initData(e: any) {
  baseMaps.value = e.baseMaps.map((m: any) => {
    if (m.isAdded && m.show) {
      active.value = m.id
    }
    return {
      name: m.name,
      id: m.id,
      options: markRaw(m.options)
    }
  })

  chkHasTerrain.value = e.hasTerrain || false
}

function changeBaseMaps(item: any) {
  mapWork.changeBaseMaps((active.value = item.id))
}

function changeTerrain() {
  mapWork.changeTerrain(chkHasTerrain.value)
}
</script>
<style lang="less" scoped>
.basemap {
  height: calc(100% - 40px);
}
.basemap-card {
  display: inline-block;
  width: 75px;
  list-style-type: none;
  margin-top: 10px;
  margin-left: 10px;
  vertical-align: top;
  text-align: center;
  cursor: pointer;
  font-size: 12px;
  color: var(--mars-text-color);
  &:hover {
    .active-card();
  }
  .icon {
    border: 1px solid #4db3ff78;
    width: 75px;
    height: 70px;
    padding: 1px;
  }
}

.active-card {
  color: #337fe5 !important;
  .icon {
    border-color: #337fe5;
  }
}
</style>
