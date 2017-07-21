import { subReducer as networkSubReducer } from './network'

const initState = {
  records: null,
}

const reducer = (state = initState, action) => {
  if (action.type === '@poi-plugin-mini-senka@Modify') {
    const {modifier} = action
    return modifier(state)
  }

  // only handle network when our records are available
  if (state.records !== null) {
    return networkSubReducer(state, action)
  }

  return state
}

export * from './action-creator'

export {
  initState,
  reducer,
}
