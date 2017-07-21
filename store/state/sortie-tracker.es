import { store } from 'views/create-store'
import { boundActionCreator } from '../action-creator'

const asyncRecordsNewSortie = func =>
  store.dispatch(() => setTimeout(() =>
    func(boundActionCreator.recordsNewSortie)))

const asyncRecordsBossBattleResult = func =>
  store.dispatch(() => setTimeout(() =>
    func(boundActionCreator.recordsBossBattleResult)))

const reducer = (state = null, action) => {
  if (
    action.type === '@@Response/kcsapi/api_req_map/start' ||
    action.type === '@@Response/kcsapi/api_req_map/next'
  ) {
    const {body, time} = action
    const mapId = Number(body.api_maparea_id)*10 + Number(body.api_mapinfo_no)
    const isBoss = Number(body.api_event_id) === 5
    if (action.type === '@@Response/kcsapi/api_req_map/start') {
      asyncRecordsNewSortie(recordsNewSortie =>
        recordsNewSortie(mapId, time))
    }

    return {
      mapId,
      isBoss,
    }
  }

  if (
    state !== null && state.isBoss && (
      action.type === '@@Response/kcsapi/api_req_sortie/battleresult' ||
      action.type === '@@Response/kcsapi/api_req_combined_battle/battleresult'
    )
  ) {
    asyncRecordsBossBattleResult(recordsBossBattleResult => {
      const {body, time} = action
      const winRank = body.api_win_rank
      recordsBossBattleResult(state.mapId, winRank, time)
    })
    return null
  }
  return state
}

export { reducer }
