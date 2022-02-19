import { Store, StoreOptions } from "vuex"
import { InjectionKey, ComputedRef } from "vue"

/**
 * store 状态管理
 * @copyright 火星科技 mars3d.cn
 * @author 火星吴彦祖 2022-2-19
 */
declare module "@mars/common/store/widget" {
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

  export const key: InjectionKey<Store<WidgetState>>

  export const injectState: (options: StoreOptions<WidgetState>) => Store<WidgetState>

  export const useWidget: () => {
    // 本页面widget配置数组
    widgets: ComputedRef<Widget[]>
    // 默认开启的widget
    openAtStart: ComputedRef<string[]>
    // 获取指定的widget
    getWidget: (name: string) => any
    // 出发对应widget的onUpdate
    updateWidget: (name: string, ...args: any[]) => any
    // 获取widget的当前激活状态
    isActivate: (name: string) => boolean
    // 激活指定 widget模块
    activate: (widget: string | Widget, reload?:boolean) => void
    // 释放指定的widget
    disable: (name: string) => void
    // 关闭释放所有widget ，hasAll传true值强制释放所有widget(默认autoDisable为false的widet不会释放)
    disableAll: (hasAll?: boolean) => void
  }
}
