<template>
  <div class="mars-color" :style="{ backgroundColor: props.value }">
    <input type="color" :onchange="changeColor" v-model="props.value" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: "mars-color",
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      default: "#FFFFFF"
    }
  },
  emits: ["update:value", "change"],
  setup(props, context) {
    const changeColor = (e: any) => {
      context.emit("change", e.target.value)
    }
    return {
      props,
      changeColor
    }
  }
})
</script>
<style lang="less" scoped>
.mars-color {
  width: 80px;
  height: 20px;
  background-color: #fff;
  cursor: pointer;

  input {
    outline: none !important;
    border: 0px !important;
    opacity: 0;
    width: 80px;
    height: 20px;
    cursor: pointer;
  }
}
</style>
