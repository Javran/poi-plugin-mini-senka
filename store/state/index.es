import { combineReducers } from 'redux'
import { reducer as records } from './records'
import { reducer as expTracker } from './exp-tracker'
import { reducer as sortieTracker } from './sortie-tracker'

const reducer = combineReducers({
  records,
  expTracker,
  sortieTracker,
})

export { reducer }
