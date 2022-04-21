<template>
  <mars-dialog title="坐标拾取" :handles="false" width="298" height="330" top="50" right="10" :min-width="340">
    <template #icon>
      <mars-icon icon="local" width="18" />
    </template>
    <div class="position-container">
      <a-form>
        <mars-gui ref="marsGuiRef" :options="options"></mars-gui>
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
import { onMounted, reactive, UnwrapRef, ref } from "vue"
import useLifecycle from "@mars/common/uses/use-lifecycle"
import * as mapWork from "./map"
import { $alert } from "@mars/components/mars-ui/index"
import type { GuiItem } from "@mars/components/mars-ui/mars-gui"

// 启用map.ts生命周期
useLifecycle(mapWork)

const marsGuiRef = ref()

onMounted(() => {
  const defaultPoitn = mapWork.defultPoint()

  marsGuiRef.value.updateField("lng", mapWork.marsUtilFormtNum(defaultPoitn.lng, 6))
  marsGuiRef.value.updateField("lat", mapWork.marsUtilFormtNum(defaultPoitn.lat, 6))
  marsGuiRef.value.updateField("alt", mapWork.marsUtilFormtNum(defaultPoitn.alt, 6))

  const lngDMS = [mapWork.marsPointTrans(defaultPoitn.lng).degree, mapWork.marsPointTrans(defaultPoitn.lng).minute, mapWork.marsPointTrans(defaultPoitn.lng).second]
  const latDMS = [mapWork.marsPointTrans(defaultPoitn.lat).degree, mapWork.marsPointTrans(defaultPoitn.lat).minute, mapWork.marsPointTrans(defaultPoitn.lat).second]
  marsGuiRef.value.updateField("lngDMS", lngDMS)
  marsGuiRef.value.updateField("latDMS", latDMS)
  marsGuiRef.value.updateField("altDMS", mapWork.marsUtilFormtNum(defaultPoitn.alt, 6))

  const zone = mapWork.marsProj4Trans(defaultPoitn.lng, defaultPoitn.lat, marsGuiRef.value.getValue("radioFendai"))
  marsGuiRef.value.updateField("gk6X", mapWork.marsUtilFormtNum(zone[0], 1))
  marsGuiRef.value.updateField("gk6Y", mapWork.marsUtilFormtNum(zone[1], 1))
  marsGuiRef.value.updateField("gkAlt", mapWork.marsUtilFormtNum(defaultPoitn.alt, 6))

})
const options: GuiItem[] = [
  {
    type: "radio",
    field: "type",
    label: "类型",
    value: "1",
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
    change(value, data) {
      // changeValue(value, data)
    }
  },
  {
    type: "input",
    field: "lng",
    label: "经度",
    value: "",
    show(data) {
      return data.type === "1"
    },
    change(value, data) {
      changeValue3(value, data)
    }
  },
  {
    type: "input",
    field: "lat",
    label: "纬度",
    value: "",
    show(data) {
      return data.type === "1"
    },
    change(value, data) {
      changeValue3(value, data)
    }
  },
  {
    type: "input",
    field: "alt",
    label: "高程",
    value: "",
    show(data) {
      return data.type === "1"
    },
    change(value, data) {
      changeValue3(value, data)
    }
  },
  {
    type: "inputGroup",
    field: "lngDMS",
    label: "经度",
    value: [0, 0, 0],
    units: ["度", "分", "秒"],
    show(data) {
      return data.type === "2"
    },
    change(value, data) {
      changeValue4(value, data)
    }

  },
  {
    type: "inputGroup",
    field: "latDMS",
    label: "纬度",
    value: [0, 0, 0],
    units: ["度", "分", "秒"],
    show(data) {
      return data.type === "2"
    },
    change(value, data) {
      changeValue4(value, data)
    }
  },
  {
    type: "input",
    field: "altDMS",
    label: "高程",
    value: "",
    show(data) {
      return data.type === "2"
    },
    change(value, data) {
      changeValue4(value, data)
    }
  },
  {
    type: "radio",
    field: "radioFendai",
    label: "分带",
    value: "1",
    data: [
      {
        label: "三度带",
        value: "1"
      },
      {
        label: "六度带",
        value: "2"
      }
    ],
    change(value, data) {
      changeValue2(value, data)
    },
    show(data) {
      return data.type === "3"
    }
  },
  {
    type: "input",
    field: "gk6X",
    label: "纵坐标",
    value: "",
    show(data) {
      return data.type === "3"
    },
    change(value, data) {
      changeValue5(value, data)
    }
  },
  {
    type: "input",
    field: "gk6Y",
    label: "横坐标",
    value: "",
    show(data) {
      return data.type === "3"
    },
    change(value, data) {
      changeValue5(value, data)
    }
  },
  {
    type: "input",
    field: "gkAlt",
    label: "高度值",
    value: "",
    show(data) {
      return data.type === "3"
    },
    change(value, data) {
      changeValue5(value, data)
    }
  }
]

// 十进制转2000平面三分度六分度
const changeValue2 = (value, data) => {

  const zoon = mapWork.marsZONEtoCRS(Number(data.gk6X), Number(data.gk6Y), data.radioFendai)
  marsGuiRef.value.updateField("lng", mapWork.marsUtilFormtNum(zoon[0], 6))
  marsGuiRef.value.updateField("lat", mapWork.marsUtilFormtNum(zoon[1], 6))
  marsGuiRef.value.updateField("alt", data.gkAlt)

  const zone = mapWork.marsProj4Trans(mapWork.marsUtilFormtNum(data.lng, 6), mapWork.marsUtilFormtNum(data.lat, 6), data.radioFendai)
  marsGuiRef.value.updateField("gk6X", mapWork.marsUtilFormtNum(zone[0], 1))
  marsGuiRef.value.updateField("gk6Y", mapWork.marsUtilFormtNum(zone[1], 1))
  marsGuiRef.value.updateField("gkAlt", mapWork.marsUtilFormtNum(data.alt, 6))
}

