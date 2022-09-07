<template>
  <mars-dialog :draggable="false" top="100" left="10" :width="400" :right="10">
    <a-form :model="formState" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
      <a-form-item label="面板测试" name="extent">
        <a-row :gutter="5">
          <a-col :span="19">
            <mars-input v-model:value="formState.extent" :allowClear="true"></mars-input>
          </a-col>
          <a-col :span="5">
            <a-space>
              <mars-button class="small-btn" @click="onClickDrawExtent">绘制</mars-button>
            </a-space>
          </a-col>
        </a-row>
      </a-form-item>
    </a-form>
  </mars-dialog>
</template>

<script setup lang="ts">
import { reactive } from "vue"
import useLifecycle from "@mars/common/uses/use-lifecycle"
import * as mapWork from "./map"

// 启用map.ts生命周期
useLifecycle(mapWork)

interface FormState {
  extent: string
}
const formState = reactive<FormState>({
  extent: ""
})

// 渲染模型
const onClickDrawExtent = () => {
  // formState.extent = "测试组件内部数据是否响应"
  mapWork.drawExtent()
}
mapWork.eventTarget.on("drawExtent", function (event: any) {
  formState.extent = event.extent
})
</script>
<style lang="less"></style>
