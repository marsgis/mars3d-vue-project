/**
 * store 状态管理
 * @copyright 火星科技 mars3d.cn
 * @author 火星吴彦祖 2021-12-30
 */
import { Store, createStore } from "vuex"
import { InjectionKey } from "vue"
import _ from "lodash"

export interface Test {
  count?: number
}

export const key: InjectionKey<Store<Test>> = Symbol("test")

export const store = createStore<Test>({
  state: {
    count: 0
  }
})
