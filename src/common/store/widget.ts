/**
 * store 状态管理
 * @copyright 火星科技 mars3d.cn
 * @author 火星渣渣灰 2022-02-19
 */
import { Store, StoreOptions, createStore, useStore } from "vuex"
import { InjectionKey, computed, nextTick, onUnmounted, inject } from "vue"
import { v4 as uuidV4 } from "uuid"
import { logInfo, logWarn } from "@mars/utils/mars-util"

// 为 store state 声明类型
export interface DefaultOption {
  autoDisable?: boolean
  disableOther?: boolean | string[]
  group?: string // group相同的widget一定是互斥的
  meta?: any // 额外参数 不会在每次关闭后清除
}

export interface Widget {
  name: string // 唯一标识
  key?: string // 作为vue diff 环节的key，用于控制组件重载
  component?: any // widget关联的异步组件
  autoDisable?: boolean // 是否能够被自动关闭
  disableOther?: boolean | string[] // 是否自动关闭其他widget,或通过数组指定需要被关闭的widget
  group?: string // group相同的widget一定是互斥的
  visible?: boolean // 显示隐藏
  data?: any // 额外传参 会在每次关闭后清除
  meta?: any // 额外参数 不会在每次关闭后清除
}

export interface WidgetState {
  widgets: Widget[] // widget具体配置
  openAtStart: string[] // 默认加载的widget
  defaultOption?: DefaultOption // 支持配置默认参数
}

export let key: InjectionKey<Store<WidgetState>> = Symbol("widget")

/**
 * 初始化状态
 * @param {StoreOptions<WidgetState>} options
 * @return {Store<WidgetState>} 公共状态
 */
export const injectState = (options: StoreOptions<WidgetState>): Store<WidgetState> => {
  key = Symbol("widget")
  if (typeof options.state === "function") {
    options.state = (options.state() || {}) as WidgetState
  }
  const defaultOption = {
    autoDisable: true,
    disableOther: false,
    ...options.state.defaultOption
  }
  const openAtStart = options.state?.openAtStart
  if (!options) {
    throw new Error("injectState 参数不能为空")
  } else {
    const widgets = options.state?.widgets.map((item) => {
      return {
        visible: openAtStart?.includes(item.name),
        ...defaultOption,
        ...item,
        meta: {
          ...defaultOption.meta,
          ...item.meta
        },
        key: uuidV4()
      }
    })
    options.state!.widgets = widgets!
  }
  return createStore<WidgetState>({
    state: {
      widgets: [],
      openAtStart: [],
      ...options.state,
      defaultOption
    },
    getters: {
      ...options.getters
    },
    mutations: {
      addAlive(state, value: string) {
        if (!state.openAtStart.includes(value)) {
          state.openAtStart.push(value)
        }
      },
      ...options.mutations
    },
    actions: {
      activate({ commit, state, dispatch }, widget: any) {
        const value = typeof widget === "string" ? widget : widget.name

        const pannel = state.widgets.find((item) => item.name === value)
        if (!pannel) {
          logWarn("widget不存在", widget)
          return
        }

        if (pannel.visible && widget.reload) {
          // 重载组件
          pannel.visible = false
          pannel.key = uuidV4()
        }

        nextTick(() => {
          if (typeof widget === "object" && widget !== null && widget.data) {
            pannel.data = widget.data
          }
          pannel.visible = true
        })

        // 处理其他面板的显示隐藏
        state.widgets.forEach((item) => {
          if (pannel.name !== item.name) {
            // 默认关闭同组
            if (pannel.group && item.group === pannel.group) {
              item.visible = false
            }
            // 关闭非同组需要关闭的面板
            if (Array.isArray(pannel.disableOther)) {
              pannel.disableOther.forEach((item: string) => {
                dispatch("disable", item)
              })
            } else if (pannel.disableOther && item.autoDisable) {
              item.visible = false
            }
          }
        })

        if (!state.openAtStart.includes(value)) {
          commit("addAlive", value)
        }

      },
      disable({ state }, widget: string) {
        const value = widget
        const pannel = state.widgets.find((item, i) => {
          if (item.name === value) {
            delete state.widgets[i].data
            return true
          } else {
            return false
          }
        })
        // 显示面板
        if (pannel) {
          pannel.visible = false
        }
      },
      disableAll({ state }, hasAll: boolean) {
        state.widgets.forEach((item: Widget) => {
          if (item.visible && (hasAll || item.autoDisable)) {
            item.visible = false
          }
        })
      },
      ...options.actions
    }
  })
}

