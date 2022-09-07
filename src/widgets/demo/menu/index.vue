<template>
  <mars-dialog :draggable="false" left="10" top="10">
    <a-space>
      <mars-button @click="back">返回</mars-button>
      <mars-button @click="show('my-widget')">弹窗示例</mars-button>
      <mars-button @click="show('ui')">UI面板</mars-button>
      <mars-button @click="update()">测试ui交互</mars-button>
      <mars-button @click="show('test')">test</mars-button>
    </a-space>
  </mars-dialog>
</template>

<script setup lang="ts">
import { defineCustomElement } from "vue"
import { useWidget } from "@mars/common/store/widget"
import useLifecycle from "@mars/common/uses/use-lifecycle"
import * as mapWork from "./map"
import MyButton from "./button.ce.vue"
import { useRouter } from "vue-router"

const router = useRouter()

if (!customElements.get("my-element")) {
  const MyElement = defineCustomElement(MyButton)
  customElements.define("my-element", MyElement)
}

// 启用map.ts生命周期
useLifecycle(mapWork)

const { activate, updateWidget } = useWidget()

const show = (name: string) => {
  activate(name)
}

const update = () => {
  updateWidget("my-widget", "测试")
}

const back = () => {
  router.back()
}
</script>
<style lang="less"></style>
