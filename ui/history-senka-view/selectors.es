import _ from 'lodash'
import { createSelector } from 'reselect'
import {
  recordDataRootSelector,
  uiSelector,
} from '../../selectors'
import {
  MonthRecords,
} from '../../records'

const monthRecordsInfoSelector = createSelector(
  recordDataRootSelector,
  recordDataRoot =>
    recordDataRoot.map(({month, records: monthRecord}) => {
      const tsFirst = _.get(_.first(monthRecord),'record.expRange.first.time')
      const tsLast = _.get(_.last(monthRecord),'record.expRange.last.time')
      return {month, tsFirst, tsLast}
    }).reverse()
)

const monthSelector = createSelector(
  uiSelector,
  ui => ui.history.month)

const monthRecordInfoSelector = createSelector(
  recordDataRootSelector,
  monthSelector,
  (recordDataRoot, month) => {
    if (month === null)
      return []

    const maybeMonthRecord = MonthRecords.find(month)(recordDataRoot)
    if (! maybeMonthRecord)
      return []

    const dayRecords = maybeMonthRecord.records

    const getInfo = ({key,record}) => {
      const tsFirst = _.get(record,'expRange.first.time')
      const expFirst = _.get(record,'expRange.first.exp')
      const tsLast = _.get(record,'expRange.last.time')
      const expLast = _.get(record,'expRange.last.exp')
      const expDiff = (_.isNumber(expLast) && _.isNumber(expFirst)) ?
        expLast - expFirst :
        null
      const {sorties} = record
      return {
        key, tsFirst, tsLast, expDiff, sorties,
      }
    }

    return dayRecords.map(getInfo).reverse()
  })

export {
  monthRecordsInfoSelector,
  monthSelector,
  monthRecordInfoSelector,
}
