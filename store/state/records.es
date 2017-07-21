const reducer = (state = null, action) => {
  if (action.type === '@poi-plugin-mini-senka@records@Replace') {
    const {newState} = action
    return newState
  }

  if (state === null)
    return state

  if (action.type === '@poi-plugin-mini-senka@records@Modify') {
    const {modifier} = action
    return modifier(state)
  }
  return state
}

export { reducer }
