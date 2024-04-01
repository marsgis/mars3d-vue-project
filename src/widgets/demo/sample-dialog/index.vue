<template>
  <mars-dialog :nopadding="true" title="弹窗标题" width="300" height="400" top="400" bottom="10" :right="10">
    <a-row :gutter="5">
      <a-col :span="19">
        <mars-input v-model:value="extent" :allowClear="true"></mars-input>
      </a-col>
      <a-col :span="5">
        <a-space size="small">
          <mars-button class="small-btn" @click="onClickDrawExtent">绘制</mars-button>
        </a-space>
      </a-col>
    </a-row>
    <template #icon>
      <mars-icon icon="bookmark-one" width="18" />
    </template>
  </mars-dialog>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from "vue"
import useLifecycle from "@mars/common/uses/use-lifecycle"
import * as mapWork from "./map"

// 启用map.ts生命周期
useLifecycle(mapWork)

const extent = ref("")

// 渲染模型
const onClickDrawExtent = () => {
  // formState.extent = "测试组件内部数据是否响应"
  mapWork.drawExtent()
}
mapWork.eventTarget.on("drawExtent", function (event: any) {
  extent.value = event.extent
})

onUnmounted(() => {
  // 销毁操作
})
</script>
<style lang="less"></style>
