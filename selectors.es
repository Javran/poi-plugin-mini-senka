import _ from 'lodash'
import { createSelector } from 'reselect'
import {
  basicSelector,
  extensionSelectorFactory,
} from 'views/utils/selectors'

import { getInitState } from './store'
import {
  emptyEntity,
  emptyConfig,
  MonthRecords,
  DayRecords,
} from './records'

const admiralIdSelector = createSelector(
  basicSelector,
  basic => Number(_.get(basic, 'api_member_id')) || null
)

const extSelector = createSelector(
  extensionSelectorFactory('poi-plugin-mini-senka'),
  ext => _.isEmpty(ext) ? getInitState() : ext)

const mkExtPropSelector = _.memoize(propName =>
  createSelector(extSelector, ext => ext[propName]))

const recordsSelector =
  mkExtPropSelector('records')

const accountingInfoSelector =
  mkExtPropSelector('accountingInfo')

const configSelector =
  mkExtPropSelector('config')

const uiSelector =
  mkExtPropSelector('ui')

const recordDataRootSelector = createSelector(
  recordsSelector,
  r => _.get(r,'records',emptyConfig.records))

const sortieTableConfigSelector = createSelector(
  configSelector,
  conf => conf.sortieTable)

const showAllConfigSelector = createSelector(
  sortieTableConfigSelector,
  st => st.showAll)

const recordSelector = createSelector(
  recordDataRootSelector,
  accountingInfoSelector,
  (recordDataRoot, accountingInfo) => {
    const maybeMonthRecord = MonthRecords.find(accountingInfo.month)(recordDataRoot)
    if (! maybeMonthRecord)
      return emptyEntity
    const maybeDayRecord = DayRecords.find(accountingInfo.label)(maybeMonthRecord.records)
    if (! maybeDayRecord)
      return emptyEntity
    return maybeDayRecord.record
  }
)

const sortiesSelector = createSelector(
  recordSelector,
  record => record.sorties || {})

const sortieInfoRowsSelector = createSelector(
  sortiesSelector,
  sortieTableConfigSelector,
  (sorties, sortieTableConfig) => {
    const mapIds = Object.keys(sorties).map(Number)
    // partition mapIds into normal / hidden
    // starred mapIds can be enumerated by configs
    // so we don't have to deal with them here
    const normalMapIds = []
    const hiddenMapIds = []

    mapIds.map(mapId => {
      if (sortieTableConfig.starredMapIds.includes(mapId))
        return

      if (sortieTableConfig.hiddenMapIds.includes(mapId)) {
        hiddenMapIds.push(mapId)
      } else {
        normalMapIds.push(mapId)
      }
    })
    normalMapIds.sort((x,y) => x-y)
    hiddenMapIds.sort((x,y) => x-y)

    // [<mapId>] => [<{mapId, type}>]
    const partialSortieInfoRows = [
      ...sortieTableConfig.starredMapIds.map(mapId => ({
        mapId, type: 'starred'})),
      ...normalMapIds.map(mapId => ({
        mapId, type: 'normal'})),
      ...(sortieTableConfig.showAll ?
          hiddenMapIds.map(mapId => ({
            mapId, type: 'hidden'})) :
          []),
    ]

    // {mapId, type} => {mapId, type, sortieInfo}
    const attachSortieInfo = obj => {
      const {mapId} = obj
      const rawSortieInfo = _.get(sorties,mapId)
      const sortieCount = _.get(rawSortieInfo,'count',0)
      const bossRanksObj = _.get(rawSortieInfo,'boss',{})
      // e.g. [{winRank: 'S', count: 1}, ...]
      const bossRanks = _.flatMap(
        'S A B C D E'.split(' '),
        winRank => {
          const count = _.get(bossRanksObj,winRank,0)
          return count > 0 ? [{winRank, count}] : []
        })
      const bossCount = _.sum(bossRanks.map(x => x.count))
      const bossCountAlt = _.sum(Object.values(bossRanksObj))
      if (bossCount !== bossCountAlt) {
        console.error(`bossCount mismatched, the object is`, bossRanksObj)
      }
      return {
        ...obj,
        sortieInfo: {
          sortieCount,
          bossCount,
          bossRanks,
        },
      }
    }

    return partialSortieInfoRows.map(attachSortieInfo)
  })

export {
  admiralIdSelector,
  extSelector,
  mkExtPropSelector,

  recordsSelector,
  accountingInfoSelector,
  configSelector,
  uiSelector,
  showAllConfigSelector,
  sortieInfoRowsSelector,

  recordDataRootSelector,
  recordSelector,
}