const changeValue3 = (value, data) => {
  const lngDMS = [mapWork.marsPointTrans(data.lng).degree, mapWork.marsPointTrans(data.lng).minute, mapWork.marsPointTrans(data.lng).second]
  const latDMS = [mapWork.marsPointTrans(data.lat).degree, mapWork.marsPointTrans(data.lat).minute, mapWork.marsPointTrans(data.lat).second]
  marsGuiRef.value.updateField("lngDMS", lngDMS)
  marsGuiRef.value.updateField("latDMS", latDMS)
  marsGuiRef.value.updateField("altDMS", mapWork.marsUtilFormtNum(data.alt, 6))

  const zone = mapWork.marsProj4Trans(mapWork.marsUtilFormtNum(data.lng, 6), mapWork.marsUtilFormtNum(data.lat, 6), data.radioFendai)
  marsGuiRef.value.updateField("gk6X", mapWork.marsUtilFormtNum(zone[0], 1))
  marsGuiRef.value.updateField("gk6Y", mapWork.marsUtilFormtNum(zone[1], 1))
  marsGuiRef.value.updateField("gkAlt", mapWork.marsUtilFormtNum(data.alt, 6))
}

const changeValue4 = (value, data) => {

  marsGuiRef.value.updateField("lng", mapWork.marsDms2degree(mapWork.marsUtilFormtNum(data.lngDMS[0], 6), mapWork.marsUtilFormtNum(data.lngDMS[1], 6), mapWork.marsUtilFormtNum(data.lngDMS[2], 6)))
  marsGuiRef.value.updateField("lat", mapWork.marsDms2degree(mapWork.marsUtilFormtNum(data.latDMS[0], 6), mapWork.marsUtilFormtNum(data.latDMS[1], 6), mapWork.marsUtilFormtNum(data.latDMS[2], 6)))
  marsGuiRef.value.updateField("alt", data.altDMS)

  const zone = mapWork.marsProj4Trans(data.lng, data.lat, data.radioFendai)
  marsGuiRef.value.updateField("gk6X", mapWork.marsUtilFormtNum(zone[0], 1))
  marsGuiRef.value.updateField("gk6Y", mapWork.marsUtilFormtNum(zone[1], 1))
  marsGuiRef.value.updateField("gkAlt", mapWork.marsUtilFormtNum(data.altDMS, 6))
}

const changeValue5 = (value, data) => {

  const zoon = mapWork.marsZONEtoCRS(Number(data.gk6X), Number(data.gk6Y), data.radioFendai)
  marsGuiRef.value.updateField("lng", mapWork.marsUtilFormtNum(zoon[0], 6))
  marsGuiRef.value.updateField("lat", mapWork.marsUtilFormtNum(zoon[1], 6))
  marsGuiRef.value.updateField("alt", data.gkAlt)

  const lngDMS = [mapWork.marsPointTrans(data.lng).degree, mapWork.marsPointTrans(data.lng).minute, mapWork.marsPointTrans(data.lng).second]
  const latDMS = [mapWork.marsPointTrans(data.lat).degree, mapWork.marsPointTrans(data.lat).minute, mapWork.marsPointTrans(data.lat).second]
  marsGuiRef.value.updateField("lngDMS", lngDMS)
  marsGuiRef.value.updateField("latDMS", latDMS)
  marsGuiRef.value.updateField("altDMS", mapWork.marsUtilFormtNum(data.gkAlt, 6))

  console.log(data)
}


const bindMourseClick = () => {
  mapWork.bindMourseClick()
}

mapWork.eventTarget.on("clickMap", (event: any) => {
  const currJD = event.point.lng
  const currWD = event.point.lat
  const currGD = event.point.alt

  marsGuiRef.value.updateField("lng", mapWork.marsUtilFormtNum(currJD, 6))
  marsGuiRef.value.updateField("lat", mapWork.marsUtilFormtNum(currWD, 6))
  marsGuiRef.value.updateField("alt", mapWork.marsUtilFormtNum(currGD, 6))

  const lngDMS = [mapWork.marsPointTrans(currJD).degree, mapWork.marsPointTrans(currJD).minute, mapWork.marsPointTrans(currJD).second]
  const latDMS = [mapWork.marsPointTrans(currWD).degree, mapWork.marsPointTrans(currWD).minute, mapWork.marsPointTrans(currWD).second]
  marsGuiRef.value.updateField("lngDMS", lngDMS)
  marsGuiRef.value.updateField("latDMS", latDMS)
  marsGuiRef.value.updateField("altDMS", mapWork.marsUtilFormtNum(currGD, 6))

  const zone = mapWork.marsProj4Trans(currJD, currWD, marsGuiRef.value.getValue("radioFendai"))
  marsGuiRef.value.updateField("gk6X", mapWork.marsUtilFormtNum(zone[0], 1))
  marsGuiRef.value.updateField("gk6Y", mapWork.marsUtilFormtNum(zone[1], 1))
  marsGuiRef.value.updateField("gkAlt", mapWork.marsUtilFormtNum(currGD, 6))
  // 更新面板
  mapWork.updateMarker(false, currJD, currWD, currGD)
})

const submitCenter = () => {
  const data = marsGuiRef.value.getValues()
  mapWork.updateMarker(true, data.lng, data.lat, data.alt)
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
