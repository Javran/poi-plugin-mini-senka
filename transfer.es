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
import { modifyObject } from 'subtender'

import {
  recordDataRootSelector,
} from './selectors'

import {
  boundActionCreator as bac,
} from './store'

/* eslint-disable no-console */
const exportThisMonthToJsonWithCallback = onResult => {
  const {getStore} = window
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
  onResult(JSON.stringify(
    monRecord,
    [
      'records', 'month',
      'key', 'record', 'expRange',
      'first', 'last', 'exp', 'time',
    ]))
}

const exportThisMonthToJson = () => exportThisMonthToJsonWithCallback(result => {
  const {copy} = window
  copy(result)
  console.log('Copied to clipboard.')
})

const importedValToRecordsModifier = _v => recordsRoot => {
  const rootObj = _.fromPairs(
    _.map(recordsRoot, ({month, records}) => [month, records])
  )

  // TODO: import data to modifier functions
  const recordModifier = _.identity

  return _.sortBy(
    _.map(
      _.toPairs(recordModifier(rootObj)),
      ([month, records]) => ({month, records})),
    ['month']
  )
}

// debug tool that exports current data and import it again - this should result in no change.
const roundTripTest = () => {
  const exportedRaw = (() => {
    let tmp = null
    exportThisMonthToJsonWithCallback(r => { tmp = r })
    console.assert(typeof tmp === 'string', 'Exported value should be a string')
    return tmp
  })()
  console.assert(typeof exportedRaw === 'string', 'Exported value should be a string')
  const importedVal = JSON.parse(exportedRaw)
  const {getStore} = window
  const state = getStore()
  const recordsRoot = recordDataRootSelector(state)
  const recordsRootOut = importedValToRecordsModifier(importedVal)(recordsRoot)
  console.log(`input and output identical? ${_.isEqual(recordsRoot, recordsRootOut)}`)
}

const importFromJson = v => {
  /*
    The assumption is that the data is directly pasted as the input
    of this function so by the time we get here it's already evaluated
    as if it's a JS value.
   */
  bac.recordsModify(
    modifyObject(
      'records',
      importedValToRecordsModifier(v)
    )
  )
}
/* eslint-enable no-console */

const transferFunctions = {
  exportThisMonthToJson,
  importFromJson,
  roundTripTest,
}

export {
  transferFunctions,
}
