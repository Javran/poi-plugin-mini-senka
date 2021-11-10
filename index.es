import { MiniSenkaMain as reactClass } from './ui'
import { reducer } from './store'
import { pluginDidLoad, pluginWillUnload } from './manager'
import { transferFunctions } from './transfer'

window.miniSenka = {
  ...transferFunctions,
}

export {
  reactClass,
  reducer,
  pluginDidLoad,
  pluginWillUnload,
}