type EventCb = (...args: any[]) => void
class Event {
  private _cache: Record<string, EventCb[]> = {}
  // 绑定
  on(type: string, callback: EventCb) {
    const fns = (this._cache[type] = this._cache[type] || [])
    if (fns.indexOf(callback) === -1) {
      fns.push(callback)
    }
    return this
  }

  fire(type: string, ...args: any[]) {
    const fns = this._cache[type]
    if (Array.isArray(fns)) {
      fns.forEach((fn) => {
        fn(...args)
      })
    }
    return this
  }

  off(type: string, callback: EventCb) {
    const fns = this._cache[type]
    if (Array.isArray(fns)) {
      if (callback) {
        const index = fns.indexOf(callback)
        if (index !== -1) {
          fns.splice(index, 1)
        }
      } else {
        // 全部清空
        fns.length = 0
      }
    }
    return this
  }
}
const widgetEvent = new Event()

export function useWidgetStore() {
  const store = useStore(key)
  return store
}

export function useWidget() {
  const store = useStore(key)

  const getCurrentWidget = inject<() => string>("getCurrentWidget")
  let currentWidget: any
  if (getCurrentWidget) {
    const widegtName = getCurrentWidget()

    currentWidget = {
      ...store.state.widgets.find((item: any) => item.name === widegtName),
      onUpdate(callback: EventCb) {
        if (currentWidget) {
          widgetEvent.on(currentWidget.name, callback)
        }
        onUnmounted(() => {
          if (currentWidget) {
            widgetEvent.off(currentWidget.name, callback)
          }
        })
      }
    }
  }
  return {
    currentWidget,
    // 获取指定的widget
    getWidget: (name: string) => {
      const widget = store.state.widgets.find((item: any) => item.name === name)
      if (!widget) {
        return null
      }

      return {
        ...widget,
        onUpdate(callback: EventCb) {
          if (widget) {
            widgetEvent.on(widget.name, callback)
          }
          onUnmounted(() => {
            widgetEvent.off(widget.name, callback)
          })
        }
      }
    },
    setVisible(name: string, visible: boolean) {
      const widget = store.state.widgets.find((item: any) => item.name === name)
      widget.visible = visible
    },
    // 出发对应widget的onUpdate
    updateWidget(name: string, ...args: any[]) {
      widgetEvent.fire(name, ...args)
    },
    // 获取widget的当前激活状态
    isActivate: (name: string) => {
      const widget = store.state.widgets.find((item: any) => item.name === name)
      return widget ? widget.visible : false
    },
    // 激活指定 widget模块
    activate: (option: string | Widget | (string | Widget)[], reload = true) => {
      let widgets: (string | Widget)[] = []
      if (!Array.isArray(option)) {
        widgets.push(option)
      } else {
        widgets = option
      }
      widgets.forEach((widget) => {
        let params: any
        if (typeof widget === "string") {
          params = { reload, name: widget }
        } else {
          params = { reload, ...widget }
        }
        store.dispatch("activate", params)
        logInfo("激活了widget", params)
      })
    },
    // 释放指定的widget
    disable: (option: string | string[]) => {
      let widgets: (string | Widget)[] = []
      if (!Array.isArray(option)) {
        widgets.push(option)
      } else {
        widgets = option
      }

      widgets.forEach((widget) => {
        store.dispatch("disable", widget)
      })
    },
    // 关闭释放所有widget ，hasAll传true值强制释放所有widget(默认autoDisable为false的widet不会释放)
    disableAll: (hasAll = false) => {
      store.dispatch("disableAll", hasAll)
    }
  }
}
