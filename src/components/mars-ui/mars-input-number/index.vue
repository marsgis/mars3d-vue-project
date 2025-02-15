<template>
  <a-input-number class="mars-input-number" :class='{"unit-class": attrs["addon-after"]}' v-bind="attrs" :precision="attrs.tofixed">
    <template v-for="(comp, name) in slots" :key="name" v-slot:[name]>
      <component :is="comp" />
    </template>
  </a-input-number>
</template>
<script lang="ts">
import { useAttrs, useSlots, defineComponent } from "vue"
export default defineComponent({
  name: "mars-input-number",
  inheritAttrs: false,
  setup() {
    const attrs = useAttrs()
    const slots = useSlots()

    // 在style.js中配置 toFixed 用于控制保留小数位数
    return {
      slots,
      attrs
    }
  }
})
</script>
<style lang="less" scoped>
.mars-input-number {
  width: 100%;
  height: 32px; // size="small" 时将不居中，需要使用不同大小可注释
  color: var(--mars-control-text);
  background-color: var(--mars-control-bg);
  border-radius: 0;
  border: 1px solid;
  border-color: var(--mars-control-border);
  border-radius: 2px;
  box-shadow: none;
  font-family: var(--mars-font-family);
  :deep(.ant-input-number-input-wrap) {
    height: 100%; // size="small" 时将不生效，需要使用不同大小可注释
    .ant-input-number-input {
      height: 100%; // size="small" 时将不生效，需要使用不同大小可注释
      color: var(--mars-control-text);
      padding: 5px 11px;
      &::placeholder {
        color: var(--mars-control-placeholder);
      }
    }
  }
  &:hover {
    border-color: var(--mars-hover-color);
  }
}
:deep(.ant-input-number-handler-wrap) {
  background: none;
  .anticon {
    color: var(--mars-control-placeholder);
    > svg {
      font-size: 10px;
    }
  }
  .ant-input-number-handler {
    border-color: rgba(234, 242, 255, 0.2);
    &:hover {
      .anticon {
        color: var(--mars-control-placeholder);
      }
    }
  }
}
:deep(.unit-class) {
  border-radius: 0px !important;
  background-color: var(--mars-control-bg);
}
:deep(.ant-input-number) {
  border-color: transparent
}
:deep(.ant-input-number-group-addon) {
  padding: 0 8px !important;
  border-radius: 0px !important;
  border-color: transparent;
  color: var(--mars-control-placeholder);
}
</style>
