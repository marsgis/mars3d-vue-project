<template>
  <mars-dialog title="坐标拾取" :handles="false" width="298" height="330" top="50" right="10" :min-width="340">
    <template #icon>
      <mars-icon icon="icon-park-outline:local" width="18" />
    </template>
    <div class="position-container">
      <a-form>
        <a-form-item label="类型">
          <a-radio-group v-model:value="formState.radioFanwei" @change="changeFanwei">
            <a-radio value="1">十进制</a-radio>
            <a-radio value="2">度分秒</a-radio>
            <a-radio value="3" title="2000平面坐标">平面坐标</a-radio>
          </a-radio-group>
        </a-form-item>

        <!-- 十进制的面板 -->
        <div v-show="formState.radioFanwei === '1'">
          <a-form-item label="经度">
            <mars-input v-model:value="formState.lng" class="lnglat-input"> </mars-input>
          </a-form-item>
          <a-form-item label="纬度">
            <mars-input v-model:value="formState.lat" class="lnglat-input"> </mars-input>
          </a-form-item>
          <a-form-item label="高程">
            <mars-input v-model:value="formState.alt" class="lnglat-input"> </mars-input>
          </a-form-item>
        </div>

        <!-- 度分秒的面板 -->
        <div v-show="formState.radioFanwei === '2'">
          <a-form-item label="经度">
            <a-space>
              <mars-input v-model:value="formState.jdDegree"> </mars-input>° <mars-input v-model:value="formState.jdMinute"> </mars-input>'
              <mars-input v-model:value="formState.jdSecond"> </mars-input>"
            </a-space>
          </a-form-item>
          <a-form-item label="纬度">
            <a-space>
              <mars-input v-model:value="formState.wdDegree"> </mars-input>° <mars-input v-model:value="formState.wdMinute"> </mars-input>'
              <mars-input v-model:value="formState.wdSecond"> </mars-input>"
            </a-space>
          </a-form-item>
          <a-form-item label="高程">
            <mars-input v-model:value="formState.alt" class="lnglat-input"> </mars-input>
          </a-form-item>
        </div>

        <!-- 平面坐标的面板 -->
        <div v-show="formState.radioFanwei === '3'">
          <a-form-item label="分带">
            <a-radio-group v-model:value="formState.radioFendai" @change="changeFendai">
              <a-radio value="1">三度带</a-radio>
              <a-radio value="2">六度带</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="纵坐标">
            <mars-input v-model:value="formState.gk6X" class="lnglat-input"> </mars-input>
          </a-form-item>
          <a-form-item label="横坐标">
            <mars-input v-model:value="formState.gk6Y" class="lnglat-input"> </mars-input>
          </a-form-item>
          <a-form-item label="高度值">
            <mars-input v-model:value="formState.alt" class="lnglat-input"> </mars-input>
          </a-form-item>
        </div>
      </a-form>

      <div class="f-pt f-tac">
        <a-space>
          <mars-button @click="bindMourseClick">图上拾取</mars-button>
          <mars-button @click="submitCenter">坐标定位</mars-button>
        </a-space>
      </div>
    </div>
  </mars-dialog>
</template>

<script setup lang="ts">
import { reactive, UnwrapRef } from "vue"
import useLifecycle from "@mars/common/uses/use-lifecycle"
import * as mapWork from "./map"
import { $alert } from "@mars/components/mars-ui/index"

// 启用map.ts生命周期
useLifecycle(mapWork)

interface FormState {
  radioFanwei: string
  radioFendai: string
  lng: number
  lat: number
  alt: number
  jdDegree: number
  jdMinute: number
  jdSecond: number
  wdDegree: number
  wdMinute: number
  wdSecond: number
  gk6X: number
  gk6Y: number
}

const formState: UnwrapRef<FormState> = reactive({
  radioFanwei: "1",
  radioFendai: "2",
  lng: 0,
  lat: 0,
  alt: 0,
  jdDegree: 0,
  jdMinute: 0,
  jdSecond: 0,
  wdDegree: 0,
  wdMinute: 0,
  wdSecond: 0,
  gk6X: 0,
  gk6Y: 0
})

// 全局中间变量
let currJD: number
let currWD: number
let currGD: number

mapWork.eventTarget.on("loadOK", function (event: any) {
  currJD = event.currJD
  currWD = event.currWD
  currGD = event.currGD

  formState.lng = mapWork.marsUtilFormtNum(currJD, 6)
  formState.lat = mapWork.marsUtilFormtNum(currWD, 6)
  formState.alt = mapWork.marsUtilFormtNum(currGD, 6)
})

const changeFanwei = () => {
  switch (formState.radioFanwei) {
    case "2": // 度分秒
      formState.jdDegree = mapWork.marsPointTrans(currJD).degree
      formState.jdMinute = mapWork.marsPointTrans(currJD).minute
      formState.jdSecond = mapWork.marsPointTrans(currJD).second

      formState.wdDegree = mapWork.marsPointTrans(currWD).degree
      formState.wdMinute = mapWork.marsPointTrans(currWD).minute
      formState.wdSecond = mapWork.marsPointTrans(currWD).second

      formState.alt = mapWork.marsUtilFormtNum(currGD, 6)
      break
    case "3": // CGCS2000
      changeFendai()
      break
    default:
      // 十进制
      formState.lng = mapWork.marsUtilFormtNum(currJD, 6)
      formState.lat = mapWork.marsUtilFormtNum(currWD, 6)
      formState.alt = mapWork.marsUtilFormtNum(currGD, 6)
      break
  }
}

const changeFendai = () => {
  if (formState.radioFendai === "2") {
    // 十进制转2000平面六分度
    const zoon6 = mapWork.marsProj4Trans(currJD, currWD, formState.radioFendai)
    formState.gk6X = mapWork.marsUtilFormtNum(zoon6[0], 1)
    formState.gk6Y = mapWork.marsUtilFormtNum(zoon6[1], 1)
    formState.alt = mapWork.marsUtilFormtNum(currGD, 6)
  } else {
    // 十进制转2000平面三分度
    const zone3 = mapWork.marsProj4Trans(currJD, currWD, formState.radioFendai)
    formState.gk6X = mapWork.marsUtilFormtNum(zone3[0], 1)
    formState.gk6Y = mapWork.marsUtilFormtNum(zone3[1], 1)
    formState.alt = mapWork.marsUtilFormtNum(currGD, 6)
  }
}

const bindMourseClick = () => {
  mapWork.bindMourseClick()
}

mapWork.eventTarget.on("clickMap", (event: any) => {
  currJD = event.point.lng
  currWD = event.point.lat
  currGD = event.point.alt

  formState.lng = mapWork.marsUtilFormtNum(currJD, 6)
  formState.lat = mapWork.marsUtilFormtNum(currWD, 6)
  formState.alt = mapWork.marsUtilFormtNum(currGD, 6)
  changeFanwei()
  // 更新面板
  mapWork.updateMarker(false, currJD, currWD, currGD)
})

const submitCenter = () => {
  if (!formState.lng || !formState.lat || !formState.alt) {
    $alert("坐标不能为空")
    return
  }

  if (formState.lng > 180 || formState.lng < -180) {
    $alert("请输入有效的经度值！")
    return
  }

  if (formState.lat > 90 || formState.lat < -90) {
    $alert("请输入有效的纬度值！")
    return
  }

  mapWork.updateMarker(true, formState.lng, formState.lat, formState.alt)
}
</script>
<style lang="less" scoped>
.position-container {
  padding: 10px;
}
.lnglat-input {
  width: 200px;
}
</style>
