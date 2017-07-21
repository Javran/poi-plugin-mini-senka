/*

   sub-reducer for handling network requests from poi

 */
import { modifyObject } from '../utils'
import { computeAccountingInfo } from '../senka-accounting'

const registerNewRecord = (exp, time) => {
  const accountingInfo = computeAccountingInfo(time)
  console.log(accountingInfo)
  return modifyObject(
    accountingInfo.label,
    (entity = {first: null, last: null}) => ({
      first: entity.first || {exp, time},
      last: {exp, time},
    }))
}

const subReducer = (state, action) => {
  if ([
    '@@Response/kcsapi/api_get_member/basic',
    '@@Response/kcsapi/api_get_member/record',
  ].includes(action.type)) {
    const {records} = state
    if (records) {
      const exp = action.body.api_experience[0]
      const {time} = action
      return modifyObject(
        'records',
        registerNewRecord(exp,time),
      )(state)
    } else {
      return state
    }
  }

  if ([
    '@@Response/kcsapi/api_req_mission/result',
    '@@Response/kcsapi/api_req_sortie/battleresult',
    '@@Response/kcsapi/api_req_combined_battle/battleresult',
  ].includes(action.type)) {
    const {records} = state
    if (records) {
      const exp = action.body.api_member_exp
      const {time} = action
      return modifyObject(
        'records',
        registerNewRecord(exp,time),
      )(state)
    } else {
      return state
    }
  }
  return state
}

export { subReducer }
