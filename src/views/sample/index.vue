<template>
  <PannelBox class="infoView" v-auto-height="100">
    <a-form :model="formState" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
      <a-collapse v-model:activeKey="activeKey">
        <!-- 自定义切换图标 -->
        <template #expandIcon>
          <icon-down-c />
        </template>
        <a-collapse-panel key="1" header="表单控件">
          <!-- 自定义面板右侧图标 -->
          <template #extra>
            <icon-config theme="outline" />
          </template>

          <a-form-item label="简单文本" name="url">
            <mars-input v-model:value="formState.url" :allowClear="true" @change="onTextChange" />
          </a-form-item>

          <a-form-item label="地图交互" name="extent">
            <a-row :gutter="5">
              <a-col :span="19">
                <mars-input v-model:value="formState.extent" :allowClear="true"></mars-input>
              </a-col>
              <a-col :span="5">
                <a-space size="small">
                  <mars-button class="small-btn" @click="onClickDrawExtent">绘制</mars-button>
                </a-space>
              </a-col>
            </a-row>
          </a-form-item>

          <a-form-item label="数字输入">
            <mars-input-number v-model:value="formState.countCar" :step="0.1" @change="onNumberChange" />
          </a-form-item>

          <a-form-item label="下拉选择">
            <mars-select v-model:value="formState.model" :options="modelOptions" @change="onSelectChange"></mars-select>
          </a-form-item>

          <a-form-item label="日期">
            <mars-date-picker v-model:value="formState.date" format="YYYY-MM-DD" @change="onDateChange" />
          </a-form-item>

          <a-form-item label="滑动条">
            <a-slider v-model:value="formState.brightness" :min="-0.5" :max="1.5" :step="0.05" @change="onSliderChange" />
          </a-form-item>

          <a-form-item label="刻度滑动条">
            <a-slider v-model:value="formState.contrast" :marks="marks" :min="-255" :max="255" :step="1" @change="onMarkSliderChange" />
          </a-form-item>

          <a-form-item label="多选">
            <a-checkbox-group v-model:value="formState.checkboxVal" @change="onCheckboxChange">
              <a-checkbox value="mars">火星</a-checkbox>
              <a-checkbox value="earth">地球</a-checkbox>
              <a-checkbox value="sun">太阳</a-checkbox>
            </a-checkbox-group>
          </a-form-item>

          <a-form-item label="单选">
            <a-radio-group v-model:value="formState.radioVal">
              <a-radio value="1">2D</a-radio>
              <a-radio value="2">2.5D</a-radio>
              <a-radio value="3">3D</a-radio>
            </a-radio-group>
            <!-- 已选择：{{ formState.radioVal }} -->
          </a-form-item>

          <a-form-item label="允许鼠标操作">
            <a-switch v-model:checked="formState.isScale" @change="onSwitchChange" />
          </a-form-item>

          <a-form-item label="颜色选择">
            <mars-color-picker v-model:value="formState.color" />
            已选择：{{ formState.color }}
          </a-form-item>

          <div class="f-tac">
            <a-space>
              <mars-button size="middle" @click="onClickMessage">
                <template #icon><icon-alarm /></template>
                消息
              </mars-button>
              <mars-button size="middle" @click="onClickNotify">
                <template #icon><icon-download-one /></template>
                提示
              </mars-button>
              <mars-button size="middle" @click="onClickAlert">
                <template #icon><icon-download-one /></template>
                弹窗
              </mars-button>
            </a-space>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </a-form>
  </PannelBox>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue"
import PannelBox from "@comp/OperationPannel/PannelBox.vue"
import { TableColumnType, TableProps } from "ant-design-vue"
import type { Dayjs } from "dayjs"

import * as mapWork from "./map.js"

const activeKey = ref(["1", "2", "3"])

interface FormState {
  url: string
  extent: string
  countCar: number
  model: string
  date: Dayjs | null
  brightness: number
  contrast: number
  checkboxVal: string[]
  radioVal: string
  isScale: boolean
  color: string
}
const formState = reactive<FormState>({
  url: "",
  extent: "",
  countCar: 1,
  model: "qiche",
  date: null,
  brightness: 0,
  contrast: 128,
  checkboxVal: ["mars"],
  radioVal: "3",
  isScale: true,
  color: "#ffff00"
})



const rules = {
  url: [{ required: true, message: "请输入内容", trigger: "blur" }]
}

onMounted(() => {
  mapWork.eventTarget.on("test", (res: any) => {
    console.log("触发test")
    console.log(res)
  })
})

// 数字输入框修改事件
const onTextChange = () => {
  window.$message("您输入了文本：" + formState.url)
}

// 渲染模型
const onClickDrawExtent = () => {
  mapWork.drawExtent(formState.extent)
}
mapWork.eventTarget.on("drawExtent", function (event: any) {
  formState.extent = event.extent
})

// 数字输入框修改事件
const onNumberChange = () => {
  window.$message("您修改了数字：" + formState.countCar)
}

// 下拉列表数据
const modelOptions = [
  {
    value: "jingche",
    label: "警车",
    style: { scale: 8, url: "//data.mars3d.cn/gltf/mars/jingche/jingche.gltf" }
  },
  {
    value: "qiche",
    label: "小汽车",
    style: { scale: 1, url: "//data.mars3d.cn/gltf/mars/qiche.gltf" }
  }
]

// 下拉列表切换事件
const onSelectChange = (value: string, data: any) => {
  window.$message("您选择了：" + data.label)
  console.log(data)
}

// 日期切换事件
const onDateChange = (data: any, value: any) => {
  window.$message("您选择了日期：" + value)
}

// 多选框勾选事件
const onCheckboxChange = () => {
  window.$message("您勾选了：" + formState.checkboxVal)
  console.log(formState.checkboxVal)
}

// 滑动条修改事件
const onSliderChange = () => {
  mapWork.updateBrightness(formState.brightness)
}

const marks: Record<number, any> = {
  "-255": "-255",
  "-200": "200",
  "-100": "-100",
  0: "0",
  100: "100",
  200: "200",
  255: "255"
}
// 带刻度滑动条修改事件
const onMarkSliderChange = () => {
  mapWork.updateContrast(formState.contrast) // 调用地图方法
}

// switch切换了
const onSwitchChange = () => {
  mapWork.enableMapMouseController(formState.isScale) // 调用地图方法
}

// 显示消息提示，自动消失
const onClickMessage = () => {
  window.$message("Message消息提示演示")
}

// 显示提示窗，不影响地图操作，会出现在页面右下角
const onClickNotify = async () => {
  window.$notify("Notify提示窗", `该窗口会出现在页面右下角，不影响地图交互操作。`)
}

// 显示遮罩提示窗，需要手动关闭
const onClickAlert = async () => {
  // window.$alert 返回一个Promise
  await window.$alert(`该窗口会出现在后需要单击按钮进行关闭，会遮罩影响地图交互操作。`, "Alert提示窗")

  window.$message("点击了确定按钮") // 异步单击确定后提示
}


</script>
<style lang="less">
.infoView {
  overflow-y: auto;
}
</style>
