/*
  This module provides some functions for transfering progress
  between machines.

  TODO: impl

  Limitation:
  - Currently only senka record of the latest month is exported
  - only expRange is exported and imported - sortie counter
    has the problem that there is no way to make importing them idempotent.

 */

import _ from 'lodash'

import {
  recordDataRootSelector,
} from './selectors'

/* eslint-disable no-console */
const exportThisMonthToJson = () => {
  const {getStore, copy} = window
  const state = getStore()
  const monRecord = _.last(recordDataRootSelector(state))
  if (
    !monRecord ||
    typeof monRecord.month !== 'string' ||
    monRecord.records.length === 0
  ) {
    console.log('Nothing to export.')
    return
  }
  console.log(`Selected month ${monRecord.month}, ${monRecord.records.length} records.`)
  copy(JSON.stringify(
    monRecord,
    [
      'records', 'month',
      'key', 'record', 'expRange',
      'first', 'last', 'exp', 'time',
    ]))
  console.log('Copied to clipboard.')
}

const importFromJson = () => {
  // TODO
}
/* eslint-enable no-console */

const transferFunctions = {
  exportThisMonthToJson,
  importFromJson,
}

export {
  transferFunctions,
}
