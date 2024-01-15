<template>
  <div class="mars3d-popup-content-wrapper mars3d-popup-background">
    <span class="mars3d-popup-close-button mars3d-popup-color closeButton" @click="closePopup"> × </span>

    <div class="mars3d-popup-content-wrapper mars3d-popup-background">
      <div class="mars3d-template-titile">
        <a :href="'https://www.amap.com/detail/' + props.id" target="_black">{{ props.name }}</a>
      </div>
      <div class="mars3d-template-content">
        <div v-if="props.tel"><label>电话:</label> {{ props.tel }}</div>
        <div v-if="props.address"><label>地址:</label> {{ props.address }}</div>
        <div v-if="props.type"><label>类别:</label> {{ props.type }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as mapWork from "./map"
const props = defineProps<{
  id: string
  name: string
  tel?: string
  address?: string
  type?: string
}>()

const closePopup = () => {
  mapWork.graphicLayer.closePopup()
}
</script>

<style lang="less">
.mars3d-template-content {
  padding-bottom: 20px;

  div {
    padding-right: 10px;
  }
}
</style>
