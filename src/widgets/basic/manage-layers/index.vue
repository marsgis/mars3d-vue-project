<template>
  <mars-dialog title="图层" width="320" :min-width="320" top="50" bottom="40" right="10">
    <mars-tree checkable :tree-data="treeData" v-model:expandedKeys="expandedKeys" v-model:checkedKeys="checkedKeys" @check="checkedChange">
      <template #title="node">
        <a-dropdown :trigger="['contextmenu']">
          <span @dblclick="flyTo(node)">{{ node.title }}</span>
          <template #overlay v-if="node.hasZIndex">
            <a-menu @click="(menu: any) => onContextMenuClick(node, menu.key)">
              <a-menu-item key="1">图层置为顶层</a-menu-item>
              <a-menu-item key="2">图层上移一层</a-menu-item>
              <a-menu-item key="3">图层下移一层</a-menu-item>
              <a-menu-item key="4">图层置为底层</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <span v-if="node.hasOpacity" v-show="node.checked" class="tree-slider">
          <!-- <a-slider v-model:value="node.data.opacity" :min="0" :step="1" :max="100" @change="opcityChange(node)" /> -->
          <a-slider v-model:value="opacityObj[node.id]" :min="0" :step="1" :max="100" @change="opcityChange(node)" />
        </span>
      </template>
    </mars-tree>
  </mars-dialog>
</template>
<script lang="ts" setup>
import MarsDialog from "@/components/marsgis/mars-dialog.js"
import { onUnmounted, nextTick, reactive, ref } from "vue"
import useLifecycle from "@/common/uses/use-lifecycle.js"
import * as mapWork from "./map"
import { useStore } from "vuex"

const store = useStore()

onUnmounted(() => {
  store.dispatch("disable", "layer-tree")
})

useLifecycle(mapWork)

const treeData = ref<any[]>([])

const expandedKeys = ref<string[]>([])

const checkedKeys = ref<string[]>([])

const layersObj: any = {}

const opacityObj: any = reactive({})

mapWork.eventTarget.on("loadOK", () => {
  initTree()
})

let lastWidget: any
const checkedChange = (keys: string[], e: any) => {
  const layer = layersObj[e.node.id]
  console.log(layer)

  if (layer) {
    if (!layer.isAdded) {
      mapWork.addLayer(layer)
    }
    if (keys.indexOf(e.node.id) !== -1) {
      layer.show = true
      layer.flyTo()
    } else {
      layer.show = false
    }

    // 处理图层构件树控件
    if (layer.options.scenetree) {
      initLayerTree(layer)
    }

    // 处理图层的关联事件
    if (layer.options.onWidget) {
      if (e.checked) {
        if (lastWidget) {
          store.dispatch("disable", lastWidget)
        }

        store.dispatch("activate", {
          name: layer.options.onWidget
        })
        lastWidget = layer.options.onWidget
      } else {
        store.dispatch("disable", layer.options.onWidget)
      }
    }

    // 处理子节点
    if (e.node.children && e.node.children.length) {
      renderChildNode(keys, e.node.children)
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

// 未知原因导致的性能问题？？？？
// const opcityChange = (node: any) => {
//   const layer = layersObj[node.id]
//   if (layer) {
//     layer.opacity = node.data.opacity / 100
//   }
// }
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

    if (layer && layer.pid === -1) {
      const node: any = reactive({
        index: i,
        title: layer.name,
        key: layer.id,
        id: layer.id,
        pId: layer.pid,
        uuid: layer.uuid,
        hasZIndex: layer.hasZIndex,
        hasOpacity: layer.hasOpacity,
        opacity: 100 * (layer.opacity || 0)
      })
      if (layer.hasOpacity) {
        opacityObj[layer.id] = 100 * (layer.opacity || 0)
      }
      node.children = findChild(node, layers)
      treeData.value.push(node)
      expandedKeys.value.push(node.key)
    }
  }
}
function findChild(parent: any, list: any[]) {
  return list
    .filter((item: any) => item.pid === parent.id)
    .map((item: any, i: number) => {
      if ((item.pid = parent.id)) {
        const node: any = {
          index: i,
          title: item.name,
          key: item.id,
          id: item.id,
          pId: item.pid,
          uuid: item.uuid,
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
        expandedKeys.value.push(node.key)
        if (item.isAdded && item.show) {
          nextTick(() => {
            checkedKeys.value.push(node.key)
          })
        }
        return node
      }
    })
}

function initLayerTree(layer: any) {
  store.dispatch("disable", "layer-tree")
  // 处理图层构件树控件
  if (layer.options.scenetree) {
    layer.on("click", () => {
      const url = layer.options.url
      const id = layer.id
      store.dispatch("activate", {
        name: "layer-tree",
        url,
        id
      })
    })
  }
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
