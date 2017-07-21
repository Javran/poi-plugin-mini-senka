import _ from 'lodash'
import { createSelector } from 'reselect'
import {
  basicSelector,
  extensionSelectorFactory,
} from 'views/utils/selectors'

import { getInitState } from './store'

const admiralIdSelector = createSelector(
  basicSelector,
  basic => Number(_.get(basic, 'api_member_id')) || null
)

const extSelector = createSelector(
  extensionSelectorFactory('poi-plugin-mini-senka'),
  ext => _.isEmpty(ext) ? getInitState() : ext)

const mkExtPropSelector = _.memoize(propName =>
  createSelector(extSelector, ext => ext[propName]))

const recordsSelector =
  mkExtPropSelector('records')

const accountingInfoSelector =
  mkExtPropSelector('accountingInfo')

// import { selectorTester } from './utils'

export {
  admiralIdSelector,
  extSelector,
  mkExtPropSelector,

  recordsSelector,
  accountingInfoSelector,
}
