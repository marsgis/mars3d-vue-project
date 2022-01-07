<template>
  <mars-pannel>
    <a-space>
      <mars-button @click="show('sample-pannel')">面板示例</mars-button>
      <mars-button @click="show('sample-dialog')">弹窗示例</mars-button>
      <mars-button @click="show('ui')">UI面板</mars-button>
    </a-space>
  </mars-pannel>
</template>

<script setup lang="ts">
import MarsPannel from "@/components/marsgis/mars-pannel.js"
import { useWidget } from "@/common/store/widget.js"
const { activate } = useWidget()

const show = (name: string) => {
  activate(name)
}
</script>
<style lang="less"></style>
