<template>
  <PannelBox class="infoView" v-auto-height="100">
    <a-form :model="formState" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
      <a-form-item label="地图交互" name="extent">
        <a-row :gutter="5">
          <a-col :span="19">
            <mars-input v-model:value="formState.extent" :allowClear="true"></mars-input>
          </a-col>
          <a-col :span="5">
            <a-space size="small">
              <mars-button class="small-btn" @click="onClickDrawExtent">绘制</mars-button>
            </a-space>
          </a-col>
        </a-row>
      </a-form-item>
    </a-form>
  </PannelBox>
</template>

<script setup lang="ts">
import { reactive } from "vue"
import PannelBox from "@comp/OperationPannel/PannelBox.vue"
import * as mapWork from "./map.js"

interface FormState {
  extent: string
}
const formState = reactive<FormState>({
  extent: ""
})

// 渲染模型
const onClickDrawExtent = () => {
  mapWork.drawExtent()
}
mapWork.eventTarget.on("drawExtent", function (event: any) {
  formState.extent = event.extent
})

// 对父组件暴露 setMap 方法
const setMap = (map: any) => {
  mapWork.onMounted(map)
}

defineExpose({
  setMap
})
</script>
<style lang="less">
.infoView {
  overflow-y: auto;
}
</style>
