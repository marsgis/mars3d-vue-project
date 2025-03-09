<template>
  <mars-dialog :draggable="false" customClass="query-poi-pannel" width="330" top="10" left="10">
    <div class="query-poi" @mousedown="clickVoid">
      <div class="mars-base-border_gradient">
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
            <img src="./img/search.png" alt="" @click="selectPoint(searchTxt)"/>
          </mars-button>
        </div>
      </div>

      <div v-if="searchListShow" class="mars-base-border_gradient f-push-5-t">
        <ul class="search-list">
          <li v-for="(item, i) in dataSource" :key="i" class="search-list__item" @click="selectPoint(item.value)">
            <mars-icon icon="history" width="16"></mars-icon>
            {{ item.value }}
          </li>
          <p v-if="isShowClearHisBtn" class="search-list__clear" @click="clearHistoryList">删除历史</p>
        </ul>
      </div>

      <div class="query-site" v-if="siteListShow">
        <template v-if="siteSource && siteSource.length">
          <ul>
            <li v-for="(item, i) in siteSource" :key="i" class="query-site__item" @click.stop="flyTo(item)">
              <div class="query-site__context">
                <p class="query-site-text f-toe" :title="item.name">
                  <span class="query-site-text_num">{{ i + 1 }}</span>
                  {{ item.name }}
                </p>
                <p class="query-site-sub">{{ item.type }}</p>
              </div>
              <!-- <a :href="url + item.id" target="_blank" class="query-site__more">
                更多
                <mars-icon icon="double-right" width="16"></mars-icon>
              </a> -->
            </li>
          </ul>
          <div class="query-site__page">
            <p class="query-site-allcount">共{{ allCount }}条结果</p>
            <a-pagination @change="(page) => querySiteList(searchTxt, page)" size="small" :total="allCount" pageSize="6" :simple="true" />
          </div>
        </template>
        <a-empty class="f-push-10-t" v-else />
      </div>
    </div>
  </mars-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { isLonLat, logInfo } from "@mars/utils/mars-util"
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
const isShowClearHisBtn = ref<boolean>(true) // 删除历史 按钮是否显示
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
  isShowClearHisBtn.value = false

  const result = await mapWork.queryData(val)
  const list: { value: string }[] = []

  result?.list.forEach((item: any) => {
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
    isShowClearHisBtn.value = true
  }
  if (timer) {
    clearTimeout(timer)
  }
  siteListShow.value = false
}

const clearHistoryList = () => {
  localStorage.removeItem(storageName)
  dataSource.value = []
  searchListShow.value = false
}

// 开始查询并加载数据
const selectPoint = async (value: any) => {
  searchTxt.value = value

  $showLoading()
  addHistory(value)
  logInfo("开始搜索", value)

  siteSource.value = []
  allCount.value = 0

  await querySiteList(value, 1)
  $hideLoading()
  searchListShow.value = false
}

// 表格数据内部
// const pagination = {
//   onChange: (page: number) => {
//     querySiteList(searchTxt.value, page)
//   },
//   size: "small",
//   total: 0,
//   pageSize: 6,
//   simple: true
// }

function clickVoid(e) {
  if (e.target.dataset?.event !== "prevent" && e.target.tagName !== "INPUT") {
    e.preventDefault()
  }
}

async function querySiteList(text: string, page: number) {
  const result = await mapWork.querySiteList(text, page)

  if (!result || !result.list || result.list.length <= 0) {
    $message("暂无数据")
    return
  }

  siteListShow.value = true
  // pagination.total = Number(result.allcount) || 0
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
  padding: 0 !important;
  overflow: visible !important;
  backdrop-filter: none !important;
  box-shadow: none !important;
}

.query-poi-pannel .mars-dialog__content {
  padding: 0 !important;
  background-color: transparent !important;
}
</style>
<style lang="less" scoped>
.query-poi {
  color: #fff;
  border-radius: 4px;

  .mars-base-border_gradient {
    background: var(--mars-poi-border);
  }

  .query-poi__search {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 45px;
    background: var(--mars-base-bg);
    padding: 3px;
    border-radius: 4px;

    .input {
      border: none;
      background: none;
      height: 44px;
      outline: none;
      padding-left: 10px;
      flex-grow: 1;

      :deep(.ant-input) {
        font-size: 16px;
        color: var(--mars-control-text) !important;

        &::placeholder {
          color: var(--mars-control-placeholder);
        }
      }
    }

    .button {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      height: 100%;
      width: 50px;
      border-radius: 4px;
    }
  }
}

// 提示列表
.search-list {
  width: 100%;
  .mars-drop-bg();
  position: relative;
  border-radius: 4px !important;
  backdrop-filter: blur(10px);
  padding: 4px;

  .search-list__item {
    height: 34px;
    line-height: 34px;
    padding-left: 14px;
    color: var(--mars-sub-title-color);
    cursor: pointer;

    &:hover {
      background-color: var(--mars-list-select);
    }
  }

  .search-list__clear {
    color: var(--mars-control-icon);
    padding: 8px 14px;
    text-align: right;
    cursor: pointer;
  }
}

// 搜索结果列表
.query-site {
  width: 100%;
  position: relative;
  z-index: 100;
  padding: 3px 4px 4px;
  margin-top: 7px;
  border-radius: 4px !important;
  backdrop-filter: blur(10px);
  .mars-drop-bg();

  .query-site__item {
    height: 80px;
    padding: 14px 13px 0 10px;
    display: flex;
    border-radius: 4px 4px 0px 0px;
    border-bottom: 1px solid var(--mars-control-border);

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: var(--mars-list-select);
    }

    .query-site__context {
      flex-grow: 1;

      .query-site-text {
        width: calc(100% - 12px);
        max-width: 255px;
        font-size: 14px;
        font-family: var(--mars-font-family);
        font-weight: normal;
        color: var(--mars-primary-color);

        .query-site-text_num {
          width: 18px;
          height: 18px;
          line-height: 16px;
          padding: 1.5px 5px;
          color: #ffffff;
          background-color: var(--mars-primary-color);
          margin-right: 5px;
          display: inline-block;
          text-align: center;
          border-radius: 50%;
        }
      }

      .query-site-sub {
        width: 200px;
        font-size: 12px;
        font-weight: normal;
        font-family: var(--mars-font-family);
        margin-left: 28px;
        margin-top: 8px;
        color: var(--mars-control-icon);
        word-break: break-all;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
    }

    .query-site__more {
      font-size: 12px;
      font-weight: normal;
      font-family: var(--mars-font-family);
      color: var(--mars-control-icon);
      text-decoration: none;
    }
  }

  .query-site__page {
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;

    .query-site-allcount {
      font-size: 14px;
      color: var(--mars-control-icon);
    }

    :deep(.ant-pagination-simple-pager) {
      color: var(--mars-control-icon);

      input {
        width: 50px;
      }
    }

    :deep(.ant-pagination-next) {
      .ant-pagination-item-link {
        color: var(--mars-control-icon);
      }
    }
  }
}

:deep(.ant-input-clear-icon) {
  color: var(--mars-control-icon) !important;
}
</style>
