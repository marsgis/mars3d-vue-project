<template>
  <div class="mars3d-popup-content-wrapper mars3d-popup-background">
    <span class="mars3d-popup-close-button mars3d-popup-color closeButton" @click="closePopup"> × </span>

    <div class="mars3d-popup-content-wrapper mars3d-popup-background">
      <div class="mars3d-template-titile">
        <!-- <a :href="'https://www.amap.com/detail/' + props.id" target="_black">{{ props.name }}</a> -->
        {{ props.name }}
      </div>
      <div class="mars3d-template-content">
        <div v-if="props.tel"><label>电话:</label> {{ props.tel }}</div>
        <div v-if="props.address"><label>地址:</label> {{ props.address }}</div>
        <div v-if="props.type"><label>类别:</label> {{ props.type }}</div>
      </div>
    </div>
    <div class="mars3d-template-tri"></div>
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
}

.mars3d-template-tri {
  margin: 5px 10px;
  width: 0px;
  height: 0px;
  border: 10px solid rgba(39, 44, 54, 0.8);
  border-bottom: none;
  border-left-color: transparent;
  border-right-color: transparent;
}
</style>
<style lang="less" scoped>
.mars3d-popup-background {
  background: none !important;
}

.mars3d-popup-content-wrapper {
  box-shadow: none !important;
  padding: 0 !important;
  background: var(--mars-base-border) !important;
  border-radius: 4px;
}
</style>
