import { store } from 'views/create-store'
import { boundActionCreator } from '../action-creator'

const asyncRecordsNewExp = func =>
  store.dispatch(() => setTimeout(() =>
    func(boundActionCreator.recordsNewExp)))

const reducer = (state = null, action) => {
  if ([
    '@@Response/kcsapi/api_get_member/basic',
    '@@Response/kcsapi/api_get_member/record',
  ].includes(action.type)) {
    asyncRecordsNewExp(recordsNewExp => {
      const exp = action.body.api_experience[0]
      const {time} = action
      recordsNewExp(exp,time)
    })
    return state
  }

  if ([
    '@@Response/kcsapi/api_req_mission/result',
    '@@Response/kcsapi/api_req_sortie/battleresult',
    '@@Response/kcsapi/api_req_combined_battle/battleresult',
  ].includes(action.type)) {
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
