<template>
  <div class="mars-color">
    <input type="color" :style="{ backgroundColor: color }" :onchange="changeColor" v-model="color" />
    <label> {{ color }} </label>
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
    const color = props.value
    const changeColor = (e: any) => {
      context.emit("change", e.target.value)
    }
    return {
      color,
      changeColor
    }
  }
})
</script>
<style lang="less" scoped>
.mars-color {
  width: 100%;
  height: 32px;
  background-color: var(--mars-control-bg);
  border: 1px solid;
  border-color: var(--mars-control-border);
  border-radius: 2px;
  padding: 3px 4px;
  &:hover {
    border-color: var(--mars-primary-color);
  }

  > input {
    outline: none !important;
    width: 24px;
    height: 24px;
    cursor: pointer;
    border: 1px solid var(--mars-control-border);
  }
  > label {
    height: 32px;
    line-height: 32px;
    color: var(--mars-control-text);
    font-family: var(--mars-font-family);
    font-size: 14px;
    font-weight: normal;
    display: inline-block;
    position: absolute;
    top: 0;
    margin-left: 10px;
  }
}

// 去掉颜色input 内置颜色线
input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 0;
}
input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
  margin: 0;
}
</style>
