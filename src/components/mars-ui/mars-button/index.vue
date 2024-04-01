<template>
  <a-button class="mars-button" v-bind="attrs">
    <template v-for="(comp, name) in slots" :key="name" v-slot:[name]>
      <component :is="comp" />
    </template>
  </a-button>
</template>
<script lang="ts">
import { useAttrs, useSlots, defineComponent } from "vue"
export default defineComponent({
  name: "mars-button",
  inheritAttrs: false,
  setup() {
    const attrs = useAttrs()
    const slots = useSlots()
    return {
      attrs,
      slots
    }
  }
})
</script>
<style lang="less" scoped>
// 按钮
.mars-button {
  height: 32px;
  font-family: var(--mars-font-family);
  font-size: 14px;
  background: var(--mars-primary-color);
  border: none;
  padding-left: 10px;
  padding-right: 10px;
  color: #ffffff;
  border-radius: 2px;

  :deep(.mars-icon) {
    font-size: 18px !important;
    line-height: 18px;
    vertical-align: middle !important;
    padding-left: 2px;
    padding-right: 2px;
  }
}

.mars-button:not([disabled]) {
  &:hover {
    color: #ffffff;
    border-color: #89bceb;
    background: var(--mars-hover-color);
  }

  // &:focus {
  //   color: #ffffff;
  //   border-color: #89bceb;
  //   background: var(--mars-hover-color);
  // }
}

.ant-btn:disabled {
  color: var(--mars-text-color);
  background: var(--mars-disable-color);

  &:hover {
    background: var(--mars-disable-color);
    color: var(--mars-text-color);
  }
}

.ant-btn-dangerous {
  background-color: var(--mars-dangerous-color) !important;

  &:hover {
    background-color: #ff7875 !important;
  }
}
</style>
<style lang="less">
.ant-btn-link {
  border: none !important;
  background: none !important;
  padding: 0;
  height: initial;
}

/* 小型 单击按钮 */
.small-btn {
  padding: 4px 5px;
}
</style>
