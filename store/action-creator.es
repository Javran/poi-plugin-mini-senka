import _ from 'lodash'

import { bindActionCreators } from 'redux'
import { store } from 'views/create-store'

import { modifyObject } from '../utils'
import {
  modifyRecordByTime,
  modifySortieByMapId,
} from '../records'

const actionCreator = {
  recordsReplace: newState => ({
    type: '@poi-plugin-mini-senka@records@Replace',
    newState,
  }),
  recordsModify: modifier => ({
    type: '@poi-plugin-mini-senka@records@Modify',
    modifier,
  }),
  accountingInfoReplace: newState => ({
    type: '@poi-plugin-mini-senka@accountingInfo@Replace',
    newState,
  }),
  configReplace: newState => ({
    type: '@poi-plugin-mini-senka@config@Replace',
    newState,
  }),
  configModify: modifier => ({
    type: '@poi-plugin-mini-senka@config@Modify',
    modifier,
  }),
  uiModify: modifier => ({
    type: '@poi-plugin-mini-senka@ui@Modify',
    modifier,
  }),
  recordsNewExp: (exp, time, action) => {
    const newExpInfo = {exp, time}
    const updateExpRange =
      modifyObject(
        'expRange',
        expRange => {
          if (! _.isInteger(exp)) {
            console.error(`exp is not an integer, actual type: ${typeof exp}`)
            console.error('triggering action:', action)
            return expRange
          }

          if (expRange.first) {
            if (exp < expRange.first.exp) {
              console.error(
                `inequality violation: ${exp}(exp) < ${expRange.first.exp} (fst.exp)`)
              console.error('triggering action:', action)
              return expRange
            }
          }

          if (expRange.last) {
            if (exp < expRange.last.exp) {
              console.error(
                `inequality violation: ${exp}(exp) < ${expRange.last.exp} (lst.exp)`)
              console.error('triggering action:', action)
              return expRange
            }
          }

          return {
            ...expRange,
            first: expRange.first || newExpInfo,
            last: newExpInfo,
          }
        })

    return actionCreator.recordsModify(
      modifyRecordByTime(
        time,
        updateExpRange
      )
    )
  },
  recordsNewSortie: (mapId, time) =>
    actionCreator.recordsModify(
      modifyRecordByTime(
        time,
        modifyObject(
          'sorties',
          modifySortieByMapId(
            mapId,
            modifyObject(
              'count',
              (count=0) => count+1
            )
          )
        )
      )
    ),
  recordsBossBattleResult: (mapId, winRank, time) =>
    actionCreator.recordsModify(
      modifyRecordByTime(
        time,
        modifyObject(
          'sorties',
          modifySortieByMapId(
            mapId,
            modifyObject(
              'boss',
              (boss = {}) =>
                modifyObject(
                  winRank,
                  (count=0) => count+1
                )(boss)
            )
          )
        )
      )
    ),
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(actionCreator, dispatch)

const boundActionCreator =
  mapDispatchToProps(store.dispatch)

const asyncBoundActionCreator = func =>
  store.dispatch(() => setTimeout(() =>
    func(boundActionCreator)))

export {
  actionCreator,
  mapDispatchToProps,
  boundActionCreator,
  asyncBoundActionCreator,
}
