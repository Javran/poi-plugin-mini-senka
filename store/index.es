// import { subReducer as expTrackerReducer } from './exp-tracker'
// import { subReducer as sortieTrackerReducer } from './sortie-tracker'
import { reducer } from './state'

const getInitState = () =>
  reducer(undefined, {type: '@@INIT'})

export * from './action-creator'
export * from './state'

export {
  getInitState,
}
