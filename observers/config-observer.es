import _ from 'lodash'
import { observer } from 'redux-observers'

import { configSelector } from '../selectors'
import { loadConfig, saveConfig } from '../config'
import { boundActionCreator } from '../store'

const configObserver = observer(
  configSelector,
  (_dispatch, cur, prev) => {
    if (typeof prev === 'undefined' &&
        _.get(cur,'ready') === false) {
      // is initializing, schedule a config replace
      setTimeout(() => {
        const configData = loadConfig()
        boundActionCreator.configReplace({
          ...configData,
          ready: true,
        })
      })
      return
    }

    if (
      _.get(prev,'ready') === true &&
      _.get(cur,'ready') === true &&
      cur.sortieTable !== prev.sortieTable
    ) {
      // currently this is the only thing to save
      const {sortieTable} = cur
      setTimeout(() =>
        saveConfig({sortieTable}))
    }
  },
  {skipInitialCall: false})

export { configObserver }
