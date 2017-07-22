import { defaultConfig } from '../../config'

const initState = {
  ...defaultConfig,
  ready: false,
}

const reducer = (state = initState, action) => {
  if (action.type === '@poi-plugin-mini-senka@config@Replace') {
    const {newState} = action
    return newState
  }

  if (!state.ready)
    return state

  if (action.type === '@poi-plugin-mini-senka@config@Modify') {
    const {modifier} = action
    return modifier(state)
  }
  return state
}

export { reducer }
