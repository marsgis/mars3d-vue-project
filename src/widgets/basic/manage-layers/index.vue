<template>
  <mars-dialog :draggable="true" title="图层" width="300" :min-width="250" top="60" right="10">
    <mars-tree checkable :tree-data="treeData" v-model:expandedKeys="expandedKeys" v-model:checkedKeys="checkedKeys" @check="checkedChange">
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
        <span v-if="node.hasOpacity" v-show="node.checked" class="tree-slider">
          <mars-slider v-model:value="opacityObj[node.id]" :min="0" :step="1" :max="100" @change="opcityChange(node)" />
        </span>
      </template>
    </mars-tree>
  </mars-dialog>
</template>
<script lang="ts" setup>
import { onUnmounted, nextTick, reactive, ref, onMounted } from "vue"
import useLifecycle from "@mars/common/uses/use-lifecycle"
import * as mapWork from "./map"
import { useWidget } from "@mars/common/store/widget"

const { activate, disable, currentWidget } = useWidget()
onMounted(() => {
  initTree()
})
onUnmounted(() => {
  disable("layer-tree")
})

useLifecycle(mapWork)

currentWidget.onUpdate(() => {
  treeData.value = []
  expandedKeys.value = []
  checkedKeys.value = []
  initTree()
})

const treeData = ref<any[]>([])

const expandedKeys = ref<string[]>([])

const checkedKeys = ref<string[]>([])

const layersObj: any = {}

const opacityObj: any = reactive({})

let lastWidget: any
const checkedChange = (keys: string[], e: any) => {
  const layer = layersObj[e.node.id]
  // console.log("点击的矢量图层", layer)
  if (layer) {
    if (!layer.isAdded) {
      mapWork.addLayer(layer)
    }

    // 特殊处理同目录下的单选的互斥的节点，可在config对应图层节点中配置"radio":true即可
    if (layer.options?.radio && e.checked) {
      // 循环所有的图层
      for (const i in layersObj) {
        const item = layersObj[i]
        // 循环所有的打开的图层
        checkedKeys.value.forEach((key, index) => {
          // 在所有图层中筛选与打开图层对应key值的图层 以及 与当前操作的图层的pid相同的图层
          if (item === layersObj[key] && layer.pid === layersObj[key].pid) {
            // 筛选出不是当前的其他图层进行图层隐藏以及移除
            if (item !== layer) {
              checkedKeys.value.splice(index, 1)
              item.show = false
            }
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

    // 处理子节点
    if (e.node.children && e.node.children.length) {
      renderChildNode(keys, e.node.children)
    }
    if (keys.indexOf(e.node.id) !== -1) {
      layer.show = true
      if (!layer.options.noCenter) {
        // 在对应config.json图层节点配置 noCenter:true 可以不定位
        layer.readyPromise.then(function (layer) {
          layer.flyTo()
        })
      }
    } else {
      layer.show = false
    }

    // 处理图层构件树控件
    if (layer.options?.scenetree) {
      initLayerTree(layer)
    }
  }
}

function renderChildNode(keys: string[], children: any[]) {
  children.forEach((child) => {
    const layer = layersObj[child.id]
    if (layer) {
      if (!layer.isAdded) {
        mapWork.addLayer(layer)
      }
      if (keys.indexOf(child.id) !== -1) {
        layer.show = true
      } else {
        layer.show = false
      }
      if (child.children) {
        renderChildNode(keys, child.children)
      }
      if (layer.options.scenetree) {
        initLayerTree(layer)
      }
    }
  })
}

const opcityChange = (node: any) => {
  const id = node.id
  const layer = layersObj[id]
  if (layer) {
    layer.opacity = opacityObj[id] / 100
  }
}

const onContextMenuClick = (node: any, type: string) => {
  const parent = node.parent
  const index = node.index
  switch (type) {
    case "1": {
      if (index !== 0) {
        parent.children[0].index = index
        parent.children[index].index = 0
      }
      break
    }
    case "2": {
      parent.children[index - 1].index = index
      parent.children[index].index = index - 1
      break
    }
    case "3": {
      parent.children[index + 1].index = index
      parent.children[index].index = index + 1
      break
    }
    case "4": {
      parent.children[parent.children.length - 1].index = index
      parent.children[index].index = parent.children.length - 1
      break
    }
  }

  parent.children = parent.children.sort((a: any, b: any) => a.index - b.index)
}

function flyTo(item: any) {
  if (item.checked) {
    const layer = layersObj[item.id]
    layer.flyTo()
  }
}

function initTree() {
  const layers = mapWork.getLayers()
  for (let i = layers.length - 1; i >= 0; i--) {
    const layer = layers[i] // 创建图层

    if (!layer._hasMapInit && layer.pid === -1 && layer.id !== 99) {
      layer.pid = 99 // 示例中创建的图层都放到99分组下面
    }

    layersObj[layer.id] = layer

    if (layer && layer.pid === -1) {
      const node: any = reactive({
        index: i,
        title: layer.name || `未命名(${layer.type})`,
        key: layer.id,
        id: layer.id,
        pId: layer.pid,
        hasZIndex: layer.hasZIndex,
        hasOpacity: layer.hasOpacity,
        opacity: 100 * (layer.opacity || 0)
      })
      if (layer.hasOpacity) {
        opacityObj[layer.id] = 100 * (layer.opacity || 0)
      }
      node.children = findChild(node, layers)
      treeData.value.push(node)

      if (layer.options.open !== false) {
        expandedKeys.value.push(node.key)
      }

      if (layer.isAdded && layer.show) {
        nextTick(() => {
          checkedKeys.value.push(node.key)
        })
      }
    }
  }

  treeData.value.forEach((data: any) => {
    data.children.forEach((item: any) => {
      if (item.children) {
        item.children.forEach((chil: any) => {
          if (layersObj[chil.key].options.radio) {
            chil.parent.disabled = true
          }
        })
      }
    })
  })
}
function findChild(parent: any, list: any[]) {
  return list
    .filter((item: any) => item.pid === parent.id)
    .reverse()
    .map((item: any, i: number) => {
      const node: any = {
        index: i,
        title: item.name || `未命名(${item.type})`,
        key: item.id,
        id: item.id,
        pId: item.pid,
        hasZIndex: item.hasZIndex,
        hasOpacity: item.hasOpacity,
        opacity: 100 * (item.opacity || 0),
        parent: parent
      }

      if (item.hasOpacity) {
        opacityObj[item.id] = 100 * (item.opacity || 0)
      }
      layersObj[item.id] = item

      node.children = findChild(node, list)

      if (item.options.open !== false) {
        expandedKeys.value.push(node.key)
      }

      if (item.isAdded && item.show) {
        nextTick(() => {
          checkedKeys.value.push(node.key)
        })
      }
      return node
    })
}

function initLayerTree(layer: any) {
  disable("layer-tree")

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
    name: "layer-tree",
    data: { url, id }
  })
}
</script>

<style scoped lang="less">
.tree-slider {
  display: inline-block;
  width: 70px;
  margin-left: 5px;
  vertical-align: middle;
}
</style>
