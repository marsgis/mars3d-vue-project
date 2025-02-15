<template>
  <mars-dialog title="图层" icon="layers" custom-class="manage-layer_pannel" :draggable="true" width="300" :min-width="250" top="60" right="10">
    <mars-tree
      class="layer-tree"
      checkable
      :tree-data="treeData"
      v-model:expandedKeys="expandedKeys"
      v-model:checkedKeys="checkedKeys"
      @check="checkedChange"
    >
      <template #title="node">
        <mars-dropdown-menu :trigger="['contextmenu']">
          <span @dblclick="flyTo(node)">{{ node.title }}</span>
          <template #overlay v-if="node.hasZIndex">
            <a-menu @click="(menu) => onContextMenuClick(node, menu.key)">
              <a-menu-item key="1">图层置为顶层</a-menu-item>
              <a-menu-item key="2">图层上移一层</a-menu-item>
              <a-menu-item key="3">图层下移一层</a-menu-item>
              <a-menu-item key="4">图层置为底层</a-menu-item>
            </a-menu>
          </template>
        </mars-dropdown-menu>
        <span v-if="node.hasOpacity && node.checked" class="tree-slider">
          <mars-slider v-model:value="opacityValue[node.key]" :min="0" :step="0.1" :max="1" @change="(value) => opcityChange(node, value)" />
        </span>
      </template>
    </mars-tree>
    <template #footer>
      <div class="tips">提示：双击可定位视域至其所在位置</div>
    </template>
  </mars-dialog>
</template>

<script lang="ts" setup>
import { onUnmounted, ref, onMounted } from "vue"
import useLifecycle from "@mars/common/uses/use-lifecycle"
import * as mapWork from "./map"
import { useWidget } from "@mars/common/store/widget"
import { logInfo } from "@mars/utils/mars-util"

const { activate, disable, updateWidget, currentWidget } = useWidget()
useLifecycle(mapWork)

onMounted(() => {
  initTree()
})

onUnmounted(() => {
  disable("layer-scenetree")
  updateWidget("toolbar", "manage-layer")
})

currentWidget.onUpdate(() => {
  treeData.value = []
  expandedKeys.value = []
  checkedKeys.value = []

  initTree()
})

const treeData = ref<any[]>()
const expandedKeys = ref<string[]>()
const checkedKeys = ref<string[]>()

const opacityValue = ref<{ id: number }>({} as any)

let lastWidget: any

// 初始化树构件
function initTree() {
  const showIds = [] // 是显示状态的图层id集合
  const openIds = [] // 展开的树节点id集合（如果不想展开，对应图层配置open:false）

  const result = mapWork.getLayrsTree({
    basemaps: true, // 是否取config.json中的basempas
    filter: function (layer) {
      if (!layer.name) {
        logInfo("未命名图层不加入图层管理", layer)
        return false // 未命名图层不在管理器展示
      }
      return true
    },
    forEach: function (item, layer) {
      item.key = item.id // 树控件api需要的唯一标识
      item.title = item.name || `未命名(${layer.type})` // 树控件api需要的显示文本字段

      item.hasZIndex = layer.hasZIndex // 当前vue绑定使用的属性
      item.hasOpacity = layer.hasOpacity

      // 记录在item中，会导致卡顿
      opacityValue.value[item.id] = layer.opacity ?? 1
      if (item.show) {
        showIds.push(item.id)
      }
      if (item.group && item.open !== false) {
        openIds.push(item.id)
      }
    }
  })
  logInfo("获取到的map图层树", result)

  // 赋予树控件
  treeData.value = result.tree
  checkedKeys.value = showIds
  expandedKeys.value = openIds
}

