import { useStore } from "vuex"

export default function useLifecycle(name: string): () => any {
  const store = useStore()

  const pannel = store.state.widgets.find((item: any) => item.name === name)

  return () => pannel
}
