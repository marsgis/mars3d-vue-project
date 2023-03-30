<template>
  <my-button type="primary" @click="tanchu('sample-pannel')">
    测试1
    <mars-icon icon="people" theme="filled" width="19"></mars-icon>
  </my-button>
  <my-button type="primary" @click="tanchu(props.remark)">我是传入的参数：{{ props.remark }}</my-button>
</template>

<script setup lang="ts">
import { Button as MyButton } from "ant-design-vue"
import MarsIcon from "@mars/components/mars-ui/mars-icon/index.vue"

// 与传入的参数一一对应
const props = defineProps<{
  remark?: string
}>()

const tanchu = (message) => {
  alert(message)
}
</script>
<style lang="less">
@import "ant-design-vue/lib/button/style/index.less";
</style>
