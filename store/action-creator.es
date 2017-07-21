import { store } from 'views/create-store'
import { bindActionCreators } from 'redux'

import { modifyObject } from '../utils'
import { computeAccountingInfo } from '../senka-accounting'
import { emptyEntity } from '../records'

const actionCreator = {
  recordsReplace: newState => ({
    type: '@poi-plugin-mini-senka@records@Replace',
    newState,
  }),
  recordsModify: modifier => ({
    type: '@poi-plugin-mini-senka@records@Modify',
    modifier,
  }),
  recordsNewExp: (exp, time) => {
    const accountingInfo = computeAccountingInfo(time)
    return actionCreator.recordsModify(
      modifyObject(
        accountingInfo.label,
        (entity = emptyEntity) =>
          modifyObject(
            'expRange',
            expRange => ({
              first: expRange.first || {exp, time},
              last: {exp, time},
            })
          )(entity)
      )
    )
  },
  recordsNewSortie: (mapId, time) => {
    const accountingInfo = computeAccountingInfo(time)
    return actionCreator.recordsModify(
      modifyObject(
        accountingInfo.label,
        (entity = emptyEntity) =>
          modifyObject(
            'sorties',
            modifyObject(
              mapId,
              (mapSortieInfo = {}) =>
                modifyObject(
                  'count',
                  (count=0) => count+1
                )(mapSortieInfo)
            )
          )(entity)
      )
    )
  },
  recordsBossBattleResult: (mapId, winRank, time) => {
    const accountingInfo = computeAccountingInfo(time)
    return actionCreator.recordsModify(
      modifyObject(
        accountingInfo.label,
        (entity = emptyEntity) =>
          modifyObject(
            'sorties',
            modifyObject(
              mapId,
              (mapSortieInfo = {}) =>
                modifyObject(
                  'boss',
                  (boss = {}) =>
                    modifyObject(
                      winRank,
                      (count=0) => count+1
                    )(boss)
                )(mapSortieInfo)
            )
          )(entity)
      )
    )
  },
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(actionCreator, dispatch)

const boundActionCreator =
  mapDispatchToProps(store.dispatch)

export {
  actionCreator,
  mapDispatchToProps,
  boundActionCreator,
}
