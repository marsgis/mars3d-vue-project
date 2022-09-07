<template>
  <mars-dialog :draggable="false" top="100" left="10" :width="400" :right="10">
    <!-- 方式一： 通过组件api 删除或添加显示的元素， option不需要是响应式数据 -->
    <h3 class="f-push-10-t">表单一</h3>
    <mars-gui ref="marsGuiRef" :options="options" @change="gui1Change"></mars-gui>
    <a-space>
      <mars-button @click="deleteJingdu">删除经度</mars-button>
      <mars-button @click="deleteFirst">删除第一个</mars-button>
      <mars-button @click="insertOne">插入一个</mars-button>
      <mars-button @click="insertMore">插入多个</mars-button>
    </a-space>
    <a-space>
      <mars-button @click="updateExtra">改变后缀</mars-button>
    </a-space>
    <!-- 方式一： 直接通过options控制显示元素， option需要是响应式数据 -->
    <h3 class="f-push-10-t">表单二</h3>
    <mars-gui :options="options2"></mars-gui>
    <a-space>
      <mars-button @click="updateAll">完全替换</mars-button>
    </a-space>
  </mars-dialog>
</template>

<script setup lang="ts">
import type { GuiItem } from "@mars/components/mars-ui/mars-gui"
import { ref } from "vue"

const options: GuiItem[] = [
  {
    type: "inputGroup",
    field: "dufenmiao",
    label: "度分秒",
    extra: "{type}-{dufenmiao}",
    value: [1, 2, 3],
    units: ["度", "分", "秒"],
    change(data) {
      console.log("数据change变化", data)
    }
  },
  {
    type: "radio",
    field: "type",
    label: "测试",
    value: "1",
    // 显示过滤器 可以直接传递boolen
    show(data) {
      return data.speed !== "2"
    },
    data: [
      {
        label: "十进制",
        value: "1"
      },
      {
        label: "度分秒",
        value: "2"
      },
      {
        label: "平面坐标",
        value: "3"
      }
    ],
    change(data) {
      console.log("数据change变化", data)
    }
  },
  {
    type: "checkbox",
    field: "type2",
    label: "测试多选",
    value: ["1"],
    extra(data) {
      return data.speed
    },
    data: [
      {
        label: "十进制",
        value: "1"
      },
      {
        label: "度分秒",
        value: "2"
      },
      {
        label: "平面坐标",
        value: "3"
      }
    ],
    change(data) {
      console.log("数据change变化", data)
    }
  },
  {
    type: "select",
    field: "speed",
    label: "速度",
    value: "1",
    data: [
      {
        label: "1",
        value: "1"
      },
      {
        label: "2",
        value: "2"
      },
      {
        label: "3",
        value: "3"
      }
    ]
  },
  {
    type: "input",
    field: "jingdu",
    label: "经度",
    value: "122.234324",
    change(data) {
      console.log("数据change变化", data)
    }
  },
  {
    type: "textarea",
    field: "remark",
    label: "备注",
    value: "测试",
    change(data) {
      console.log("数据change变化", data)
    }
  },
  {
    type: "switch",
    field: "opener",
    label: "开关",
    value: true,
    change(data) {
      console.log("数据change变化", data)
    }
  },
  {
    type: "number",
    field: "count",
    label: "数字",
    step: 0.1,
    min: -10,
    max: 100,
    value: 0.3,
    change(data) {
      console.log("数据change变化", data)
    }
  },
  {
    type: "slider",
    field: "opcity",
    label: "滑动输入",
    step: 0.1,
    min: -10,
    max: 100,
    value: 0.3,
    extra: "{opcity}",
    change(data) {
      console.log("数据change变化", data)
    }
  },
  {
    type: "slider",
    field: "range",
    label: "双向滑动",
    step: 0.1,
    range: true,
    min: -10,
    max: 100,
    value: [1, 50],
    extra: "{opcity}",
    change(data) {
      console.log("数据change变化", data)
    }
  }
]

const marsGuiRef = ref()

function deleteJingdu() {
  marsGuiRef.value.delete("jingdu")
}
function deleteFirst() {
  marsGuiRef.value.delete(0)
}
function insertOne() {
  marsGuiRef.value.insert(3, {
    type: "input",
    field: "weidu",
    label: "纬度",
    value: "122.234324",
    change(data) {
      console.log("数据change变化", data)
    }
  })
}
function insertMore() {
  marsGuiRef.value.insert(
    6,
    {
      type: "input",
      field: "field1",
      label: "字段1",
      value: "字段一",
      change(data) {
        console.log("数据change变化", data)
      }
    },
    {
      type: "input",
      field: "field2",
      label: "字段2",
      value: "字段二",
      change(data) {
        console.log("数据change变化", data)
      }
    }
  )
}

function updateExtra() {
  marsGuiRef.value.updateExtra("dufenmiao", "测试改变为显示经度{jingdu}")
}

function gui1Change(data) {
  console.log("数据change变化", data)
}

const options2 = ref<GuiItem[]>([
  {
    type: "input",
    field: "field1",
    label: "字段1",
    value: "字段一",
    change(data) {
      console.log("数据change变化", data)
    }
  }
])

function updateAll() {
  options2.value = [
    {
      type: "input",
      field: "field2",
      label: "字段2",
      value: "字段二",
      change(data) {
        console.log("数据change变化", data)
      }
    }
  ]
}
</script>
<style lang="less"></style>
