<template>
  <mars-dialog :draggable="false" customClass="query-poi-pannel" top="10" left="10">
    <div class="query-poi" @mousedown="clickVoid">
      <div class="query-poi__search">
        <mars-input
          placeholder="搜索 地点"
          v-model:value="searchTxt"
          class="input"
          data-event="prevent"
          @blur="startCloseSearch"
          @focus="showHistoryList"
          allowClear
          @input="handleSearch(searchTxt)"
        ></mars-input>
        <mars-button class="button">
          <mars-icon icon="search" width="20" color="#fff" @click="selectPoint(searchTxt)"></mars-icon>
        </mars-button>
      </div>

      <ul class="search-list" v-if="searchListShow">
        <li v-for="(item, i) in dataSource" :key="i" class="search-list__item" @click="selectPoint(item.value)">
          {{ item.value }}
        </li>
      </ul>
      <div class="query-site" v-if="siteListShow">
        <template v-if="siteSource && siteSource.length">
          <ul>
            <li v-for="(item, i) in siteSource" :key="i" class="query-site__item" @click.stop="flyTo(item)">
              <div class="query-site__context">
                <p class="query-site-text f-toe" :title="item.name">
                  <span class="query-site-text_num">{{ i + 1 }}</span>
                  {{ item.name }}
                </p>
                <p class="query-site-sub f-toe">{{ item.type }}</p>
              </div>
              <a :href="url + item.id" target="_blank" class="query-site__more">
                <mars-icon icon="double-right" width="20"></mars-icon>
              </a>
            </li>
          </ul>
          <div class="query-site__page">
            <p class="query-site-allcount">共{{ allCount }}条结果</p>
            <a-pagination @change="(page: number) => querySiteList(searchTxt, page)" size="small" :total="allCount" pageSize="6" :simple="true" />
          </div>
        </template>
        <a-empty class="f-push-10-t" v-else />
      </div>
    </div>
  </mars-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { isLonLat } from "@mars/utils/mars-util"
import useLifecycle from "@mars/common/uses/use-lifecycle"
import * as mapWork from "./map"
import { $message, $alert } from "@mars/components/mars-ui/index"
import { $hideLoading, $showLoading } from "@mars/components/mars-ui/mars-loading"

// 启用map.ts生命周期
useLifecycle(mapWork)

const storageName = "mars3d_queryGaodePOI"
const siteListShow = ref(false)

// 各类数据
const searchTxt = ref("")
const dataSource = ref<any[]>([])
const searchListShow = ref<boolean>(false)
const siteSource = ref<any[]>([])

const allCount = ref(0)
const url = "//www.amap.com/detail/"

let timer

const startCloseSearch = () => {
  timer = setTimeout(() => {
    searchListShow.value = false
    clearTimeout(timer)
    timer = null
  }, 500) // 时间太短会导致点击失败
}

// 搜寻输入框数据之前的提示数据 以及搜寻过的历史数据  通过列表展现
const handleSearch = async (val: string) => {
  if (val === "") {
    showHistoryList()
    mapWork.clearLayers()
    return
  }

  if (isLonLat(val)) {
    mapWork.centerAtLonLat(val)
    return
  }

  siteListShow.value = false

  const result = await mapWork.queryData(val)
  const list: { value: string }[] = []

  result.list.forEach((item: any) => {
    if (list.every((l) => l.value !== item.name)) {
      list.push({
        value: item.name
      })
    }
  })

  dataSource.value = list
  searchListShow.value = true
}

// 展示搜寻过的历史数据
const showHistoryList = () => {
  if (searchTxt.value) {
    return
  }
  const historys = JSON.parse(localStorage.getItem(storageName)!)
  if (historys) {
    dataSource.value = (historys || []).map((item: any) => ({ value: item }))
    searchListShow.value = true
  }
  if (timer) {
    clearTimeout(timer)
  }
  siteListShow.value = false
}

// 开始查询并加载数据
const selectPoint = async (value: any) => {
  searchTxt.value = value

  $showLoading()
  addHistory(value)
  console.log("开始搜索", value)
  await querySiteList(value, 1)
  $hideLoading()
  siteListShow.value = true
  searchListShow.value = false
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

function clickVoid(e) {
  if (e.target.dataset?.event !== "prevent") {
    e.preventDefault()
  }
}

async function querySiteList(text: string, page: number) {
  const result = await mapWork.querySiteList(text, page)

  if (!result || !result.list || result.list.length <= 0) {
    $message("暂无数据")
    return
  }

  pagination.total = Number(result.allcount) || 0
  siteSource.value = result.list || []
  allCount.value = Number(result.allcount) || 0

  mapWork.showPOIArr(result.list || [])

  return result
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
.query-poi-pannel .mars-dialog__content {
  padding: 0 !important;
}
</style>
<style lang="less" scoped>
.query-poi {
  padding: 0;
  color: #fff;
  .query-poi__search {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 320px;
    height: 44px;
    border: 1px solid var(--mars-primary-color);
    background: var(--mars-bg-base);
    .input {
      border: none;
      background: none;
      height: 44px;
      outline: none;
      padding-left: 10px;
      flex-grow: 1;
      :deep(.ant-input) {
        font-size: 16px;
        color: var(--mars-text-color) !important;
      }
    }
    .button {
      height: 44px;
      width: 55px;
    }
  }
}
.search-list {
  min-height: 100px;
  width: 100%;
  .mars-drop-bg();
  position: absolute;
  .search-list__item {
    height: 36px;
    line-height: 36px;
    padding-left: 10px;
    color: var(--mars-text-color);
    cursor: pointer;
    &:hover {
      background-color: var(--mars-select-bg);
    }
  }
}
.query-site {
  position: absolute;
  border-top: none;
  padding-bottom: 10px;
  width: 100%;
  z-index: 100;
  .mars-drop-bg();

  .query-site__item {
    height: 80px;
    padding: 0 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    &:hover {
      background-color: var(--mars-select-bg);
    }
    .query-site__context {
      flex-grow: 1;
      .query-site-text {
        font-size: 16px;
        width: 200px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: var(--mars-text-color);
        .query-site-text_num {
          width: 19px;
          height: 25px;
          margin-right: 5px;
          display: inline-block;
          text-align: center;
          background-image: url("@mars/components/mars-ui/assets/images/query-site-text_num.png");
        }
      }
      .query-site-sub {
        font-size: 14px;
        width: 200px;
        margin-left: 19px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: var(--mars-content-color);
      }
    }
    .query-site__more {
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: var(--mars-content-color);
    }
  }
  .query-site__page {
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
    .query-site-allcount {
      font-size: 14px;
      color: var(--mars-text-color);
    }
  }
}
:deep(.ant-pagination-simple-pager) {
  input {
    width: 50px;
  }
}

:deep(.ant-input-clear-icon) {
  color: var(--mars-content-color) !important;
}
</style>
