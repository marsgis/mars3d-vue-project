export const components = {
  number: "mars-input-number",
  switch: "mars-switch",
  radio: "a-radio-group",
  checkbox: "a-checkbox-group",
  slider: "mars-slider",
  color: "mars-color-picker",
  select: "mars-select",
  textarea: "mars-textarea",
  input: "mars-input",
  inputGroup: "mars-input-group"
}

export interface GuiItem {
  type: keyof typeof components
  field: string
  label: string
  extra?: any
  extraWidth?: number
  extraType?: "string" | "custom"
  min?: number
  max?: number
  step?: number
  range?: boolean
  data?: any[]
  value?: string | boolean | number | any
  units?: string[]
  show?: boolean | ((data: any) => boolean)
  change?: (value: any, dataObj: any) => any
}
