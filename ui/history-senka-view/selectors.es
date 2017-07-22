import _ from 'lodash'
import { createSelector } from 'reselect'
import {
  recordsSelector,
  uiSelector,
} from '../../selectors'

// records indexed by 2017-06, 2017-07, ...
// values are arrays of [<label>, <record>]
const grouppedRecordPairsSelector = createSelector(
  recordsSelector,
  records =>
    _.groupBy(
      _.toPairs(records)
       .filter(([k,_v]) => ! k.startsWith('$')),
      ([k,_v]) => k.slice(0,'XXXX-XX'.length))
)

const recordPrefixesInfoSelector = createSelector(
  grouppedRecordPairsSelector,
  grouppedRecordPairs =>
    Object.entries(grouppedRecordPairs).map(([prefix, recordPairs]) => {
      const tsFirst = _.min(_.compact(
        recordPairs.map(([_k,v]) =>
          _.get(v,'expRange.first.time'))))
      const tsLast = _.max(_.compact(
        recordPairs.map(([_k,v]) =>
          _.get(v,'expRange.last.time'))))
      return {prefix, tsFirst, tsLast}
    }).reverse()
)

const prefixSelector = createSelector(
  uiSelector,
  ui => ui.history.prefix)

const historyInfoListSelector = createSelector(
  grouppedRecordPairsSelector,
  prefixSelector,
  (grouppedRecordPairs, prefix) => {
    if (prefix === null)
      return []
    const recordPairs = grouppedRecordPairs[prefix]
    // reverse to make recent records show first
    const sortedRecordPairs = _.sortBy(
      recordPairs,
      [([k,_v]) => k]
    ).reverse()

    const getInfo = ([key,record]) => {
      const tsFirst = _.get(record,'expRange.first.time')
      const expFirst = _.get(record,'expRange.first.exp')
      const tsLast = _.get(record,'expRange.last.time')
      const expLast = _.get(record,'expRange.last.exp')
      const expDiff = expLast - expFirst
      return {
        key, tsFirst, tsLast, expDiff,
      }
    }
    return sortedRecordPairs.map(getInfo)
  }
)

export {
  recordPrefixesInfoSelector,
  prefixSelector,
  historyInfoListSelector,
}
