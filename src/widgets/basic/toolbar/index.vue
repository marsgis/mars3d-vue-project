<template>
  <mars-pannel customClass="base-pannel" right="10" top="10">
    <template v-for="(item, i) in data" :key="i">
      <div v-if="item.widget && !item.children" class="toolbar-item" @click="showWidget(item.widget)">
        <mars-icon :icon="item.icon" width="18"></mars-icon>
        <span class="title">{{ item.name }}</span>
      </div>
      <mars-dropdown-menu v-if="item.children && !item.widget" trigger="hover" placement="bottomRight">
        <div class="toolbar-item">
          <mars-icon :icon="item.icon" width="18"></mars-icon>
          <span class="title">{{ item.name }}</span>
          <mars-icon icon="down" width="18"></mars-icon>
        </div>
        <template #overlay>
          <a-menu @click="clickMenu">
            <a-menu-item v-for="child in item.children" :key="child.widget">
              <mars-icon :icon="child.icon" width="18"></mars-icon>
              <span>{{ child.name }}</span>
            </a-menu-item>
          </a-menu>
        </template>
      </mars-dropdown-menu>
    </template>
  </mars-pannel>
</template>

<script setup lang="ts">
/**
 * 导航菜单按钮 （右上角）
 * @copyright 火星科技 mars3d.cn
 * @author 火星吴彦祖 2022-01-10
 */
import { useWidget } from "@mars/common/store/widget"

const { activate } = useWidget()

const data = [
  { name: "底图", icon: "international", widget: "manage-basemap" },
  { name: "图层", icon: "layers", widget: "manage-layers" },
  {
    name: "工具",
    icon: "tool",
    children: [
      // { name: "图上量算", icon: "ruler", widget: "measure" },
      // { name: "空间分析", icon: "analysis", widget: "analysis" },
      { name: "坐标定位", icon: "local", widget: "location-point" }
      // { name: "地区导航", icon: "navigation", widget: "location-region" },
      // { name: "我的标记", icon: "mark", widget: "addmarker" },
      // { name: "视角书签", icon: "bookmark", widget: "bookmark" },
      // { name: "地图打印", icon: "printer", widget: "print" },
      // { name: "飞行漫游", icon: "take-off", widget: "roamLine-list" },
      // { name: "图上标绘", icon: "hand-painted-plate", widget: "plot" },
      // { name: "路线导航", icon: "connection", widget: "query-route" },
      // { name: "卷帘对比", icon: "switch-contrast", widget: "map-split" },
      // { name: "分屏对比", icon: "full-screen-play", widget: "map-compare" }
      // { name: "百度街景", icon: h(City, { theme: "outline", size: "18" }), widget: "street-view" }
    ]
  }
]

const showWidget = (widget: string) => {
  activate(widget)
}

const clickMenu = ({ key }: any) => {
  showWidget(key)
}
</script>

<style lang="less">
.base-pannel {
  padding: 0 !important;
  background: rgba(23, 49, 71, 0.8);
  border: 1px solid;
  border-image: linear-gradient(180deg, #1081e1, #1081e1) 10 10;
  border-radius: 0px;
  background-color: rgba(43, 44, 47, 0.8) !important;
  height: 40px;
  .toolbar-item {
    display: inline-block;
    padding: 6px 12px;
    height: 100%;
    color: @mars-content-color;
    font-size: 15px;
    &:hover {
      background-color: @mars-select-bg;
      color: @mars-base-color;
    }
  }
  .mars-icon {
    margin-right: 5px;
  }
}
</style>
