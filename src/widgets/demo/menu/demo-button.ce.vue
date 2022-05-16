<template>
  <my-button type="primary" @click="tanchu('sample-pannel')">测试1</my-button>
  <my-button type="primary" @click="tanchu('my-widget')">测试1</my-button>
</template>

<script setup lang="ts">
import { Button as MyButton } from "ant-design-vue"
const tanchu = (message) => {
  alert(message)
}
</script>
<style lang="less">
@import "ant-design-vue/lib/button/style/index.less";
</style>
