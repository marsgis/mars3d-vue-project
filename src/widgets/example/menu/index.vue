<template>
  <mars-pannel>
    <a-space>
      <mars-button @click="show('sample-pannel')">面板示例</mars-button>
      <mars-button @click="show('my-widget')">弹窗示例</mars-button>
      <mars-button @click="show('ui')">UI面板</mars-button>
      <mars-button @click="update">测试交互</mars-button>
    </a-space>
  </mars-pannel>
</template>

<script setup lang="ts">
import MarsPannel from "@mars/components/mars-work/mars-pannel.vue"
import { useWidget } from "@mars/common/store/widget"

const { activate, updateWidget } = useWidget()

const show = (name: string) => {
  activate(name)
}

const update = () => {
  updateWidget("my-widget", "测试")
}
</script>
<style lang="less"></style>
