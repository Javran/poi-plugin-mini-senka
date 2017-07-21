import { observer } from 'redux-observers'
import { createStructuredSelector } from 'reselect'
import { recordsSelector, admiralIdSelector } from '../selectors'
import { shallowEqual } from '../utils'
import { saveRecords } from '../records'

const recordsObserver = observer(
  createStructuredSelector({
    admiralId: admiralIdSelector,
    records: recordsSelector,
  }),
  (_dispatch, cur, prev) => {
    if (
      cur.admiralId !== null &&
      cur.admiralId === prev.admiralId &&
      cur.records !== null && prev.records !== null &&
      ! shallowEqual(cur.records,prev.records)
    ) {
      const {admiralId, records} = cur
      setTimeout(() =>
        saveRecords(admiralId, records))
    }
  })

export { recordsObserver }
