import _ from 'lodash'
import { createSelector } from 'reselect'
import {
  basicSelector,
  extensionSelectorFactory,
} from 'views/utils/selectors'

import { initState } from './store'

const admiralIdSelector = createSelector(
  basicSelector,
  basic => Number(_.get(basic, 'api_member_id')) || null
)

const extSelector = createSelector(
  extensionSelectorFactory('poi-plugin-mini-senka'),
  ext => _.isEmpty(ext) ? initState : ext)

const mkExtPropSelector = _.memoize(propName =>
  createSelector(extSelector, ext => ext[propName]))

const recordsSelector =
  mkExtPropSelector('records')

export {
  admiralIdSelector,
  extSelector,
  mkExtPropSelector,

  recordsSelector,
}
