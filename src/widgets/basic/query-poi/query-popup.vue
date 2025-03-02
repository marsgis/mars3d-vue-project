<template>
  <div class="mars3d-popup-content-wrapper mars3d-query-pupup">
    <span class="mars3d-popup-close-button mars3d-popup-color closeButton" @click="closePopup"> × </span>

    <div class="mars3d-popup-content mars3d-popup-background">
      <div class="mars3d-template-title">
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
.mars3d-query-pupup {
  box-shadow: none;
  padding: 1px;
  background: var(--mars-base-border);
  border-radius: 4px;

  .mars3d-popup-close-button {
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .mars3d-template-title {
    background-color: #464c5a;
    border-bottom: 1px solid #464c5a;
  }

  .mars3d-popup-content {
    margin: 0px;
    border-radius: 4px;
  }

  .mars3d-template-content {
    background-color: rgba(35, 39, 47, 0.7);
  }

  .mars3d-template-tri {
    margin: auto;
    width: 0px;
    height: 0px;
    border: 10px solid rgba(39, 44, 54, 0.8);
    border-bottom: none;
    border-left-color: transparent;
    border-right-color: transparent;
  }
}
</style>
