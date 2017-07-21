import { store } from 'views/create-store'
import { bindActionCreators } from 'redux'

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
  recordsNewExp: (exp, time) =>
    actionCreator.recordsModify(
      modifyRecordByTime(
        time,
        modifyObject(
          'expRange',
          expRange => ({
            first: expRange.first || {exp, time},
            last: {exp, time},
          })
        )
      )
    ),
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
