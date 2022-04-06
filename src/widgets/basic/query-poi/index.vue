<template>
  <mars-pannel customClass="query-poi-pannel" top="10" left="10">
    <div class="query-poi">
      <a-auto-complete
        class="search-input"
        ref="complete"
        v-model:value="searchTxt"
        :options="dataSource"
        size="large"
        :dropdown-style="{ 'background-color': 'rgba(63, 72, 84, 0.7' }"
        @search="handleSearch"
        @select="selectPoint"
        @focus="handleSearch(searchTxt)"
        @blur="blurSearch"
      >
        <a-input-search size="large" placeholder="搜索 地点" @search="searchPoint">
          <template #enterButton>
            <a-button>
              <mars-icon icon="search" width="20" color="#fff"></mars-icon>
            </a-button>
          </template>
        </a-input-search>
      </a-auto-complete>
      <div class="query-site" v-if="siteListShow">
        <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="siteSource">
          <template #renderItem="{ item, index }">
            <a-list-item>
              <a-list-item-meta :description="item.type">
                <template #title>
                  <a-space>
                    {{ index + 1 }}、
                    <a @click.stop="flyTo(item)" class="query-site-text">{{ item.name }}</a>
                    <a :href="url + item.id" target="_blank" class="query-site-more">更多></a>
                  </a-space>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
        <p class="query-site-allcount">共{{ allCount }}条结果</p>
      </div>
    </div>
  </mars-pannel>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { isLonLat } from "@mars/utils/mars-util"
import useLifecycle from "@mars/common/uses/use-lifecycle"
import * as mapWork from "./map"
import { $message, $alert } from "@mars/components/mars-ui/index"

// 启用map.ts生命周期
useLifecycle(mapWork)

const storageName = "mars3d_queryGaodePOI"
const siteListShow = ref(false)

// 各类数据
const searchTxt = ref("")
const dataSource = ref<any[]>([])
const siteSource = ref<any[]>([])
const complete = ref()

const allCount = ref()
const url = "//www.amap.com/detail/"

// 搜寻输入框数据之前的提示数据 以及搜寻过的历史数据  通过列表展现
const handleSearch = (val: string) => {
  if (val === "") {
    mapWork.clearLayers()
  }

  if (!val) {
    showHistoryList()
    return
  }
  siteListShow.value = false
  mapWork.queryData(val).then((result: any) => {
    const list: { value: string }[] = []
    result.list.forEach((item: any) => {
      if (list.every((l) => l.value !== item.name)) {
        list.push({
          value: item.name
        })
      }
    })
    dataSource.value = list
  })
}
const blurSearch = () => {
  const text = searchTxt.value

  if (!text) {
    mapWork.clearLayers()
    siteListShow.value = false
  }
}

// 展示搜寻过的历史数据
const showHistoryList = () => {
  const historys = JSON.parse(localStorage.getItem(storageName)!)
  if (historys && historys.length <= 10) {
    dataSource.value = (historys || []).map((item: any) => ({ value: item }))
  }
}

// 输入关键字，开始查询
const searchPoint = () => {
  const text = searchTxt.value

  if (!text) {
    $message("请输入搜索关键字！", "warning")
    return
  }

  if (isLonLat(text)) {
    mapWork.centerAtLonLat(text)
    return
  }

  addHistory(text)

  selectPoint(searchTxt.value)

  setTimeout(() => {
    complete.value.blur()
  }, 100)
}

// 开始查询并加载数据
const selectPoint = async (value: any) => {
  await querySiteList(value, 1)
  siteListShow.value = true
}

// 表格数据内部
const pagination = {
  onChange: (page: number) => {
    querySiteList(searchTxt.value, page)
  },
  size: "small",
  total: 0,
  pageSize: 6,
  simple: true
}

function querySiteList(text: string, page: number) {
  mapWork.querySiteList(text, page).then((result: any) => {
    pagination.total = Number(result.allcount) || 0
    siteSource.value = result.list || []
    allCount.value = result.allcount

    mapWork.showPOIArr(result.list || [])
    return result
  })
}

// 定位至矢量图层
function flyTo(item: any) {
  const graphic = item._graphic
  if (graphic === null) {
    return $alert(item.name + " 无经纬度坐标信息！")
  }

  mapWork.flyToGraphic(graphic, { radius: 2000 })
}

/**
 * 将需要搜查的关键字记录进历史数据中
 * @param {any} data 输入框输入的关键字
 * @returns {void} 无
 */
function addHistory(data: any) {
  try {
    const arrHistory = JSON.parse(localStorage.getItem(storageName)!) || []
    if (!arrHistory.includes(data)) {
      arrHistory.unshift(data)
    }
    localStorage.setItem(storageName, JSON.stringify(arrHistory.slice(0, 10)))
  } catch (err: any) {
    throw new Error(err)
  }
}
</script>

<style lang="less">
.query-poi-pannel {
  background: none !important;
  border: none !important;
  padding: 0 !important;
  overflow: visible !important;
}
</style>
<style lang="less" scoped>
.query-poi {
  padding: 0;
  width: 300px;
  color: #fff;
  .search-input {
    width: 100%;
  }
}
.query-site {
  position: absolute;
  border-top: none;
  padding: 10px;
  width: 100%;
  background-color: rgba(63, 72, 84, 0.9);
}
.query-site-more {
  position: absolute;
  right: 10px;
  margin-top: -12px;
  font-size: 12px;
  color: #999 !important;
  &:hover {
    text-decoration: underline;
  }
}
.query-site-text {
  display: block;
  width: 186px;
}
.query-site-allcount {
  position: absolute;
  bottom: 11px;
  left: 15px;
}
:deep(.ant-btn-lg) {
  background-color: rgb(10, 142, 253);
  border-color: rgb(10, 142, 253);
}
:deep(.ant-input-lg) {
  font-size: 16px;
  border-color: #4db3ff;
}
:deep(.ant-list-item) {
  padding: 0;
}
:deep(.ant-list-item-meta) {
  margin: 0;
  padding: 10px 0;
}
:deep(.ant-list-item-meta-title) {
  font-size: 14px;
  margin: 0;
}

:deep(.ant-input) {
  background-color: @form-input-background !important;
  color: @mars-basecolor;
}
</style>
