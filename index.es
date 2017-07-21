import { MiniSenkaMain as reactClass } from './ui'
import { observeAll } from './observers'
import { reducer } from './store'

// for observer
let unsubscribe = null

const pluginDidLoad = () => {
  if (unsubscribe !== null) {
    console.error(`unsubscribe function should be null`)
  }
  unsubscribe = observeAll()
}

const pluginWillUnload = () => {
  if (typeof unsubscribe !== 'function') {
    console.error(`invalid unsubscribe function`)
  } else {
    unsubscribe()
    unsubscribe = null
  }
}

export {
  reactClass,
  reducer,
  pluginDidLoad,
  pluginWillUnload,
}
