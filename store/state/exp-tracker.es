import { store } from 'views/create-store'
import { boundActionCreator } from '../action-creator'

const asyncRecordsNewExp = func =>
  store.dispatch(() => setTimeout(() =>
    func(boundActionCreator.recordsNewExp)))

const reducer = (state = null, action) => {
  if (
    action.type === '@@Response/kcsapi/api_get_member/basic' ||
    action.type === '@@Response/kcsapi/api_get_member/record'
  ) {
    asyncRecordsNewExp(recordsNewExp => {
      const exp = action.body.api_experience[0]
      const {time} = action
      recordsNewExp(exp,time)
    })
    return state
  }

  if (
    action.type === '@@Response/kcsapi/api_req_mission/result' ||
    action.type === '@@Response/kcsapi/api_req_sortie/battleresult' ||
    action.type === '@@Response/kcsapi/api_req_combined_battle/battleresult'
  ) {
    asyncRecordsNewExp(recordsNewExp => {
      const exp = action.body.api_member_exp
      const {time} = action
      recordsNewExp(exp,time)
    })
    return state
  }

  return state
}

export { reducer }
