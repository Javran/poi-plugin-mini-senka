import { observer } from 'redux-observers'

import { admiralIdSelector } from '../selectors'
import { boundActionCreator } from '../store'
import { loadRecords } from '../records'

let loadRecordLock = null
const clearLoadRecordLock = () => {
  if (loadRecordLock !== null) {
    clearTimeout(loadRecordLock)
    loadRecordLock = null
  }
}

const admiralIdObserver = observer(
  admiralIdSelector,
  (_dispatch, cur, prev) => {
    if (cur !== null && cur !== prev) {
      // either initializing or admiralId has been changed,
      // scheduling a config reload
      boundActionCreator.recordsReplace(null)

      clearLoadRecordLock()
      const admiralId = cur
      loadRecordLock = setTimeout(() => {
        loadRecords(admiralId, records =>
          boundActionCreator.recordsReplace(records))
        loadRecordLock = null
      })
    }
  },
  {skipInitialCall: false})

export { admiralIdObserver }
