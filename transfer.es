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

const importFromJson = xs => {
  /*
    The assumption is that the data is directly pasted as the input
    of this function so by the time we get here it's already evaluated
    as if it's a JS value, which in turn should result in an Array.
   */
  if (!Array.isArray(xs)) {
    console.error('Input is not an Array.')
    return
  }

  bac.recordsModify(
    modifyObject(
      'records',
      recordsRoot => {
        // TODO: to object, insert, then convert back and maintain order.
        const rootObj = _.fromPairs(
          _.map(recordsRoot, ({month, records}) => [month, records])
        )

        const recordsRootOut = _.sortBy(
          _.map(
            _.toPairs(rootObj),
            ([month, records]) => ({month, records})),
          ['month']
        )
        console.log(_.isEqual(recordsRootOut, recordsRoot))
        return recordsRoot
      }
    )
  )
}
/* eslint-enable no-console */

const transferFunctions = {
  exportThisMonthToJson,
  importFromJson,
}

export {
  transferFunctions,
}
