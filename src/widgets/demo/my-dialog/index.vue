<template>
  <mars-dialog title="我的弹窗" width="300" height="400" right="20" top="40" bottom="40">
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
      <mars-icon icon="icon-park-outline:bookmark-one" width="18" />
    </template>
  </mars-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import * as mapWork from "./map"
import useLifecycle from "@mars/common/uses/use-lifecycle"
import { useWidget } from "@mars/common/store/widget"

const { getWidget } = useWidget()

const widget = getWidget("my-widget")

widget.onUpdate((e) => {
  console.log(e)
})

useLifecycle(mapWork)

const extent = ref("")

const onClickDrawExtent = async () => {
  console.log(extent.value)
  const data = await mapWork.drawExtent()

  extent.value = data.extent
}
</script>
<style lang="less"></style>
