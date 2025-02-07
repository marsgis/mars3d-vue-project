<template>
  <mars-dialog
    title="底图"
    icon="international"
    customClass="manage-basemap-pannel"
    :draggable="true"
    :width="340"
    :height="600"
    :position="{ top: 60, right: 10 }"
  >
    <ul class="basemap">
      <li v-for="(item, i) in baseMaps" :key="i" class="basemap-card" :class="{ 'active-card': active === item.id }" @click="changeBaseMaps(item)">
        <img class="icon" :src="`${item.options.icon || '//data.mars3d.cn/img/thumbnail/basemap/bingAerial.png'}`" />
        <div class="name">{{ item.name }}</div>
      </li>
    </ul>
    <template #footer>
      <mars-switch v-model:checked="chkHasTerrain" @change="changeTerrain" />
      <span class="f-ml">显示地形</span>
    </template>
  </mars-dialog>
</template>

<script setup lang="ts">
import { ref, markRaw, onMounted, onUnmounted } from "vue"
import useLifecycle from "@mars/common/uses/use-lifecycle"
import { useWidget } from "@mars/common/store/widget"
import * as mapWork from "./map"

// 启用map.ts生命周期
useLifecycle(mapWork)

const { updateWidget } = useWidget()

const baseMaps = ref<any[]>([])
const active = ref("")
const chkHasTerrain = ref(false)

onMounted(() => {
  const layers = mapWork.getLayers()
  initData(layers)
})

onUnmounted(() => {
  updateWidget("toolbar", "manage-basemap")
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

<style lang="less">
.manage-basemap-pannel {
  .mars-dialog__footer {
    padding-left: 14px;
  }
}
</style>
<style lang="less" scoped>
.title {
  width: 50%;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-family: var(--mars-font-family);
}

.basemap {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  display: grid;
  justify-content: center;
  gap: 10px;
  grid-template-columns: repeat(auto-fill, 94px);
}

.basemap-card {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  list-style-type: none;
  vertical-align: top;
  text-align: center;
  cursor: pointer;
  font-size: 12px;
  color: var(--mars-text-color);
  border: 1.5px solid rgba(255, 255, 255, 0.06);
  padding: 3px 3px 0;
  background: var(--mars-collapse-title-bg);

  &:hover {
    .active-card();
  }

  .icon {
    width: 86px;
    height: 86px;
  }

  .name {
    width: 80px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin: 7px 0;
  }
}

.active-card {
  color: #337fe5 !important;
  border-color: #337fe5;
}
</style>