// 树控件 勾选事件
function checkedChange(keys: string[], e: any) {
  const layer = mapWork.getLayerById(e.node?.key)

  if (layer) {
    const show = keys.indexOf(e.node.key) !== -1
    mapWork.updateLayerShow(layer, show)

    // 特殊处理同目录下的单选的互斥的节点，可在config对应图层节点中配置"radio":true即可
    if (layer.options?.radio && e.checked) {
      // 循环所有的图层
      const layersM = mapWork.getLayerByAttr(layer.pid, "pid") // 与当前操作的图层的pid相同的图层
      for (let index = 0; index < layersM.length; index++) {
        const layerTemp = layersM[index]
        checkedKeys.value.forEach((key, index) => {
          if (layerTemp === key && layerTemp !== layer) {
            checkedKeys.value.splice(index, 1)
            layerTemp.show = false
          }
        })
      }
    }

    // 处理图层的关联事件
    if (layer.options?.onWidget) {
      if (e.checked) {
        if (lastWidget) {
          disable(lastWidget)
        }
        activate({
          name: layer.options.onWidget
        })
        lastWidget = layer.options.onWidget
      } else {
        disable(layer.options.onWidget)
      }
    }

    // 处理图层构件树控件
    if (layer.options?.scenetree) {
      initSceneTree(layer)
    }
  }

  // 处理子节点
  if (e.node.children && e.node.children.length) {
    e.node.children.forEach((child) => {
      checkedChange(keys, { node: child })
    })
  }
}

const opcityChange = (node: any, value: string | number) => {
  const layer = mapWork.getLayerById(node.id)
  if (layer) {
    layer.opacity = value
  }
}

const onContextMenuClick = (node: any, type: string) => {
  const parent = node._getParent()
  const children = parent?.children
  const index = node._index

  switch (type) {
    // <a-menu-item key="1">图层置为顶层</a-menu-item>
    case "1": {
      let layerIndex = index
      children[0]._index = index
      children[index]._index = 0
      while (layerIndex > 0) {
        mapWork.exchangeLayer(children[index].id, children[layerIndex - 1].id)
        layerIndex--
      }
      break
    }
    // <a-menu-item key="2">图层上移一层</a-menu-item>
    case "2": {
      children[index - 1]._index = index
      children[index]._index = index - 1
      mapWork.exchangeLayer(children[index].id, children[index - 1].id)

      break
    }
    // <a-menu-item key="3">图层下移一层</a-menu-item>
    case "3": {
      children[index + 1]._index = index
      children[index]._index = index + 1
      mapWork.exchangeLayer(children[index].id, children[index + 1].id)

      break
    }
    // <a-menu-item key="4">图层置为底层</a-menu-item>
    case "4": {
      let layerIndex = index
      children[children.length - 1]._index = index
      children[index]._index = children.length - 1
      while (layerIndex < children.length - 1) {
        mapWork.exchangeLayer(children[index].id, children[layerIndex + 1].id)
        layerIndex++
      }
      break
    }
  }

  parent.children = children.sort((a: any, b: any) => a._index - b._index)
}

function flyTo(item: any) {
  if (item.checked) {
    const layer = mapWork.getLayerById(item.id)
    layer.flyTo()
  }
}

function initSceneTree(layer: any) {
  disable("layer-scenetree")

  if (lastBindClickLayer) {
    lastBindClickLayer.off("click", onClickBimLayer)
    lastBindClickLayer = null
  }

  // 处理图层构件树控件
  if (layer.options.scenetree) {
    layer.on("click", onClickBimLayer)
    lastBindClickLayer = layer
  }
}

let lastBindClickLayer

function onClickBimLayer(event: any) {
  const layer = event.layer
  const url = layer.options.url
  const id = layer.id
  activate({
    name: "layer-scenetree",
    data: { url, id }
  })
}
</script>

<style lang="less">
.manage-layer_pannel {
  .mars-dialog__content {
    overflow-x: hidden !important;
  }
}

.layer-tree {
  .ant-tree-treenode-checkbox-checked {
    .ant-tree-node-content-wrapper {
      width: calc(100% - 55px);

      .ant-tree-title {
        display: inline-flex;
        width: calc(100% - 30px);
        align-items: center;
        justify-content: space-between;
      }
    }
  }
}
</style>

<style scoped lang="less">
.title {
  width: 50%;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-family: var(--mars-font-family);
}

.tree-slider {
  display: inline-block;
  width: 100px;
  margin-left: 5px;
  margin-right: 5px;
  vertical-align: middle;
}

.tips {
  width: 100%;
  text-align: center;
  margin-top: 10px;
  color: #9e9e9e;
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
