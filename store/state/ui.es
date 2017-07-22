const initState = {
  history: {
    prefix: null,
  },
}

const reducer = (state = initState, action) => {
  if (action.type === '@poi-plugin-mini-senka@ui@Modify') {
    const {modifier} = action
    return modifier(state)
  }

  return state
}

export { reducer }
