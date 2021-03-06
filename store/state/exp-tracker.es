import { asyncBoundActionCreator } from '../action-creator'

const reducer = (state = null, action) => {
  if (
    action.type === '@@Response/kcsapi/api_get_member/record'
  ) {
    asyncBoundActionCreator(({recordsNewExp}) => {
      const exp = action.body.api_experience[0]
      const {time} = action
      recordsNewExp(exp,time,action)
    })
    return state
  }

  if (
    action.type === '@@Response/kcsapi/api_get_member/basic'
  ) {
    asyncBoundActionCreator(({recordsNewExp}) => {
      const exp = action.body.api_experience
      const {time} = action
      recordsNewExp(exp,time,action)
    })
    return state
  }

  if (
    action.type === '@@Response/kcsapi/api_req_mission/result' ||
    action.type === '@@Response/kcsapi/api_req_sortie/battleresult' ||
    action.type === '@@Response/kcsapi/api_req_combined_battle/battleresult'
  ) {
    asyncBoundActionCreator(({recordsNewExp}) => {
      const exp = action.body.api_member_exp
      const {time} = action
      recordsNewExp(exp,time,action)
    })
    return state
  }

  return state
}

export { reducer }
