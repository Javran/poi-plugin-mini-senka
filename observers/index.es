import { observe } from 'redux-observers'
import { store } from 'views/create-store'

import { admiralIdObserver } from './records-loader'
import { recordsObserver } from './records-saver'
import { configObserver } from './config-observer'

const observeAll = () => observe(
  store,
  [
    admiralIdObserver,
    recordsObserver,
    configObserver,
  ]
)

export {
  observeAll,
}
