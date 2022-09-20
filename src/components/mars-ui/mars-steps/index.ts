import { App } from "vue"
import "./mars-steps.less"
import MarsSteps from "./index.vue"
import MarsStep from "./step.vue"
import MarsStepGroup from "./step-group.vue"

export default function install(app: App): App {
  app.component("mars-steps", MarsSteps)
  app.component("mars-step", MarsStep)
  app.component("mars-step-group", MarsStepGroup)
  return app
}
