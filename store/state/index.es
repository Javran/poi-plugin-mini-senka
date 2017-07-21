import { combineReducers } from 'redux'
import { reducer as records } from './records'
import { reducer as expTracker } from './exp-tracker'
import { reducer as sortieTracker } from './sortie-tracker'
import { reducer as accountingInfo } from './accounting-info'

const reducer = combineReducers({
  records,
  expTracker,
  sortieTracker,
  accountingInfo,
})

export { reducer }
