import { computeAccountingInfo } from '../../senka-accounting'

const getInitState = () =>
  computeAccountingInfo(new Date())

const reducer = (state = getInitState(), action) => {
  if (action.type === '@poi-plugin-mini-senka@accountingInfo@Replace') {
    const {newState} = action
    return newState
  }

  return state
}

export { reducer }
