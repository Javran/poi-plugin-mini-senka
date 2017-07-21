import { store } from 'views/create-store'

import { accountingInfoSelector } from './selectors'
import { observeAll } from './observers'
import {
  computeAccountingInfo,
  isAccountingInfoEqual,
} from './senka-accounting'
import { boundActionCreator } from './store'

// for observer
let unsubscribe = null

const { ticker } = window
const tickLabel = 'mini-senka'

const handleTick = curTime => {
  const curAccountingInfo = computeAccountingInfo(curTime)
  const accountingInfo = accountingInfoSelector(store.getState())

  if (
    !isAccountingInfoEqual(accountingInfo, curAccountingInfo)
  ) {
    boundActionCreator.accountingInfoReplace(curAccountingInfo)
  }
}

const pluginDidLoad = () => {
  if (unsubscribe !== null) {
    console.error(`unsubscribe function should be null`)
  }
  unsubscribe = observeAll()

  ticker.reg(tickLabel, handleTick)
}

const pluginWillUnload = () => {
  ticker.unreg(tickLabel)

  if (typeof unsubscribe !== 'function') {
    console.error(`invalid unsubscribe function`)
  } else {
    unsubscribe()
    unsubscribe = null
  }
}

export {
  pluginDidLoad,
  pluginWillUnload,
}
