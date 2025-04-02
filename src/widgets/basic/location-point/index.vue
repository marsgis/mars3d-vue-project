<template>
  <mars-dialog title="坐标拾取" icon="local" width="330" top="60">
    <mars-gui ref="marsGuiRef" :options="options" labelCol="5"></mars-gui>
    <div class="f-pt f-tac control-btn">
      <mars-button class="btn" @click="bindMourseClick">图上拾取</mars-button>
      <mars-button class="btn" @click="submitCenter">坐标定位</mars-button>
    </div>
  </mars-dialog>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from "vue"
import useLifecycle from "@mars/common/uses/use-lifecycle"
import { useWidget } from "@mars/common/store/widget"
import * as mapWork from "./map"
import type { GuiItem } from "@mars/components/mars-ui/mars-gui"

// 启用map.ts生命周期
useLifecycle(mapWork)
const { updateWidget } = useWidget()

// 取消工具栏高亮
onUnmounted(() => {
  updateWidget("toolbar", "location-point")
})

const marsGuiRef = ref()

onMounted(() => {
  const defaultPoitn = mapWork.defultPoint()

  marsUpdataPosition(defaultPoitn)
  marsPointTrans(defaultPoitn)
  marsProj4Trans(defaultPoitn)
})


const options: GuiItem[] = [
  {
    type: "radio",
    field: "type",
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
    ]
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
      changeDmsGk(data)
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
      changeDmsGk(data)
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
      changeDmsGk(data)
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
      changeGk(data)
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
      changeGk(data)
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
      changeGk(data)
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
      changeValue(data)
    },
    show(data) {
      return data.type === "3"
    }
  },
  {
    type: "input",
    field: "gk6X",
    label: "横坐标",
    value: "",
    show(data) {
      return data.type === "3"
    },
    change(value, data) {
      changeDms(data)
    }
  },
  {
    type: "input",
    field: "gk6Y",
    label: "纵坐标",
    value: "",
    show(data) {
      return data.type === "3"
    },
    change(value, data) {
      changeDms(data)
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
      changeDms(data)
    }
  }
]

// 十进制转2000平面三分度六分度
const changeValue = (data) => {
  marsZONEtoCRS(data)
  marsProj4Trans(data)
}

// 界面一
const changeDmsGk = (data) => {
  marsPointTrans(data)

  marsProj4Trans(data)
}

// 界面二
const changeGk = (data) => {
  marsGuiRef.value.updateField(
    "lng",
    mapWork.marsDms2degree(
      mapWork.marsUtilFormtNum(data.lngDMS[0], 6),
      mapWork.marsUtilFormtNum(data.lngDMS[1], 6),
      mapWork.marsUtilFormtNum(data.lngDMS[2], 6)
    )
  )
  marsGuiRef.value.updateField(
    "lat",
    mapWork.marsDms2degree(
      mapWork.marsUtilFormtNum(data.latDMS[0], 6),
      mapWork.marsUtilFormtNum(data.latDMS[1], 6),
      mapWork.marsUtilFormtNum(data.latDMS[2], 6)
    )
  )
  marsGuiRef.value.updateField("alt", data.altDMS)

  marsProj4Trans(data)
}

// 界面三
const changeDms = (data) => {
  marsZONEtoCRS(data)
  marsPointTrans(data)
}

const bindMourseClick = () => {
  mapWork.bindMourseClick()
}

// 图上拾取的坐标
mapWork.eventTarget.on("clickMap", (event: any) => {
  const data = reactive({
    lng: event.point.lng,
    lat: event.point.lat,
    alt: event.point.alt
  })

  marsUpdataPosition(data)
  marsPointTrans(data)
  marsProj4Trans(data)
  // 更新面板
  mapWork.updateMarker(false, data.lng, data.lat, data.alt)
})

// 更新度分秒
const marsUpdataPosition = (data) => {
  marsGuiRef.value.updateField("lng", mapWork.marsUtilFormtNum(data.lng, 6))
  marsGuiRef.value.updateField("lat", mapWork.marsUtilFormtNum(data.lat, 6))
  marsGuiRef.value.updateField("alt", mapWork.marsUtilFormtNum(data.alt, 6))
}

// 平面坐标转经纬度并更新
const marsZONEtoCRS = (data) => {
  const zone = mapWork.marsZONEtoCRS(Number(data.gk6X), Number(data.gk6Y), data.radioFendai)
  marsGuiRef.value.updateField("lng", mapWork.marsUtilFormtNum(zone[0], 6))
  marsGuiRef.value.updateField("lat", mapWork.marsUtilFormtNum(zone[1], 6))
  marsGuiRef.value.updateField("alt", data.gkAlt)
}

// 经纬度转平面坐标并更新
const marsProj4Trans = (data) => {
  const zone = mapWork.marsProj4Trans(
    mapWork.marsUtilFormtNum(data.lng, 6),
    mapWork.marsUtilFormtNum(data.lat, 6),
    marsGuiRef.value.getValue("radioFendai")
  )
  marsGuiRef.value.updateField("gk6X", mapWork.marsUtilFormtNum(zone[0], 1))
  marsGuiRef.value.updateField("gk6Y", mapWork.marsUtilFormtNum(zone[1], 1))
  marsGuiRef.value.updateField("gkAlt", mapWork.marsUtilFormtNum(data.alt, 6))
}

// 经纬度转度分秒并更新
const marsPointTrans = (data) => {
  const lngDMS = [mapWork.marsPointTrans(data.lng).degree, mapWork.marsPointTrans(data.lng).minute, mapWork.marsPointTrans(data.lng).second]
  const latDMS = [mapWork.marsPointTrans(data.lat).degree, mapWork.marsPointTrans(data.lat).minute, mapWork.marsPointTrans(data.lat).second]
  marsGuiRef.value.updateField("lngDMS", lngDMS)
  marsGuiRef.value.updateField("latDMS", latDMS)
  marsGuiRef.value.updateField("altDMS", mapWork.marsUtilFormtNum(data.alt, 6))
}

// 坐标定位
const submitCenter = () => {
  const data = marsGuiRef.value.getValues()
  mapWork.updateMarker(true, data.lng, data.lat, data.alt)
}
</script>
<style lang="less" scoped>
.control-btn {
  display: flex;

  .btn {
    flex: 1;

    &:last-child {
      margin-left: 10px;
    }
  }
}

:deep(.ant-col) {
  max-width: 100% !important;
  text-align: left;
}

:deep(.ant-radio-group) {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

:deep(.ant-radio-group label:nth-child(3)) {
  margin-right: 0px;
}

:deep(.ant-radio-group label:nth-child(3) span) {
  padding-inline-end: 0px;
}

:deep(.ant-radio-inner) {
  border-radius: 0px;
}

:deep(.ant-radio-inner::after) {
  border-radius: 0px !important;
}
</style>
